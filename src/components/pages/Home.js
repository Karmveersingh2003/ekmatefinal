import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel, Accordion } from 'react-bootstrap';
import {
  FaBus, FaCalendarAlt, FaBell, FaChair, FaUserCog, FaMapMarkedAlt,
  FaClock, FaCheckCircle, FaMobileAlt, FaUsers, FaGraduationCap, FaLightbulb, FaPlayCircle, FaStar, FaQuoteLeft, FaAdjust // For theme toggle
} from 'react-icons/fa'; // Consider more antique icons if available

import 'aos/dist/aos.css';
import AOS from 'aos';

import './Home.css'; // Your new CSS file

// Image imports (ensure these paths are correct)
// For antique look, consider images with vintage filters or textures
import bustrack from "./img/bustrack.webp"; // These might need CSS filters
import eventbased from "./img/eventbased.avif";
import adminpannel from "./img/adminpannel.webp";
import Jiet from "./img/jiet.jpeg";
import jietmp4 from "./img/jiet_mp4.mp4";
import heroBgImage from "./img/image.png";


// Consider more thematic background images
import exploreBgImage from "./img/vintage-library-bg.jpg"; // EXAMPLE: Replace with a vintage library or landscape

// Placeholder images for screenshots - these will look modern unless filtered
const screenshotImg1 = adminpannel; // SaddleBrown/Wheat
const screenshotImg2 = "http://localhost:3000/static/media/jiet.d8dfef71189df6b79fd4.jpeg"; // Sienna/Linen
const screenshotImg3 = 'https://via.placeholder.com/800x500/8B4513/F5F5DC?text=App+Screenshot+3'; // SaddleBrown/Beige

