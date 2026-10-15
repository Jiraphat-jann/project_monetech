import React, { useState } from 'react';

export default function SettingsView({ onNavigate, isDarkMode }) {
  const [showPolicyModal, setShowPolicyModal] = useState(false);

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
          <span className="material-symbols-outlined text-xl">settings</span> การตั้งค่า
        </h2>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <h3 className={`text-base font-bold border-b pb-1 ${isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-900'}`}>
          ข้อมูลแอปและข้อกำหนด
        </h3>

        {/* แถบแสดงเวอร์ชัน */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-xl text-slate-400">article</span>
            <span className="text-xs font-semibold">• เวอร์ชั่นแอป</span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            isDarkMode ? 'bg-slate-700 border-slate-600 text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            v0.1
          </span>
        </div>

        {/* กล่องนโยบายความเป็นส่วนตัว */}
        <div className={`p-4 rounded-2xl border space-y-2 transition ${
          isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white border-slate-200/80 text-slate-700 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-emerald-500">verified_user</span>
            <span className="text-xs font-bold">• นโยบายความเป็นส่วนตัว</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Monetech ให้ความสำคัญกับความปลอดภัยและข้อมูลส่วนบุคคลของผู้ใช้ ข้อมูลทั้งหมดจะถูกเข้ารหัสระดับมาตรฐานสากล
          </p>
          <button 
            type="button" 
            onClick={() => setShowPolicyModal(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-500 underline pt-1 block"
          >
            อ่านนโยบายเต็ม
          </button>
        </div>
      </div>

      {/* Pop-up แสดงนโยบายแบบเต็ม */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3 ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900'}`}>
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500">shield</span> ข้อกำหนดและนโยบาย
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              แอปพลิเคชัน Monetech ทำการเก็บข้อมูลบันทึกรายรับ-รายจ่ายของคุณไว้บนพื้นที่จัดเก็บในเครื่องเพื่อความเป็นส่วนตัวสูงสุด ไม่มีการส่งต่อข้อมูลทางการเงินให้แก่บุคคลภายนอกโดยไม่ได้รับอนุญาต
            </p>
            <button 
              type="button" 
              onClick={() => setShowPolicyModal(false)}
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