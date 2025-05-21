import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/ekmate/api/v1/contact-form-query', formData);

      if (response.data.success) {
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          role: 'student',
          message: ''
        });
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
    <main>
      {/* Contact Hero Section */}
      <section className="contact-hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="contact-title">Contact Us</h1>
              <p className="contact-subtitle">
                Have questions or suggestions? We'd love to hear from you!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="section contact-form-section">
        <Container>
          <Row>
            <Col lg={6} className="mb-5 mb-lg-0">
              <h2 className="section-title text-start">Get In Touch</h2>
              <p className="contact-text">
                Fill out the form below to send us a message. We'll get back to you as soon as possible.
              </p>

              {formStatus.submitted && (
                <Alert variant={formStatus.success ? 'success' : 'danger'}>
                  {formStatus.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
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
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
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
                    <option value="admin">Admin</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter your message"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 custom-btn"
                  style={{ backgroundColor: '#9575cd', borderColor: '#9575cd' }}
                >
                  Send Message
                </Button>
              </Form>
            </Col>

            <Col lg={6}>
              <div className="contact-info">
                <h2 className="section-title text-start">Contact Information</h2>
                <p className="contact-text">
                  You can also reach out to us using the following contact information.
                </p>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-details">
                    <h5>Address</h5>
                    <p>College Campus, City, State, India</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-details">
                    <h5>Phone</h5>
                    <p>+91 1234567890</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-details">
                    <h5>Email</h5>
                    <p>info@ekmate.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div className="contact-details">
                    <h5>Office Hours</h5>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="contact-map mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.8219652911444!2d72.54993641496726!3d22.993471384967775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84576b8d8c79%3A0x1c5e3b2d312f1c5b!2sSome%20College%20Campus!5e0!3m2!1sen!2sin!4v1620123456789!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '10px' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="College Map"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="section contact-faq-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Find quick answers to common questions
              </p>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6} className="mb-4">
              <div className="faq-item">
                <h4>How can I report a bus delay?</h4>
                <p>
                  You can report a bus delay through the app by selecting the specific bus route and clicking on the "Report Issue" button. Alternatively, you can contact our support team directly.
                </p>
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <div className="faq-item">
                <h4>What if I lost something on the bus?</h4>
                <p>
                  For lost items, please contact our Lost and Found department at lost.found@ekmate.com with details about the item and the bus route you were on.
                </p>
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <div className="faq-item">
                <h4>How accurate is the real-time tracking?</h4>
                <p>
                  Our real-time tracking is updated every 30 seconds and is generally accurate within 1-2 minutes, depending on network conditions and traffic.
                </p>
              </div>
            </Col>

            <Col md={6} className="mb-4">
              <div className="faq-item">
                <h4>Can I suggest a new bus route?</h4>
                <p>
                  Yes! We welcome route suggestions. Please use the contact form above to submit your suggestion with details about the proposed route and why it would be beneficial.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Contact;
