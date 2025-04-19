import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Accordion, Form, Button, Alert } from 'react-bootstrap';
import { FaSignOutAlt, FaEdit, FaSave } from 'react-icons/fa';
import { supabase } from './supabaseClient';
import { useCart } from '../context/CartContext';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem('userId');
  const { clearCart } = useCart();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const [editing, setEditing] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    address: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('customer')
          .select('*')
          .eq('customerID', userId)
          .single();

        if (error) throw error;
        if (data) {
          setUserData({
            name: data.name || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || ''
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleEdit = (field) => {
    setEditing(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = async (field) => {
    try {
      const { error } = await supabase
        .from('customer')
        .update({ [field]: userData[field] })
        .eq('customerID', userId);

      if (error) throw error;

      setEditing(prev => ({
        ...prev,
        [field]: false
      }));
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'phoneNumber') {
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
    clearCart();
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const renderEditableField = (label, field) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold me-2">{label}:</span>
            {!editing[field] ? (
              <span>{userData[field] || 'Not set'}</span>
            ) : (
              <Form.Control
                type={field === 'phoneNumber' ? 'tel' : field === 'email' ? 'email' : 'text'}
                value={userData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                size="sm"
                style={{ 
                  display: 'inline-block', 
                  width: field === 'address' ? '300px' : '200px',
                  marginLeft: '10px' 
                }}
                pattern={field === 'phoneNumber' ? '[0-9]*' : undefined}
                inputMode={field === 'phoneNumber' ? 'numeric' : 'text'}
                placeholder={
                  field === 'phoneNumber' 
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
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {/* Profile Information */}
      <section className="mb-5">
        {renderEditableField('Name', 'name')}
        {renderEditableField('Email', 'email')}
        {renderEditableField('Phone Number', 'phoneNumber')}
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