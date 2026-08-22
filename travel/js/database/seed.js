import { hashPassword } from './database.js';

export async function seedDatabase(supabase) {
  const now = new Date().toISOString();

  console.log('Seeding Supabase Cloud Database...');

  // 1. Seed Users
  const adminPass = await hashPassword('Admin123!');
  const userPass = await hashPassword('User123!');

  const { data: users, error: usersErr } = await supabase.from('users').insert([
    { username: 'admin', email: 'admin@travel.com', password_hash: adminPass, role: 'admin', full_name: 'TravelViet Administrator', phone: '0901234567', country: 'Vietnam', address: 'Hà Nội, Việt Nam', created_at: now },
    { username: 'userdemo', email: 'user@travel.com', password_hash: userPass, role: 'user', full_name: 'Nguyễn Văn User', phone: '0987654321', country: 'Vietnam', address: 'TP. Hồ Chí Minh, Việt Nam', created_at: now }
  ]).select();

  if (usersErr) console.warn('Seed users error:', usersErr.message);

  // 2. Seed Airlines
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
  await supabase.from('airlines').insert(airlines);

  // 3. Seed Airports
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
  await supabase.from('airports').insert(airports);

  // 4. Seed Flights (105 Flights)
  const aircraftList = ['Airbus A320', 'Airbus A321', 'Airbus A330', 'Airbus A350', 'Boeing 737', 'Boeing 787', 'Boeing 777'];
  const times = ['06:00', '08:30', '10:15', '13:00', '15:45', '18:20', '20:50', '22:30'];
  const dates = ['2026-09-01', '2026-09-02', '2026-09-05', '2026-09-10', '2026-09-15', '2026-09-20', '2026-10-01'];

  const flightsToInsert = [];
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

        flightsToInsert.push({
          flight_number: fNum,
          airline_id: aId,
          origin_airport_id: origId,
          destination_airport_id: destId,
          departure_date: depDate,
          departure_time: depTime,
          arrival_time: arrTime,
          duration_minutes: duration,
          trip_type: tripType,
          stops,
          aircraft,
          economy_price: ecoPrice,
          business_price: busPrice,
          services: 'Hành lý xách tay 7kg, Suất ăn nhẹ',
          status: 'available'
        });
      }
    }
  }

  await supabase.from('flights').insert(flightsToInsert);

  // 5. Seed Featured Tours & 100+ Total Tours
  const featuredTours = [
    {
      code: 'TOUR001', name: 'Hà Nội — Hạ Long 4N3Đ: Trải Nghiệm Du Thuyền 5 Sao', operator: 'TravelViet Heritage',
      origin: 'TP. Hồ Chí Minh', destination: 'Hạ Long', country: 'Vietnam', departure_date: '2026-09-10',
      days: 4, nights: 3, price: 5990000, thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Hành trình khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long, nghỉ dưỡng du thuyền cao cấp và tham quan Phố cổ Hà Nội.',
      featured: 1, airline_id: 2, aircraft: 'Airbus A321', included_services: 'Vé máy bay, Khách sạn 4 sao, Các bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR002', name: 'Đà Nẵng — Hội An — Bà Nà Hills 4N3Đ: Cầu Vàng Huyền Thoại', operator: 'Vietnam Travel',
      origin: 'Hà Nội', destination: 'Đà Nẵng', country: 'Vietnam', departure_date: '2026-09-12',
      days: 4, nights: 3, price: 6890000, thumbnail: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Chiêm ngưỡng Cầu Vàng Sun World Bà Nà Hills, thả hoa đăng trên sông Hoài Phố cổ Hội An rực rỡ sắc màu.',
      featured: 1, airline_id: 2, aircraft: 'Airbus A321', included_services: 'Vé máy bay, Khách sạn 4 sao, Các bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR003', name: 'Phú Quốc 4N3Đ: Thiên Đường Biển Ngọc & VinWonders', operator: 'Island Escape',
      origin: 'TP. Hồ Chí Minh', destination: 'Phú Quốc', country: 'Vietnam', departure_date: '2026-09-15',
      days: 4, nights: 3, price: 7490000, thumbnail: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Tận hưởng bờ cát trắng mịn Grand World, lặn ngắm san hô Hòn Mây Rút và vui chơi VinWonders cực đã.',
      featured: 1, airline_id: 1, aircraft: 'Airbus A320', included_services: 'Vé máy bay, Khách sạn 4 sao, Các bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR004', name: 'Nha Trang 4N3Đ: Khám Phá Vịnh Biển Đẹp Nhất Thế Giới', operator: 'Coastal Travel',
      origin: 'Hà Nội', destination: 'Nha Trang', country: 'Vietnam', departure_date: '2026-09-18',
      days: 4, nights: 3, price: 5490000, thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Tắm khoáng nóng Tháp Bà, đi cáp treo Vinpearl Harbour và thưởng thức hải sản tươi sống đẳng cấp.',
      featured: 1, airline_id: 3, aircraft: 'Airbus A321', included_services: 'Vé máy bay, Khách sạn 4 sao, Các bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR005', name: 'Đà Lạt 3N2Đ: Thành Phố Ngàn Hoa & Thung Lũng Tình Yêu', operator: 'Highland Tour',
      origin: 'TP. Hồ Chí Minh', destination: 'Đà Lạt', country: 'Vietnam', departure_date: '2026-09-20',
      days: 3, nights: 2, price: 3990000, thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Khí hậu mát mẻ quanh năm, ghé thăm Quảng trường Lâm Viên, săn mây Cầu Đất và thưởng thức lẩu gà lá é.',
      featured: 1, airline_id: 1, aircraft: 'Airbus A320', included_services: 'Vé xe cao cấp, Khách sạn 3 sao, Bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR006', name: 'Hà Nội — Ninh Bình 3N2Đ: Tràng An — Bái Đính Quần Thể Di Sản', operator: 'TravelViet Heritage',
      origin: 'Đà Nẵng', destination: 'Ninh Bình', country: 'Vietnam', departure_date: '2026-09-22',
      days: 3, nights: 2, price: 4290000, thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Đi thuyền trên dòng sông Sào Khê Tràng An, leo núi Hang Múa ngắm trọn vẹn thung lũng lúa chín.',
      featured: 1, airline_id: 2, aircraft: 'Airbus A321', included_services: 'Vé máy bay, Khách sạn 4 sao, Bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR007', name: 'TP.HCM — Miền Tây 3N2Đ: Sông Nước Cần Thơ — Chợ Nổi Cái Răng', operator: 'Mekong Discovery',
      origin: 'Hà Nội', destination: 'Cần Thơ', country: 'Vietnam', departure_date: '2026-09-25',
      days: 3, nights: 2, price: 3490000, thumbnail: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Trải nghiệm văn hóa chợ nổi trên sông, hái trái cây tại vườn bãi bồi Cù lao Thới Sơn mộc mạc.',
      featured: 1, airline_id: 1, aircraft: 'Airbus A320', included_services: 'Xe du lịch, Khách sạn 3 sao, Bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    },
    {
      code: 'TOUR008', name: 'Sapa — Fansipan 4N3Đ: Chinh Phục Nóc Nhà Đông Dương', operator: 'Highland Tour',
      origin: 'TP. Hồ Chí Minh', destination: 'Sapa', country: 'Vietnam', departure_date: '2026-09-28',
      days: 4, nights: 3, price: 6290000, thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Đỉnh Fansipan rực rỡ mây trời, khám phá Bản Cát Cát sương giăng và trải nghiệm ẩm thực nướng vùng cao.',
      featured: 1, airline_id: 2, aircraft: 'Airbus A321', included_services: 'Vé máy bay, Khách sạn 4 sao, Bữa ăn, HDV', excluded_services: 'Chi phí cá nhân'
    }
  ];

  const { data: insertedFeatured } = await supabase.from('tours').insert(featuredTours).select();

  if (insertedFeatured) {
    // Seed Itineraries
    const itineraries = [];
    insertedFeatured.forEach(t => {
      itineraries.push(
        { tour_id: t.id, day_number: 1, title: 'Khởi hành — Nhận phòng & Tham quan', description: 'Đón khách tại sân bay, di chuyển về khách sạn nhận phòng nghỉ ngơi. Chiều tham quan danh thắng địa phương.', meals: 'Trưa, Tối', accommodation: 'Khách sạn 4 sao' },
        { tour_id: t.id, day_number: 2, title: 'Khám phá danh thắng & Trải nghiệm', description: 'Hành trình trải nghiệm trọn vẹn các điểm đến nổi tiếng nhất trong tour. Thưởng thức đặc sản vùng miền.', meals: 'Sáng, Trưa, Tối', accommodation: 'Khách sạn 4 sao' },
        { tour_id: t.id, day_number: 3, title: 'Trải nghiệm văn hóa & Mua sắm', description: 'Tự do dạo chơi mua sắm quà lưu niệm địa phương. Tham gia các hoạt động giải trí độc đáo.', meals: 'Sáng, Trưa', accommodation: 'Khách sạn 4 sao' },
        { tour_id: t.id, day_number: 4, title: 'Tạm biệt & Trở về điểm xuất phát', description: 'Ăn sáng tại khách sạn, làm thủ tục trả phòng. Xe đưa đoàn ra sân bay trở về điểm đón ban đầu.', meals: 'Sáng', accommodation: 'Tự do' }
      );
    });
    await supabase.from('tour_itineraries').insert(itineraries);
  }

  // Seed 95 additional tours for pagination
  const countries = ['Thailand', 'Singapore', 'Japan', 'South Korea', 'China', 'Malaysia', 'Indonesia', 'France', 'Italy', 'Australia', 'UAE', 'Vietnam'];
  const destinations = ['Bangkok', 'Singapore', 'Tokyo', 'Seoul', 'Thượng Hải', 'Kuala Lumpur', 'Bali', 'Paris', 'Rome', 'Sydney', 'Dubai', 'Đà Nẵng'];
  const operators = ['Vietnam Travel', 'TravelViet Heritage', 'Global Explorer', 'Asian Horizons', 'Euro World Travel'];

  const extraTours = [];
  for (let idx = 9; idx <= 103; idx++) {
    const country = countries[idx % countries.length];
    const dest = destinations[idx % destinations.length];
    const op = operators[idx % operators.length];
    const code = `TOUR${String(idx).padStart(3, '0')}`;
    const name = `Tour ${dest} — Khám Phá ${country} ${4 + (idx % 3)}N${3 + (idx % 3)}Đ Trọn Gói`;
    const price = 8900000 + (idx % 20) * 1200000;
    const depDate = `2026-10-${String(1 + (idx % 28)).padStart(2, '0')}`;

    extraTours.push({
      code, name, operator: op, origin: 'TP. Hồ Chí Minh', destination: dest, country, departure_date: depDate,
      days: 4 + (idx % 3), nights: 3 + (idx % 3), airline_id: (idx % 10) + 1, aircraft: 'Boeing 787', price,
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=400&q=80',
      description: 'Hành trình tour hấp dẫn với dịch vụ tiêu chuẩn quốc tế.', included_services: 'Vé máy bay, Khách sạn, Các bữa ăn, HDV',
      excluded_services: 'Chi phí cá nhân', featured: 0, created_at: now
    });
  }
  await supabase.from('tours').insert(extraTours);

  // 6. Seed Bookings
  const demoBookings = [
    { booking_code: 'BK8801', customer_name: 'Nguyễn Văn User', customer_email: 'user@travel.com', customer_phone: '0987654321', country: 'Vietnam', total_amount: 12480000, created_at: '2026-08-01T10:30:00Z' },
    { booking_code: 'BK8802', customer_name: 'Trần Thị B', customer_email: 'tranb@gmail.com', customer_phone: '0912345678', country: 'Thailand', total_amount: 15800000, created_at: '2026-08-03T14:15:00Z' },
    { booking_code: 'BK8803', customer_name: 'Le Vance', customer_email: 'vance@yahoo.com', customer_phone: '0933445566', country: 'Singapore', total_amount: 9500000, created_at: '2026-08-05T09:20:00Z' },
    { booking_code: 'BK8804', customer_name: 'Phạm Minh C', customer_email: 'minhc@hotmail.com', customer_phone: '0977889900', country: 'Japan', total_amount: 24500000, created_at: '2026-08-08T16:45:00Z' },
    { booking_code: 'BK8805', customer_name: 'Kim Soo Hyun', customer_email: 'kimsh@naver.com', customer_phone: '0900112233', country: 'South Korea', total_amount: 18900000, created_at: '2026-08-10T11:00:00Z' },
    { booking_code: 'BK8806', customer_name: 'David Smith', customer_email: 'dsmith@gmail.com', customer_phone: '0944556677', country: 'Australia', total_amount: 32000000, created_at: '2026-08-12T15:30:00Z' },
    { booking_code: 'BK8807', customer_name: 'Li Wei', customer_email: 'liwei@qq.com', customer_phone: '0966778899', country: 'China', total_amount: 14200000, created_at: '2026-08-14T08:45:00Z' },
    { booking_code: 'BK8808', customer_name: 'Jean Dupont', customer_email: 'jdupont@orange.fr', customer_phone: '0922334455', country: 'France', total_amount: 28900000, created_at: '2026-08-16T19:10:00Z' },
    { booking_code: 'BK8809', customer_name: 'Marco Rossi', customer_email: 'mrossi@libero.it', customer_phone: '0955667788', country: 'Italy', total_amount: 27500000, created_at: '2026-08-18T13:25:00Z' },
    { booking_code: 'BK8810', customer_name: 'Sultan Ahmed', customer_email: 'sahmed@emirates.ae', customer_phone: '0988990011', country: 'UAE', total_amount: 41000000, created_at: '2026-08-20T17:50:00Z' }
  ];

  const { data: insertedBookings } = await supabase.from('bookings').insert(demoBookings).select();

  if (insertedBookings) {
    const bookingFlights = [];
    const bookingTours = [];
    insertedBookings.forEach((b, i) => {
      bookingFlights.push({ booking_id: b.id, flight_id: (i * 10) + 1, fare_class: 'Economy', quantity: 2, price: 4500000 });
      bookingTours.push({ booking_id: b.id, tour_id: (i % 8) + 1, quantity: 1, price: 5990000 });
    });
    await supabase.from('booking_flights').insert(bookingFlights);
    await supabase.from('booking_tours').insert(bookingTours);
  }

  console.log('Supabase Cloud Database seeded successfully!');
}
