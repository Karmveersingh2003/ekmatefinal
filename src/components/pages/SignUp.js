import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import axiosInstance from '../../utils/axiosConfig';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: '',
    reg_number: '',
    email: '',
    branch: '',
    year: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      showError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      // Simplify the data we're sending to reduce request size
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Add optional fields only if they have values
      if (formData.reg_number) signupData.reg_number = formData.reg_number;
      if (formData.branch) signupData.branch = formData.branch;
      if (formData.year) signupData.year = formData.year;
      if (formData.phone_number) signupData.phone_number = formData.phone_number;

      // Use our custom axios instance with optimized headers
      const response = await axiosInstance.post('/auth/sign-up', signupData);

      if (response.data.success) {
        const successMsg = 'Registration successful! Please verify your email with the OTP sent to your email.';
        setSuccess(successMsg);
        showSuccess(successMsg);
        setStep(2);
      } else {
        const errorMsg = response.data.message || 'Registration failed. Please try again.';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMsg = 'Registration failed. Please try again.';

      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || errorMsg;
      }

      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });

      if (response.data.success) {
        const successMsg = 'Email verified successfully! Redirecting to login...';
        setSuccess(successMsg);
        showSuccess(successMsg);

        // Use setTimeout to ensure the toast is visible before redirect
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        const errorMsg = response.data.message || 'OTP verification failed. Please try again.';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      let errorMsg = 'OTP verification failed. Please try again.';

      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || errorMsg;
      }

      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      // We'll reuse the signup endpoint since it sends an OTP
      const response = await axiosInstance.post('/auth/sign-up', {
        email: formData.email,
        password: formData.password,
        role: formData.role || 'student' // Use the role from form data or default to student
      });

      if (response.data.success) {
        const successMsg = 'OTP has been resent to your email.';
        setSuccess(successMsg);
        showSuccess(successMsg);
      } else {
        const errorMsg = response.data.message || 'Failed to resend OTP. Please try again.';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      let errorMsg = 'Failed to resend OTP. Please try again.';

      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || errorMsg;
      }

      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="auth-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="auth-title">{step === 1 ? 'Sign Up' : 'Verify OTP'}</h2>
                  <p className="auth-subtitle">
                    {step === 1
                      ? 'Create your account to access EKmate bus management system'
                      : 'Enter the OTP sent to your email'}
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {step === 1 ? (
                  <Form onSubmit={handleSignUp}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Registration Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="reg_number"
                        value={formData.reg_number}
                        onChange={handleChange}
                        placeholder="Enter your registration number"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>College Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your college email"
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Branch</Form.Label>
                          <Form.Control
                            type="text"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            placeholder="Enter your branch"

                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Year</Form.Label>
                          <Form.Select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}

                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Enter your phone number"

                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 8 characters long and include at least one letter, one number, and one special character.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
                      </p>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleOtpVerification}>
                    <Form.Group className="mb-4">
                      <Form.Label>OTP Verification</Form.Label>
                      <Form.Control
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the 6-digit OTP"
                        required
                      />
                      <Form.Text className="text-muted">
                        Please enter the 6-digit OTP sent to your email address.
                      </Form.Text>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Didn't receive the OTP? <Button
                          variant="link"
                          className="auth-link p-0"
                          onClick={handleResendOTP}
                          disabled={loading}
                        >
                          Resend OTP
                        </Button>
                      </p>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
