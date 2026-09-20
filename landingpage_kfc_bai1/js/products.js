// KFC Products Database and Shared Cart Utilities

const PRODUCTS = [
  {
    id: "ga-ran",
    name: "Gà Rán",
    price: 40000,
    unit: "miếng",
    category: "ga-ran",
    categoryName: "Gà Rán",
    badge: "Bán Chạy Nhất",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
    description: "Miếng gà rán truyền thống với lớp da vàng ươm giòn rụm, thịt bên trong mềm mọng thơm lừng thảo mộc.",
    details: "Gà rán KFC truyền thống được tẩm ướp với công thức bí truyền 11 loại thảo mộc và gia vị của Đại tá Sanders. Từng miếng gà tươi ngon được chiên với nhiệt độ và thời gian chuẩn xác dưới áp suất đặc biệt, giữ trọn vẹn vị ngọt thanh tự nhiên của thịt gà cùng lớp da vàng giòn khó cưỡng.",
    ingredients: "Thịt gà tươi 100%, bột chiên xù cao cấp, 11 loại thảo mộc & gia vị bí truyền KFC, dầu thực vật nguyên chất.",
    nutrition: {
      calories: "320 kcal / miếng",
      protein: "28g",
      fat: "18g",
      carbs: "11g"
    }
  },
  {
    id: "ga-ran-cay",
    name: "Gà Rán Cay",
    price: 45000,
    unit: "miếng",
    category: "ga-ran",
    categoryName: "Gà Rán",
    badge: "Vị Cay Bùng Nổ",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80",
    description: "Gà rán giòn cay nồng nàn với ớt tươi và ớt bột cay cay xé lưỡi, đánh thức mọi giác quan.",
    details: "Dành riêng cho những tín đồ ẩm thực thích vị cay bốc lửa. Từng thớ thịt gà được ướp kỹ lưỡng với xốt cay đặc trưng và lăn qua lớp bột chiên giòn rụm. Khi cắn vào, âm thanh rôm rốp hòa quyện cùng vị cay nồng quyến rũ lan tỏa khắp khoang miệng.",
    ingredients: "Thịt gà tươi, ớt cay thượng hạng, hỗn hợp gia vị cay bí truyền, bột chiên giòn cay.",
    nutrition: {
      calories: "340 kcal / miếng",
      protein: "29g",
      fat: "19g",
      carbs: "12g"
    }
  },
  {
    id: "khoai-tay-chien",
    name: "Khoai Tây Chiên",
    price: 20000,
    unit: "phần",
    category: "mon-kem",
    categoryName: "Món Kèm",
    badge: "Món Kèm Chuẩn Vị",
    image: "images/products/khoai-tay-chien.jpg",
    description: "Khoai tây cắt thanh dày dặn chiên vàng đều, giòn rụm bên ngoài và bùi xốp bên trong.",
    details: "Khoai tây chiên KFC được chọn lọc từ những củ khoai tây chất lượng cao nhất, cắt hình thanh chuẩn mực và chiên ngập dầu ở nhiệt độ tối ưu. Món ăn vặt không thể thiếu trong bất kỳ bữa tiệc gà rán nào!",
    ingredients: "Khoai tây tự nhiên, muối tinh khiết, dầu cọ thực vật tinh luyện.",
    nutrition: {
      calories: "280 kcal / phần",
      protein: "3.5g",
      fat: "14g",
      carbs: "35g"
    }
  },
  {
    id: "burger-ga",
    name: "Hamburger Gà",
    price: 50000,
    unit: "cái",
    category: "burger",
    categoryName: "Hamburger",
    badge: "Đậm Vị Giòn Tan",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    description: "Bánh burger vỏ mềm rắc mè, kẹp miếng phi lê gà giòn rụm cùng sốt mayonnaise béo ngậy và rau xà lách tươi.",
    details: "Hamburger Gà KFC là sự kết hợp hoàn hảo giữa phi lê gà chiên giòn tan, vỏ bánh mì nướng mềm thơm rắc hạt mè vàng, xà lách tươi giòn mát và sốt mayonnaise thượng hạng ngọt dịu.",
    ingredients: "Vỏ bánh mì burger rắc mè, phi lê ức gà giòn rụm, xà lách tươi sạch, sốt mayonnaise độc quyền.",
    nutrition: {
      calories: "450 kcal / cái",
      protein: "24g",
      fat: "22g",
      carbs: "40g"
    }
  },
  {
    id: "burger-bo",
    name: "Hamburger Bò",
    price: 50000,
    unit: "cái",
    category: "burger",
    categoryName: "Hamburger",
    badge: "Bò Nướng Thơm Lừng",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    description: "Bò nướng thơm lừng đậm đà, phô mai tan chảy quyện cùng sốt BBQ và hành tây ngọt dịu.",
    details: "Chiếc bánh burger dành cho những ai mê thịt bò nướng. Thịt bò tươi xay nhuyễn ướp đượm gia vị nướng trên lửa hồng, kết hợp phô mai cheddar béo ngậy và sốt nướng đậm đà, tạo nên trải nghiệm vị giác khó quên.",
    ingredients: "Thịt bò nướng tiêu chuẩn, vỏ bánh nướng, phô mai Cheddar, xà lách, cà chua, dưa chua, sốt burger đặc biệt.",
    nutrition: {
      calories: "490 kcal / cái",
      protein: "26g",
      fat: "25g",
      carbs: "38g"
    }
  },
  {
    id: "burger-tom",
    name: "Hamburger Tôm",
    price: 50000,
    unit: "cái",
    category: "burger",
    categoryName: "Hamburger",
    badge: "Hải Sản Tươi Ngon",
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&auto=format&fit=crop&q=80",
    description: "Nhân tôm tươi giòn sần sật bọc bột chiên xù, kết hợp xốt chua ngọt thanh mát và rau xà lách xanh tươi.",
    details: "Hamburger Tôm mang đến hương vị hải sản thanh ngọt độc đáo. Từng miếng chả tôm được làm từ tôm tươi nguyên con, chiên giòn tan rụm kết hợp với sốt tartar dịu nhẹ, vừa ăn vừa không hề ngán.",
    ingredients: "Thịt tôm tươi, bột chiên giòn hải sản, bánh burger mè, rau xà lách tươi, sốt Tartar chua ngọt dịu.",
    nutrition: {
      calories: "420 kcal / cái",
      protein: "20g",
      fat: "18g",
      carbs: "42g"
    }
  },
  {
    id: "pepsi",
    name: "Pepsi",
    price: 10000,
    unit: "ly",
    category: "thuc-uong",
    categoryName: "Thức Uống",
    badge: "Giải Nhiệt Cực Đã",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&auto=format&fit=crop&q=80",
    description: "Nước ngọt Pepsi mát lạnh bùng nổ vị giác, đánh tan cơn khát và nhân đôi vị ngon gà rán.",
    details: "Một ly Pepsi ướp lạnh đầy sảng khoái với những bọt gas sủi tăm tắp, là người bạn đồng hành không thể thiếu giúp cân bằng vị giác khi thưởng thức các món chiên nướng tại KFC.",
    ingredients: "Nước bão hòa CO2, đường mía tinh khiết, hương cola tự nhiên, chất điều chỉnh độ acid.",
    nutrition: {
      calories: "150 kcal / ly",
      protein: "0g",
      fat: "0g",
      carbs: "38g"
    }
  },
  {
    id: "coca-cola",
    name: "Coca Cola",
    price: 10000,
    unit: "ly",
    category: "thuc-uong",
    categoryName: "Thức Uống",
    badge: "Sảng Khoái Tột Đỉnh",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80",
    description: "Coca Cola tươi ướp đá truyền thống với vị ngọt dịu và gas cực mạnh xua tan cơn khát.",
    details: "Hương vị Coca Cola trứ danh toàn cầu với công thức giữ trọn vị ngon kinh điển. Từng ngụm mát lạnh xua tan mọi mệt mỏi, mang lại cảm giác phấn chấn tức thì.",
    ingredients: "Nước khoáng có ga CO2, đường tự nhiên, hương caramel, chất điều chỉnh độ acid.",
    nutrition: {
      calories: "140 kcal / ly",
      protein: "0g",
      fat: "0g",
      carbs: "35g"
    }
  },
  {
    id: "7up",
    name: "7Up",
    price: 10000,
    unit: "ly",
    category: "thuc-uong",
    categoryName: "Thức Uống",
    badge: "Hương Chanh Thanh Mát",
    image: "https://hongphatfood.com/wp-content/uploads/2024/10/7up-lemon-soft-drink-320ml4.jpg",
    description: "Nước ngọt có ga vị chanh thanh mát, thanh lọc vị giác, uống là mê.",
    details: "7Up với hương vị chanh tự nhiên tươi mới, vị ngọt thanh thoát kết hợp cùng gas sủi mạnh mẽ giúp khử ngấy tuyệt hảo khi ăn kèm cùng các món ăn nhanh giòn cay.",
    ingredients: "Nước bão hòa CO2, đường tự nhiên, tinh chất chanh tươi, chất điều chỉnh độ acid.",
    nutrition: {
      calories: "140 kcal / ly",
      protein: "0g",
      fat: "0g",
      carbs: "36g"
    }
  }
];
// https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80
// Helper to format currency
function formatVND(amount) {
  return amount.toLocaleString('vi-VN') + ' VND';
}

// Cart Storage Functions (Synchronized across index.html & product-detail.html)
const CART_STORAGE_KEY = 'kfc_cart_items';

function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving cart to localStorage", e);
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCartGlobal(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return null;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit || '',
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  return product;
}

function updateCartItemQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart(cart);
  }
  return cart;
}

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}
