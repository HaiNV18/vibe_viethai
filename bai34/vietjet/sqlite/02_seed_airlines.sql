-- ============================================================================
-- FILE: 02_seed_airlines.sql
-- MÔ TẢ: Dữ liệu mẫu cho bảng Hãng hàng không (airlines)
-- ============================================================================

INSERT INTO airlines (code, name, logo, country, description) VALUES
('VJ', 'VietJet Air', 'images/vietjet-logo.jpg', 'Việt Nam', 'Hãng hàng không thế hệ mới với mạng bay rộng khắp Việt Nam và Châu Á.'),
('VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vietnam_Airlines_logo.svg/600px-Vietnam_Airlines_logo.svg.png', 'Việt Nam', 'Hãng hàng không Quốc gia Việt Nam tiêu chuẩn 4 sao Skytrax.'),
('SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/600px-Singapore_Airlines_Logo_2.svg.png', 'Singapore', 'Hãng hàng không 5 sao hàng đầu thế giới với dịch vụ đẳng cấp.'),
('QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bamboo_Airways_Logo.svg/600px-Bamboo_Airways_Logo.svg.png', 'Việt Nam', 'Hơn cả một chuyến bay - Dịch vụ định hướng 5 sao.'),
('KE', 'Korean Air', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Korean_Air_Logo.svg/600px-Korean_Air_Logo.svg.png', 'Hàn Quốc', 'Hãng hàng không lớn nhất Hàn Quốc kết nối Á - Âu - Mỹ.'),
('TG', 'Thai Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Thai_Airways_Logo.svg/600px-Thai_Airways_Logo.svg.png', 'Thái Lan', 'Hãng hàng không Quốc gia Thái Lan với trải nghiệm Royal Orchid.');
