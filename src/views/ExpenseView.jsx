import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';

export default function ExpenseView({ onNavigate, onAddExpense }) {
  const [expenseVal, setExpenseVal] = useState('0');
  const [slipPreview, setSlipPreview] = useState('');
  const [slipFileName, setSlipFileName] = useState('');
  const [slipStatus, setSlipStatus] = useState('อัปโหลดสลิปเพื่ออ่านยอดเงิน');
  const fileInputRef = useRef(null);

  const extractAmountFromPromptPayQR = (payload) => {
    try {
      let index = 0;
      while (index < payload.length) {
        const id = payload.substring(index, index + 2);
        const length = parseInt(payload.substring(index + 2, index + 4), 10);
        const value = payload.substring(index + 4, index + 4 + length);
        if (id === '54') {
          const parsed = parseFloat(value);
          if (!isNaN(parsed) && parsed > 0) return parsed.toString();
        }
        index += 4 + length;
      }
    } catch {
      return null;
    }
    return null;
  };

  // ---------------------------------------------------------------------------
  // CRC16-CCITT (poly 0x1021, init 0xFFFF) — ใช้ตรวจสอบ checksum ท้าย payload
  // ของ QR ตามมาตรฐาน EMVCo (tag 63)
  // ---------------------------------------------------------------------------
  const crc16ccitt = (str) => {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return crc & 0xffff;
  };

  // ---------------------------------------------------------------------------
  // QR หลายๆ อันบนสลิป (เช่น QR สำหรับ "ตรวจสอบรายการ" ของธนาคาร) ไม่ใช่
  // PromptPay QR จริง แค่เป็นลิงก์/รหัสอ้างอิงทั่วไป ถ้าเอาไปแกะแบบ TLV ตรงๆ
  // จะได้ตัวเลขมั่วๆ ออกมา จึงต้องตรวจสอบให้แน่ใจก่อนว่าเป็น QR ตามมาตรฐาน
  // EMVCo Merchant Presented Mode จริง (ต้นทาง PromptPay) โดยดูว่า:
  // 1) ขึ้นต้นด้วย Payload Format Indicator "000201" (ID 00, length 02, value 01)
  // 2) มี CRC checksum (tag 63) อยู่ท้ายสุด และค่า CRC ตรงกับที่คำนวณได้จริง
  // ---------------------------------------------------------------------------
  const isValidPromptPayPayload = (payload) => {
    if (!payload || typeof payload !== 'string') return false;
    if (!payload.startsWith('000201')) return false;
    const crcTagIndex = payload.lastIndexOf('6304');
    if (crcTagIndex === -1 || crcTagIndex !== payload.length - 8) return false;
    const dataToCheck = payload.substring(0, crcTagIndex + 4); // รวม tag+length ของ "6304"
    const providedCrc = payload.substring(crcTagIndex + 4).toUpperCase();
    const computedCrc = crc16ccitt(dataToCheck).toString(16).toUpperCase().padStart(4, '0');
    return providedCrc === computedCrc;
  };

  const scanQrFromImage = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    return qrCode ? qrCode.data : null;
  };

  // ---------------------------------------------------------------------------
  // ครอปภาพเป็นสัดส่วน (x, y, w, h เป็นสัดส่วน 0-1 ของภาพต้นฉบับ)
  // ---------------------------------------------------------------------------
  const cropRegion = (img, x, y, w, h) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sx = img.width * x;
    const sy = img.height * y;
    const sw = Math.max(1, img.width * w);
    const sh = Math.max(1, img.height * h);
    canvas.width = sw;
    canvas.height = sh;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    return canvas;
  };

  // ---------------------------------------------------------------------------
  // แปลงเป็นขาว-ดำด้วย Otsu's threshold (หาจุดตัดสีที่เหมาะสมโดยอัตโนมัติ)
  // แทนที่การไล่สีเฉพาะเจาะจง (ชมพู MyMo / เทาอ่อน BBL) เพื่อให้ใช้ได้กับ
  // ธีมสีของสลิปธนาคารไหนก็ได้ (ฟ้า เขียว เหลือง ม่วง ดำ ฯลฯ)
  // ---------------------------------------------------------------------------
  const binarizeCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const pixelCount = d.length / 4;
    const gray = new Uint8ClampedArray(pixelCount);
    const hist = new Array(256).fill(0);

    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
      gray[j] = g;
      hist[g]++;
    }

    // Otsu's method: หา threshold ที่แบ่งกลุ่มสีสว่าง/มืดได้ชัดเจนที่สุด
    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * hist[t];
    let sumB = 0;
    let wB = 0;
    let varMax = 0;
    let threshold = 127;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = pixelCount - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const varBetween = wB * wF * (mB - mF) * (mB - mF);
      if (varBetween > varMax) {
        varMax = varBetween;
        threshold = t;
      }
    }

    let whiteCount = 0;
    for (let j = 0; j < pixelCount; j++) {
      if (gray[j] > threshold) whiteCount++;
    }
    // ถ้าพื้นหลังส่วนใหญ่เป็นสีเข้ม (โหมดมืด/ธีมสีเข้ม) ให้กลับขาว-ดำ
    // เพื่อให้ผลลัพธ์เป็น "ตัวหนังสือดำบนพื้นขาว" เสมอ ซึ่ง OCR อ่านได้แม่นที่สุด
    const invert = whiteCount < pixelCount / 2;

    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      let v = gray[j] > threshold ? 255 : 0;
      if (invert) v = 255 - v;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  };

  // ---------------------------------------------------------------------------
  // ดึงตัวเลขรูปแบบ "ยอดเงิน" (มีทศนิยม 2 ตำแหน่ง) จากข้อความ
  // ---------------------------------------------------------------------------
  const parseAmountsFromText = (text) => {
    const matches =
      text.match(/([0-9]{1,3}(?:[,\s][0-9]{3})*\.[0-9]{2}|[0-9]+\.[0-9]{2})/g) || [];
    return matches
      .map((m) => parseFloat(m.replace(/[,\s]/g, '')))
      .filter((v) => !isNaN(v) && v > 0 && v < 10000000);
  };

  // ---------------------------------------------------------------------------
  // สแกน canvas ด้วย OCR แล้วจัดอันดับผลลัพธ์ตาม "ขนาดตัวอักษร" ของแต่ละบรรทัด
  // เพราะยอดเงินหลักบนสลิปมักถูกแสดงด้วยตัวอักษรที่ใหญ่ที่สุดในภาพเสมอ
  // ไม่ว่าจะเป็นธนาคารหรือแอปไหนก็ตาม จึงใช้แทนการเจาะจงตำแหน่งตายตัว
  // ---------------------------------------------------------------------------
  const runOcrOnCanvas = async (worker, canvas) => {
    const processed = binarizeCanvas(canvas);
    const { data } = await worker.recognize(processed);
    const lines = data.lines && data.lines.length > 0 ? data.lines : [{ text: data.text, bbox: null }];

    const candidates = [];
    for (const line of lines) {
      const amounts = parseAmountsFromText(line.text || '');
      const height = line.bbox ? line.bbox.y1 - line.bbox.y0 : 0;
      amounts.forEach((amount) => candidates.push({ amount, height }));
    }
    candidates.sort((a, b) => b.height - a.height);
    return candidates.map((c) => c.amount);
  };

  
  const AMOUNT_KEYWORDS = [
    'จำนวนเงิน',
    'ยอดเงิน',
    'ยอดชำระ',
    'จำนวนที่โอน',
    'จำนวนโอน',
    'Amount',
    'AMOUNT',
    'Total',
  ];

  const findAmountByKeyword = async (imageElement) => {
    let labelWorker = null;
    let digitWorker = null;
    try {
      labelWorker = await createWorker('tha+eng');

      const fullCanvas = document.createElement('canvas');
      const fCtx = fullCanvas.getContext('2d');
      fullCanvas.width = imageElement.width;
      fullCanvas.height = imageElement.height;
      fCtx.drawImage(imageElement, 0, 0);

      // ไม่ binarize ในรอบนี้ เพราะการบังคับขาว-ดำแรงๆ จะทำลายรายละเอียด
      // เส้นสระ/วรรณยุกต์ภาษาไทยที่บาง ทำให้อ่านคำว่า "จำนวนเงิน" พลาดได้ง่าย
      const { data } = await labelWorker.recognize(fullCanvas);
      const lines = data.lines || [];

      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i].text || '';
        const matchedKeyword = AMOUNT_KEYWORDS.find((kw) => lineText.includes(kw));
        if (!matchedKeyword) continue;

        // 1) ลองหาตัวเลขในบรรทัดเดียวกับป้ายกำกับก่อน
        const sameLineAmounts = parseAmountsFromText(lineText);
        if (sameLineAmounts.length > 0) {
          return sameLineAmounts[0].toString();
        }

        // 2) ถ้าไม่เจอในบรรทัดเดียวกัน ให้ครอปเฉพาะบริเวณบรรทัดถัดไปมาอ่าน
        //    ใหม่แบบเจาะจงตัวเลขล้วน (แม่นกว่าการอ่านปนภาษาไทย)
        const nextLine = lines[i + 1];
        if (nextLine) {
          if (nextLine.bbox) {
            const { x0, y0, x1, y1 } = nextLine.bbox;
            const padX = 24;
            const padY = 12;
            const region = cropRegion(
              imageElement,
              Math.max(0, (x0 - padX) / imageElement.width),
              Math.max(0, (y0 - padY) / imageElement.height),
              Math.min(1, (x1 - x0 + padX * 2) / imageElement.width),
              Math.min(1, (y1 - y0 + padY * 2) / imageElement.height)
            );
            if (!digitWorker) {
              digitWorker = await createWorker('eng');
              await digitWorker.setParameters({ tessedit_char_whitelist: '0123456789.,' });
            }
            const croppedAmounts = await runOcrOnCanvas(digitWorker, region);
            if (croppedAmounts.length > 0) {
              return croppedAmounts[0].toString();
            }
          }
          // เผื่อไม่มี bbox ให้ลองอ่านจากข้อความบรรทัดถัดไปตรงๆ
          const nextLineAmounts = parseAmountsFromText(nextLine.text || '');
          if (nextLineAmounts.length > 0) {
            return nextLineAmounts[0].toString();
          }
        }
      }
    } catch (e) {
      console.warn('Keyword-based scan failed:', e);
    } finally {
      if (labelWorker) await labelWorker.terminate();
      if (digitWorker) await digitWorker.terminate();
    }
    return null;
  };

  // วิธีสำรอง: สแกนทั้งภาพแบบตัวเลขล้วน แล้วเลือกจากบรรทัดที่ตัวอักษรใหญ่สุด
  // ใช้เมื่อหาคำว่า "จำนวนเงิน"/"Amount" ไม่เจอ (เช่น สลิปพิมพ์ไม่ชัด หรือ
  // แอปที่ใช้คำอื่น)
  const extractAmountByLargestNumber = async (imageElement) => {
    const worker = await createWorker('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789.,',
    });

    // 1) สแกนทั้งภาพก่อน (ครอบคลุมสลิปทุกรูปแบบ ทุกธนาคาร ทุกธีมสี)
    //    แล้วเลือกยอดเงินจากบรรทัดที่ตัวอักษรใหญ่ที่สุด
    try {
      const fullCanvas = document.createElement('canvas');
      const ctx = fullCanvas.getContext('2d');
      fullCanvas.width = imageElement.width;
      fullCanvas.height = imageElement.height;
      ctx.drawImage(imageElement, 0, 0);
      const amounts = await runOcrOnCanvas(worker, fullCanvas);
      if (amounts.length > 0) {
        await worker.terminate();
        return amounts[0].toString();
      }
    } catch (e) {
      console.warn('Full-image scan failed:', e);
    }

    // 2) ถ้ายังไม่เจอ (เช่น ตัวเลขเล็ก/ปะปนกับข้อความอื่นเยอะ) ให้ลองแบ่งโซน
    //    กว้างๆ ตามตำแหน่งที่พบยอดเงินได้บ่อยในสลิปทั่วไป เป็น fallback เท่านั้น
    const fallbackZones = [
      { x: 0, y: 0.0, w: 1, h: 0.5 }, // ครึ่งบนของภาพ
      { x: 0, y: 0.5, w: 1, h: 0.5 }, // ครึ่งล่างของภาพ
    ];

    for (const zone of fallbackZones) {
      try {
        const canvas = cropRegion(imageElement, zone.x, zone.y, zone.w, zone.h);
        const amounts = await runOcrOnCanvas(worker, canvas);
        if (amounts.length > 0) {
          await worker.terminate();
          return amounts[0].toString();
        }
      } catch (e) {
        console.warn('Zone scan failed:', zone, e);
      }
    }

    await worker.terminate();
    return null;
  };

  // รวมทั้งสองวิธีเข้าด้วยกัน: หาโดยใช้คำกำกับก่อน (แม่นและครอบคลุมสุด)
  // แล้วค่อย fallback ไปวิธีเลือกจากตัวเลขที่ใหญ่สุดในภาพ
  const extractAmountWithOCR = async (imageElement) => {
    const byKeyword = await findAmountByKeyword(imageElement);
    if (byKeyword) return byKeyword;
    return extractAmountByLargestNumber(imageElement);
  };

  const pressKey = (val) => {
    if (val === 'del') {
      setExpenseVal((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
    } else if (val === '.') {
      setExpenseVal((prev) => (prev.includes('.') ? prev : prev + '.'));
    } else {
      setExpenseVal((prev) => {
        if (prev === '0') return val;
        if (prev.includes('.') && prev.split('.')[1]?.length >= 2) return prev;
        if (prev.replace('.', '').length < 8) return prev + val;
        return prev;
      });
    }
  };

  const handleSlip = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSlipFileName(file.name);
    setSlipStatus('กำลังวิเคราะห์สลิป...');
    setExpenseVal('...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgSrc = event.target.result;
      setSlipPreview(imgSrc);

      const img = new Image();
      img.onload = async () => {
        try {
          // 1. ตรวจสอบ PromptPay QR Code — ต้องเป็น QR ตามมาตรฐาน EMVCo จริงๆ
          //    เท่านั้น (เช็ค CRC) ไม่งั้น QR อื่นๆ บนสลิป เช่น QR สำหรับ
          //    "ตรวจสอบรายการ" ของธนาคาร จะถูกแกะมั่วออกมาเป็นยอดเงินผิดๆ
          const qrData = scanQrFromImage(img);
          if (qrData && isValidPromptPayPayload(qrData)) {
            const qrAmount = extractAmountFromPromptPayQR(qrData);
            if (qrAmount) {
              setExpenseVal(qrAmount);
              setSlipStatus('ตรวจพบยอดเงินจาก QR สำเร็จ!');
              return;
            }
          }

          // 2. สแกนด้วย OCR (รองรับสลิปได้ทุกธนาคาร ไม่จำกัดเฉพาะแอปใดแอปหนึ่ง)
          setSlipStatus('กำลังอ่านยอดเงินจากสลิป...');
          const ocrAmount = await extractAmountWithOCR(img);

          if (ocrAmount) {
            setExpenseVal(ocrAmount);
            setSlipStatus('อ่านยอดเงินสำเร็จ!');
          } else {
            setExpenseVal('0');
            setSlipStatus('อ่านยอดเงินไม่สำเร็จ กรุณาระบุเอง');
          }
        } catch {
          setExpenseVal('0');
          setSlipStatus('เกิดข้อผิดพลาด กรุณาระบุยอดเงินเอง');
        }
      };
      img.src = imgSrc;
    };
    reader.readAsDataURL(file);
  };

  const clearSlip = () => {
    setSlipPreview('');
    setSlipFileName('');
    setSlipStatus('อัปโหลดสลิปเพื่ออ่านยอดเงิน');
    setExpenseVal('0');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const num = parseFloat(expenseVal);
    if (isNaN(num) || num <= 0) {
      alert('กรุณาระบุยอดเงินที่มากกว่า 0 บาท');
      return;
    }

    if (onAddExpense) {
      onAddExpense({
        id: Date.now(),
        title: slipFileName ? 'สแกนสลิปโอนเงิน' : 'รายจ่ายทั่วไป',
        amount: num,
        type: 'expense',
        date: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      });
    }

    alert(`บันทึกรายจ่าย ฿${num.toLocaleString('th-TH', { minimumFractionDigits: 2 })} สำเร็จ!`);
    onNavigate('home');
  };

  return (
    <section className="flex-1 flex flex-col px-6 pt-3 pb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <h2 className="text-base font-bold text-slate-900">บันทึกรายจ่าย</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col items-center my-3">
        <p className="text-xs text-slate-400 mb-1">ระบุยอดเงินที่จ่าย</p>
        <div className="flex items-center text-slate-900 font-extrabold text-5xl tracking-tight">
          <span className="text-3xl mr-1 text-slate-400">฿</span>
          <span>{expenseVal}</span>
        </div>
      </div>

      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleSlip} />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 transition rounded-2xl p-3 flex items-center justify-center gap-3 text-indigo-600 mb-3"
      >
        <span className="material-symbols-outlined text-2xl">receipt_long</span>
        <div className="text-left">
          <p className="text-xs font-bold">อัปโหลดสลิปโอนเงิน / สแกนบิล</p>
          <p className="text-[10px] text-indigo-400">{slipStatus}</p>
        </div>
      </button>

      {slipPreview && (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 mb-3">
          <img src={slipPreview} alt="Slip" className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-slate-800 truncate max-w-[180px]">{slipFileName}</p>
            <p className="text-[10px] text-emerald-600 font-medium">✓ อ่านข้อมูลสำเร็จ</p>
          </div>
          <button type="button" onClick={clearSlip} className="text-slate-400 hover:text-rose-500 p-1">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => pressKey(key)}
            className="py-3.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-xl active:bg-slate-200 flex items-center justify-center transition"
          >
            {key === 'del' ? <span className="material-symbols-outlined text-xl">backspace</span> : key}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl mt-3 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition"
      >
        บันทึกทันที (Enter)
      </button>
    </section>
  );
}
