import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Accordion, Form, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaEdit, FaSave } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || {
    username: '',
    email: '',
    contact: '',
    alternateContact: '',
    address: ''
  });


  
  const [editing, setEditing] = useState({
    username: false,
    email: false,
    contact: false,
    alternateContact: false,
    address: false
  });

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
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleChange = (field, value) => {
    if (field === 'contact' || field === 'alternateContact') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 15);
      setUserData(prev => ({
        ...prev,
        [field]: numbersOnly
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderEditableField = (label, field, isOptional = false) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold me-2">
              {label}:
              {isOptional && <span className="text-muted fs-6 ms-1">(Optional)</span>}
            </span>
            {!editing[field] ? (
              <span>{userData[field] || 'Not set'}</span>
            ) : (
              <Form.Control
                type={field.includes('contact') ? 'tel' : 'text'}
                value={userData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                size="sm"
                style={{ 
                  display: 'inline-block', 
                  width: field === 'address' ? '300px' : '200px',
                  marginLeft: '10px' 
                }}
                pattern={field.includes('contact') ? '[0-9]*' : undefined}
                inputMode={field.includes('contact') ? 'numeric' : 'text'}
                placeholder={
                  field === 'contact' || field === 'alternateContact' 
                    ? 'Enter numbers only'
                    : field === 'address'
                    ? 'Enter your delivery address'
                    : undefined
                }
                as={field === 'address' ? 'textarea' : 'input'}
                rows={field === 'address' ? 2 : undefined}
              />
            )}
          </div>
          {!editing[field] ? (
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => handleEdit(field)}
            >
              <FaEdit />
            </Button>
          ) : (
            <Button 
              variant="success" 
              size="sm"
              onClick={() => handleSave(field)}
            >
              <FaSave />
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Profile</h2>
      
      {/* Profile Information */}
      <section className="mb-5">
        {renderEditableField('Username', 'username')}
        {renderEditableField('Email', 'email')}
        {renderEditableField('Contact', 'contact')}
        {renderEditableField('Alternate Contact', 'alternateContact', true)}
        {renderEditableField('Delivery Address', 'address')}
      </section>

      {/* General Information */}
      <section className="mb-5">
        <h3 className="mb-4">General Information</h3>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>FAQs</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <h6>How do I place an order?</h6>
                <p>Simply browse products, add them to your cart, and proceed to checkout.</p>
              </div>
              <div className="mb-3">
                <h6>What payment methods do you accept?</h6>
                <p>We accept all major credit cards and digital payment methods.</p>
              </div>
              <div>
                <h6>How long does delivery take?</h6>
                <p>Typical delivery time is 1-3 business days.</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="1">
            <Accordion.Header>Terms and Conditions</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <h6>1. General Terms</h6>
                <p>By accessing and placing an order with Grocery Store, you confirm that you are in agreement with and bound by these terms and conditions.</p>
              </div>
              <div className="mb-3">
                <h6>2. Privacy Policy</h6>
                <p>Your personal information will be handled according to our privacy policy and applicable data protection laws.</p>
              </div>
              <div>
                <h6>3. Order & Delivery</h6>
                <p>We strive to deliver products in good condition and as per the timeline specified during checkout.</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Return Policies</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <h6>1. Return Window</h6>
                <p>Products can be returned within 7 days of delivery if they are unopened and in original condition.</p>
              </div>
              <div className="mb-3">
                <h6>2. Damaged Items</h6>
                <p>If you receive damaged items, please report within 24 hours of delivery for immediate replacement.</p>
              </div>
              <div>
                <h6>3. Refund Process</h6>
                <p>Refunds are processed within 5-7 business days after we receive the returned item.</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>

      {/* Logout Button */}
      <div className="text-center">
        <Button 
          variant="danger" 
          size="lg" 
          onClick={handleLogout}
          className="d-flex align-items-center gap-2 mx-auto"
        >
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </Container>
  );
};

export default Profile;