import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, removeFromCart } = useCart();
  const { subtotal, tax, total } = getCartTotal();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shipping: {
      fullName: '',
      address: '',
      area: '',
      postalCode: '',
      phoneNumber: ''
    },
    payment: {
      method: 'cash'
    }
  });

  // Only redirect if cart is empty and we're not submitting an order
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting && !location.pathname.includes('order-confirmation')) {
      navigate('/cart');
    }
  }, [cartItems, navigate, location.pathname, isSubmitting]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsSubmitting(true);
      
      // Handle order submission
      const orderData = {
        shipping: formData.shipping,
        payment: {
          method: formData.payment.method
        },
        orderDetails: {
          items: cartItems,
          subtotal,
          tax,
          total
        }
      };
      
      // Navigate to confirmation page
      navigate('/order-confirmation', { 
        state: { orderData },
        replace: true 
      });
      
      // Clear cart after successful navigation
      cartItems.forEach(item => {
        removeFromCart(item.id);
      });
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <p>Shipping</p>
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <p>Payment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        {step === 1 ? (
          <div className="shipping-section">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.shipping.fullName}
                onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.shipping.address}
                onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Area</label>
              <input
                type="text"
                value={formData.shipping.area}
                onChange={(e) => handleInputChange('shipping', 'area', e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={formData.shipping.postalCode}
                  onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.shipping.phoneNumber}
                  onChange={(e) => handleInputChange('shipping', 'phoneNumber', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="payment-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.payment.method === 'cash'}
                  onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                />
                Cash on Delivery
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.payment.method === 'card'}
                  onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                />
                Pay by Card
              </label>
            </div>

            {formData.payment.method === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={formData.payment.cardNumber}
                    onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={formData.payment.expiryDate}
                      onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      value={formData.payment.cvv}
                      onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-item">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="summary-item">
            <span>Tax (10%)</span>
            <span>Rs. {tax}</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        <div className="checkout-actions">
          {step === 2 && (
            <button
              type="button"
              className="back-button"
              onClick={() => setStep(1)}
            >
              Back
            </button>
          )}
          <button type="submit" className="continue-button">
            {step === 1 ? 'Continue to Payment' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;