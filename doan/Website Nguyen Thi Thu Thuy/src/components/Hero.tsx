import { MapPin, Clock, Wifi, Coffee } from 'lucide-react';

export default function Hero() {
  return (
    <div id="about" className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden bg-brand-cream">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000" 
          alt="The Brew Lab Interior" 
          className="w-full h-full object-cover opacity-10 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-brand-cream/90 to-brand-cream"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-24">
        <div className="md:w-[55%] flex flex-col gap-8">
          <section>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-brown/60 block mb-4">Nghệ thuật Cafe Thủ Công</span>
            <h2 className="text-4xl md:text-5xl leading-tight text-brand-brown italic mb-6">Nơi khơi nguồn cảm hứng và sự tĩnh lặng giữa lòng Quận 1.</h2>
            <p className="text-sm text-brand-brown/80 leading-relaxed font-sans max-w-md">
              Tại The Brew Lab, chúng tôi tôn vinh giá trị của hạt cà phê rang xay thủ công. Một không gian được thiết kế riêng cho sự tập trung, với wifi tốc độ cao và hương thơm nồng nàn để bạn thỏa sức sáng tạo.
            </p>
          </section>

          <div className="flex flex-col gap-4 text-xs font-sans tracking-widest uppercase text-brand-brown/70">
            <div className="flex items-center">
              <Coffee className="w-4 h-4 mr-3 opacity-60" />
              <span>Cà phê rang xay thủ công</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-3 opacity-60" />
              <span>Không gian yên tĩnh</span>
            </div>
            <div className="flex items-center">
              <Wifi className="w-4 h-4 mr-3 opacity-60" />
              <span>Wifi tốc độ cao</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <a 
              href="#menu" 
              className="inline-flex justify-center items-center px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] bg-brand-brown text-brand-cream hover:bg-brand-brown/90 transition-colors"
            >
              Xem Thực Đơn
            </a>
            <a 
              href="#reservation" 
              className="inline-flex justify-center items-center px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] border border-brand-brown text-brand-brown hover:bg-brand-brown/5 transition-colors"
            >
              Đặt Bàn Ngay
            </a>
          </div>
        </div>
        
        <div className="hidden md:block md:w-[45%]">
           <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800" 
            alt="Coffee pouring" 
            className="w-full aspect-[3/4] object-cover shadow-2xl rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}
