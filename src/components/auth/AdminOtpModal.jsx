import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import './AdminOtpModal.css';

/**
 * Modal component for admin OTP verification
 */
const AdminOtpModal = ({ show, onHide, adminEmail }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { login } = useAuth();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset form when modal is shown
  useEffect(() => {
    if (show) {
      console.log('AdminOtpModal shown with email:', adminEmail);
      setOtp('');
      setError('');
      setVerifying(false);
      setCountdown(30); // 30 seconds countdown for resend button
    }
  }, [show, adminEmail]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!adminEmail) {
      setError('Admin email is missing. Please try signing in again.');
      showError('Admin email is missing. Please try signing in again.');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      showError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setVerifying(true);

    try {
      console.log('Verifying admin OTP:', { email: adminEmail, otp });
      const result = await authService.verifyAdminOTP(adminEmail, otp);
      console.log('OTP verification result:', result);

      if (result.success) {
        showSuccess('OTP verified successfully!');
        onHide(); // Close the modal

        // Navigate to admin dashboard
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } else {
        const errorMessage = result.error || 'OTP verification failed. Please try again.';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      // Extract the most specific error message
      let errorMessage = 'OTP verification failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!adminEmail) {
      setError('Admin email is missing. Please try signing in again.');
      showError('Admin email is missing. Please try signing in again.');
      return;
    }

    setResending(true);
    setError('');

    try {
      // Re-login to trigger OTP sending
      const result = await login(adminEmail, ''); // Password not needed for resend

      if (result.success && result.requiresOTP) {
        showSuccess('A new OTP has been sent to your email');
        setCountdown(30); // Reset countdown
      } else {
        setError('Failed to resend OTP. Please try signing in again.');
        showError('Failed to resend OTP. Please try signing in again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend OTP. Please try signing in again.');
      showError('Failed to resend OTP. Please try signing in again.');
    } finally {
      setResending(false);
    }
  };

  // Reset form when modal is closed
  const handleClose = () => {
    setOtp('');
    setError('');
    setVerifying(false);
    onHide();
  };

  // Log when the component renders
  console.log('AdminOtpModal rendering with props:', { show, adminEmail });

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      animation={true}
      style={{ zIndex: 9999 }}
      dialogClassName="admin-otp-modal"
    >
      <Modal.Header>
        <Modal.Title>Admin Verification Required</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="info" className="mb-3">
          <p className="mb-0">
            An OTP has been sent to <strong>{adminEmail}</strong>.
            Please enter it below to access the admin dashboard.
          </p>
        </Alert>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleVerify}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Enter OTP</strong></Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter the 6-digit OTP"
              maxLength={6}
              className="text-center"
              style={{ fontSize: '1.2rem', letterSpacing: '0.5rem' }}
              autoFocus
              required
            />
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Form.Text className="text-muted">
                Please check your email inbox for the OTP
              </Form.Text>

              <Button
                variant="link"
                size="sm"
                onClick={handleResendOTP}
                disabled={countdown > 0 || resending}
                className="p-0"
              >
                {resending ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                    Resending...
                  </>
                ) : countdown > 0 ? (
                  `Resend OTP in ${countdown}s`
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
          </Form.Group>

          <div className="d-grid gap-2 mt-4">
            <Button
              variant="primary"
              type="submit"
              disabled={verifying || !otp || otp.length !== 6}
              style={{ backgroundColor: '#9575cd', borderColor: '#9575cd' }}
            >
              {verifying ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Verifying...
                </>
              ) : 'Verify OTP'}
            </Button>

            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={verifying}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminOtpModal;
