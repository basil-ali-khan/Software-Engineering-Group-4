import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Form, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const RiderProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [riderDetails, setRiderDetails] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiderDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('deliverypersonnel')
          .select('*')
          .eq('personnelID', userId)
          .single();
        if (error) console.error('Error fetching rider details:', error);
        else setRiderDetails(data);
      } catch (err) {
        console.error('Unexpected error fetching rider details:', err);
      }
    };

    const fetchPendingOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Order')
          .select('*')
          .eq('accepted', 'no');
        if (error) console.error('Error fetching pending orders:', error);
        else setPendingOrders(data || []);
      } catch (err) {
        console.error('Unexpected error fetching pending orders:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAcceptedOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('deliveryassignment')
          .select('*, Order(*)')
          .eq('personnelID', userId);
        if (error) console.error('Error fetching accepted orders:', error);
        else setAcceptedOrders(data || []);
      } catch (err) {
        console.error('Unexpected error fetching accepted orders:', err);
      }
    };

    if (userId) {
      fetchRiderDetails();
      fetchPendingOrders();
      fetchAcceptedOrders();
    }
  }, [userId]);

  const handleLogout = () => {
    // Clear session or authentication data (if applicable)
    supabase.auth.signOut(); // If using Supabase authentication
    navigate('/login'); // Redirect to login page
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const { error: updateError } = await supabase
        .from('Order')
        .update({ accepted: 'yes' })
        .eq('orderID', orderId);
      if (updateError) {
        console.error('Error updating order status in Order table:', updateError);
        return;
      }

      const { data, error: assignmentError } = await supabase
        .from('deliveryassignment')
        .insert({
          orderID: orderId,
          personnelID: userId,
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
        })
        .select('*, Order(*)');

      if (assignmentError) {
        console.error('Error adding to accepted orders in deliveryassignment table:', assignmentError);
        return;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert query');
        return;
      }

      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderID !== orderId)
      );

      setAcceptedOrders((prevOrders) => [...prevOrders, data[0]]);

      alert('Order accepted successfully!');
    } catch (err) {
      console.error('Unexpected error while accepting order:', err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'delivered') {
        updateData.deliveredAt = new Date().toISOString();
      }

      const { error } = await supabase
        .from('deliveryassignment')
        .update(updateData)
        .eq('orderID', orderId)
        .eq('personnelID', userId);

      if (error) {
        console.error('Error updating order status:', error);
        return;
      }

      setAcceptedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderId
            ? { ...order, ...updateData }
            : order
        )
      );

      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Unexpected error while updating order status:', err);
    }
  };

  return (
    <Container className="rider-container py-5">
      <Row className="mb-4">
        <Col>
          <h2>Rider Profile</h2>
        </Col>
        <Col className="text-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      {riderDetails && (
        <Card className="mb-4">
          <Card.Body>
            <p><strong>Name:</strong> {riderDetails.name}</p>
            <p><strong>Email:</strong> {riderDetails.email}</p>
            <p><strong>Phone:</strong> {riderDetails.phone}</p>
            <p><strong>CNIC:</strong> {riderDetails.cnic}</p>
            <p><strong>Bike Plate Number:</strong> {riderDetails.bikeNumber}</p>
          </Card.Body>
        </Card>
      )}

      <h2 className="rider-title mb-4">Accepted Orders</h2>
      <Table responsive bordered>
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Status</th>
      <th>Accepted At</th>
      <th>Delivered At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {acceptedOrders.length > 0 ? (
      acceptedOrders.map((entry) => {
        const order = entry.Order || {};
        return (
          <tr key={entry.orderID}>
            <td>{entry.orderID}</td>
            <td>{entry.status}</td>
            <td>{new Date(entry.acceptedAt).toLocaleString()}</td>
            <td>
              {entry.deliveredAt
                ? new Date(entry.deliveredAt).toLocaleString()
                : 'Not Delivered'}
            </td>
            <td>
              {entry.status === 'delivered' ? (
                <span className="text-muted">Delivered</span>
              ) : (
                <Form.Select
                  value={entry.status}
                  onChange={(e) =>
                    handleUpdateStatus(entry.orderID, e.target.value)
                  }
                >
                  <option value="accepted">Accepted</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </Form.Select>
              )}
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="5" className="text-center">
          No accepted orders available.
        </td>
      </tr>
    )}
  </tbody>
</Table>

      <h2 className="rider-title mb-4">Pending Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <tr key={order.orderID}>
                  <td>{order.orderID}</td>
                  <td>{order.customerID}</td>
                  <td>Rs. {order.totalAmount.toFixed(2)}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptOrder(order.orderID)}
                    >
                      Accept Order
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No pending orders available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RiderProfile;