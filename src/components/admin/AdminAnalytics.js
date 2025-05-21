import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaBus, FaDownload, FaFilter } from 'react-icons/fa';
import { analyticsService, busService } from '../../services';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './AdminAnalytics.css';

// Register Chart.js components
Chart.register(...registerables);

const AdminAnalytics = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [passengerData, setPassengerData] = useState({
    labels: [],
    datasets: []
  });
  const [peakHoursData, setPeakHoursData] = useState({
    labels: [],
    datasets: []
  });
  const [routeDistributionData, setRouteDistributionData] = useState({
    labels: [],
    datasets: []
  });
  const [busUtilizationData, setBusUtilizationData] = useState({
    labels: [],
    datasets: []
  });
  const [analyticsStats, setAnalyticsStats] = useState({
    totalPassengers: 0,
    averagePassengersPerDay: 0,
    peakHour: '',
    mostUsedBus: '',
    mostPopularRoute: ''
  });

  useEffect(() => {
    fetchBuses();
    fetchAnalyticsData();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await busService.getAllBuses();
      if (response.success && response.data && response.data.buses) {
        setBuses(response.data.buses);
        if (response.data.buses.length > 0) {
          setSelectedBus(response.data.buses[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      setError('Failed to fetch buses');
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch peak hours data
      const peakHoursResponse = await analyticsService.getPeakHourData();
      if (peakHoursResponse.success && peakHoursResponse.data) {
        const peakHours = peakHoursResponse.data;
        setPeakHoursData({
          labels: peakHours.map(item => `${item.hour}:00`),
          datasets: [{
            label: 'Passengers',
            data: peakHours.map(item => item.count),
            backgroundColor: 'rgba(147, 112, 219, 0.6)',
            borderColor: 'rgba(147, 112, 219, 1)',
            borderWidth: 1
          }]
        });

        // Find peak hour
        const peakHour = peakHours.reduce((max, item) => max.count > item.count ? max : item, { count: 0 });
        if (peakHour && peakHour.hour) {
          setAnalyticsStats(prev => ({
            ...prev,
            peakHour: `${peakHour.hour}:00`
          }));
        }
      }

      // Fetch bus utilization data
      const busUtilizationResponse = await analyticsService.getBusUtilization();
      if (busUtilizationResponse.success && busUtilizationResponse.data) {
        const busUtilization = busUtilizationResponse.data;
        setBusUtilizationData({
          labels: busUtilization.map(item => item.busNumber),
          datasets: [{
            label: 'Utilization (%)',
            data: busUtilization.map(item => item.utilizationPercentage),
            backgroundColor: busUtilization.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
            borderWidth: 1
          }]
        });

        // Find most used bus
        const mostUsedBus = busUtilization.reduce((max, item) => max.utilizationPercentage > item.utilizationPercentage ? max : item, { utilizationPercentage: 0 });
        if (mostUsedBus && mostUsedBus.busNumber) {
          setAnalyticsStats(prev => ({
            ...prev,
            mostUsedBus: mostUsedBus.busNumber
          }));
        }
      }

      // Fetch route distribution data
      const routeDistributionResponse = await analyticsService.getRouteDistribution();
      if (routeDistributionResponse.success && routeDistributionResponse.data) {
        const routeDistribution = routeDistributionResponse.data;
        setRouteDistributionData({
          labels: routeDistribution.map(item => item.routeName),
          datasets: [{
            label: 'Passengers',
            data: routeDistribution.map(item => item.passengerCount),
            backgroundColor: routeDistribution.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
            borderWidth: 1
          }]
        });

        // Find most popular route
        const mostPopularRoute = routeDistribution.reduce((max, item) => max.passengerCount > item.passengerCount ? max : item, { passengerCount: 0 });
        if (mostPopularRoute && mostPopularRoute.routeName) {
          setAnalyticsStats(prev => ({
            ...prev,
            mostPopularRoute: mostPopularRoute.routeName
          }));
        }
      }

      // Calculate total stats
      const statsResponse = await analyticsService.getAnalyticsStats();
      if (statsResponse.success && statsResponse.data) {
        setAnalyticsStats(prev => ({
          ...prev,
          totalPassengers: statsResponse.data.totalPassengers || 0,
          averagePassengersPerDay: statsResponse.data.averagePassengersPerDay || 0
        }));
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleBusChange = (e) => {
    setSelectedBus(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (selectedBus) {
        const response = await analyticsService.getAnalyticsByBusIdAndDate(
          selectedBus,
          dateRange.startDate,
          dateRange.endDate
        );

        if (response.success && response.data) {
          // Process passenger data for the selected bus
          const data = response.data;
          setPassengerData({
            labels: data.map(item => new Date(item.date).toLocaleDateString()),
            datasets: [{
              label: 'Passenger Count',
              data: data.map(item => item.passengerCount),
              fill: false,
              backgroundColor: 'rgba(147, 112, 219, 0.6)',
              borderColor: 'rgba(147, 112, 219, 1)',
              tension: 0.1
            }]
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bus analytics:', error);
      setError('Failed to fetch bus analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Implement export functionality
    alert('Export functionality will be implemented here');
  };

  return (
    <div className="admin-analytics">
      <div className="page-title">
        <h1>Analytics Dashboard</h1>
        <Button variant="outline-primary" onClick={handleExportData}>
          <FaDownload className="me-2" /> Export Data
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {/* Analytics Stats Cards */}
      <Row className="stats-cards mb-4">
        <Col md={6} lg={3} className="mb-4">
          <Card className="admin-card stat-card">
            <Card.Body>
              <div className="stat-icon passengers">
                <FaChartLine />
              </div>
              <div className="stat-details">
                <h3>{analyticsStats.totalPassengers.toLocaleString()}</h3>
                <p>Total Passengers</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="admin-card stat-card">
            <Card.Body>
              <div className="stat-icon average">
                <FaChartBar />
              </div>
              <div className="stat-details">
                <h3>{analyticsStats.averagePassengersPerDay.toLocaleString()}</h3>
                <p>Avg. Passengers/Day</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="admin-card stat-card">
            <Card.Body>
              <div className="stat-icon peak">
                <FaChartPie />
              </div>
              <div className="stat-details">
                <h3>{analyticsStats.peakHour || 'N/A'}</h3>
                <p>Peak Hour</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="admin-card stat-card">
            <Card.Body>
              <div className="stat-icon popular">
                <FaBus />
              </div>
              <div className="stat-details">
                <h3>{analyticsStats.mostUsedBus || 'N/A'}</h3>
                <p>Most Used Bus</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bus Specific Analytics */}
      <Card className="admin-card mb-4">
        <Card.Header>
          <h5>Bus Specific Analytics</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row className="align-items-end">
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Select Bus</Form.Label>
                  <Form.Select
                    value={selectedBus}
                    onChange={handleBusChange}
                  >
                    {buses.map(bus => (
                      <option key={bus._id} value={bus._id}>{bus.busNumber}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Button type="submit" variant="primary" className="w-100">
                  <FaFilter className="me-2" /> Filter
                </Button>
              </Col>
            </Row>
          </Form>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading analytics data...</p>
            </div>
          ) : (
            <div className="chart-container">
              {passengerData.labels.length > 0 ? (
                <Line 
                  data={passengerData} 
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Passenger Count Over Time'
                      },
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center py-5">
                  <p>No data available for the selected bus and date range.</p>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Analytics Charts */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="admin-card">
            <Card.Header>
              <h5>Peak Hours Distribution</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="chart-container">
                  {peakHoursData.labels.length > 0 ? (
                    <Bar 
                      data={peakHoursData} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <p>No peak hours data available.</p>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="admin-card">
            <Card.Header>
              <h5>Route Distribution</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="chart-container">
                  {routeDistributionData.labels.length > 0 ? (
                    <Pie 
                      data={routeDistributionData} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <p>No route distribution data available.</p>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <Card className="admin-card">
            <Card.Header>
              <h5>Bus Utilization</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="chart-container">
                  {busUtilizationData.labels.length > 0 ? (
                    <Bar 
                      data={busUtilizationData} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: 'Utilization (%)'
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <p>No bus utilization data available.</p>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminAnalytics;
