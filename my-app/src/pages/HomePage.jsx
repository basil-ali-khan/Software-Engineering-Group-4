import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import the Supabase client
import { Container, Row, Col, Card, Button, Form, InputGroup, Toast } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState([]); // Initialize products as an empty array
  const { addToCart } = useCart();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('product')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        console.log('All products:', data);
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    'All',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Bakery',
    'Beverages',
    'Snacks'
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category.trim() === selectedCategory;
    console.log('Product:', product.name, 'Category:', product.category, 'Selected:', selectedCategory, 'Matches:', matchesCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Container fluid className="homepage-container">
      {/* Toast Notification */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success!</strong>
          </Toast.Header>
          <Toast.Body>Item added to cart</Toast.Body>
        </Toast>
      </div>

      {/* Search Bar */}
      <Row className="my-4">
        <Col md={6} className="mx-auto">
          <InputGroup className="search-bar">
            <Form.Control
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Button variant="outline-primary">
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {/* Categories Sidebar */}
        <Col md={3}>
          <Card className="categories-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Categories</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`list-group-item list-group-item-action ${
                      selectedCategory === category ? 'active' : ''
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card className="product-card h-100">
                  <div className="product-image-container">
                    <Card.Img 
                      variant="top" 
                      src={product.image}
                      className="product-image"
                      alt={product.name}
                    />
                    <Button 
                      variant="light" 
                      className="favorite-button"
                      onClick={() => console.log('Added to favorites')}
                    >
                      <FaHeart />
                    </Button>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="product-title">{product.name}</Card.Title>
                    <Card.Text className="text-muted product-description">
                      {product.description}
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 product-price">Rs. {product.price}</h5>
                        <Button 
                          variant="primary"
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stockQuantity === 0}
                        >
                          <FaShoppingCart className="me-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;