import React, { useState } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // Import Supabase client
import { useCart } from "../context/CartContext";
import "../styles/commonStyles.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer", // default value
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
  
    try {
      let tableName = "";
      switch (formData.userType) {
        case "customer":
          tableName = "customer";
          break;
        case "admin":
          tableName = "admin";
          break;
        case "rider":
          tableName = "deliverypersonnel";
          break;
        default:
          setErrorMessage("Invalid user type");
          return;
      }
  
      // Query the respective table
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("email", formData.email)
        .single();
  
      if (error || !data) {
        setErrorMessage("Invalid email or user does not exist");
        return;
      }
  
      // Validate password
      if (data.password !== formData.password) {
        setErrorMessage("Incorrect password");
        return;
      }
  
      // Clear cart before login
      clearCart();
  
      // Redirect based on user type and pass the ID
      switch (formData.userType) {
        case "customer":
          localStorage.setItem('userId', data.customerID);
          localStorage.setItem('userType', formData.userType);
          navigate("/profile", { state: { userId: data.customerID, userType: formData.userType } });
          break;
        case "admin":
          localStorage.setItem('userId', data.adminID);
          localStorage.setItem('userType', formData.userType);
          navigate("/admin", { state: { userId: data.adminID } });
          break;
        case "rider":
          localStorage.setItem('userId', data.personnelID);
          localStorage.setItem('userType', formData.userType);
          navigate("/rider", { state: { userId: data.personnelID } });
          break;
        default:
          navigate("/home");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };
  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                {errorMessage && (
                  <div className="alert alert-danger text-center">
                    {errorMessage}
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Login As</Form.Label>
                    <Form.Select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="rider">Rider</option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                  >
                    Login
                  </Button>

                  <div className="text-center">
                    {formData.userType === "customer" && (
                      <>
                        Don't have an account?{" "}
                        <Link to="/register">Register here</Link>
                      </>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
