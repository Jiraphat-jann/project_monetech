import React from 'react';

export default function RegisterView({ onNavigate }) {
  return (
    <section className="flex-1 flex flex-col px-6 pt-4 pb-8">
      <div className="flex items-center relative mb-4">
        <button onClick={() => onNavigate('login')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-lg font-bold text-center flex-1 pr-10 text-slate-900">สร้างบัญชีใหม่</h2>
      </div>
      <form className="space-y-3.5 flex-1" onSubmit={(e) => { e.preventDefault(); onNavigate('home'); }}>
        <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none" placeholder="ชื่อ-นามสกุล" type="text" required />
        <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none" placeholder="name@email.com" type="email" required />
        <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none" placeholder="รหัสผ่าน" type="password" required />
        <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-full shadow-md mt-2">
          ลงทะเบียน
        </button>
      </form>
    </section>
  );
}