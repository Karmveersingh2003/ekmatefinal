import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaBus, FaMapMarkerAlt, FaClock, FaRoute } from 'react-icons/fa';
import { busService, gpsLocationService } from '../../../services';
import './BusTracking.css';

const BusTracking = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState({
    lat: 0,
    lng: 0,
    name: ''
  });

  // Fetch all buses
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await busService.getAllBuses();
        console.log('Bus Tracking - API Response:', response);

        if (response.success) {
          // Check if response.data contains buses property (pagination structure)
          const busesData = response.data.buses || response.data;
          console.log('Bus Tracking - Buses data extracted:', busesData);

          if (Array.isArray(busesData) && busesData.length > 0) {
            setBuses(busesData);
            console.log('Bus Tracking - Buses set:', busesData.length);
          } else {
            setBuses([]);
            console.warn('No buses found in the database');
          }
        } else {
          setBuses([]);
          setError('Failed to fetch buses. Please try again later.');
          console.error('Failed to fetch buses:', response?.message);
        }
      } catch (error) {
        console.error('Error fetching buses:', error);
        setBuses([]);
        setError('An error occurred while fetching buses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Fetch bus location when a bus is selected
  useEffect(() => {
    if (!selectedBus) return;

    const fetchBusLocation = async () => {
      try {
        setLocationLoading(true);
        setError(null);

        const response = await gpsLocationService.getLatestLocation(selectedBus);
        if (response && response.success && response.data) {
          setBusLocation(response.data);
        } else {
          setBusLocation(null);
          console.error('Failed to fetch bus location:', response?.message);
          setError('Could not retrieve the current location for this bus.');
        }
      } catch (error) {
        console.error('Error fetching bus location:', error);
        setBusLocation(null);
        setError('An error occurred while fetching the bus location. Please try again later.');
      } finally {
        setLocationLoading(false);
      }
    };

    fetchBusLocation();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchBusLocation, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [selectedBus]);

  // Calculate ETA when destination and bus location are available
  useEffect(() => {
    if (!selectedBus || !destination.lat || !destination.lng || !busLocation) return;

    const calculateBusETA = async () => {
      try {
        const response = await gpsLocationService.calculateETA(selectedBus, {
          destinationLat: destination.lat,
          destinationLng: destination.lng
        });

        if (response && response.success && response.data) {
          setEta(response.data);
        } else {
          setEta(null);
          console.error('Failed to calculate ETA:', response?.message);
          setError('Could not calculate the estimated time of arrival.');
        }
      } catch (error) {
        console.error('Error calculating ETA:', error);
        setEta(null);
        setError('An error occurred while calculating the estimated time of arrival.');
      }
    };

    calculateBusETA();
  }, [selectedBus, destination, busLocation]);

  // Handle bus selection
  const handleBusSelect = (e) => {
    const busId = e.target.value;
    setSelectedBus(busId === '' ? null : busId);
    setBusLocation(null);
    setEta(null);
  };

  // Handle destination selection (simplified for demo)
  const handleDestinationSelect = (e) => {
    const destinationId = e.target.value;

    // Mock destinations (in a real app, these would come from an API)
    const destinations = [
      { id: '1', name: 'Campus Main Gate', lat: 37.7749, lng: -122.4194 },
      { id: '2', name: 'Library', lat: 37.7750, lng: -122.4183 },
      { id: '3', name: 'Student Center', lat: 37.7752, lng: -122.4175 }
    ];

    const selected = destinations.find(d => d.id === destinationId);

    if (selected) {
      setDestination({
        lat: selected.lat,
        lng: selected.lng,
        name: selected.name
      });
    } else {
      setDestination({ lat: 0, lng: 0, name: '' });
    }

    setEta(null);
  };

  return (
    <Container fluid>
      <div className="page-header">
        <h1>
          <FaMapMarkerAlt className="me-2" />
          Bus Tracking
        </h1>
        <p className="tracking-subtitle">Track buses in real-time and get ETA to your destination</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading buses...</p>
        </div>
      ) : buses.length === 0 ? (
        <div className="text-center my-5">
          <Alert variant="info">
            <h4>No buses found</h4>
            <p>There are currently no buses available in the system.</p>
            <p>Please check back later or contact the administrator.</p>
          </Alert>
        </div>
      ) : (
        <Row>
          <Col lg={4} className="mb-4">
            <Card className="tracking-card">
              <Card.Header>
                <h5 className="mb-0">Select Bus & Destination</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Bus</Form.Label>
                    <Form.Select onChange={handleBusSelect} value={selectedBus || ''}>
                      <option value="">-- Select a bus --</option>
                      {buses.map(bus => {
                        // Get route information from the first route if available
                        const routeInfo = bus.routes && bus.routes.length > 0
                          ? `${bus.routes[0].pickupPoint} to ${bus.destination}`
                          : bus.title || 'No route assigned';

                        return (
                          <option key={bus._id} value={bus._id}>
                            {bus.busNumber} - {routeInfo}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Select Destination</Form.Label>
                    <Form.Select onChange={handleDestinationSelect} disabled={!selectedBus}>
                      <option value="">-- Select destination --</option>
                      <option value="1">Campus Main Gate</option>
                      <option value="2">Library</option>
                      <option value="3">Student Center</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {selectedBus && busLocation && (
              <Card className="tracking-card mt-4">
                <Card.Header>
                  <h5 className="mb-0">Bus Information</h5>
                </Card.Header>
                <Card.Body>
                  <div className="bus-info">
                    <div className="info-item">
                      <FaBus className="info-icon" />
                      <div>
                        <strong>Bus Number</strong>
                        <p>{buses.find(b => b._id === selectedBus)?.busNumber || 'Unknown'}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaRoute className="info-icon" />
                      <div>
                        <strong>Route</strong>
                        <p>
                          {(() => {
                            const bus = buses.find(b => b._id === selectedBus);
                            if (!bus) return 'No route assigned';

                            return bus.routes && bus.routes.length > 0
                              ? `${bus.routes[0].pickupPoint} to ${bus.destination}`
                              : bus.title || 'No route assigned';
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <div>
                        <strong>Current Location</strong>
                        <p>
                          Lat: {busLocation.latitude.toFixed(6)},
                          Lng: {busLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <div>
                        <strong>Last Updated</strong>
                        <p>{new Date(busLocation.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>

                  {eta && destination.name && (
                    <div className="eta-info mt-3">
                      <h6>Estimated Time of Arrival</h6>
                      <div className="eta-destination">
                        <strong>To: {destination.name}</strong>
                      </div>
                      <div className="eta-time">
                        <FaClock className="me-2" />
                        <span>{eta.estimatedMinutes} minutes</span>
                      </div>
                      <div className="eta-distance">
                        <span>Distance: {eta.distanceKm.toFixed(1)} km</span>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={8}>
            <Card className="tracking-card h-100">
              <Card.Header>
                <h5 className="mb-0">Map View</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {locationLoading ? (
                  <div className="text-center my-5">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading location data...</p>
                  </div>
                ) : selectedBus && busLocation ? (
                  <div className="map-placeholder">
                    <div className="map-info">
                      <p>Map would display here with bus location:</p>
                      <p>Latitude: {busLocation.latitude.toFixed(6)}</p>
                      <p>Longitude: {busLocation.longitude.toFixed(6)}</p>
                      {destination.name && (
                        <>
                          <p>Destination: {destination.name}</p>
                          <p>ETA: {eta ? `${eta.estimatedMinutes} minutes` : 'Calculating...'}</p>
                        </>
                      )}
                    </div>
                    <p className="map-note">
                      Note: In a production app, this would be an actual map component
                      (e.g., Google Maps, Mapbox, Leaflet) showing the bus location in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="map-placeholder">
                    <p>Select a bus to view its location on the map</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default BusTracking;