const Home = () => {
  const [theme, setTheme] = useState('light'); // 'light' (parchment) or 'dark' (aged wood)

  useEffect(() => {
    AOS.init({
      duration: 1500, // Slightly longer for a more graceful feel
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Smoother, elegant easing
      once: true,
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const heroTitleWords = "Your Trusted Guide For Campus Transportation Management".split(' '); // Slightly altered for tone

  return (
    <main className="home-main-container">
      {/* Shooting stars for hero - decorative */}
      <div className="home-shooting-star" style={{ top: '10%', left: '15%', width: '150px', animationDelay: '0s' }}></div>
      <div className="home-shooting-star" style={{ top: '30%', left: '70%', width: '100px', animationDelay: '1.5s' }}></div>
      <div className="home-shooting-star" style={{ top: '60%', left: '40%', width: '120px', animationDelay: '3s' }}></div>


      

      {/* New Hero Section */}
      <header id="home-new-hero" className="home-new-hero-section" style={{ backgroundImage: `linear-gradient(rgba(var(--home-hero-overlay-color-rgb), 0.6), rgba(var(--home-hero-overlay-color-rgb), 0.8)), url(${heroBgImage})` }}>
        <div className="home-hero-particle-overlay">
            {/* Add a few particle elements for subtle effect */}
            {[...Array(15)].map((_, i) => <div className="home-particle" key={i}></div>)}
        </div>
        <div className="home-new-hero-content" data-aos="fade-down" data-aos-duration="1800">
          <h2 id="home-new-hero-quote">Welcome To EkMate</h2>
          <div className="home-new-hero-line"></div>
          <h1>
            {heroTitleWords.map((word, index) => (
              <span className="home-hero-title-word" key={index} style={{ animationDelay: `${index * 0.15}s` }}>{word} </span>
            ))}
          </h1>
        </div>
      </header>

      {/* Key Features Section */}
      <section id="home-features" className="home-section home-features-section">
        <Container>
          <h2 className="home-section-title home-ornate-title" data-aos="fade-up"><span>Key Features</span></h2>
          <p className="home-section-subtitle" data-aos="fade-up" data-aos-delay="100">Discover the reliable features that simplify your journey.</p>
          <Row>
            {[
              { img: bustrack, title: "Real-time Bus Tracking", text: "Ascertain your bus's position with precision and anticipate its arrival.", aos: "fade-right" },
              { img: eventbased, title: "Daily & Event Schedules", text: "Consult daily timetables or arrange transport for special college occasions.", aos: "fade-up", aosDelay: "150" },
              { img: adminpannel, title: "Administrative Console", text: "Administrators may update schedules with ease, keeping all informed.", aos: "fade-left", aosDelay: "300" }
            ].map((feature, index) => (
              <Col md={6} lg={4} className="mb-4 home-feature-col" key={index} data-aos={feature.aos} data-aos-delay={feature.aosDelay || "0"}>
                <Card className="home-feature-card home-antique-card">
                  <div className="home-feature-img-frame">
                    <Card.Img variant="top" src={feature.img} className="home-feature-card-img" />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title as="h3" className="home-feature-title">{feature.title}</Card.Title>
                    <Card.Text className="home-feature-text">{feature.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Explore Section */}
      <section id="home-explore" className="home-explore-section" style={{ backgroundImage: `linear-gradient(rgba(var(--home-bg-color-rgb), 0.3), rgba(var(--home-bg-color-rgb), 0.7)), url(${exploreBgImage})` }}>
        <div className="home-explore-content-wrapper home-vellum-overlay" data-aos="zoom-in-up" data-aos-duration="1200">
          <h1 className="home-explore-title home-ornate-title"><span>EXPLORE THE EkMate</span></h1>
          <div className="home-explore-line"></div>
          <p className="home-explore-text">
            “Navigate your college journeys with grace; your transport schedules, elegantly presented.” <br /> <br />
            “Track your conveyance, plan your travels, and never miss your passage with our steadfast management system."
          </p>
          <br />
          <Button href="#" className="home-primary-button home-antique-button">
            Discover More <FaPlayCircle className="ms-2 home-button-icon"/>
          </Button>
        </div>
      </section>

       {/* How It Works Section */}
      <section id="home-how-it-works" className="home-section home-how-it-works-section">
        <Container>
          <h2 className="home-section-title home-ornate-title" data-aos="fade-up"><span>Begin Your Journey</span></h2>
          <p className="home-section-subtitle" data-aos="fade-up" data-aos-delay="100">Embarking with EKmate is a simple four-step process!</p>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="home-steps-container">
                {[
                  { num: "I", title: "Download & Enlist", text: "Procure the application and register with your college credentials." },
                  { num: "II", title: "Peruse Schedules", text: "Browse daily or event-specific timetables with utmost ease." },
                  { num: "III", title: "Track Your Conveyance", text: "Monitor your bus's live location for accurate arrival estimations." },
                  { num: "IV", title: "Travel with Assurance", text: "Enjoy serene travels with timely notifications and updates." }
                ].map((step, index) => (
                  <div className="home-step" key={step.num} data-aos="fade-right" data-aos-offset="100" data-aos-delay={`${index * 200}`}>
                    <div className="home-step-number-wrapper">
                      <div className="home-step-number">{step.num}</div>
                    </div>
                    <div className="home-step-content home-vellum-card">
                      <h4 className="home-step-title">{step.title}</h4>
                      <p className="home-step-text">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About College & Video Section */}
      <section id="home-about-college-video" className="home-section home-about-college-video-section">
        <Container>
          <div data-aos="fade-up">
            <h2 className="home-section-title home-ornate-title"><span>About the Esteemed College</span></h2>
          </div>
          <Row id='home-about-college-main' className="align-items-center mt-4">
            <Col md={5} id='home-about-college-img-col' data-aos="zoom-in-right">
                <div className="home-image-frame">
                    <img src={Jiet} alt="JIET College Campus" className="home-about-college-img img-fluid" />
                </div>
            </Col>
            <Col md={7} id='home-about-college-paragraph-col' data-aos="fade-left" data-aos-delay="200">
              <div className="home-vellum-box">
                <p className="home-about-college-text">
                    JIET, established in the year of our Lord 2003, stands as a prominent institution in the realms of education and health care, situated in the historic lands of western Rajasthan.
                    It caters to esteemed scholars and patients from across the nation. The institution derives its fortitude from cherished core values
                    and a visionary council of experts, focusing on Quality tutelage, diligent implementation, and enlightened learning processes...
                </p>
              </div>
            </Col>
          </Row>

          <div className="mt-5 pt-4" data-aos="fade-up" data-aos-delay="100">
            <h2 className="home-section-title home-ornate-title"><span>A Glimpse of the College’s Environs</span></h2>
          </div>
          <div id="home-jiet-video-wrapper" data-aos="zoom-in" data-aos-delay="200">
            <div className="home-video-frame">
                <video src={jietmp4} autoPlay loop muted className="home-jiet-video" />
                <div className="home-video-overlay-grain"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Screenshots/Demo Section */}
      <section id="home-screenshots" className="home-section home-screenshots-section">
        <Container>
          <h2 className="home-section-title home-ornate-title" data-aos="fade-up"><span>Witness EKmate in Operation</span></h2>
          <p className="home-section-subtitle" data-aos="fade-up" data-aos-delay="100">A brief look into our intuitive and feature-rich application.</p>
          <Carousel className="home-screenshots-carousel home-antique-carousel" indicators={true} interval={4000} data-aos="zoom-in-up" data-aos-delay="200">
            {[screenshotImg1, screenshotImg2, screenshotImg3].map((img, index) => (
              <Carousel.Item key={index}>
                <div className="home-carousel-image-container">
                    <img className="d-block w-100 home-carousel-image" src={img} alt={`App screenshot ${index + 1}`} />
                </div>
                <Carousel.Caption className="home-carousel-caption home-vellum-caption">
                  <h3>{["Live Conveyance Tracking", "Comprehensive Schedules", "Instant Dispatches"][index]}</h3>
                  <p>{["Observe your bus's journey upon the map in real-time.", "Access all routes and timings with scholarly ease.", "Receive timely missives for important updates."][index]}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
          <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="300">
            <Button variant="outline-primary" size="lg" className="home-outline-button home-antique-button">
              <FaPlayCircle className="me-2 home-button-icon" /> View Moving Pictures
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="home-testimonials" className="home-section home-testimonials-section">
        <Container>
          <h2 className="home-section-title home-ornate-title" data-aos="fade-up"><span>Commended by Our Community</span></h2>
          <p className="home-section-subtitle" data-aos="fade-up" data-aos-delay="100">Hear the testimonies of students and faculty regarding EKmate.</p>
          <Row>
            {[
              { quote: "EKmate is a true boon! Real-time tracking ensures I never tarry for my bus. Most convenient!", author: "Aisha K., Scholar", aos: "fade-right", aosDelay: "0" },
              { quote: "Managing event transport was once a trial. EKmate's administrative panel has rendered it remarkably simple.", author: "Mr. Sharma, Transport Steward", aos: "fade-up", aosDelay: "150" },
              { quote: "The application is exceedingly user-friendly, and the notifications are most helpful for any sudden alterations.", author: "Rahul P., Scholar", aos: "fade-left", aosDelay: "300" }
            ].map((testimonial, index) => (
              <Col md={6} lg={4} className="mb-4 home-testimonial-col" key={index} data-aos={testimonial.aos} data-aos-delay={testimonial.aosDelay}>
                <Card className="home-testimonial-card home-antique-card">
                  <Card.Body>
                    <FaQuoteLeft className="home-testimonial-quote-icon" />
                    <blockquote className="home-testimonial-quote">{testimonial.quote}</blockquote>
                    <p className="home-testimonial-author">— {testimonial.author}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
        <section id="home-benefits" className="home-section home-benefits-section">
            <Container>
            <h2 className="home-section-title home-ornate-title" data-aos="fade-up"><span>Advantages of Employing EKmate</span></h2>
            <p className="home-section-subtitle" data-aos="fade-up" data-aos-delay="100">Improving your daily passage in every conceivable manner.</p>
            <Row>
                {[
                { icon: <FaMapMarkedAlt />, title: "Utmost Convenience", text: "Access schedules and track conveyances at any hour, from any place.", aos: "zoom-in-right", aosDelay: "0"},
                { icon: <FaClock />, title: "Time-Honored Reliability", text: "Accurate, real-time updates diminish waiting and uncertainty.", aos: "zoom-in-up", aosDelay: "150" },
                { icon: <FaCheckCircle />, title: "Enhanced Prudence", text: "Plan your day with sagacity, guided by precise arrival information.", aos: "zoom-in-left", aosDelay: "300" }
                ].map((benefit, index) => (
                <Col md={4} className="mb-4 home-benefit-col" key={index} data-aos={benefit.aos} data-aos-delay={benefit.aosDelay}>
                    <div className="home-benefit-item home-vellum-card">
                    <div className="home-benefit-icon-wrapper">
                        <div className="home-benefit-icon">{benefit.icon}</div>
                    </div>
                    <h4 className="home-benefit-title">{benefit.title}</h4>
                    <p className="home-benefit-text">{benefit.text}</p>
                    </div>
                </Col>
                ))}
            </Row>
            </Container>
        </section>


      {/* FAQ Section */}
      <section id="home-faq" className="home-section home-faq-section">
        <Container>
          <h2 className="home-section-title home-ornate-title" data-aos="fade-up"><span>Queries? We Offer Enlightenment.</span></h2>
          <p className="home-section-subtitle" data-aos="fade-up" data-aos-delay="100">Find swift answers to common inquiries regarding EKmate.</p>
          <Row className="justify-content-center">
            <Col md={10} lg={8} data-aos="fade-up" data-aos-delay="200">
              <Accordion defaultActiveKey="0" className="home-faq-accordion home-antique-accordion">
                {[
                  { eventKey: "0", q: 'How might I verify my electronic mail?', a: 'Kindly select the link within the verification missive dispatched to your registered college electronic mail address upon enlistment.' },
                  { eventKey: "1", q: 'How does one reset a forgotten password?', a: 'Upon the login screen, select the "Forgotten Password" link and adhere to the on-screen instructions to reset your password via electronic mail.' },
                  { eventKey: "2", q: 'How may I peruse Bus Routes?', a: 'Once logged in, navigate to the "Schedules" or "Routes" section within the application to view all available routes and their timings.' },
                  { eventKey: "3", q: 'Is the application available for both Android and iOS contrivances?', a: 'Indeed! EKmate is available for download on both the Google Play Store (for Android) and the Apple App Store (for iOS).' },
                  { eventKey: "4", q: 'What transpires if a bus is delayed or a route altered?', a: 'EKmate provides real-time push notifications for any significant delays, route modifications, or emergency announcements, keeping you duly informed.' }
                ].map(faq => (
                  <Accordion.Item eventKey={faq.eventKey} className="home-accordion-item" key={faq.eventKey}>
                    <Accordion.Header className="home-accordion-header">{faq.q}</Accordion.Header>
                    <Accordion.Body className="home-accordion-body">{faq.a}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section id="home-cta" className="home-section home-cta-section">
        <div className="home-cta-grain-overlay"></div>
        <div className="home-cta-bg-elements">
            {[...Array(5)].map((_, i) => <span key={i} className={`home-cta-bg-el home-cta-el${i + 1}`}></span>)}
        </div>
        <Container className="text-center home-cta-content-wrapper" data-aos="zoom-in-out" data-aos-duration="1200">
          <FaStar className="home-cta-icon" /> {/* Consider an old compass rose or similar icon */}
          <h2 className="home-cta-title">Ready for a More Refined Commute?</h2>
          <p className="home-cta-text">Download EKmate forthwith and transform your college travel experience. It is complimentary, swift, and designed with your needs in mind!</p>
          <Button variant="light" size="lg" className="home-cta-button home-antique-button">
            Procure EKmate Now <FaMobileAlt className="ms-2 home-button-icon" />
          </Button>
        </Container>
      </section>
    </main>
  );
};

export default Home;