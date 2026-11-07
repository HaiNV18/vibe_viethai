-- ============================================================================
-- FILE: 03_seed_flights.sql
-- MÔ TẢ: Dữ liệu mẫu cho bảng Chuyến bay (flights)
-- Bao phủ đầy đủ các bộ lọc: Hãng bay, Khứ hồi/Một chiều, Bay thẳng/Nhiều thành phố,
-- Khung giờ cất cánh (00-06h, 06-12h, 12-18h, 18-24h), Loại máy bay (Airbus, Boeing)
-- và Giá vé 2 hạng (Hạng Phổ Thông & Hạng Thương Gia).
-- ============================================================================

INSERT INTO flights (
    flight_code, airline_code, airline_name,
    from_code, from_city, to_code, to_city,
    departure_date, return_date, departure_time, arrival_time, departure_hour,
    duration, trip_type, route_type, aircraft,
    price_economy, price_business, services
) VALUES
-- 1. VietJet Air: TP.HCM -> Hà Nội (Buổi sáng, Khứ hồi, Bay thẳng)
('VJ122', 'VJ', 'VietJet Air',
 'SGN', 'TP. Hồ Chí Minh', 'HAN', 'Hà Nội',
 '2026-11-15', '2026-11-18', '07:30', '09:40', 7,
 '2 giờ 10 phút', 'round-trip', 'direct', 'Airbus A321neo',
 1290000, 3490000, 'Hành lý xách tay 7kg, Suất ăn nóng SkyCafe, Bảo hiểm SkyCare'),

-- 2. VietJet Air: TP.HCM -> Đà Nẵng (Sáng sớm, Một chiều, Bay thẳng)
('VJ624', 'VJ', 'VietJet Air',
 'SGN', 'TP. Hồ Chí Minh', 'DAD', 'Đà Nẵng',
 '2026-11-15', NULL, '05:15', '06:35', 5,
 '1 giờ 20 phút', 'one-way', 'direct', 'Airbus A320',
 890000, 2590000, 'Hành lý xách tay 7kg, Chọn chỗ ngồi tiêu chuẩn'),

-- 3. VietJet Air: Hà Nội -> Phú Quốc (Buổi chiều, Khứ hồi, Bay thẳng)
('VJ453', 'VJ', 'VietJet Air',
 'HAN', 'Hà Nội', 'PQC', 'Phú Quốc',
 '2026-11-16', '2026-11-20', '14:20', '16:30', 14,
 '2 giờ 10 phút', 'round-trip', 'direct', 'Airbus A321neo',
 1590000, 3890000, 'Hành lý xách tay 7kg, 20kg ký gửi, Suất ăn nóng'),

-- 4. VietJet Air: TP.HCM -> Nha Trang (Buổi tối, Một chiều, Bay thẳng)
('VJ782', 'VJ', 'VietJet Air',
 'SGN', 'TP. Hồ Chí Minh', 'CXR', 'Nha Trang',
 '2026-11-15', NULL, '19:45', '20:55', 19,
 '1 giờ 10 phút', 'one-way', 'direct', 'Airbus A320',
 750000, 2290000, 'Hành lý xách tay 7kg, Đổi vé linh hoạt'),

-- 5. VietJet Air: TP.HCM -> Bangkok (Buổi trưa, Khứ hồi, Bay thẳng)
('VJ801', 'VJ', 'VietJet Air',
 'SGN', 'TP. Hồ Chí Minh', 'BKK', 'Bangkok',
 '2026-11-18', '2026-11-22', '11:15', '12:45', 11,
 '1 giờ 30 phút', 'round-trip', 'direct', 'Airbus A321',
 1850000, 4500000, 'Hành lý xách tay 7kg, 20kg ký gửi, Bảo hiểm quốc tế SkyCare'),

-- 6. VietJet Air: Hà Nội -> Seoul (Đêm/Tối muộn, Khứ hồi, Nhiều thành phố)
('VJ960', 'VJ', 'VietJet Air',
 'HAN', 'Hà Nội', 'ICN', 'Seoul',
 '2026-11-20', '2026-11-25', '22:50', '05:10', 22,
 '4 giờ 20 phút', 'round-trip', 'multi-city', 'Airbus A330-300',
 3290000, 7890000, 'Hành lý xách tay 10kg, 30kg ký gửi, Chăn gối, Suất ăn Hàn Quốc'),

-- 7. Vietnam Airlines: TP.HCM -> Hà Nội (Buổi sáng, Khứ hồi, Bay thẳng)
('VN210', 'VN', 'Vietnam Airlines',
 'SGN', 'TP. Hồ Chí Minh', 'HAN', 'Hà Nội',
 '2026-11-15', '2026-11-19', '08:00', '10:10', 8,
 '2 giờ 10 phút', 'round-trip', 'direct', 'Boeing 787-9 Dreamliner',
 1890000, 4950000, 'Hành lý xách tay 12kg, 23kg ký gửi, Suất ăn tiêu chuẩn 4 sao, Giải trí màn hình riêng'),

