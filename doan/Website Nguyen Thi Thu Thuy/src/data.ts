import { Category, Product } from './types';

export const categories: Category[] = [
  {
    id: 1,
    name: "Cà phê",
    description: "Sự kết hợp hoàn hảo giữa hạt cà phê Robusta & Arabica thượng hạng được trồng trên những vùng cao nguyên Việt Nam màu mỡ, qua những bí quyết rang xay độc đáo, The Brew Lab tự hào giới thiệu những dòng sản phẩm Cà phê mang hương vị đậm đà và tinh tế."
  },
  {
    id: 2,
    name: "Freeze",
    description: "Sảng khoái với thức uống đá xay. Freeze là thức uống đá xay mát lạnh được pha chế từ những nguyên liệu thuần túy."
  },
  {
    id: 3,
    name: "Trà",
    description: "Hương vị tự nhiên, thơm ngon của Trà với phong cách hiện đại tại The Brew Lab sẽ giúp bạn gợi mở vị giác của bản thân và tận hưởng một cảm giác thật khoan khoái, tươi mới."
  },
  {
    id: 4,
    name: "Bánh ngọt",
    description: "Những chiếc bánh ngọt ngào, mềm mịn được làm thủ công mỗi ngày, là sự kết hợp hoàn hảo cùng ly cà phê hay tách trà của bạn."
  }
];

const getImageForCategory = (categoryId: number) => {
  switch (categoryId) {
    case 1: return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800";
    case 2: return "https://images.unsplash.com/photo-1572490122747-3968b75bf699?auto=format&fit=crop&q=80&w=800";
    case 3: return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800";
    case 4: return "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800";
    default: return "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800";
  }
};

