import { MapPin, Clock, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-cream border-t border-brand-brown/10 text-brand-brown pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="font-serif font-black text-2xl uppercase tracking-tighter">THE BREW LAB</h3>
            <p className="text-brand-brown/70 font-sans text-sm leading-relaxed max-w-xs">
              Không gian trải nghiệm cà phê thủ công tinh tế, nơi ý tưởng được thăng hoa và công việc hiệu quả.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-brand-brown/20 flex items-center justify-center hover:bg-brand-brown hover:text-brand-cream transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-brand-brown/20 flex items-center justify-center hover:bg-brand-brown hover:text-brand-cream transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/60 mb-6">Liên Hệ</h4>
            <ul className="space-y-4 font-sans text-sm font-bold">
              <li className="flex items-start text-brand-brown">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 opacity-60 flex-shrink-0" />
                <span>123 Nguyễn Huệ, Quận 1, Tp. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center text-brand-brown">
                <Phone className="w-4 h-4 mr-3 opacity-60 flex-shrink-0" />
                <span>090 123 4567</span>
              </li>
              <li className="flex items-center text-brand-brown">
                <Mail className="w-4 h-4 mr-3 opacity-60 flex-shrink-0" />
                <span>hello@thebrewlab.vn</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/60 mb-6">Giờ Mở Cửa</h4>
            <ul className="space-y-4 font-sans text-sm font-bold">
              <li className="flex items-start text-brand-brown">
                <Clock className="w-4 h-4 mr-3 mt-0.5 opacity-60 flex-shrink-0" />
                <div>
                  <p className="mb-1">Thứ 2 – Chủ Nhật</p>
                  <p className="text-brand-brown/60 font-normal">07:00 – 22:00</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/60 mb-6">Bản Đồ</h4>
            <div className="w-full h-40 border border-brand-brown/20 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-brand-brown/10 group-hover:bg-transparent transition-colors z-10"></div>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600" alt="Map" className="w-full h-full object-cover grayscale opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-brand-brown p-2 rounded-full shadow-lg">
                  <MapPin className="w-5 h-5 text-brand-cream" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-brand-brown/20 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-brand-brown/50">
          <p>&copy; {new Date().getFullYear()} The Brew Lab.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-brown transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-brand-brown transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
