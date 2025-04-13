import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Toast } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  // Updated product data with correct categories and names
  const products = [
    // Fruits & Vegetables
    {
      id: 1,
      name: 'Mango',
      price: 250, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/Mango.jpeg',
      description: 'Fresh Mango',
      stock: 15
    },
    {
      id: 2,
      name: 'Strawberry',
      price: 400, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/strawberry.jpeg',
      description: 'Fresh Strawberries',
      stock: 10
    },
    {
      id: 3,
      name: 'Tomato',
      price: 120, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/tomato.jpeg',
      description: 'Fresh Tomatoes',
      stock: 20
    },
    {
      id: 4,
      name: 'Onion',
      price: 80, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/onion.jpeg',
      description: 'Fresh Onions',
      stock: 25
    },
    {
      id: 5,
      name: 'Potato',
      price: 100, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/potato.jpeg',
      description: 'Fresh Potatoes',
      stock: 30
    },
    {
      id: 6,
      name: 'Apples',
      price: 300, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/apples.jpg',
      description: 'Fresh Apples',
      stock: 18
    },
    {
      id: 7,
      name: 'Banana',
      price: 150, // PKR per dozen
      category: 'Fruits & Vegetables',
      image: '../pictures/banana.jpeg',
      description: 'Fresh Bananas',
      stock: 22
    },
    {
      id: 8,
      name: 'Bottle Gourd',
      price: 90, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/BottleGourd.jpeg',
      description: 'Fresh Bottle Gourd',
      stock: 12
    },
    {
      id: 9,
      name: 'Carrot',
      price: 110, // PKR per kg
      category: 'Fruits & Vegetables',
      image: '../pictures/Carrot.jpeg',
      description: 'Fresh Carrots',
      stock: 20
    },
    // Dairy
    {
      id: 10,
      name: 'Milk',
      price: 180, // PKR per liter
      category: 'Dairy',
      image: '../pictures/Milk.jpg',
      description: 'Fresh Milk',
      stock: 15
    },
    {
      id: 11,
      name: 'Cheese',
      price: 450, // PKR per 250g
      category: 'Dairy',
      image: '../pictures/Cheese.jpg',
      description: 'Cheddar Cheese',
      stock: 8
    },
    {
      id: 12,
      name: 'Butter',
      price: 350, // PKR per 250g
      category: 'Dairy',
      image: '../pictures/butter.jpeg',
      description: 'Fresh Butter',
      stock: 10
    },
    {
      id: 13,
      name: 'Cream',
      price: 250, // PKR per 200ml
      category: 'Dairy',
      image: '../pictures/cream.jpeg',
      description: 'Fresh Cream',
      stock: 12
    },
    // Bakery
    {
      id: 14,
      name: 'Bread',
      price: 120, // PKR per loaf
      category: 'Bakery',
      image: '../pictures/Bread.jpg',
      description: 'Fresh Bread',
      stock: 20
    },
    {
      id: 15,
      name: 'Eggs',
      price: 300, // PKR per dozen
      category: 'Bakery',
      image: '../pictures/Eggs.jpg',
      description: 'Fresh Eggs',
      stock: 15
    },
    {
      id: 16,
      name: 'Bun',
      price: 50, // PKR per piece
      category: 'Bakery',
      image: '../pictures/bun.jpeg',
      description: 'Fresh Buns',
      stock: 25
    },
    {
      id: 17,
      name: 'Pastry',
      price: 150, // PKR per piece
      category: 'Bakery',
      image: '../pictures/pastry.jpeg',
      description: 'Fresh Pastry',
      stock: 10
    },
    // Beverages
    {
      id: 18,
      name: 'Water',
      price: 80, // PKR per 1.5L
      category: 'Beverages',
      image: '../pictures/water.jpeg',
      description: 'Mineral Water',
      stock: 30
    },
    {
      id: 19,
      name: 'Soft Drink',
      price: 150, // PKR per 2L
      category: 'Beverages',
      image: '../pictures/Softdrink.jpeg',
      description: 'Carbonated Drink',
      stock: 20
    },
    {
      id: 20,
      name: 'Juice',
      price: 250, // PKR per liter
      category: 'Beverages',
      image: '../pictures/juice.jpeg',
      description: 'Fresh Juice',
      stock: 15
    },
    // Snacks
    {
      id: 21,
      name: 'Biscuit',
      price: 100, // PKR per pack
      category: 'Snacks',
      image: '../pictures/biscuit.jpeg',
      description: 'Assorted Biscuits',
      stock: 25
    },
    {
      id: 22,
      name: 'Chips',
      price: 120, // PKR per 150g
      category: 'Snacks',
      image: '../pictures/chips.jpeg',
      description: 'Potato Chips',
      stock: 20
    },
    {
      id: 23,
      name: 'Chips2',
      price: 120, // PKR per 150g
      category: 'Snacks',
      image: '../pictures/chips2.jpeg',
      description: 'Assorted Chips',
      stock: 18
    },
    {
      id: 24,
      name: 'Jelly',
      price: 150, // PKR per pack
      category: 'Snacks',
      image: '../pictures/jelly.jpeg',
      description: 'Fruit Jelly',
      stock: 15
    },
    {
      id: 25,
      name: 'Slanty',
      price: 100, // PKR per pack
      category: 'Snacks',
      image: '../pictures/slantychips.jpeg',
      description: 'Slanty Chips',
      stock: 20
    }
  ];

  const categories = [
    'All',
    'Fruits & Vegetables',
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
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
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
                          disabled={product.stock === 0}
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