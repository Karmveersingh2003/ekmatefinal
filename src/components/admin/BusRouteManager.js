import React, { useState } from 'react';
import { Form, Button, Table, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const BusRouteManager = ({ routes, onChange, disabled }) => {
  const [newRoute, setNewRoute] = useState({
    pickupPoint: '',
    time: '',
    estimatedArrivalTime: '',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });

  const handleRouteChange = (index, field, value) => {
    const updatedRoutes = [...routes];
    
    if (field === 'latitude' || field === 'longitude') {
      updatedRoutes[index].coordinates = {
        ...updatedRoutes[index].coordinates,
        [field]: value
      };
    } else {
      updatedRoutes[index][field] = value;
    }
    
    onChange(updatedRoutes);
  };

  const handleAddRoute = () => {
    if (!newRoute.pickupPoint || !newRoute.time) {
      return; // Don't add empty routes
    }
    
    const updatedRoutes = [
      ...routes,
      {
        ...newRoute,
        coordinates: {
          latitude: parseFloat(newRoute.coordinates.latitude) || 0,
          longitude: parseFloat(newRoute.coordinates.longitude) || 0
        }
      }
    ];
    
    onChange(updatedRoutes);
    
    // Reset the form
    setNewRoute({
      pickupPoint: '',
      time: '',
      estimatedArrivalTime: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    });
  };

  const handleRemoveRoute = (index) => {
    const updatedRoutes = [...routes];
    updatedRoutes.splice(index, 1);
    onChange(updatedRoutes);
  };

  const handleMoveRoute = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === routes.length - 1)
    ) {
      return; // Can't move first item up or last item down
    }
    
    const updatedRoutes = [...routes];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the items
    [updatedRoutes[index], updatedRoutes[newIndex]] = [updatedRoutes[newIndex], updatedRoutes[index]];
    
    onChange(updatedRoutes);
  };

  const handleNewRouteChange = (field, value) => {
    if (field === 'latitude' || field === 'longitude') {
      setNewRoute({
        ...newRoute,
        coordinates: {
          ...newRoute.coordinates,
          [field]: value
        }
      });
    } else {
      setNewRoute({
        ...newRoute,
        [field]: value
      });
    }
  };

  return (
    <div className="bus-route-manager">
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Bus Routes</h5>
        </Card.Header>
        <Card.Body>
          {routes.length > 0 ? (
            <Table responsive className="mb-4">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Pickup Point</th>
                  <th style={{ width: '15%' }}>Time</th>
                  <th style={{ width: '15%' }}>Est. Arrival</th>
                  <th style={{ width: '20%' }}>Coordinates</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={route.pickupPoint}
                        onChange={(e) => handleRouteChange(index, 'pickupPoint', e.target.value)}
                        disabled={disabled}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="time"
                        value={route.time}
                        onChange={(e) => handleRouteChange(index, 'time', e.target.value)}
                        disabled={disabled}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="time"
                        value={route.estimatedArrivalTime}
                        onChange={(e) => handleRouteChange(index, 'estimatedArrivalTime', e.target.value)}
                        disabled={disabled}
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Form.Control
                          type="number"
                          placeholder="Lat"
                          value={route.coordinates?.latitude || ''}
                          onChange={(e) => handleRouteChange(index, 'latitude', e.target.value)}
                          disabled={disabled}
                          size="sm"
                        />
                        <Form.Control
                          type="number"
                          placeholder="Long"
                          value={route.coordinates?.longitude || ''}
                          onChange={(e) => handleRouteChange(index, 'longitude', e.target.value)}
                          disabled={disabled}
                          size="sm"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleMoveRoute(index, 'up')}
                          disabled={index === 0 || disabled}
                        >
                          <FaArrowUp />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleMoveRoute(index, 'down')}
                          disabled={index === routes.length - 1 || disabled}
                        >
                          <FaArrowDown />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveRoute(index)}
                          disabled={disabled}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No routes added yet. Add a route below.</p>
          )}

          <Card className="bg-light">
            <Card.Body>
              <h6 className="mb-3">Add New Route</h6>
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Pickup Point</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Main Gate"
                      value={newRoute.pickupPoint}
                      onChange={(e) => handleNewRouteChange('pickupPoint', e.target.value)}
                      disabled={disabled}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={newRoute.time}
                      onChange={(e) => handleNewRouteChange('time', e.target.value)}
                      disabled={disabled}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Est. Arrival</Form.Label>
                    <Form.Control
                      type="time"
                      value={newRoute.estimatedArrivalTime}
                      onChange={(e) => handleNewRouteChange('estimatedArrivalTime', e.target.value)}
                      disabled={disabled}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Coordinates</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        step="0.0001"
                        placeholder="Latitude"
                        value={newRoute.coordinates.latitude}
                        onChange={(e) => handleNewRouteChange('latitude', e.target.value)}
                        disabled={disabled}
                      />
                      <Form.Control
                        type="number"
                        step="0.0001"
                        placeholder="Longitude"
                        value={newRoute.coordinates.longitude}
                        onChange={(e) => handleNewRouteChange('longitude', e.target.value)}
                        disabled={disabled}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                  <Button
                    variant="primary"
                    onClick={handleAddRoute}
                    disabled={!newRoute.pickupPoint || !newRoute.time || disabled}
                    className="w-100"
                  >
                    <FaPlus className="me-2" /> Add Route
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusRouteManager;
