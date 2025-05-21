import React from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import {
  FaBusAlt, FaUsers, FaHandshake, FaLeaf, FaBullseye, FaEye, FaLightbulb,
  FaUsersCog, FaRocket, FaPalette, FaCode, FaBullhorn, FaRoute, FaHistory,
  FaLaptopCode, FaQuoteLeft, FaChartLine, FaMapMarkedAlt, FaCalendarAlt
} from 'react-icons/fa';
// Consider a dedicated animation library like AOS (Animate On Scroll) for more complex scroll animations
// import AOS from 'aos';
// import 'aos/dist/aos.css'; // You'd import this in your main app.js or index.js
// React.useEffect(() => {
//   AOS.init({ duration: 1000, once: true });
// }, []);

import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: "Esha",
      role: "Founder & Lead Developer",
      bio: "Driving the vision and technical execution of EKmate with a passion for innovative campus solutions.",
      imgSrc: "https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&h=400&q=80",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Jitendra",
      role: "Head of Product & Design",
      bio: "Crafting intuitive, user-centric experiences that make campus navigation effortless and enjoyable.",
      imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&h=400&q=80",
      social: { linkedin: "#", dribbble: "#" }
    },
    {
      name: "Karamveer",
      role: "Chief Technology Officer",
      bio: "Architecting robust, scalable backend systems that power EKmate's real-time capabilities.",
      imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&h=400&q=80",
      social: { linkedin: "#", github: "#" }
    },
  ];

  const timelineEvents = [
    { year: "2022 Q4", title: "Concept & Idea", description: "Initial brainstorming and identification of campus transportation challenges at [College Name]." },
    { year: "2023 Q1", title: "Prototype Development", description: "First functional prototype developed, focusing on core tracking features." },
    { year: "2023 Q2", title: "Pilot Program Launch", description: "Limited rollout to a test group of students and faculty for feedback." },
    { year: "2023 Q3", title: "EKmate Official Launch", description: "Platform officially launched for the entire [College Name] community." },
    { year: "2024 Q1", title: "New Features Added", description: "Introduced real-time notifications and enhanced route planning based on user feedback." }
  ];

  const differentiators = [
    { icon: <FaRoute />, title: "Real-Time Accuracy", description: "Pinpoint GPS tracking for up-to-the-minute bus locations." },
    { icon: <FaCalendarAlt />, title: "Intuitive Schedules", description: "Easy-to-access, clearly presented bus schedules and ETAs." },
    { icon: <FaUsers />, title: "Community Driven", description: "Built with constant feedback from students and faculty." },
    { icon: <FaLightbulb />, title: "Innovative Features", description: "Continuously evolving with features that matter to you." }
  ];

  const testimonials = [
    { quote: "EKmate has revolutionized my commute! I never miss a bus anymore.", author: "Sarah L., Student", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80" },
    { quote: "As a faculty member, getting around campus is so much easier. Thank you, EKmate!", author: "Dr. David K., Professor", img: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&h=100&fit=crop&q=80" },
    { quote: "The app is super user-friendly and reliable. A must-have for [College Name]!", author: "Mike B., Student", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80" }
  ];


  return (
    <main className="about-page-enhanced">
      {/* Enhanced Hero Section */}
      <section className="about-hero-enhanced-section">
        <div className="about-hero-enhanced-bg-image"></div>
        <div className="about-hero-enhanced-overlay"></div>
        <Container className="about-hero-enhanced-content">
          <Row className="justify-content-center text-center">
            <Col md={10} lg={8}>
              <h1 className="about-hero-enhanced-tagline">Pioneering Campus Mobility</h1>
              <h2 className="about-hero-enhanced-title">Welcome to EKmate</h2>
              <p className="about-hero-enhanced-subtitle">
                We are a team of passionate innovators at [College Name], dedicated to transforming your campus transit experience. Discover how we're making every journey smoother, smarter, and more connected.
              </p>
              <Button variant="light" size="lg" href="#about-story-section" className="about-hero-enhanced-cta">
                Explore Our Story <FaRocket className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Story / Journey Section */}
      <section id="about-story-section" className="about-section about-story-section">
        <Container>
          <div className="about-section-header text-center">
            <FaHistory className="about-header-icon" />
            <h2 className="about-section-title">Our Journey So Far</h2>
            <p className="about-section-description">From a simple idea to a campus-wide solution.</p>
          </div>
          <div className="about-timeline">
            {timelineEvents.map((event, index) => (
              <div key={index} className={`about-timeline-item ${index % 2 === 0 ? 'about-timeline-item-left' : 'about-timeline-item-right'}`}>
                <div className="about-timeline-content">
                  <span className="about-timeline-year">{event.year}</span>
                  <h3 className="about-timeline-title">{event.title}</h3>
                  <p className="about-timeline-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose EKmate? / Differentiators Section */}
      <section className="about-section about-differentiators-section">
        <Container>
          <div className="about-section-header text-center">
            <FaBullseye className="about-header-icon" />
            <h2 className="about-section-title">Why EKmate?</h2>
            <p className="about-section-description">The EKmate advantage for your campus commute.</p>
          </div>
          <Row className="mt-5 justify-content-center">
            {differentiators.map((item, index) => (
              <Col key={index} md={6} lg={3} className="mb-4 d-flex">
                <Card className="about-differentiator-card">
                  <Card.Body className="text-center">
                    <div className="about-differentiator-icon-wrapper">
                      {item.icon}
                    </div>
                    <Card.Title className="about-differentiator-title">{item.title}</Card.Title>
                    <Card.Text className="about-differentiator-text">{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>


      {/* Mission & Vision Combined Section */}
      <section className="about-section about-mission-vision-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0 about-mission-content" data-aos="fade-right">
              <div className="about-icon-heading-wrapper">
                <FaBullseye className="about-header-icon-inline" />
                <h2 className="about-section-title-inline">Our Mission</h2>
              </div>
              <p className="about-section-text-lead">
                To empower every student and faculty member at [College Name] with a reliable, intuitive, and efficient campus transportation system.
              </p>
              <p className="about-section-text">
                We strive to remove commuting hurdles, fostering a connected, accessible, and thriving academic environment through innovative technology and user-centric design.
              </p>
            </Col>
            <Col lg={6} className="about-vision-content" data-aos="fade-left">
              <div className="about-icon-heading-wrapper">
                <FaEye className="about-header-icon-inline" />
                <h2 className="about-section-title-inline">Our Vision</h2>
              </div>
              <p className="about-section-text-lead">
                We envision a future where campus transportation is seamlessly woven into the fabric of university life.
              </p>
              <p className="about-section-text">
                Our goal is an intelligent, interconnected transportation ecosystem promoting sustainability, enhancing efficiency, and ensuring universal accessibility for the entire [College Name] community, enriching the overall campus experience.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values Section - Refined */}
      <section className="about-section about-values-section-refined">
        <Container>
          <div className="about-section-header text-center">
            <FaLightbulb className="about-header-icon" />
            <h2 className="about-section-title">Our Guiding Principles</h2>
            <p className="about-section-description">The values that shape our work and culture at EKmate.</p>
          </div>
          <Row className="mt-5 justify-content-center">
            {[
              { icon: <FaRocket />, title: "Innovation", text: "Pioneering solutions that redefine campus mobility and user experience." },
              { icon: <FaUsers />, title: "User-Centricity", text: "Placing the needs and feedback of our campus community at the heart of everything." },
              { icon: <FaHandshake />, title: "Reliability & Trust", text: "Delivering accurate, dependable services that our users can count on every day." },
              { icon: <FaLeaf />, title: "Sustainability", text: "Championing eco-friendly transit options for a greener, healthier campus." }
            ].map((value, index) => (
              <Col key={index} md={6} lg={3} className="mb-4 d-flex">
                <div className="about-value-card-refined">
                  <div className="about-value-icon-refined-wrapper">{value.icon}</div>
                  <h3 className="about-value-title-refined">{value.title}</h3>
                  <p className="about-value-text-refined">{value.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Impact & Statistics Section */}
      <section className="about-section about-impact-section">
        <Container>
          <div className="about-section-header text-center">
            <FaChartLine className="about-header-icon" />
            <h2 className="about-section-title">Our Impact</h2>
            <p className="about-section-description">Making a tangible difference in campus life at [College Name].</p>
          </div>
          <Row className="mt-5 text-center">
            <Col md={4} className="mb-4">
              <div className="about-stat-item">
                <h3 className="about-stat-number">10,000+</h3>
                <p className="about-stat-label">Active Daily Users</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="about-stat-item">
                <h3 className="about-stat-number">99.8%</h3>
                <p className="about-stat-label">Service Uptime</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="about-stat-item">
                <h3 className="about-stat-number">15 min</h3>
                <p className="about-stat-label">Avg. Commute Time Saved Daily</p>
              </div>
            </Col>
          </Row>
           {/* Optional: Add a visual element like a map snippet */}
           <Row className="mt-5 justify-content-center">
            <Col md={10} lg={8} className="text-center">
                <img src="https://images.unsplash.com/photo-1571505002820-a00599031009?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtcHVzJTIwbWFwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Campus Map Illustration" className="img-fluid rounded shadow-lg about-campus-map-illustration" />
                <p className="mt-3 fst-italic text-muted">Connecting every corner of [College Name].</p>
            </Col>
           </Row>
        </Container>
      </section>


      {/* Meet The Team Section - Refined */}
      <section className="about-section about-team-section-refined">
        <Container>
          <div className="about-section-header text-center">
            <FaUsersCog className="about-header-icon" />
            <h2 className="about-section-title">The Minds Behind EKmate</h2>
            <p className="about-section-description">Meet the dedicated individuals making campus transit better.</p>
          </div>
          <Row className="mt-5 justify-content-center">
            {teamMembers.map((member, index) => (
              <Col key={index} md={6} lg={3} className="mb-5 d-flex justify-content-center" style={{width:"33%"}}>
                <Card className="about-team-card-refined">
                  <div className="about-team-img-wrapper">
                    <Card.Img variant="top" src={member.imgSrc} className="about-team-img-refined" />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="about-team-name-refined">{member.name}</Card.Title>
                    <Card.Subtitle className="about-team-role-refined mb-2">{member.role}</Card.Subtitle>
                    <Card.Text className="about-team-bio-refined">{member.bio}</Card.Text>
                    <div className="about-team-social-links mt-3">
                      {member.social.linkedin && <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`}><i className="fab fa-linkedin"></i></a>}
                      {member.social.twitter && <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Twitter`}><i className="fab fa-twitter"></i></a>}
                      {member.social.dribbble && <a href={member.social.dribbble} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Dribbble`}><i className="fab fa-dribbble"></i></a>}
                      {member.social.github && <a href={member.social.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`}><i className="fab fa-github"></i></a>}
                      {member.social.instagram && <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} Instagram`}><i className="fab fa-instagram"></i></a>}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Technology We Use Section */}
      <section className="about-section about-tech-stack-section">
        <Container>
          <div className="about-section-header text-center">
            <FaLaptopCode className="about-header-icon" />
            <h2 className="about-section-title">Powered by Technology</h2>
            <p className="about-section-description">The innovative technologies that bring EKmate to life.</p>
          </div>
          <Row className="mt-5 text-center about-tech-logos">
            {/* Replace with actual tech logos or icons */}
            <Col xs={6} sm={4} md={2} className="mb-4"><div className="about-tech-logo-item" title="React"><i className="fab fa-react fa-3x"></i><p>React</p></div></Col>
            <Col xs={6} sm={4} md={2} className="mb-4"><div className="about-tech-logo-item" title="Node.js"><i className="fab fa-node-js fa-3x"></i><p>Node.js</p></div></Col>
            <Col xs={6} sm={4} md={2} className="mb-4"><div className="about-tech-logo-item" title="MongoDB"><i className="fas fa-database fa-3x"></i><p>MongoDB</p></div></Col>
            <Col xs={6} sm={4} md={2} className="mb-4"><div className="about-tech-logo-item" title="AWS"><i className="fab fa-aws fa-3x"></i><p>AWS</p></div></Col>
            <Col xs={6} sm={4} md={2} className="mb-4"><div className="about-tech-logo-item" title="Docker"><i className="fab fa-docker fa-3x"></i><p>Docker</p></div></Col>
            <Col xs={6} sm={4} md={2} className="mb-4"><div className="about-tech-logo-item" title="GPS Tech"><i className="fas fa-map-marker-alt fa-3x"></i><p>GPS Tech</p></div></Col>
          </Row>
        </Container>
      </section>

      {/* User Testimonials Section */}
      <section className="about-section about-testimonials-section">
        <Container>
          <div className="about-section-header text-center">
            <FaQuoteLeft className="about-header-icon" />
            <h2 className="about-section-title">What Our Users Say</h2>
            <p className="about-section-description">Real feedback from the [College Name] community.</p>
          </div>
          <Row className="mt-5 justify-content-center">
            {testimonials.map((testimonial, index) => (
              <Col key={index} md={6} lg={4} className="mb-4 d-flex">
                <Card className="about-testimonial-card">
                  <Card.Body>
                    <div className="about-testimonial-quote-icon">”</div>
                    <Card.Text className="about-testimonial-text">"{testimonial.quote}"</Card.Text>
                    <div className="about-testimonial-author-info mt-3">
                      <img src={testimonial.img} alt={testimonial.author} className="about-testimonial-author-img" />
                      <span className="about-testimonial-author">{testimonial.author}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Future Roadmap Section */}
      <section className="about-section about-roadmap-section">
        <Container>
            <div className="about-section-header text-center">
                <FaRocket className="about-header-icon" />
                <h2 className="about-section-title">What's Next for EKmate?</h2>
                <p className="about-section-description">Our vision for the future of campus transit innovation.</p>
            </div>
            <Row className="mt-5 align-items-stretch">
                <Col md={4} className="mb-4 d-flex">
                    <div className="about-roadmap-item">
                        <h4>Advanced Personalization</h4>
                        <p>Tailored route suggestions and notifications based on your class schedule and preferred locations.</p>
                        <span className="about-roadmap-status">In Progress</span>
                    </div>
                </Col>
                <Col md={4} className="mb-4 d-flex">
                    <div className="about-roadmap-item">
                        <h4>Eco-Friendly Incentives</h4>
                        <p>Rewarding sustainable travel choices and promoting green initiatives on campus.</p>
                        <span className="about-roadmap-status">Planned</span>
                    </div>
                </Col>
                <Col md={4} className="mb-4 d-flex">
                    <div className="about-roadmap-item">
                        <h4>Expanded Coverage & Integrations</h4>
                        <p>Integrating with other campus services and potentially expanding to nearby affiliated institutions.</p>
                        <span className="about-roadmap-status">Exploring</span>
                    </div>
                </Col>
            </Row>
        </Container>
      </section>


      {/* Get Involved Section - Enhanced */}
      <section className="about-section about-get-involved-enhanced-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={10} lg={8}>
              <FaBullhorn className="about-header-icon-large mb-4" />
              <h2 className="about-section-title-light">Become a Part of the EKmate Evolution</h2>
              <p className="about-get-involved-enhanced-text">
                Your voice matters. Whether you have feedback, ideas for new features, or want to collaborate,
                we're eager to hear from you. Let's shape the future of campus mobility at [College Name] together!
              </p>
              <Button variant="light" size="lg" href="/contact" className="about-get-involved-enhanced-button">
                Connect With Us Today
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default About;