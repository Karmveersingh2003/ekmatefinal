import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Log the form data for debugging
      console.log('Attempting login with:', { email: formData.email });

      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);

      if (result.success) {
        // Extract user role from the result
        const role = result.user?.role;
        console.log('User role:', role);

        // Add more detailed logging to debug role issues
        console.log('Full user object:', result.user);

        showSuccess('Login successful!');

        // Use setTimeout to ensure the toast is visible before redirect
        setTimeout(() => {
          // Strict check for admin role
          if (role && role.toLowerCase() === 'admin') {
            console.log('Redirecting to admin dashboard');
            navigate('/admin');
          } else {
            console.log('Redirecting to user dashboard');
            navigate('/dashboard');
          }
        }, 500);
      } else {
        // Display the error message from the result
        console.error('Login failed:', result.error);
        console.error('Error details:', result.details);

        // Extract the most specific error message
        let errorMessage = result.error || 'Sign in failed. Please try again.';

        // Check if there's a more specific error in the details
        if (result.details?.err?.message) {
          errorMessage = result.details.err.message;
        }

        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Sign in error:', error);

      // Try to extract the most specific error message
      let errorMessage = 'Sign in failed. Please try again.';

      if (error.response?.data?.err?.message) {
        errorMessage = error.response.data.err.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="auth-title">Sign In</h2>
                  <p className="auth-subtitle">
                    Welcome back! Sign in to access your account
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4 text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <span><strong>Error:</strong> {error}</span>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSignIn}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email / Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email or phone number"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3 custom-btn"
                    disabled={loading}
                    style={{ backgroundColor: '#9575cd', borderColor: '#9575cd' }}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Signing In...
                      </>
                    ) : 'Sign In'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </p>
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

export default SignIn;
