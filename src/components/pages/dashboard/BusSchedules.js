import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSearch, FaBus, FaUserAlt, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaFilter } from 'react-icons/fa';
import { busService } from '../../../services';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from '../../../context/ToastContext';
import './BusSchedules.css';

const BusSchedules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const { theme } = useTheme();
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = searchQuery ? { route: searchQuery, busNumber: searchQuery } : {};
        const response = await busService.getAllBuses(searchParams);

        if (response && response.success && response.data && response.data.buses) {
          setSchedules(response.data.buses);

          // Show toast message for search results
          if (searchQuery) {
            if (response.data.buses.length > 0) {
              showSuccess(`Found ${response.data.buses.length} bus routes matching "${searchQuery}"`);
            } else {
              showInfo(`No bus routes found matching "${searchQuery}"`);
            }
          }
        } else {
          console.error('Failed to fetch buses:', response?.message);
          setError('Failed to fetch bus schedules. Please try again later.');
          showError('Failed to fetch bus schedules. Please try again later.');
          setSchedules([]);
        }
      } catch (error) {
        console.error('Error fetching bus data:', error);
        setError('An error occurred while fetching bus schedules. Please try again later.');
        showError('An error occurred while fetching bus schedules. Please try again later.');
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusData();
  }, [searchQuery, showSuccess, showError, showInfo]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showInfo('Please enter a route or bus number to search');
      return;
    }

    // The actual search is handled by the useEffect hook when searchQuery changes
    showInfo(`Searching for "${searchQuery}"...`);
  };

  return (
    <Container>
      <div className="page-header">
        <h1>Bus Schedules</h1>
        <p className="text-muted">View and search for bus schedules</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="mb-4 search-card">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={9} lg={10}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label>Search Bus Routes</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by route or bus number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={3} lg={2}>
                <Button type="submit" variant="primary" className="w-100 search-button">
                  <FaSearch className="me-2" /> Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <div className="bus-route-info-header">
        <h2>Bus Routes</h2>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading schedules...</p>
        </div>
      ) : (
        <div className="bus-schedules">
          {schedules.length > 0 ? (
            schedules.map((bus) => (
              <Card key={bus._id}>
                <Card.Body className="p-0">
                  <div className="bus-card-header">
                    <div className="bus-number">
                      <FaBus className="bus-icon" />
                      <span>Bus #{bus.busNumber}</span>
                    </div>
                    <div className="driver-info">
                      <FaUserAlt className="driver-icon" />
                      <div>
                        <div className="driver-name">{bus.driver?.name || 'Unknown'}</div>
                        {bus.driver?.phone_number && (
                          <div className="driver-phone">
                            <FaPhoneAlt className="phone-icon" />
                            {bus.driver.phone_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered route-table">
                      <thead>
                        <tr>
                          <th width="15%">
                            <div className="d-flex align-items-center">
                              <span className="th-text">S.NO</span>
                            </div>
                          </th>
                          <th width="55%">
                            <div className="d-flex align-items-center">
                              <FaMapMarkerAlt className="th-icon" />
                              <span className="th-text">PICK UP POINT</span>
                            </div>
                          </th>
                          <th width="30%">
                            <div className="d-flex align-items-center">
                              <FaClock className="th-icon" />
                              <span className="th-text">TIME</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bus.routes.map((route, index) => (
                          <tr key={route._id}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                              <span className="pickup-point">{route.pickupPoint}</span>
                            </td>
                            <td className="text-center">
                              <span className="time-badge">
                                {route.time}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <FaBus className="no-results-icon" />
                <h5>No bus routes found</h5>
                <p>Try changing your search criteria or check back later</p>
                <Button
                  variant="outline-primary"
                  onClick={() => setSearchQuery('')}
                  className="mt-3"
                >
                  View All Routes
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default BusSchedules;