-- 8. Vietnam Airlines: Hà Nội -> Đà Nẵng (Buổi chiều, Một chiều, Bay thẳng)
('VN175', 'VN', 'Vietnam Airlines',
 'HAN', 'Hà Nội', 'DAD', 'Đà Nẵng',
 '2026-11-16', NULL, '15:30', '16:50', 15,
 '1 giờ 20 phút', 'one-way', 'direct', 'Airbus A321',
 1350000, 3600000, 'Hành lý xách tay 12kg, 23kg ký gửi, Phục vụ đồ uống miễn phí'),

-- 9. Vietnam Airlines: TP.HCM -> Đà Lạt (Sáng sớm, Một chiều, Bay thẳng)
('VN1380', 'VN', 'Vietnam Airlines',
 'SGN', 'TP. Hồ Chí Minh', 'DLI', 'Đà Lạt',
 '2026-11-17', NULL, '05:45', '06:40', 5,
 '0 giờ 55 phút', 'one-way', 'direct', 'Airbus A321',
 1120000, 2950000, 'Hành lý xách tay 12kg, 23kg ký gửi, Nước suối & khăn lạnh'),

-- 10. Singapore Airlines: TP.HCM -> Singapore (Buổi sáng, Khứ hồi, Bay thẳng)
('SQ177', 'SQ', 'Singapore Airlines',
 'SGN', 'TP. Hồ Chí Minh', 'SIN', 'Singapore',
 '2026-11-18', '2026-11-21', '09:50', '12:55', 9,
 '2 giờ 05 phút', 'round-trip', 'direct', 'Airbus A350-900',
 3450000, 8900000, 'Hành lý ký gửi 30kg, Wifi miễn phí, Hệ thống giải trí KrisWorld, Ẩm thực 5 sao'),

-- 11. Singapore Airlines: Hà Nội -> Singapore (Buổi tối, Khứ hồi, Nhiều thành phố)
('SQ193', 'SQ', 'Singapore Airlines',
 'HAN', 'Hà Nội', 'SIN', 'Singapore',
 '2026-11-19', '2026-11-24', '18:35', '23:05', 18,
 '3 giờ 30 phút', 'round-trip', 'multi-city', 'Boeing 787-10 Dreamliner',
 4150000, 9800000, 'Hành lý ký gửi 30kg, Phòng chờ SilverKris (Thương gia), Suất ăn quốc tế'),

-- 12. Bamboo Airways: Hà Nội -> TP.HCM (Buổi chiều, Một chiều, Bay thẳng)
('QH241', 'QH', 'Bamboo Airways',
 'HAN', 'Hà Nội', 'SGN', 'TP. Hồ Chí Minh',
 '2026-11-15', NULL, '13:15', '15:25', 13,
 '2 giờ 10 phút', 'one-way', 'direct', 'Boeing 787-9 Dreamliner',
 1490000, 4100000, 'Hành lý xách tay 7kg, 20kg ký gửi, Suất ăn nhẹ & Nước uống'),

-- 13. Bamboo Airways: TP.HCM -> Phú Quốc (Buổi sáng, Khứ hồi, Bay thẳng)
('QH1521', 'QH', 'Bamboo Airways',
 'SGN', 'TP. Hồ Chí Minh', 'PQC', 'Phú Quốc',
 '2026-11-16', '2026-11-19', '10:10', '11:10', 10,
 '1 giờ 00 phút', 'round-trip', 'direct', 'Airbus A320neo',
 1190000, 3150000, 'Hành lý xách tay 7kg, 20kg ký gửi, Chọn ghế ngồi trước'),

-- 14. Korean Air: TP.HCM -> Seoul (Đêm khuya, Khứ hồi, Nhiều thành phố)
('KE476', 'KE', 'Korean Air',
 'SGN', 'TP. Hồ Chí Minh', 'ICN', 'Seoul',
 '2026-11-20', '2026-11-26', '23:55', '06:55', 23,
 '5 giờ 00 phút', 'round-trip', 'multi-city', 'Boeing 777-300ER',
 5890000, 14500000, 'Hành lý ký gửi 2 kiện x 23kg, Ẩm thực Bibimbap truyền thống, Giải trí AVOD'),

-- 15. Thai Airways: Hà Nội -> Bangkok (Buổi tối, Khứ hồi, Bay thẳng)
('TG565', 'TG', 'Thai Airways',
 'HAN', 'Hà Nội', 'BKK', 'Bangkok',
 '2026-11-18', '2026-11-22', '20:30', '22:20', 20,
 '1 giờ 50 phút', 'round-trip', 'direct', 'Airbus A350-900',
 2950000, 6800000, 'Hành lý ký gửi 30kg, Suất ăn Royal Thai, Phòng chờ Royal Silk (Thương gia)'),

-- 16. VietJet Air: Đà Nẵng -> Hà Nội (Buổi chiều, Một chiều, Bay thẳng)
('VJ512', 'VJ', 'VietJet Air',
 'DAD', 'Đà Nẵng', 'HAN', 'Hà Nội',
 '2026-11-17', NULL, '16:40', '18:00', 16,
 '1 giờ 20 phút', 'one-way', 'direct', 'Airbus A321',
 920000, 2650000, 'Hành lý xách tay 7kg, Làm thủ tục nhanh');
