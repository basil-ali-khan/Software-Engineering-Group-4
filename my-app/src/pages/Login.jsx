// import React, { useState } from 'react';
// import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/commonStyles.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     userType: 'customer' // default value
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!formData.username || !formData.password) {
//       alert('Please fill in all fields');
//       return;
//     }

//     // Redirect based on user type
//     switch(formData.userType) {
//       case 'customer':
//         navigate('/home');
//         break;
//       case 'admin':
//         navigate('/admin');
//         break;
//       case 'rider':
//         navigate('/rider');
//         break;
//       default:
//         navigate('/home');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6} lg={5}>
//             <Card className="auth-card">
//               <Card.Body>
//                 <h2 className="text-center mb-4">Login</h2>
//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Username</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleChange}
//                       placeholder="Enter username"
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Enter password"
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <Form.Label>Login As</Form.Label>
//                     <Form.Select
//                       name="userType"
//                       value={formData.userType}
//                       onChange={handleChange}
//                     >
//                       <option value="customer">Customer</option>
//                       <option value="admin">Admin</option>
//                       <option value="rider">Rider</option>
//                     </Form.Select>
//                   </Form.Group>

//                   <Button variant="primary" type="submit" className="w-100 mb-3">
//                     Login
//                   </Button>

//                   <div className="text-center">
//                     Don't have an account?{' '}
//                     <Link to="/register">Register here</Link>
//                   </div>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import Supabase client
import '../styles/commonStyles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer' // default value
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      let tableName = '';
      switch (formData.userType) {
        case 'customer':
          tableName = 'customer';
          break;
        case 'admin':
          tableName = 'admin';
          break;
        case 'rider':
          tableName = 'deliverypersonnel';
          break;
        default:
          setErrorMessage('Invalid user type');
          return;
      }

      // Query the respective table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('email', formData.email)
        .single();

      if (error || !data) {
        setErrorMessage('Invalid email or user does not exist');
        return;
      }

      // Validate password
      if (data.password !== formData.password) {
        setErrorMessage('Incorrect password');
        return;
      }

      // Redirect based on user type
      switch (formData.userType) {
        case 'customer':
          navigate('/home');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'rider':
          navigate('/rider');
          break;
        default:
          navigate('/home');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setErrorMessage('An error occurred. Please try again later.');
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
                  <div className="alert alert-danger text-center">{errorMessage}</div>
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

                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    Login
                  </Button>

                  <div className="text-center">
                    Don't have an account?{' '}
                    <Link to="/register">Register here</Link>
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