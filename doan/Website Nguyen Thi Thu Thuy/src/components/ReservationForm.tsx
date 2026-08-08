import { useState } from 'react';

export default function ReservationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="reservation" className="py-24 bg-brand-cream relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-brand-brown text-brand-cream p-8 md:p-16">
          <h3 className="text-3xl md:text-4xl italic mb-12 text-center md:text-left">
            Đặt Chỗ & Đặt Món
          </h3>
          
          {isSubmitted ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-brand-cream text-brand-brown rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Đã nhận thông tin</h3>
              <p className="text-brand-cream/70 font-sans text-sm">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60">Họ và tên</label>
                  <input required type="text" placeholder="Nguyễn Văn A" className="bg-transparent border-b border-brand-cream/30 py-2 focus:outline-none focus:border-brand-cream font-sans text-sm placeholder:text-brand-cream/30" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60">Số điện thoại</label>
                  <input required type="tel" placeholder="0901 234 567" className="bg-transparent border-b border-brand-cream/30 py-2 focus:outline-none focus:border-brand-cream font-sans text-sm placeholder:text-brand-cream/30" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60">Ngày</label>
                  <input required type="date" className="bg-transparent border-b border-brand-cream/30 py-2 focus:outline-none focus:border-brand-cream font-sans text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60">Thời gian (07:00 - 22:00)</label>
                  <input required type="time" min="07:00" max="22:00" className="bg-transparent border-b border-brand-cream/30 py-2 focus:outline-none focus:border-brand-cream font-sans text-sm" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60">Số khách</label>
                  <select className="bg-transparent border-b border-brand-cream/30 py-2 focus:outline-none focus:border-brand-cream font-sans text-sm appearance-none cursor-pointer">
                    <option className="text-brand-brown">1 Người</option>
                    <option className="text-brand-brown" selected>2 Người</option>
                    <option className="text-brand-brown">3 Người</option>
                    <option className="text-brand-brown">4 Người</option>
                    <option className="text-brand-brown">5+ Người</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60">Ghi chú thêm (Tùy chọn)</label>
                  <input type="text" placeholder="Yêu cầu đặc biệt..." className="bg-transparent border-b border-brand-cream/30 py-2 focus:outline-none focus:border-brand-cream font-sans text-sm placeholder:text-brand-cream/30" />
                </div>
              </div>
              
              <div className="pt-8">
                <button type="submit" className="w-full bg-brand-cream text-brand-brown py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-white transition-colors">
                  Xác Nhận Đặt Bàn
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
