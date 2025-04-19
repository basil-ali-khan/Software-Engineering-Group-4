import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from './supabaseClient';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, removeFromCart } = useCart();
  const { subtotal, tax, total } = getCartTotal();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    shipping: {
      fullName: '',
      address: '',
      area: '',
      phoneNumber: ''
    },
    payment: {
      method: 'cash'
    }
  });

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('customer')
          .select('name, address, phoneNumber')
          .eq('customerID', userId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            shipping: {
              ...prev.shipping,
              fullName: data.name || '',
              address: data.address || '',
              phoneNumber: data.phoneNumber || ''
            }
          }));
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsSubmitting(true);
      
      try {
        // Update product quantities in the database
        for (const item of cartItems) {
          const { error } = await supabase
            .from('product')
            .update({ stockQuantity: item.stockQuantity - item.quantity })
            .eq('productID', item.productID);

          if (error) {
            console.error('Error updating product quantity:', error);
            throw error;
          }
        }

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
          removeFromCart(item.productID);
        });
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return <div className="checkout-container">Loading...</div>;
  }

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
        ) : (
          <div className="payment-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={true}
                  readOnly
                />
                Cash on Delivery
              </label>
            </div>
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