import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import {
  FaBus,
  FaUserTie,
  FaUsers,
  FaCalendarAlt,
  FaComments,
  FaTools,
  FaChartLine,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { adminService, busService, driverService, eventService } from '../../services';
import { Link } from 'react-router-dom';
import './AdminHome.css';

const AdminHome = () => {
  const [stats, setStats] = useState({
    buses: 0,
    drivers: 0,
    users: 0,
    events: 0,
    feedback: 0,
    maintenance: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard statistics
      const statsResponse = await adminService.getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Fetch recent activities
      const activitiesResponse = await adminService.getRecentActivities(5);
      if (activitiesResponse.success && activitiesResponse.data) {
        setRecentActivities(activitiesResponse.data);
      }

      // Fetch upcoming events
      const eventsResponse = await adminService.getUpcomingEvents(5);
      if (eventsResponse.success && eventsResponse.data) {
        setUpcomingEvents(eventsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'bus': return <FaBus className="activity-icon bus" />;
      case 'driver': return <FaUserTie className="activity-icon driver" />;
      case 'user': return <FaUsers className="activity-icon user" />;
      case 'event': return <FaCalendarAlt className="activity-icon event" />;
      case 'feedback': return <FaComments className="activity-icon feedback" />;
      case 'maintenance': return <FaTools className="activity-icon maintenance" />;
      default: return <FaChartLine className="activity-icon" />;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;

    // Convert to lowercase for case-insensitive comparison
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      case 'in_progress': return <Badge bg="info">In Progress</Badge>;
      case 'completed': return <Badge bg="success">Completed</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="page-title">
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/admin/buses">
            <Button variant="primary" className="me-2">
              <FaBus className="me-2" /> Manage Buses
            </Button>
          </Link>
          <Link to="/admin/drivers">
            <Button variant="outline-primary">
              <FaUserTie className="me-2" /> Manage Drivers
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="stats-cards">
        {loading ? (
          <Col xs={12} className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading dashboard data...</p>
          </Col>
        ) : (
          <>
            <Col md={6} lg={4} xl={2} className="mb-4">
              <Card className="admin-card stat-card">
                <Card.Body>
                  <div className="stat-icon bus">
                    <FaBus />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.buses}</h3>
                    <p>Total Buses</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={2} className="mb-4">
              <Card className="admin-card stat-card">
                <Card.Body>
                  <div className="stat-icon driver">
                    <FaUserTie />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.drivers}</h3>
                    <p>Total Drivers</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={2} className="mb-4">
              <Card className="admin-card stat-card">
                <Card.Body>
                  <div className="stat-icon user">
                    <FaUsers />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.users}</h3>
                    <p>Total Users</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={2} className="mb-4">
              <Card className="admin-card stat-card">
                <Card.Body>
                  <div className="stat-icon event">
                    <FaCalendarAlt />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.events}</h3>
                    <p>Active Events</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={2} className="mb-4">
              <Card className="admin-card stat-card">
                <Card.Body>
                  <div className="stat-icon feedback">
                    <FaComments />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.feedback}</h3>
                    <p>New Feedback</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={2} className="mb-4">
              <Card className="admin-card stat-card">
                <Card.Body>
                  <div className="stat-icon maintenance">
                    <FaTools />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.maintenance}</h3>
                    <p>Maintenance</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {!loading && (
        <Row>
          {/* Recent Activities */}
          <Col lg={6} className="mb-4">
            <Card className="admin-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Recent Activities</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="activity-list">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div key={activity.id || activity._id || `activity-${index}`} className="activity-item">
                        {getActivityIcon(activity.type)}
                        <div className="activity-content">
                          <h6>{activity.title || activity.action || 'Activity'}</h6>
                          <p>{activity.description || activity.details || 'No details available'}</p>
                          <span className="activity-time">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-0">No recent activities found.</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Upcoming Events */}
          <Col lg={6} className="mb-4">
            <Card className="admin-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Upcoming Events</h5>
                <Link to="/admin/events">
                  <Button variant="outline-primary" size="sm">View All</Button>
                </Link>
              </Card.Header>
              <Card.Body className="p-0">
                <Table className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Buses</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => (
                        <tr key={event._id || `event-${index}`}>
                          <td>{event.eventName || event.title || 'Unnamed Event'}</td>
                          <td>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Unknown date'}</td>
                          <td>{getStatusBadge(event.status)}</td>
                          <td>{event.assignedBuses?.length || 0}</td>
                          <td>
                            <Link to={`/admin/events/edit/${event._id}`}>
                              <Button variant="link" className="action-btn">
                                <FaEdit />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No upcoming events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminHome;
