import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaShoppingCart } from 'react-icons/fa';
import { supabase } from './supabaseClient'; // Import Supabase client
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    description: '',
    image: ''
  });

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('product').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('product').insert([formData]);
    if (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } else {
      setProducts([...products, ...data]);
      setShowAddModal(false);
      setFormData({
        name: '',
        category: '',
        price: '',
        stockQuantity: '',
        description: '',
        image: ''
      });
      alert('Product added successfully!');
    }
  };

  // Edit an existing product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('product')
      .update(formData)
      .eq('productID', selectedProduct.productID);
    if (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    } else {
      setProducts(products.map((product) =>
        product.productID === selectedProduct.productID ? { ...product, ...formData } : product
      ));
      setShowEditModal(false);
      alert('Product updated successfully!');
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productID) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('product').delete().eq('productID', productID);
      if (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      } else {
        setProducts(products.filter((product) => product.productID !== productID));
        alert('Product deleted successfully!');
      }
    }
  };

  // Reorder stock for a product
  const handleReorder = async (productID) => {
    const product = products.find((p) => p.productID === productID);
    const updatedStock = product.stockQuantity + 10;
    const { error } = await supabase
      .from('product')
      .update({ stockQuantity: updatedStock })
      .eq('productID', productID);
    if (error) {
      console.error('Error reordering stock:', error);
      alert('Failed to reorder stock.');
    } else {
      setProducts(products.map((p) =>
        p.productID === productID ? { ...p, stockQuantity: updatedStock } : p
      ));
      alert('Reorder placed successfully!');
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      description: product.description,
      image: product.image
    });
    setShowEditModal(true);
  };

  return (
    <Container fluid className="admin-dashboard">
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2" />
            Add New Product
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Products</h6>
                  <h3>{products.length}</h3>
                </div>
                <FaBoxOpen className="dashboard-icon" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Low Stock Items</h6>
                  <h3>{products.filter((p) => p.stockQuantity < 5).length}</h3>
                </div>
                <FaShoppingCart className="dashboard-icon" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productID} className={product.stockQuantity < 5 ? 'low-stock' : ''}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <span className={`stock-badge ${product.stockQuantity < 5 ? 'low' : 'normal'}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(product)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteProduct(product.productID)}
                    >
                      <FaTrash />
                    </Button>
                    {product.stockQuantity < 5 && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleReorder(product.productID)}
                      >
                        Reorder
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;