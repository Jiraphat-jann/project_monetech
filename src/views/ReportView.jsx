import React, { useState, useRef } from 'react';

export default function ReportView({ onNavigate, isDarkMode }) {
  const [issueType, setIssueType] = useState('bug');
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // จัดการการเลือกไฟล์
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files.map(f => f.name)]);
    }
  };

  // ลบไฟล์ที่แนบ
  const removeFile = (indexToRemove) => {
    setAttachedFiles(attachedFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('กรุณาระบุรายละเอียดของปัญหาที่พบ');
      return;
    }
    alert('ส่งรายงานปัญหาเรียบร้อยแล้ว ทีมงานจะเร่งตรวจสอบให้ครับ!');
    setDescription('');
    setAttachedFiles([]);
    onNavigate('home');
  };

  return (
    <section className="flex-1 flex flex-col px-5 pt-3 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center relative mb-1">
        <button 
          type="button"
          onClick={() => onNavigate('home')} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-lg font-bold text-center flex-1 pr-10 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-xl text-emerald-500">campaign</span> แจ้งปัญหา
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <h3 className={`text-base font-bold border-b pb-1 ${isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-900'}`}>
          ส่งข้อเสนอแนะหรือแจ้งปัญหา
        </h3>

        {/* ประเภทปัญหา */}
        <div>
          <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            • ประเภทปัญหา
          </label>
          <div className="relative">
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-xl text-xs outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 transition ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="bug">แจ้งข้อผิดพลาด (Bug / สลิปไม่อ่าน)</option>
              <option value="ui">ปัญหาการแสดงผล (UI Display)</option>
              <option value="feature">เสนอแนะฟีเจอร์ใหม่</option>
              <option value="other">อื่น ๆ</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-400 text-lg">
              expand_more
            </span>
          </div>
        </div>

        {/* รายละเอียดปัญหา */}
        <div>
          <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            • รายละเอียดปัญหา
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ระบุสิ่งที่พบเพื่อให้ทีมงานช่วยเหลือ..."
            className={`w-full p-3 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          ></textarea>
        </div>

        {/* แนบไฟล์หลักฐาน */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            • แนบไฟล์หลักฐาน
          </label>
          
          {/* ซ่อน input ไฟล์จริงไว้ */}
          <input 
            type="file" 
            ref={imageInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border transition text-xs font-semibold ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-emerald-500">image</span>
              แนบรูปถ่าย
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border transition text-xs font-semibold ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-indigo-500">attach_file</span>
              แนบไฟล์
            </button>
          </div>

          {/* รายการไฟล์ที่แนบแล้ว */}
          {attachedFiles.length > 0 && (
            <div className="mt-2.5 space-y-1.5">
              {attachedFiles.map((name, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-[11px] ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="truncate max-w-[200px]">{name}</span>
                  <button 
                    type="button"
                    onClick={() => removeFile(index)} 
                    className="text-rose-500 hover:text-rose-600 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ปุ่มส่งปัญหา */}
        <div className="mt-auto pt-4">
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow hover:bg-emerald-600 active:scale-[0.99] transition text-sm"
          >
            ส่งปัญหา
          </button>
        </div>
      </form>
    </section>
  );
}