import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaBus } from 'react-icons/fa';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <Navbar bg={darkMode ? "dark" : "light"} expand="lg" className="navbar-custom" sticky="top" variant={darkMode ? "dark" : "light"}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaBus className="me-2" size={24} />
          <span className="brand-text">EKmate</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link">About</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link">Contact</Nav.Link>
            <Nav.Link as={Link} to="/faq" className="nav-link">Faq's</Nav.Link>

          </Nav>
          <div className="d-flex align-items-center">
            {/* <ThemeToggle /> */}
            <Button
              variant="outline-primary"
              className="me-2 custom-outline-btn"
              onClick={() => navigate('/signin')}
              style={{ borderColor: '#9575cd', color: darkMode ? '#b39ddb' : '#9575cd' }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/simple-signup')}
              className="me-2 custom-btn"
              style={{ backgroundColor: '#9575cd', borderColor: '#9575cd' }}
            >
              Sign Up
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
