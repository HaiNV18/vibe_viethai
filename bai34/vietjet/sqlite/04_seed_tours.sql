-- ============================================================================
-- FILE: 04_seed_tours.sql
-- MÔ TẢ: Dữ liệu mẫu cho bảng Tour du lịch (tours)
-- Gồm đúng 8 Tour du lịch nổi bật có hình thumbnail kích thước chuẩn 600x400,
-- đầy đủ thông tin Hãng du lịch, Hãng bay, Số ngày/đêm, Loại máy bay, Giá tour
-- và Lịch trình chuyến đi chi tiết từng ngày.
-- ============================================================================

INSERT INTO tours (
    title, thumbnail, travel_agency,
    airline_code, airline_name, from_city, to_city,
    departure_date, departure_time, departure_hour,
    flight_duration, duration_days, aircraft,
    price, services, itinerary, is_featured
) VALUES
-- Tour 1: Phú Quốc
('Phú Quốc – Đảo Ngọc Thiên Đường – Grand World – Cáp Treo Hòn Thơm',
 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&h=400&q=80',
 'Vietjet Travel', 'VJ', 'VietJet Air', 'TP. Hồ Chí Minh', 'Phú Quốc',
 '2026-11-20', '08:15', 8,
 '1 giờ 00 phút', '3 Ngày 2 Đêm', 'Airbus A321neo',
 4590000,
 'Vé máy bay khứ hồi VietJet Air, Khách sạn 4 sao biển Dương Đông, Cano 4 đảo, Vé Grand World, Ăn 5 bữa chính',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Phú Quốc – Đông Đảo – Thành phố không ngủ Grand World","detail":"Quý khách tập trung tại sân bay Tân Sơn Nhất đáp chuyến bay VietJet Air (Airbus A321neo) đi Phú Quốc. Đến nơi, xe đón đoàn tham quan Dinh Cậu, Làng chài Hàm Ninh. Chiều khám phá Grand World, xem nhạc nước Venice."},
   {"day":"Ngày 2","title":"Khám phá Nam Đảo – Cáp treo Hòn Thơm – Cano 4 Đảo – Sunset Town","detail":"Trải nghiệm cáp treo 3 dây vượt biển dài nhất thế giới tại Hòn Thơm. Lặn ngắm san hô tại Hòn Móng Tay, Hòn Gầm Ghì. Chiều chụp ảnh tại Cầu Hôn (Kiss Bridge) và Thị trấn Hoàng Hôn."},
   {"day":"Ngày 3","title":"Mua sắm đặc sản Ngọc Trai, Nước Mắm – Bay về TP.HCM","detail":"Dùng điểm tâm sáng tại resort, tự do tắm biển. Tham quan cơ sở nuôi cấy ngọc trai và nhà thùng nước mắm Phú Quốc trước khi ra sân bay đáp chuyến bay về lại TP.HCM."}
 ]', 1),

-- Tour 2: Đà Nẵng - Hội An - Bà Nà Hills
('Đà Nẵng – Phố Cổ Hội An – Cầu Vàng Bà Nà Hills – Bán Đảo Sơn Trà',
 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&h=400&q=80',
 'Vietjet Travel', 'VJ', 'VietJet Air', 'TP. Hồ Chí Minh', 'Đà Nẵng',
 '2026-11-22', '06:30', 6,
 '1 giờ 20 phút', '4 Ngày 3 Đêm', 'Airbus A321',
 5290000,
 'Vé máy bay khứ hồi VietJet Air, Khách sạn 4 sao ven biển Mỹ Khê, Vé cáp treo Bà Nà Hills + Buffet trưa, Xe du lịch đời mới',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Đà Nẵng – Bán Đảo Sơn Trà – Chùa Linh Ứng – Biển Mỹ Khê","detail":"Khởi hành từ sân bay Tân Sơn Nhất trên tàu bay Airbus A321 của VietJet Air. Đến Đà Nẵng, tham quan Bán đảo Sơn Trà, viếng Chùa Linh Ứng Bãi Bụt và tắm biển Mỹ Khê."},
   {"day":"Ngày 2","title":"Khu du lịch Bà Nà Hills – Cầu Vàng – Làng Pháp","detail":"Đi cáp treo lên đỉnh Bà Nà, check-in Cầu Vàng nổi tiếng thế giới, tham quan Vườn hoa Le Jardin D’Amour, Hầm rượu Debay và vui chơi tại Fantasy Park. Ăn trưa buffet 5 sao."},
   {"day":"Ngày 3","title":"Ngũ Hành Sơn – Rừng Dừa Bảy Mẫu – Phố Cổ Hội An","detail":"Tham quan danh thắng Ngũ Hành Sơn, ngồi thuyền thúng Rừng Dừa Bảy Mẫu. Chiều dạo bước Phố cổ Hội An, ngắm Chùa Cầu và thả đèn hoa đăng trên sông Hoài."},
   {"day":"Ngày 4","title":"Cầu Rồng – Chợ Hàn – Tiễn sân bay Đà Nẵng","detail":"Chụp ảnh tại Cầu Tình Yêu, tượng Cá Chép Hóa Rồng, mua đặc sản miền Trung tại Chợ Hàn và ra sân bay đáp chuyến bay về lại TP.HCM."}
 ]', 1),

