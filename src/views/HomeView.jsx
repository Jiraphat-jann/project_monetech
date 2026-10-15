import React, { useState } from 'react';

export default function HomeView({ onNavigate, transactions = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ดึงเงินออมที่เคยล็อกไว้จาก localStorage (ถ้ามี)
  const [lockedSavings, setLockedSavings] = useState(() => {
    return parseFloat(localStorage.getItem('monetech_locked_savings')) || 0;
  });

  // Modal สำหรับแก้ไขเงินออมที่ล็อกไว้
  const [isEditingSavings, setIsEditingSavings] = useState(false);
  const [tempSavings, setTempSavings] = useState('');

  // 1. ยอดสลิปทั้งหมดจะไหลเข้ามาเป็น "งบทั้งเดือน" ทันที
  const totalSlipBudget = transactions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // 2. หักเงินออมที่ล็อกไว้ออก -> ได้ยอดคงเหลือที่ใช้ได้จริง (แสดงในการ์ดสีเขียว)
  const availableBudget = Math.max(0, totalSlipBudget - lockedSavings);

  // 3. คำนวณจำนวนวันจริงทั้งหมดในเดือนปัจจุบัน (28, 29, 30 หรือ 31 วันตามปฏิทินจริง)
  const today = new Date();
  const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // เฉลี่ยตามจำนวนวันจริงเต็มทั้งเดือน
  const dailyAverageAvailable = availableBudget > 0 ? availableBudget / totalDaysInMonth : 0;

  // เปอร์เซ็นต์เงินที่เหลือใช้หลังจากหักเงินออม
  const remainingPercent = totalSlipBudget > 0 
    ? Math.round((availableBudget / totalSlipBudget) * 100) 
    : 0;

  const handleOpenEditSavings = () => {
    setTempSavings(lockedSavings.toString());
    setIsEditingSavings(true);
  };

  const handleSaveSavings = (e) => {
    e.preventDefault();
    const val = parseFloat(tempSavings) || 0;
    if (totalSlipBudget > 0 && val > totalSlipBudget) {
      alert('ยอดเงินออมที่ล็อกไว้ต้องไม่เกินงบรวมจากสลิป');
      return;
    }
    setLockedSavings(val);
    localStorage.setItem('monetech_locked_savings', val.toString());
    setIsEditingSavings(false);
  };

  return (
    <section className="flex-1 flex flex-col px-5 pt-2 pb-24 space-y-4">
      {/* Header with Profile Dropdown */}
      <div className="flex justify-between items-center py-2 relative">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined icon-fill text-2xl">person</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">สวัสดี, ผู้ใช้งาน</p>
            <h2 className="text-base font-bold text-slate-900">Monetech</h2>
          </div>
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          >
            <span className="material-symbols-outlined icon-fill text-[22px]">notifications</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-13 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 divide-y divide-slate-100/70">
              {[
                { id: 'profile', icon: 'person', label: 'โปรไฟล์' },
                { id: 'settings', icon: 'settings', label: 'การตั้งค่า' },
                { id: 'report', icon: 'campaign', label: 'แจ้งปัญหา' },
                { id: 'about', icon: 'info', label: 'เกี่ยวกับแอป' },
              ].map((item) => (
                <button 
                  key={item.id} 
                  type="button"
                  onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3.5 text-left text-slate-800 hover:bg-emerald-50/70 transition"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-700">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
              <button 
                type="button"
                onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} 
                className="w-full px-4 py-3 flex items-center gap-3.5 text-left text-rose-600 hover:bg-rose-50 transition"
              >
                <span className="material-symbols-outlined text-[20px] text-rose-600">logout</span>
                <span className="text-sm font-semibold">ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* กล่องสีเขียว: ยอดที่ใช้ได้หลังหักเงินออม + ค่าเฉลี่ยรายวัน */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="text-xs text-emerald-100 font-medium">ยอดเงินที่ใช้ได้ในเดือนนี้</p>
          <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full font-bold backdrop-blur-xs">
            เฉลี่ย ฿{dailyAverageAvailable.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/วัน ({totalDaysInMonth} วัน)
          </span>
        </div>

        <div className="flex items-baseline gap-1 my-2">
          <span className="text-2xl font-bold">฿</span>
          <span className="text-4xl font-extrabold tracking-tight">
            {availableBudget.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-black/15 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500" 
              style={{ width: `${remainingPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-emerald-100 mt-2">
            <span>
              {totalSlipBudget > 0 
                ? `รับจากสลิป ฿${totalSlipBudget.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`
                : 'รอการสแกนสลิปเพื่อเติมงบ'}
            </span>
            <span className="font-bold">
              {totalSlipBudget > 0 ? `เหลือใช้ ${remainingPercent}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* กล่องสีขาวคู่: งบทั้งเดือน (ยอดจากสลิป) & ล็อกเงินออมแล้ว 🔒 */}
      <div className="grid grid-cols-2 gap-3">
        {/* ช่องซ้าย: งบทั้งเดือน (รับค่าจากสลิปอัตโนมัติ) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">งบทั้งเดือน</p>
            <span className="material-symbols-outlined text-xs text-emerald-500 font-bold">receipt</span>
          </div>
          <div className="text-lg font-bold text-slate-900 my-1 truncate">
            ฿ {totalSlipBudget.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            {transactions.length > 0 ? `● รับเข้าแล้ว ${transactions.length} สลิป` : '● รอสแกนสลิปเข้า'}
          </span>
        </div>

        {/* ช่องขวา: ล็อกเงินออมแล้ว 🔒 (กดเพื่อตั้งค่าได้) */}
        <div 
          onClick={handleOpenEditSavings}
          className="bg-slate-50 hover:bg-indigo-50/50 cursor-pointer border border-slate-200/80 rounded-2xl p-3.5 transition active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">ล็อกเงินออมแล้ว 🔒</p>
            <span className="material-symbols-outlined text-xs text-indigo-400">edit</span>
          </div>
          <div className="text-lg font-bold text-indigo-600 my-1 truncate">
            ฿ {lockedSavings.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-indigo-500 font-medium">
            {lockedSavings === 0 ? 'กดเพื่อตั้งค่าเงินออม' : 'หักเก็บเรียบร้อย'}
          </p>
        </div>
      </div>

      {/* Quick Action Smart Slip */}
      <button 
        type="button"
        onClick={() => onNavigate('expense')} 
        className="w-full bg-indigo-50/70 border border-indigo-100 hover:bg-indigo-50 active:scale-[0.99] transition rounded-2xl p-3.5 flex items-center gap-3.5 text-left"
      >
        <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined icon-fill text-xl">photo_camera</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900">สแกนสลิปโอนเงิน (Smart Slip)</h4>
          <p className="text-xs text-indigo-600">แคปรูปวางปุ๊บ เติมงบและคำนวณเงินทันที</p>
        </div>
        <span className="material-symbols-outlined text-indigo-600">chevron_right</span>
      </button>

      {/* รายการสลิปที่บันทึกเข้ามา */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-2">สลิปที่เข้าในระบบ</h3>
        {transactions.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 shadow-sm flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-slate-300">receipt_long</span>
            <p>ยังไม่มีสลิป รอการสแกน</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                    <p className="text-[10px] text-slate-400">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600">
                    +฿{Number(item.amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ป๊อปอัปสำหรับตั้งค่า ล็อกเงินออม */}
      {isEditingSavings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900">ระบุเงินที่ต้องการล็อกออม</h4>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold">฿</span>
              <input 
                type="number"
                value={tempSavings}
                onChange={(e) => setTempSavings(e.target.value)}
                autoFocus
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setIsEditingSavings(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition"
              >
                ยกเลิก
              </button>
              <button 
                type="button"
                onClick={handleSaveSavings}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-500/25"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}