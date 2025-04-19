import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { subtotal, tax, total } = getCartTotal();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        className="mb-4"
        onClick={() => navigate('/home')}
      >
        <FaArrowLeft className="me-2" />
        Continue Shopping
      </Button>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Shopping Cart</h4>
            </Card.Header>
            <Card.Body>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.productID}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '50px', marginRight: '10px' }}
                            />
                            {item.name}
                          </div>
                        </td>
                        <td>Rs. {item.price}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => updateQuantity(item.productID, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => updateQuantity(item.productID, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td>Rs. {(item.price * item.quantity)}</td>
                        <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => removeFromCart(item.productID)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Order Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>Rs. {tax}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>Rs. {total}</strong>
              </div>
              <Button 
                variant="success" 
                className="w-100"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;