-- Tour 3: Hà Nội - Hạ Long - Sapa
('Hà Nội – Vịnh Hạ Long Du Thuyền 5 Sao – Sapa Đỉnh Fansipan',
 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80',
 'Saigontourist', 'VN', 'Vietnam Airlines', 'TP. Hồ Chí Minh', 'Hà Nội',
 '2026-11-25', '07:00', 7,
 '2 giờ 10 phút', '5 Ngày 4 Đêm', 'Boeing 787-9 Dreamliner',
 7990000,
 'Vé máy bay khứ hồi Vietnam Airlines (Boeing 787), Du thuyền Vịnh Hạ Long, Khách sạn 4 sao, Vé cáp treo Fansipan',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Hà Nội – Hồ Hoàn Kiếm – 36 Phố Phường","detail":"Bay cùng Vietnam Airlines trên siêu máy bay Boeing 787-9 Dreamliner ra Thủ đô Hà Nội. Tham quan Hồ Gươm, Đền Ngọc Sơn, Văn Miếu Quốc Tử Giám."},
   {"day":"Ngày 2","title":"Hà Nội – Vịnh Hạ Long – Hang Sửng Sốt – Đảo Titop","detail":"Khởi hành đi Quảng Ninh, lên du thuyền tham quan Di sản thiên nhiên thế giới Vịnh Hạ Long, khám phá Hang Sửng Sốt, Hòn Trống Mái và tắm biển Đảo Titop."},
   {"day":"Ngày 3","title":"Hạ Long – Cao tốc Lào Cai – Thị trấn Sapa – Bản Cát Cát","detail":"Di chuyển lên Sapa, thăm Bản Cát Cát của người H’Mông, thác Tiên Sa và thưởng thức đồ nướng Tây Bắc tại Nhà thờ Đá Sapa."},
   {"day":"Ngày 4","title":"Chinh phục Nóc nhà Đông Dương Fansipan – Về lại Hà Nội","detail":"Đi cáp treo chinh phục đỉnh Fansipan ở độ cao 3.143m, chiêm bái quần thể tâm linh trên mây. Chiều khởi hành về lại Hà Nội."},
   {"day":"Ngày 5","title":"Lăng Bác – Chùa Một Cột – Hồ Tây – Bay về TP.HCM","detail":"Viếng Lăng Chủ tịch Hồ Chí Minh, Chùa Một Cột, chùa Trấn Quốc bên Hồ Tây. Xe đưa đoàn ra sân bay Nội Bài bay về TP.HCM."}
 ]', 1),

-- Tour 4: Singapore - Đảo Quốc Sư Tử
('Đảo Quốc Sư Tử Singapore – Gardens by the Bay – Đảo Sentosa – Jewel Changi',
 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&h=400&q=80',
 'Vietravel', 'SQ', 'Singapore Airlines', 'TP. Hồ Chí Minh', 'Singapore',
 '2026-11-28', '09:50', 9,
 '2 giờ 05 phút', '4 Ngày 3 Đêm', 'Airbus A350-900',
 11490000,
 'Vé máy bay khứ hồi Singapore Airlines 5 sao, Khách sạn 4 sao trung tâm Orchard, Vé Gardens by the Bay, Bảo hiểm 1 tỷ VNĐ',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Sân bay Jewel Changi – Công viên Sư tử biển Merlion Park","detail":"Đáp chuyến bay Singapore Airlines (Airbus A350-900) đến Singapore. Tham quan thác nước nhân tạo trong nhà lớn nhất thế giới tại Jewel Changi, chụp hình tại Merlion Park và nhà hát Trái Sầu Riêng Esplanade."},
   {"day":"Ngày 2","title":"Khu vườn năng lượng Gardens by the Bay – Đảo Sentosa – Nhạc nước Wings of Time","detail":"Tham quan Flower Dome, Cloud Forest. Chiều qua đảo Sentosa chụp ảnh tại quả cầu Universal Studios và xem biểu diễn nhạc nước ánh sáng laser."},
   {"day":"Ngày 3","title":"Chùa Răng Phật – Khu phố Chinatown – Mua sắm đại lộ Orchard Road","detail":"Viếng Chùa Răng Phật linh thiêng tại Chinatown, tham quan đồi Mount Faber và tự do mua sắm tại thiên đường hàng hiệu Orchard Road."},
   {"day":"Ngày 4","title":"Trải nghiệm Tàu điện ngầm MRT – Bay về TP.HCM","detail":"Tự do khám phá ẩm thực Cháo ếch Singapore trước khi ra sân bay Changi đáp chuyến bay về lại TP.HCM."}
 ]', 1),

