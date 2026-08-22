import { storage } from '../utils/storage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export const CartService = {
  getCart() {
    return storage.get(STORAGE_KEYS.CART, { flights: [], tours: [] });
  },

  saveCart(cart) {
    storage.set(STORAGE_KEYS.CART, cart);
    // Dispatch custom event so Header badge updates automatically
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  },

  addFlight(flight, fareClass = 'Economy') {
    const cart = this.getCart();
    const price = fareClass === 'Business' ? flight.business_price : flight.economy_price;

    const existingIndex = cart.flights.findIndex(
      f => f.flight_id === flight.id && f.fare_class === fareClass
    );

    if (existingIndex > -1) {
      cart.flights[existingIndex].quantity += 1;
    } else {
      cart.flights.push({
        cart_item_id: `f_${flight.id}_${fareClass}_${Date.now()}`,
        flight_id: flight.id,
        flight,
        fare_class: fareClass,
        price,
        quantity: 1
      });
    }

    this.saveCart(cart);
  },

  addTour(tour) {
    const cart = this.getCart();

    const existingIndex = cart.tours.findIndex(t => t.tour_id === tour.id);

    if (existingIndex > -1) {
      cart.tours[existingIndex].quantity += 1;
    } else {
      cart.tours.push({
        cart_item_id: `t_${tour.id}_${Date.now()}`,
        tour_id: tour.id,
        tour,
        price: tour.price,
        quantity: 1
      });
    }

    this.saveCart(cart);
  },

  removeItem(cartItemId) {
    const cart = this.getCart();
    cart.flights = cart.flights.filter(item => item.cart_item_id !== cartItemId);
    cart.tours = cart.tours.filter(item => item.cart_item_id !== cartItemId);
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart({ flights: [], tours: [] });
  },

  getItemCount() {
    const cart = this.getCart();
    const flightCount = cart.flights.reduce((acc, i) => acc + i.quantity, 0);
    const tourCount = cart.tours.reduce((acc, i) => acc + i.quantity, 0);
    return flightCount + tourCount;
  },

  getTotal() {
    const cart = this.getCart();
    const flightTotal = cart.flights.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tourTotal = cart.tours.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return flightTotal + tourTotal;
  }
};
