import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const NavigationBar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/home">Grocery Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/cart">
              <FaShoppingCart className="me-1" />
              Cart
              {itemsCount > 0 && (
                <Badge bg="primary" className="ms-1">{itemsCount}</Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              <FaUser className="me-1" />
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;