-- Tour 5: Nha Trang - Vịnh San Hô - VinWonders
('Nha Trang – Đảo Điệp Sơn – Vịnh San Hô – Thiên Đường Giải Trí VinWonders',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80',
 'Vietjet Travel', 'VJ', 'VietJet Air', 'Hà Nội', 'Nha Trang',
 '2026-11-21', '13:45', 13,
 '1 giờ 50 phút', '3 Ngày 2 Đêm', 'Airbus A320',
 3990000,
 'Vé máy bay khứ hồi VietJet Air, Khách sạn 4 sao đường Trần Phú, Vé VinWonders Hòn Tre, Tắm bùn khoáng I-Resort',
 '[
   {"day":"Ngày 1","title":"Hà Nội – Sân bay Cam Ranh – Tháp Bà Ponagar – Chùa Long Sơn","detail":"Đoàn khởi hành từ sân bay Nội Bài bằng tàu bay Airbus A320 của VietJet Air. Đến Nha Trang tham quan Tháp Bà Ponagar, Chùa Long Sơn và nhận phòng khách sạn ven biển Trần Phú."},
   {"day":"Ngày 2","title":"Du ngoạn Vịnh Nha Trang – Vịnh San Hô – Đảo Hòn Tre VinWonders","detail":"Đi cano khám phá Vịnh San Hô, dùng bữa trưa hải sản trên bè. Chiều vui chơi trọn gói tại công viên giải trí VinWonders Nha Trang và xem Tata Show."},
   {"day":"Ngày 3","title":"Tắm bùn khoáng nóng I-Resort – Chợ Đầm – Bay về Hà Nội","detail":"Trải nghiệm tắm bùn khoáng nóng thư giãn, mua yến sào & hải sản khô tại Chợ Đầm rồi ra sân bay Cam Ranh về lại Hà Nội."}
 ]', 1),

-- Tour 6: Đà Lạt - Thành Phố Ngàn Hoa Săn Mây
('Đà Lạt – Săn Mây Cầu Đất – Đỉnh Langbiang – Thác Datanla – Puppy Farm',
 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80',
 'Bamboo Holidays', 'QH', 'Bamboo Airways', 'TP. Hồ Chí Minh', 'Đà Lạt',
 '2026-11-23', '05:45', 5,
 '0 giờ 55 phút', '3 Ngày 2 Đêm', 'Airbus A320neo',
 3690000,
 'Vé máy bay khứ hồi Bamboo Airways, Khách sạn 4 sao gần chợ đêm Đà Lạt, Xe Jeep đỉnh Langbiang, Giao lưu Cồng chiêng Tây Nguyên',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Sân bay Liên Khương – Thác Datanla – Quảng trường Lâm Viên","detail":"Bay chuyến sáng sớm trên tàu bay Airbus A320neo tới Đà Lạt. Trải nghiệm máng trượt xuyên rừng tại Thác Datanla, check-in nụ hoa Atiso tại Quảng trường Lâm Viên và Hồ Xuân Hương."},
   {"day":"Ngày 2","title":"Đồi Chè Cầu Đất Săn Mây – Nông trại Cún Puppy Farm – Đỉnh Langbiang","detail":"Đón bình minh săn mây tại Cầu Đất, thăm vườn dâu tây công nghệ cao tại Puppy Farm. Chiều đi xe Jeep lên đỉnh Langbiang và dự đêm hội Cồng chiêng."},
   {"day":"Ngày 3","title":"Thiền Viện Trúc Lâm – Hồ Tuyền Lâm – Chợ Đà Lạt – Bay về TP.HCM","detail":"Viếng Thiền viện Trúc Lâm bên Hồ Tuyền Lâm thơ mộng, mua mứt và dâu tây tại Chợ Đà Lạt trước khi ra sân bay Liên Khương về lại TP.HCM."}
 ]', 1),

