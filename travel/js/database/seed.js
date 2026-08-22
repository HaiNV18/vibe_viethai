import { hashPassword } from './database.js';

export async function seedDatabase(db) {
  const now = new Date().toISOString();

  // 1. Seed Users
  const adminPass = await hashPassword('Admin123!');
  const userPass = await hashPassword('User123!');

  db.run(`
    INSERT INTO users (username, email, password_hash, role, full_name, phone, country, address, created_at)
    VALUES 
    ('admin', 'admin@travel.com', '${adminPass}', 'admin', 'TravelViet Administrator', '0901234567', 'Vietnam', 'Hà Nội, Việt Nam', '${now}'),
    ('userdemo', 'user@travel.com', '${userPass}', 'user', 'Nguyễn Văn User', '0987654321', 'Vietnam', 'TP. Hồ Chí Minh, Việt Nam', '${now}');
  `);

  // 2. Seed Airlines (10 Airlines)
  const airlines = [
    { code: 'VJ', name: 'VietJet Air', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80', country: 'Vietnam' },
    { code: 'VN', name: 'Vietnam Airlines', logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80', country: 'Vietnam' },
    { code: 'QH', name: 'Bamboo Airways', logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=120&q=80', country: 'Vietnam' },
    { code: 'BL', name: 'Pacific Airlines', logo: 'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=120&q=80', country: 'Vietnam' },
    { code: 'SQ', name: 'Singapore Airlines', logo: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=120&q=80', country: 'Singapore' },
    { code: 'TG', name: 'Thai Airways', logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80', country: 'Thailand' },
    { code: 'AK', name: 'AirAsia', logo: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80', country: 'Malaysia' },
    { code: 'KE', name: 'Korean Air', logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80', country: 'South Korea' },
    { code: 'JL', name: 'Japan Airlines', logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80', country: 'Japan' },
    { code: 'EK', name: 'Emirates', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80', country: 'UAE' }
  ];

  airlines.forEach(a => {
    db.run(`INSERT INTO airlines (code, name, logo, country) VALUES ('${a.code}', '${a.name}', '${a.logo}', '${a.country}');`);
  });

  // 3. Seed Airports (11 Airports)
  const airports = [
    { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'Vietnam' },
    { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'Vietnam' },
    { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'Vietnam' },
    { code: 'CXR', name: 'Cam Ranh', city: 'Khánh Hòa', country: 'Vietnam' },
    { code: 'PQC', name: 'Phú Quốc', city: 'Kiên Giang', country: 'Vietnam' },
    { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'Vietnam' },
    { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore' },
    { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand' },
    { code: 'ICN', name: 'Incheon', city: 'Seoul', country: 'South Korea' },
    { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan' },
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' }
  ];

  airports.forEach(ap => {
    db.run(`INSERT INTO airports (code, name, city, country) VALUES ('${ap.code}', '${ap.name}', '${ap.city}', '${ap.country}');`);
  });

  // Helper arrays for generating 100+ flights & 100+ tours
  const aircraftList = ['Airbus A320', 'Airbus A321', 'Airbus A330', 'Airbus A350', 'Boeing 737', 'Boeing 787', 'Boeing 777'];
  const times = ['06:00', '08:30', '10:15', '13:00', '15:45', '18:20', '20:50', '22:30'];
  const dates = ['2026-09-01', '2026-09-02', '2026-09-05', '2026-09-10', '2026-09-15', '2026-09-20', '2026-10-01'];

  // 4. Seed 105 Flights
  db.run("BEGIN TRANSACTION;");
  let flightCount = 0;
  for (let aId = 1; aId <= 10; aId++) {
    for (let origId = 1; origId <= 11; origId++) {
      for (let destId = 1; destId <= 11; destId++) {
        if (origId === destId) continue;
        if (flightCount >= 105) break;

        flightCount++;
        const fNum = `${airlines[aId - 1].code}${100 + flightCount}`;
        const depTime = times[flightCount % times.length];
        const depDate = dates[flightCount % dates.length];
        const duration = 120 + (flightCount % 8) * 45;
        const arrHour = (parseInt(depTime.split(':')[0]) + Math.floor(duration / 60)) % 24;
        const arrMin = (parseInt(depTime.split(':')[1]) + (duration % 60)) % 60;
        const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
        
        const tripType = flightCount % 3 === 0 ? 'round-trip' : 'one-way';
        const stops = flightCount % 7 === 0 ? 1 : 0;
        const aircraft = aircraftList[flightCount % aircraftList.length];
        const ecoPrice = 1200000 + (flightCount % 15) * 450000;
        const busPrice = ecoPrice * 2.8;

        db.run(`
          INSERT INTO flights 
          (flight_number, airline_id, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stops, aircraft, economy_price, business_price, services)
          VALUES ('${fNum}', ${aId}, ${origId}, ${destId}, '${depDate}', '${depTime}', '${arrTime}', ${duration}, '${tripType}', ${stops}, '${aircraft}', ${ecoPrice}, ${busPrice}, 'Hành lý xách tay 7kg, Suất ăn nhẹ');
        `);
      }
    }
  }
  db.run("COMMIT;");

  // 5. Seed 8 Featured Tours
  const featuredTours = [
    {
      code: 'TOUR001', name: 'Hà Nội — Hạ Long 4N3Đ: Trải Nghiệm Du Thuyền 5 Sao', operator: 'TravelViet Heritage',
      origin: 'TP. Hồ Chí Minh', destination: 'Hạ Long', country: 'Vietnam', departure_date: '2026-09-10',
      days: 4, nights: 3, price: 5990000, thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Hành trình khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long, nghỉ dưỡng du thuyền cao cấp và tham quan Phố cổ Hà Nội.',
      featured: 1
    },
    {
      code: 'TOUR002', name: 'Đà Nẵng — Hội An — Bà Nà Hills 4N3Đ: Cầu Vàng Huyền Thoại', operator: 'Vietnam Travel',
      origin: 'Hà Nội', destination: 'Đà Nẵng', country: 'Vietnam', departure_date: '2026-09-12',
      days: 4, nights: 3, price: 6890000, thumbnail: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Chiêm ngưỡng Cầu Vàng Sun World Bà Nà Hills, thả hoa đăng trên sông Hoài Phố cổ Hội An rực rỡ sắc màu.',
      featured: 1
    },
    {
      code: 'TOUR003', name: 'Phú Quốc 4N3Đ: Thiên Đường Biển Ngọc & VinWonders', operator: 'Island Escape',
      origin: 'TP. Hồ Chí Minh', destination: 'Phú Quốc', country: 'Vietnam', departure_date: '2026-09-15',
      days: 4, nights: 3, price: 7490000, thumbnail: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Tận hưởng bờ cát trắng mịn Grand World, lặn ngắm san hô Hòn Mây Rút và vui chơi VinWonders cực đã.',
      featured: 1
    },
    {
      code: 'TOUR004', name: 'Nha Trang 4N3Đ: Khám Phá Vịnh Biển Đẹp Nhất Thế Giới', operator: 'Coastal Travel',
      origin: 'Hà Nội', destination: 'Nha Trang', country: 'Vietnam', departure_date: '2026-09-18',
      days: 4, nights: 3, price: 5490000, thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Tắm khoáng nóng Tháp Bà, đi cáp treo Vinpearl Harbour và thưởng thức hải sản tươi sống đẳng cấp.',
      featured: 1
    },
    {
      code: 'TOUR005', name: 'Đà Lạt 3N2Đ: Thành Phố Ngàn Hoa & Thung Lũng Tình Yêu', operator: 'Highland Tour',
      origin: 'TP. Hồ Chí Minh', destination: 'Đà Lạt', country: 'Vietnam', departure_date: '2026-09-20',
      days: 3, nights: 2, price: 3990000, thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Khí hậu mát mẻ quanh năm, ghé thăm Quảng trường Lâm Viên, săn mây Cầu Đất và thưởng thức lẩu gà lá é.',
      featured: 1
    },
    {
      code: 'TOUR006', name: 'Hà Nội — Ninh Bình 3N2Đ: Tràng An — Bái Đính Quần Thể Di Sản', operator: 'TravelViet Heritage',
      origin: 'Đà Nẵng', destination: 'Ninh Bình', country: 'Vietnam', departure_date: '2026-09-22',
      days: 3, nights: 2, price: 4290000, thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Đi thuyền trên dòng sông Sào Khê Tràng An, leo núi Hang Múa ngắm trọn vẹn thung lũng lúa chín.',
      featured: 1
    },
    {
      code: 'TOUR007', name: 'TP.HCM — Miền Tây 3N2Đ: Sông Nước Cần Thơ — Chợ Nổi Cái Răng', operator: 'Mekong Discovery',
      origin: 'Hà Nội', destination: 'Cần Thơ', country: 'Vietnam', departure_date: '2026-09-25',
      days: 3, nights: 2, price: 3490000, thumbnail: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Trải nghiệm văn hóa chợ nổi trên sông, hái trái cây tại vườn bãi bồi Cù lao Thới Sơn mộc mạc.',
      featured: 1
    },
    {
      code: 'TOUR008', name: 'Sapa — Fansipan 4N3Đ: Chinh Phục Nóc Nhà Đông Dương', operator: 'Highland Tour',
      origin: 'TP. Hồ Chí Minh', destination: 'Sapa', country: 'Vietnam', departure_date: '2026-09-28',
      days: 4, nights: 3, price: 6290000, thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80',
      desc: 'Đỉnh Fansipan rực rỡ mây trời, khám phá Bản Cát Cát sương giăng và trải nghiệm ẩm thực nướng vùng cao.',
      featured: 1
    }
  ];

  db.run("BEGIN TRANSACTION;");
  featuredTours.forEach(t => {
    db.run(`
      INSERT INTO tours (code, name, operator, origin, destination, country, departure_date, days, nights, airline_id, aircraft, price, thumbnail, description, included_services, excluded_services, featured, created_at)
      VALUES ('${t.code}', '${t.name}', '${t.operator}', '${t.origin}', '${t.destination}', '${t.country}', '${t.departure_date}', ${t.days}, ${t.nights}, 2, 'Airbus A321', ${t.price}, '${t.thumbnail}', '${t.desc}', 'Vé máy bay khứ hồi, Khách sạn 4 sao, Các bữa ăn theo chương trình, Xe đưa đón, Hướng dẫn viên', 'Chi phí cá nhân, Tiền tip HDV', ${t.featured}, '${now}');
    `);
  });

  // Seed sample Itineraries for Featured Tours
  for (let tId = 1; tId <= 8; tId++) {
    db.run(`
      INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation)
      VALUES 
      (${tId}, 1, 'Khởi hành — Nhận phòng & Tham quan', 'Đón khách tại sân bay, di chuyển về khách sạn nhận phòng nghỉ ngơi. Chiều tham quan danh thắng địa phương.', 'Trưa, Tối', 'Khách sạn 4 sao central'),
      (${tId}, 2, 'Khám phá danh thắng & Trải nghiệm', 'Hành trình trải nghiệm trọn vẹn các điểm đến nổi tiếng nhất trong tour. Thưởng thức đặc sản vùng miền.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao central'),
      (${tId}, 3, 'Trải nghiệm văn hóa & Mua sắm', 'Tự do dạo chơi mua sắm quà lưu niệm địa phương. Tham gia các hoạt động giải trí độc đáo.', 'Sáng, Trưa', 'Khách sạn 4 sao central'),
      (${tId}, 4, 'Tạm biệt & Trở về điểm xuất phát', 'Ăn sáng tại khách sạn, làm thủ tục trả phòng. Xe đưa đoàn ra sân bay trở về điểm đón ban đầu.', 'Sáng', 'Tự do');
    `);
  }

  // 6. Seed additional 95 Tours (Total 103 tours for Admin Pagination testing)
  const countries = ['Thailand', 'Singapore', 'Japan', 'South Korea', 'China', 'Malaysia', 'Indonesia', 'France', 'Italy', 'Australia', 'UAE', 'Vietnam'];
  const destinations = ['Bangkok', 'Singapore', 'Tokyo', 'Seoul', 'Thượng Hải', 'Kuala Lumpur', 'Bali', 'Paris', 'Rome', 'Sydney', 'Dubai', 'Đà Nẵng'];
  const operators = ['Vietnam Travel', 'TravelViet Heritage', 'Global Explorer', 'Asian Horizons', 'Euro World Travel'];

  for (let idx = 9; idx <= 103; idx++) {
    const country = countries[idx % countries.length];
    const dest = destinations[idx % destinations.length];
    const op = operators[idx % operators.length];
    const code = `TOUR${String(idx).padStart(3, '0')}`;
    const name = `Tour ${dest} — Khám Phá ${country} ${4 + (idx % 3)}N${3 + (idx % 3)}Đ Trọn Gói`;
    const price = 8900000 + (idx % 20) * 1200000;
    const depDate = `2026-10-${String(1 + (idx % 28)).padStart(2, '0')}`;

    db.run(`
      INSERT INTO tours (code, name, operator, origin, destination, country, departure_date, days, nights, airline_id, aircraft, price, thumbnail, description, included_services, excluded_services, featured, created_at)
      VALUES ('${code}', '${name}', '${op}', 'TP. Hồ Chí Minh', '${dest}', '${country}', '${depDate}', ${4 + (idx % 3)}, ${3 + (idx % 3)}, ${(idx % 10) + 1}, 'Boeing 787', ${price}, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80', 'Hành trình tour hấp dẫn với dịch vụ tiêu chuẩn quốc tế.', 'Vé máy bay, Khách sạn, Các bữa ăn, HDV', 'Chi phí cá nhân', 0, '${now}');
    `);

    // Basic Itinerary
    db.run(`
      INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation)
      VALUES 
      (${idx}, 1, 'TP.HCM → ${dest}', 'Khởi hành chuyến bay đến ${dest}, làm thủ tục nhập cảnh và di chuyển về khách sạn.', 'Tối', 'Khách sạn 4 sao'),
      (${idx}, 2, 'Khám phá ${dest}', 'Tham quan các công trình kiến trúc và thắng cảnh biểu tượng của ${country}.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao');
    `);
  }

  // 7. Seed Bookings & Booking items for Dashboard Stats
  const demoBookings = [
    { code: 'BK8801', user_id: 2, name: 'Nguyễn Văn User', email: 'user@travel.com', phone: '0987654321', country: 'Vietnam', amount: 12480000, date: '2026-08-01 10:30:00' },
    { code: 'BK8802', user_id: null, name: 'Trần Thị B', email: 'tranb@gmail.com', phone: '0912345678', country: 'Thailand', amount: 15800000, date: '2026-08-03 14:15:00' },
    { code: 'BK8803', user_id: null, name: 'Le Vance', email: 'vance@yahoo.com', phone: '0933445566', country: 'Singapore', amount: 9500000, date: '2026-08-05 09:20:00' },
    { code: 'BK8804', user_id: null, name: 'Phạm Minh C', email: 'minhc@hotmail.com', phone: '0977889900', country: 'Japan', amount: 24500000, date: '2026-08-08 16:45:00' },
    { code: 'BK8805', user_id: null, name: 'Kim Soo Hyun', email: 'kimsh@naver.com', phone: '0900112233', country: 'South Korea', amount: 18900000, date: '2026-08-10 11:00:00' },
    { code: 'BK8806', user_id: null, name: 'David Smith', email: 'dsmith@gmail.com', phone: '0944556677', country: 'Australia', amount: 32000000, date: '2026-08-12 15:30:00' },
    { code: 'BK8807', user_id: null, name: 'Li Wei', email: 'liwei@qq.com', phone: '0966778899', country: 'China', amount: 14200000, date: '2026-08-14 08:45:00' },
    { code: 'BK8808', user_id: null, name: 'Jean Dupont', email: 'jdupont@orange.fr', phone: '0922334455', country: 'France', amount: 28900000, date: '2026-08-16 19:10:00' },
    { code: 'BK8809', user_id: null, name: 'Marco Rossi', email: 'mrossi@libero.it', phone: '0955667788', country: 'Italy', amount: 27500000, date: '2026-08-18 13:25:00' },
    { code: 'BK8810', user_id: null, name: 'Sultan Ahmed', email: 'sahmed@emirates.ae', phone: '0988990011', country: 'UAE', amount: 41000000, date: '2026-08-20 17:50:00' }
  ];

  demoBookings.forEach((b, i) => {
    db.run(`
      INSERT INTO bookings (booking_code, user_id, customer_name, customer_email, customer_phone, country, address, total_amount, status, created_at)
      VALUES ('${b.code}', ${b.user_id ? b.user_id : 'NULL'}, '${b.name}', '${b.email}', '${b.phone}', '${b.country}', 'Khu phố 1, Việt Nam', ${b.amount}, 'completed', '${b.date}');
    `);

    // Add booking flights (Airlines stats)
    const airlineId = (i % 10) + 1;
    const flightId = (i * 10) + 1;
    db.run(`
      INSERT INTO booking_flights (booking_id, flight_id, fare_class, quantity, price)
      VALUES (${i + 1}, ${flightId}, 'Economy', 2, 4500000);
    `);

    // Add booking tours
    const tourId = (i % 8) + 1;
    db.run(`
      INSERT INTO booking_tours (booking_id, tour_id, quantity, price)
      VALUES (${i + 1}, ${tourId}, 1, 5990000);
    `);
  });

  db.run("COMMIT;");
  console.log('Seed data inserted successfully.');
}
