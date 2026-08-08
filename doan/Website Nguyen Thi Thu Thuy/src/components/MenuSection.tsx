import { useState } from 'react';
import { categories, products } from '../data';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (product: Product) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(categories[0].id);

  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const filteredProducts = products.filter(p => p.category_id === activeCategoryId);

  return (
    <section id="menu" className="py-24 bg-brand-cream border-t border-brand-brown/10 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl italic text-brand-brown mb-8 text-center">
            Thực Đơn Đặc Tuyển
          </h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 border-b border-brand-brown/20 pb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`uppercase tracking-[0.1em] text-xs font-bold transition-all duration-300 border-b-2 pb-1 ${
                  activeCategoryId === category.id
                    ? 'border-brand-brown text-brand-brown'
                    : 'border-transparent text-brand-brown/50 hover:text-brand-brown'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <p className="max-w-2xl mx-auto text-brand-brown/80 font-sans text-sm text-center italic">
            {activeCategory?.description}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col sm:flex-row gap-6 cursor-pointer"
            >
              <div className="w-full sm:w-24 h-48 sm:h-24 shrink-0 overflow-hidden border border-brand-brown/20">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-brand-brown font-bold text-lg leading-none">{product.name}</h4>
                    <div className="flex-1 border-b border-dotted border-brand-brown/40 mx-2 mb-1"></div>
                    <span className="text-brand-brown font-bold whitespace-nowrap leading-none">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </div>
                  <div 
                    className="text-xs text-brand-brown/70 italic font-sans line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                </div>
                
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-fit flex items-center text-[10px] uppercase tracking-widest text-brand-brown/70 hover:text-brand-brown border-b border-transparent hover:border-brand-brown pb-0.5 mt-4 transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
