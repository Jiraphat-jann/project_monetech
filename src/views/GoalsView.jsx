import React from 'react';

export default function GoalsView() {
  return (
    <section className="flex-1 flex flex-col px-5 pt-3 pb-24 space-y-4">
      <h2 className="text-xl font-extrabold text-slate-900">เป้าหมายเงินออม</h2>
      <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-md">
        <p className="text-xs text-indigo-100">เงินที่ล็อกแยกไว้ตั้งแต่เงินโอนเข้า</p>
        <div className="text-3xl font-extrabold my-1">฿ 0.00</div>
      </div>
    </section>
  );
}