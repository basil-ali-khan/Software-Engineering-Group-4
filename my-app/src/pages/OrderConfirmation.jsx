import React, { useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // Redirect to home if no order data
    if (!orderData) {
      navigate('/home');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return (
      <Container className="confirmation-container">
        <Alert variant="danger">
          No order data found. Please try placing your order again.
        </Alert>
        <Button
          variant="primary"
          as={Link}
          to="/home"
          className="mt-3"
        >
          <FaHome className="me-2" />
          Back to Home
        </Button>
      </Container>
    );
  }

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
  };

  return (
    <Container className="confirmation-container">
      <Card className="confirmation-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h1>Order Confirmed!</h1>
        <p className="order-number">Order #: {Math.floor(Math.random() * 1000000)}</p>
        <p className="order-date">Date: {formatDate()}</p>

        <div className="receipt-section">
          <h2>Receipt</h2>
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p><strong>Name:</strong> {orderData.shipping.fullName}</p>
            <p><strong>Address:</strong> {orderData.shipping.address}</p>
            <p><strong>Area:</strong> {orderData.shipping.area}</p>
            <p><strong>Postal Code:</strong> {orderData.shipping.postalCode}</p>
            <p><strong>Phone:</strong> {orderData.shipping.phoneNumber}</p>
          </div>

          <div className="payment-info">
            <h3>Payment Method</h3>
            <p>{orderData.payment.method === 'cash' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
          </div>

          <div className="order-items">
            <h3>Order Items</h3>
            {orderData.orderDetails.items.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>Rs. {orderData.orderDetails.subtotal}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>Rs. {orderData.orderDetails.tax}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>Rs. {orderData.orderDetails.total}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Button
            variant="primary"
            as={Link}
            to="/home"
            className="action-button"
          >
            <FaHome className="me-2" />
            Back to Home
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default OrderConfirmation; 