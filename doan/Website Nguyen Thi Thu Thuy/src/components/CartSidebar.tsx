import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (productId: number, delta: number) => void;
}

export default function CartSidebar({ isOpen, onClose, cartItems, updateQuantity }: CartSidebarProps) {
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-brand-cream/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-brand-brown text-brand-cream shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-8 md:p-12 pb-6 border-b border-brand-cream/10">
          <h3 className="text-2xl italic">Giỏ hàng</h3>
          <button 
            onClick={onClose}
            className="p-2 text-brand-cream/60 hover:text-brand-cream transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-cream/50 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-30" />
              <p className="font-sans text-sm italic">Giỏ hàng đang trống</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-3 border border-brand-cream text-brand-cream text-[10px] uppercase tracking-widest hover:bg-brand-cream hover:text-brand-brown transition-colors"
              >
                Tiếp tục chọn món
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex space-x-4 border-b border-brand-cream/10 pb-6 last:border-0 last:pb-0">
                  <div className="w-20 h-24 overflow-hidden shrink-0 border border-brand-cream/20">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover grayscale opacity-80" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{item.product.name}</h4>
                      <p className="text-xs font-sans italic opacity-70">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="text-brand-cream/60 hover:text-brand-cream"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-sans text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="text-brand-cream/60 hover:text-brand-cream"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-8 md:p-12 border-t border-brand-cream/20 mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-70">Đã chọn {totalItems} món</span>
              <span className="text-sm tracking-widest uppercase">Tạm tính</span>
            </div>
            <div className="flex justify-between items-baseline mb-8">
              <span className="text-xs italic opacity-60"></span>
              <span className="text-4xl font-bold tracking-tighter">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
              </span>
            </div>
            <button className="w-full bg-brand-cream text-brand-brown py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-white transition-colors">
              Xác nhận & thanh toán
            </button>
          </div>
        )}
      </div>
    </>
  );
}
