import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Accordion, Alert } from 'react-bootstrap';
import {
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBus,
  FaCalendarAlt
} from 'react-icons/fa';
import './Support.css';
import axiosInstance from '../../../utils/axiosConfig';
import { useAuth } from '../../../context/AuthContext';

const Support = () => {
  const { currentUser } = useAuth();

  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    role: 'student',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // Use the current user data from the auth context
  useEffect(() => {
    if (currentUser) {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Decode the JWT token to get user information
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const userData = JSON.parse(jsonPayload);

          // Set the email from the token
          setSupportForm(prevForm => ({
            ...prevForm,
            email: userData.email || ''
          }));
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }, [currentUser]);

  const faqs = [
    {
      id: 1,
      question: 'How do I track my bus in real-time?',
      answer: 'You can track your bus in real-time by going to the Bus Schedules page, finding your bus, and clicking on the "Track" button. This will show you the current location of the bus on a map.'
    },
    {
      id: 2,
      question: 'How do I reserve a seat on a bus?',
      answer: 'To reserve a seat, navigate to the Bus Schedules page, find the bus you want to travel on, and click the "Reserve" button. Follow the prompts to select your seat and confirm your reservation.'
    },
    {
      id: 3,
      question: 'What if I miss my bus?',
      answer: 'If you miss your bus, you can check the schedule for the next available bus. If there are no more buses scheduled for the day, you may need to find alternative transportation.'
    },
    {
      id: 4,
      question: 'How do I cancel my seat reservation?',
      answer: 'You can cancel your seat reservation by going to your profile, selecting "My Reservations", and clicking the "Cancel" button next to the reservation you want to cancel.'
    },
    {
      id: 5,
      question: 'Are there special buses for college events?',
      answer: 'Yes, special buses are arranged for most college events. You can check the Events page for details about transportation options for specific events.'
    }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create form data to submit
      const formData = {
        email: supportForm.email || '',
        role: supportForm.role || 'student',
        message: supportForm.message || ''
      };

      const response = await axiosInstance.post('/contact-form-query', formData);

      if (response.data.success) {
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Thank you for your message!'
        });

        // Reset only the message field after submission
        setSupportForm(prevForm => ({
          ...prevForm,
          message: ''
        }));
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: 'There was an error submitting your message. Please try again.'
        });
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error submitting your message. Please try again.'
      });
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <Container>
      <div className="page-header">
        <h1>Help & Support</h1>
        <p className="support-subtitle">Get help with EKmate bus management system</p>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaQuestionCircle className="me-2" />
                Frequently Asked Questions
              </h5>
            </Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey="0">
                {faqs.map((faq, index) => (
                  <Accordion.Item key={faq.id} eventKey={index.toString()}>
                    <Accordion.Header>
                      <span className="faq-question">{faq.question}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="faq-answer">{faq.answer}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaFileAlt className="me-2" />
                User Guides
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <a href="#" className="guide-link">
                    <div className="guide-item">
                      <div className="guide-icon">
                        <FaBus />
                      </div>
                      <div className="guide-content">
                        <h6>Bus Tracking Guide</h6>
                        <p>Learn how to track buses in real-time</p>
                      </div>
                    </div>
                  </a>
                </Col>

                <Col md={6} className="mb-3">
                  <a href="#" className="guide-link">
                    <div className="guide-item">
                      <div className="guide-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="guide-content">
                        <h6>Schedule Management</h6>
                        <p>How to view and manage bus schedules</p>
                      </div>
                    </div>
                  </a>
                </Col>

                <Col md={6} className="mb-3">
                  <a href="#" className="guide-link">
                    <div className="guide-item">
                      <div className="guide-icon">
                        <FaCheckCircle />
                      </div>
                      <div className="guide-content">
                        <h6>Seat Reservation</h6>
                        <p>Step-by-step guide to reserving seats</p>
                      </div>
                    </div>
                  </a>
                </Col>

                <Col md={6} className="mb-3">
                  <a href="#" className="guide-link">
                    <div className="guide-item">
                      <div className="guide-icon">
                        <FaExclamationTriangle />
                      </div>
                      <div className="guide-content">
                        <h6>Troubleshooting</h6>
                        <p>Common issues and how to resolve them</p>
                      </div>
                    </div>
                  </a>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaEnvelope className="me-2" />
                Contact Support
              </h5>
            </Card.Header>
            <Card.Body>
              {formStatus.submitted && (
                <Alert
                  variant={formStatus.success ? "success" : "danger"}
                  className="mb-4"
                >
                  {formStatus.message}
                </Alert>
              )}

              {formStatus.submitted && formStatus.success ? (
                <div className="form-success">
                  <FaCheckCircle className="success-icon" />
                  <h5>Thank you for contacting us!</h5>
                  <p>We've received your message.</p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3 p-3 contact-info-box rounded">
                    <small className="contact-info-text">Your contact information is automatically filled from your account.</small>
                    <div className="mt-2">
                      <strong>Email:</strong> <span className="contact-email">{supportForm.email || 'Not available'}</span>
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="email"
                    value={supportForm.email}
                  />

                  <input
                    type="hidden"
                    name="role"
                    value={supportForm.role}
                  />

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={supportForm.message}
                      onChange={handleFormChange}
                      rows={5}
                      placeholder="Describe your issue or question"
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100">
                    Submit
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaPhone className="me-2" />
                Contact Information
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-content">
                  <h6>Phone Support</h6>
                  <p>+91 1234567890</p>
                  <p className="text-muted">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-content">
                  <h6>Email Support</h6>
                  <p>support@ekmate.com</p>
                  <p className="text-muted">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FaComments />
                </div>
                <div className="contact-content">
                  <h6>Live Chat</h6>
                  <p>Available on weekdays</p>
                  <p className="text-muted">9:00 AM - 3:00 PM</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Support;
