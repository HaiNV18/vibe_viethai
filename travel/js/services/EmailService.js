export const EmailService = {
  senderEmail: 'nvhai061993@gmail.com',

  /**
   * Sends confirmation email for booking
   */
  async sendBookingConfirmation(bookingDetails) {
    const { bookingCode, customerName, customerEmail, flights, tours, totalAmount } = bookingDetails;

    console.log(`[EmailService] Preparing email from ${this.senderEmail} to ${customerEmail}...`);
    console.log(`Booking Code: ${bookingCode}`);
    console.log(`Customer: ${customerName}`);
    console.log(`Total: ${totalAmount} VND`);

    const summaryText = `
Xin chào ${customerName},

Cảm ơn bạn đã đặt dịch vụ tại TravelViet!
Mã đơn hàng: ${bookingCode}
Tổng tiền: ${totalAmount} VND
Sender: ${this.senderEmail}

Chi tiết dịch vụ:
${flights.map(f => `- Chuyến bay: ${f.flight.airline_name} (${f.flight.origin_code} -> ${f.flight.destination_code}) - Hạng: ${f.fare_class}`).join('\n')}
${tours.map(t => `- Tour: ${t.tour.name} - Ngày đi: ${t.tour.departure_date}`).join('\n')}

Chúc bạn có những chuyến đi tuyệt vời!
    `.trim();

    // Fallback/Demo execution
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('[EmailService] Email sent successfully via Demo Service Provider!');
        resolve({ success: true, message: 'Email xác nhận đã được gửi thành công!' });
      }, 500);
    });
  }
};
