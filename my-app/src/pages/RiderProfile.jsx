import React, { useState } from 'react';
import { Container, Card, Form, Button, Table, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaMotorcycle, FaEdit, FaSave, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/RiderProfile.css';

const RiderProfile = () => {
  const [riderData, setRiderData] = useState({
    name: 'John Doe',
    email: '',
    contact: '',
    cnic: '1234567890123',
    numberPlate: 'ABC-123'
  });

  const [editing, setEditing] = useState({
    name: false,
    email: false,
    contact: false,
    cnic: false,
    numberPlate: false
  });

  // Sample orders data with updated structure
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      address: '123 Main St, City',
      items: ['Milk', 'Bread', 'Eggs'],
      total: 25.99,
      status: 'pending'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      address: '456 Oak Ave, Town',
      items: ['Fruits', 'Vegetables'],
      total: 32.50,
      status: 'in-progress'
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      address: '789 Pine Rd, Village',
      items: ['Meat', 'Fish', 'Rice'],
      total: 45.75,
      status: 'completed'
    }
  ]);

  const handleEdit = (field) => {
    setEditing(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = (field) => {
    setEditing(prev => ({
      ...prev,
      [field]: false
    }));
    localStorage.setItem('riderData', JSON.stringify(riderData));
  };

  const handleChange = (field, value) => {
    if (field === 'contact' || field === 'cnic') {
      const numbersOnly = value.replace(/\D/g, '');
      setRiderData(prev => ({
        ...prev,
        [field]: numbersOnly
      }));
    } else {
      setRiderData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'in-progress':
        return <Badge bg="primary">In Progress</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const renderEditableField = (label, field, icon, isEditable = true) => (
    <Card className="mb-3 rider-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="rider-field-icon me-3">
              {icon}
            </div>
            <div>
              <span className="rider-field-label">{label}</span>
              {!editing[field] ? (
                <div className="rider-field-value">{riderData[field] || 'Not set'}</div>
              ) : (
                <Form.Control
                  type={field === 'contact' ? 'tel' : 'text'}
                  value={riderData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  size="sm"
                  className="rider-field-input"
                  pattern={field === 'contact' ? '[0-9]*' : undefined}
                  inputMode={field === 'contact' ? 'numeric' : 'text'}
                  placeholder={
                    field === 'contact'
                      ? 'Enter numbers only'
                      : undefined
                  }
                />
              )}
            </div>
          </div>
          {isEditable && (
            !editing[field] ? (
              <Button 
                variant="outline-primary" 
                size="sm"
                className="rider-edit-button"
                onClick={() => handleEdit(field)}
              >
                <FaEdit />
              </Button>
            ) : (
              <Button 
                variant="success" 
                size="sm"
                className="rider-save-button"
                onClick={() => handleSave(field)}
              >
                <FaSave />
              </Button>
            )
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="rider-container py-5">
      <h2 className="rider-title mb-4">
        <FaUser className="me-2" />
        Rider Profile
      </h2>
      
      <section className="mb-5">
        {renderEditableField('Name', 'name', <FaUser />, false)}
        {renderEditableField('Email', 'email', <FaEnvelope />)}
        {renderEditableField('Contact', 'contact', <FaPhone />)}
        {renderEditableField('CNIC', 'cnic', <FaIdCard />, false)}
        {renderEditableField('Bike Number Plate', 'numberPlate', <FaMotorcycle />, false)}
      </section>

      <section className="rider-orders-section">
        <h3 className="rider-section-title mb-4">Delivery Orders</h3>
        <Table responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>
                  <FaMapMarkerAlt className="me-2" />
                  {order.address}
                </td>
                <td>{order.items.join(', ')}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  {order.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'in-progress')}
                    >
                      Accept Order
                    </Button>
                  )}
                  {order.status === 'in-progress' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'completed')}
                    >
                      Mark Completed
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </Container>
  );
};

export default RiderProfile;