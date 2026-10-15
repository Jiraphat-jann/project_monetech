import React, { useState } from 'react';

export default function AboutView({ onNavigate, isDarkMode }) {
  const [showContactModal, setShowContactModal] = useState(false);

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
          <span className="material-symbols-outlined text-xl">info</span> เกี่ยวกับแอป
        </h2>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <h3 className={`text-base font-bold border-b pb-1 ${isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-900'}`}>
          ข้อมูลแอปและข้อกำหนด
        </h3>

        {/* แนะนำผู้พัฒนา */}
        <div className={`p-4 rounded-2xl border space-y-2 transition ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white border-slate-200/80 text-slate-700 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-emerald-500">groups</span>
            <span className="text-xs font-bold">• แนะนำผู้พัฒนา</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Monetech พัฒนาขึ้นโดยทีมนักศึกษาเพื่อแก้ไขปัญหาการจัดสรรงบประมาณ การออม และการใช้ชีวิตประจำวัน
          </p>
        </div>

        {/* เครดิต และ ปุ่มติดต่อ */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-xl text-slate-400">code</span>
            <span className="text-xs font-semibold">• เครดิต</span>
          </div>
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 transition"
          >
            Contact Developer
          </button>
        </div>

        {/* ใบอนุญาต */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-xl text-slate-400">copyright</span>
            <span className="text-xs font-semibold">• ใบอนุญาต</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            MIT License © 2026 Monetech
          </span>
        </div>
      </div>

      {/* Pop-up สำหรับช่องทางการติดต่อ */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900'}`}>
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-500">mail</span> ติดต่อทีมผู้พัฒนา
            </h4>
            <div className="text-xs text-slate-500 space-y-1.5">
              <p></p>
              <p></p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowContactModal(false)}
              className="w-full bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-600 transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </section>
  );
}