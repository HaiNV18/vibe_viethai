import { BookingRepository } from '../repositories/BookingRepository.js';
import { CartService } from './CartService.js';
import { AuthService } from './AuthService.js';
import { EmailService } from './EmailService.js';
import { isValidEmail, isValidPhone } from '../utils/validation.js';

export const BookingService = {
  async processBooking(customerInfo) {
    const cart = CartService.getCart();

    if (cart.flights.length === 0 && cart.tours.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống.');
    }

    const { customer_name, customer_email, customer_phone, country, address } = customerInfo;

    if (!customer_name || !customer_name.trim()) {
      throw new Error('Vui lòng nhập họ và tên.');
    }

    if (!isValidEmail(customer_email)) {
      throw new Error('Vui lòng nhập địa chỉ email hợp lệ.');
    }

    if (!isValidPhone(customer_phone)) {
      throw new Error('Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).');
    }

    const currentUser = AuthService.getCurrentUser();
    const bookingCode = 'TV' + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = CartService.getTotal();

    const bookingData = {
      booking_code: bookingCode,
      user_id: currentUser ? currentUser.id : null,
      customer_name,
      customer_email,
      customer_phone,
      country: country || 'Vietnam',
      address: address || '',
      total_amount: totalAmount
    };

    const res = BookingRepository.createBooking(bookingData, cart.flights, cart.tours);

    // Send Confirmation Email asynchronously
    EmailService.sendBookingConfirmation({
      bookingCode,
      customerName: customer_name,
      customerEmail: customer_email,
      flights: cart.flights,
      tours: cart.tours,
      totalAmount
    }).catch(err => console.error('Email send failed:', err));

    // Clear cart after successful booking
    CartService.clearCart();

    return {
      success: true,
      bookingCode,
      totalAmount,
      customerName: customer_name,
      customerEmail: customer_email
    };
  }
};
