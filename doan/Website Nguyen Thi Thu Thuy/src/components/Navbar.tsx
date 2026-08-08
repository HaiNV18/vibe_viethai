import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartItemCount, onCartClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-brand-cream z-50 border-b border-brand-brown/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 md:py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-4 group">
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-brand-brown rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-brand-brown font-bold text-lg md:text-xl font-sans">B</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-brand-brown uppercase">
                The Brew Lab
              </h1>
            </a>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex md:items-center gap-8 text-sm uppercase tracking-widest text-brand-brown/70">
            <a href="#about" className="hover:text-brand-brown border-b border-transparent hover:border-brand-brown transition-colors">Câu Chuyện</a>
            <a href="#menu" className="hover:text-brand-brown border-b border-transparent hover:border-brand-brown transition-colors">Menu</a>
            <a href="#reservation" className="hover:text-brand-brown border-b border-transparent hover:border-brand-brown transition-colors">Đặt Bàn</a>
            <a href="#contact" className="hover:text-brand-brown border-b border-transparent hover:border-brand-brown transition-colors">Liên Hệ</a>
            
            <button 
              onClick={onCartClick}
              className="relative text-brand-brown hover:text-brand-brown/70 transition-colors ml-4"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-brand-cream bg-brand-brown rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button 
              onClick={onCartClick}
              className="relative text-brand-brown"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-brand-cream bg-brand-brown rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-brown hover:text-brand-brown/70"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-cream border-t border-brand-brown/10">
          <div className="px-4 py-4 space-y-4 flex flex-col uppercase tracking-widest text-sm text-brand-brown/70">
            <a href="#about" className="hover:text-brand-brown w-fit" onClick={() => setIsMobileMenuOpen(false)}>Câu Chuyện</a>
            <a href="#menu" className="hover:text-brand-brown w-fit" onClick={() => setIsMobileMenuOpen(false)}>Menu</a>
            <a href="#reservation" className="hover:text-brand-brown w-fit" onClick={() => setIsMobileMenuOpen(false)}>Đặt Bàn</a>
            <a href="#contact" className="hover:text-brand-brown w-fit" onClick={() => setIsMobileMenuOpen(false)}>Liên Hệ</a>
          </div>
        </div>
      )}
    </header>
  );
}
