export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  published_date: string;
  category_id: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