export const products: Product[] = [
  {
    id: 1,
    name: "PHIN ĐEN ĐÁ",
    price: 29000,
    image: getImageForCategory(1),
    description: "Hương vị cà phê truyền thống. Cà phê đậm đà pha hoàn toàn từ Phin, cho thêm 1 thìa đường, một ít đá viên mát lạnh, tạo nên Phin Đen Đá mang vị cà phê đậm đà chất Phin.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 2,
    name: "MOCHA MACCHIATO",
    price: 69000,
    image: getImageForCategory(1),
    description: "Một thức uống yêu thích được kết hợp bởi giữa sốt sô cô la ngọt ngào, sữa tươi và đặc biệt là cà phê espresso đậm đà.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 3,
    name: "LATTE",
    price: 65000,
    image: getImageForCategory(1),
    description: "Ly cà phê sữa ngọt ngào đến khó quên! Với một chút nhẹ nhàng hơn so với Cappuccino, Latte của chúng tôi bắt đầu với cà phê espresso, sau đó thêm sữa tươi và bọt sữa một cách đầy nghệ thuật.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 4,
    name: "CAPPUCCINO",
    price: 65000,
    image: getImageForCategory(1),
    description: "Ly cà phê sữa đậm đà thời thượng! Một chút đậm đà hơn so với Latte, Cappuccino của chúng tôi bắt đầu với cà phê espresso, sau đó thêm một lượng tương đương giữa sữa tươi và bọt sữa.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 5,
    name: "AMERICANO",
    price: 45000,
    image: getImageForCategory(1),
    description: "Americano là sự kết hợp giữa cà phê espresso thêm vào nước đun sôi. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 6,
    name: "ESPRESSO",
    price: 45000,
    image: getImageForCategory(1),
    description: "Đích thực là ly cà phê espresso ngon đậm đà! Được chiết xuất một cách hoàn hảo từ loại cà phê rang được phối trộn độc đáo.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 7,
    name: "PHIN SỮA ĐÁ",
    price: 29000,
    image: getImageForCategory(1),
    description: "Hương vị cà phê Việt Nam đích thực! Từng hạt cà phê hảo hạng được chọn bằng tay, phối trộn độc đáo giữa hạt Robusta và Arabica.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 8,
    name: "PHIN ĐEN NÓNG",
    price: 29000,
    image: getImageForCategory(1),
    description: "Dành cho những tín đồ cà phê đích thực! Hương vị cà phê truyền thống được phối trộn độc đáo.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 10,
    name: "PHINDI CASSIA",
    price: 55000,
    image: getImageForCategory(1),
    description: "Với chất phin êm ái, hương vị cà phê Việt Nam hiện đại kết hợp cùng hương quế nhẹ nhàng và thạch cà phê hấp dẫn.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 14,
    name: "BẠC XỈU ĐÁ",
    price: 29000,
    image: getImageForCategory(1),
    description: "Nếu Phin Sữa Đá dành cho các bạn đam mê vị đậm đà, thì Bạc Xỉu Đá là một sự lựa chọn nhẹ 'đô' cà phê nhưng vẫn thơm ngon.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 16,
    name: "COLD BREW ĐÀO",
    price: 79000,
    image: getImageForCategory(1),
    description: "Cà phê ủ lạnh kết hợp với hương đào thanh mát.",
    published_date: "2024-12-02 15:05:43",
    category_id: 1
  },
  {
    id: 24,
    name: "FREEZE SÔ-CÔ-LA",
    price: 55000,
    image: getImageForCategory(2),
    description: "Thiên đường đá xay sô cô la! Từ những thanh sô cô la chất lượng được đem xay với đá cho đến khi mềm mịn.",
    published_date: "2024-12-02 15:05:43",
    category_id: 2
  },
  {
    id: 25,
    name: "COOKIES & CREAM",
    price: 55000,
    image: getImageForCategory(2),
    description: "Một thức uống ngon lạ miệng bởi sự kết hợp hoàn hảo giữa cookies sô cô la giòn xốp cùng hỗn hợp sữa tươi.",
    published_date: "2024-12-02 15:05:43",
    category_id: 2
  },
  {
    id: 28,
    name: "FREEZE TRÀ XANH",
    price: 55000,
    image: getImageForCategory(2),
    description: "Thức uống rất được ưa chuộng! Trà xanh thượng hạng, kết hợp cùng đá xay, thạch trà dai dai, thơm ngon.",
    published_date: "2024-12-02 15:05:43",
    category_id: 2
  },
  {
    id: 29,
    name: "TRÀ THẠCH VẢI",
    price: 45000,
    image: getImageForCategory(3),
    description: "Một sự kết hợp thú vị giữa trà đen, những quả vải thơm ngon và thạch giòn khó cưỡng.",
    published_date: "2024-12-02 15:05:43",
    category_id: 3
  },
  {
    id: 30,
    name: "TRÀ SEN VÀNG (CỦ NĂNG)",
    price: 45000,
    image: getImageForCategory(3),
    description: "Thức uống chinh phục những thực khách khó tính! Sự kết hợp độc đáo giữa trà Ô long, hạt sen thơm bùi và củ năng giòn tan.",
    published_date: "2024-12-02 15:05:43",
    category_id: 3
  },
  {
    id: 33,
    name: "TRÀ THẠCH ĐÀO",
    price: 45000,
    image: getImageForCategory(3),
    description: "Vị trà đậm đà kết hợp cùng những miếng đào thơm ngon mọng nước cùng thạch đào giòn dai.",
    published_date: "2024-12-02 15:05:43",
    category_id: 3
  },
  {
    id: 38,
    name: "BÁNH CARAMEL PHÔ MAI",
    price: 35000,
    image: getImageForCategory(4),
    description: "Ngon khó cưỡng! Bánh phô mai thơm béo được phủ bằng lớp caramel ngọt ngào.",
    published_date: "2024-12-02 15:05:43",
    category_id: 4
  },
  {
    id: 39,
    name: "BÁNH TIRAMISU",
    price: 35000,
    image: getImageForCategory(4),
    description: "Tiramisu thơm béo, làm từ ca-cao đậm đà, kết hợp với phô mai ít béo, vani và chút rum nhẹ nhàng.",
    published_date: "2024-12-02 15:05:43",
    category_id: 4
  }
];
