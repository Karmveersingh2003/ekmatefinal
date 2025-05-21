import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading">EKmate</h5>
            <p className="footer-text">
              Simplifying and enhancing the commuting experience for students and faculty at college.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
            </div>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="footer-heading">Features</h5>
            <ul className="footer-links">
              <li><a href="#">Real-time Tracking</a></li>
              <li><a href="#">Schedules</a></li>
              <li><a href="#">Notifications</a></li>
              <li><a href="#">Seat Reservation</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="footer-heading">Contact</h5>
            <ul className="footer-contact">
              <li>Email: info@ekmate.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: College Campus, City, State, India</li>
            </ul>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <Row className="py-3">
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} EKmate. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="/terms">Terms of Service</a>
              <span className="mx-2">|</span>
              <a href="/terms">Privacy Policy</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