-- Tour 7: Bangkok - Pattaya - Thái Lan
('Thái Lan: Bangkok – Pattaya – Đảo Coral – Chùa Phật Vàng – Du Thuyền Sông Chao Phraya',
 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&h=400&q=80',
 'Vietjet Travel', 'VJ', 'VietJet Air', 'TP. Hồ Chí Minh', 'Bangkok',
 '2026-11-26', '11:15', 11,
 '1 giờ 30 phút', '5 Ngày 4 Đêm', 'Airbus A321',
 6890000,
 'Vé máy bay khứ hồi VietJet Air + 20kg ký gửi, Khách sạn 4-5 sao, Buffet 86 tầng Baiyoke Sky, Alcazar Show, Massage Thái cổ truyền',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Bangkok – Thành phố biển Pattaya – Chợ nổi 4 miền","detail":"Đáp chuyến bay thẳng VietJet Air (Airbus A321) đến sân bay Suvarnabhumi (Bangkok), khởi hành đi Pattaya tham quan Chợ nổi 4 miền."},
   {"day":"Ngày 2","title":"Đảo San Hô Coral Island – Trân Bảo Phật Sơn – Vườn Nhiệt Đới Nong Nooch","detail":"Đi tàu cao tốc tắm biển tại Đảo Coral, chiêm bái núi Phật khắc vàng Khao Chee Chan, xem biểu diễn văn hóa Thái tại công viên Nong Nooch và Alcazar Show."},
   {"day":"Ngày 3","title":"Pattaya – Bangkok – Muang Boran – Du thuyền 5 sao sông Chao Phraya","detail":"Về lại thủ đô Bangkok, tham quan thành phố cổ đại Muang Boran và thưởng thức bữa tối buffet trên du thuyền dọc sông Chao Phraya."},
   {"day":"Ngày 4","title":"Chùa Phật Vàng – Phật Bốn Mặt – Buffet 86 tầng Baiyoke Sky – Mua sắm Big C","detail":"Viếng Chùa Phật Vàng Wat Traimit, Chùa Thuyền Wat Yannawa, dùng bữa trưa trên tòa nhà 86 tầng và tự do mua sắm tại Central World, Siam Paragon."},
   {"day":"Ngày 5","title":"Bangkok – Sân bay Suvarnabhumi – Bay về TP.HCM","detail":"Dùng điểm tâm sáng tại khách sạn, xe đưa đoàn ra sân bay làm thủ tục bay về lại TP.HCM."}
 ]', 1),

-- Tour 8: Hàn Quốc - Seoul - Đảo Nami
('Hàn Quốc Mùa Lá Đỏ: Seoul – Đảo Nami – Công Viên Everland – Cung Điện Gyeongbokgung',
 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&h=400&q=80',
 'Vietravel', 'KE', 'Korean Air', 'TP. Hồ Chí Minh', 'Seoul',
 '2026-11-29', '23:55', 23,
 '5 giờ 00 phút', '5 Ngày 4 Đêm', 'Boeing 777-300ER',
 15990000,
 'Vé máy bay khứ hồi Korean Air (Boeing 777), Visa Hàn Quốc trọn gói, Khách sạn 4 sao Seoul, Vé Everland, Trải nghiệm mặc Hanbok',
 '[
   {"day":"Ngày 1","title":"TP.HCM – Sân bay Quốc tế Incheon – Đảo Nami Lãng Mạn – Tháp Namsan","detail":"Bay đêm cùng hãng hàng không 5 sao Korean Air (Boeing 777-300ER). Đến Incheon, xe đưa đoàn tham quan Đảo Nami rợp bóng ngân hạnh và ngắm toàn cảnh Seoul từ Tháp N Seoul Tower."},
   {"day":"Ngày 2","title":"Công viên giải trí Everland – Chợ đêm Myeongdong","detail":"Vui chơi trọn ngày tại công viên chủ đề lớn nhất Hàn Quốc Everland, thăm vườn thú Safari. Tối khám phá ẩm thực đường phố và mỹ phẩm tại Myeongdong."},
   {"day":"Ngày 3","title":"Cung điện Gyeongbokgung – Làng cổ Bukchon Hanok – Nhà Xanh","detail":"Mặc trang phục truyền thống Hanbok tham quan Cung điện Hoàng gia Cảnh Phúc Cung, Bảo tàng Dân gian Quốc gia và dạo bước làng cổ Bukchon Hanok."},
   {"day":"Ngày 4","title":"Trung tâm Nhân sâm Chính phủ – Thư viện Starfield COEX – Hongdae","detail":"Tham quan trung tâm nhân sâm Hàn Quốc, check-in thư viện khổng lồ Starfield và tự do dạo phố trẻ Hongdae."},
   {"day":"Ngày 5","title":"Siêu thị miễn thuế – Sân bay Incheon – Bay về TP.HCM","detail":"Mua sắm quà lưu niệm tại trung tâm miễn thuế trước khi ra sân bay Incheon đáp chuyến bay về lại TP.HCM."}
 ]', 1);
