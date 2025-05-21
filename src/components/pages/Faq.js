import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
// import { FaQuestionCircle } from 'react-icons/fa'; // Optional: if you want an icon in the hero
import './Faq.css'; // Styles for this component

const faqData = [
  {
    eventKey: "0",
    id_suffix: "create-account",
    question: 'How do I create an account with EKmate?',
    answer: 'To create an account, download the EKmate application from your respective app store (iOS or Android). Open the app and select the "Sign Up" or "Register" option. You will be prompted to enter your college credentials and verify your email address. This process is designed to be straightforward, guiding you through each step with clarity.'
  },
  {
    eventKey: "1",
    id_suffix: "track-bus",
    question: 'How can I track my bus in real-time?',
    answer: 'Once logged into the EKmate app, navigate to the "Bus Tracking" or "Live Map" section. You should see a map displaying the current location of your selected bus route. The location is updated frequently to provide near real-time information, allowing you to plan your journey with precision.'
  },
  {
    eventKey: "2",
    id_suffix: "forgot-password",
    question: 'What should I do if I forget my password?',
    answer: 'On the login screen of the EKmate app, you will find a "Forgotten Password?" link. Click on it and adhere to the on-screen instructions. Typically, you will need to enter your registered college electronic mail address, and a secure password reset link will be dispatched to you.'
  },
  {
    eventKey: "3",
    id_suffix: "schedules-events",
    question: 'Are there different schedules for regular days and special events?',
    answer: 'Indeed, EKmate provides both daily transport timetables and special schedules for college events, examinations, or other specific occasions. You can usually toggle between these views within the "Schedules" or "Events" section of the application, ensuring you are always well-informed.'
  },
  {
    eventKey: "4",
    id_suffix: "notifications",
    question: 'How do I receive notifications for delays or route changes?',
    answer: 'Ensure that you have enabled push notifications for the EKmate app in your phone\'s settings. The application will send out real-time missives for any significant bus delays, route modifications, or important announcements from the transport administration, keeping you apprised.'
  },
  {
    eventKey: "5",
    id_suffix: "device-availability",
    question: 'Is the EKmate app available for both Android and iOS contrivances?',
    answer: 'Verily! EKmate is designed to be accessible to a wide range of scholars and is available for download on both the Google Play Store (for Android contrivances) and the Apple App Store (for iOS contrivances).'
  },
  {
    eventKey: "6",
    id_suffix: "support-contact",
    question: 'Who can I contact for support or to report an issue with the app?',
    answer: 'For technical support or to report any issues with the EKmate application, kindly use the "Contact Us" or "Support" section within the app itself. Alternatively, you may find contact details on our official college portal or by speaking with the designated transport authorities.'
  }
];

const FaqPage = () => { // Renamed to FaqPage to avoid conflict if Faq is a common name
  return (
    <main id="faq-ekmate-main-container" className="faq-ekmate-main-container">
      {/* FAQ Hero Section */}
      <section id="faq-ekmate-hero" className="faq-ekmate-hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              {/* <FaQuestionCircle id="faq-ekmate-hero-main-icon" className="faq-ekmate-hero-icon" /> */}
              <h1 id="faq-ekmate-page-title" className="faq-ekmate-hero-title">Frequently Asked Questions</h1>
              <p id="faq-ekmate-page-subtitle" className="faq-ekmate-hero-subtitle">
                Find answers to common inquiries about EKmate and its services. Your guide to a smoother campus commute, presented with scholarly grace.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Content Section */}
      <section id="faq-ekmate-content" className="faq-ekmate-content-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <h2 id="faq-ekmate-list-title" className="faq-ekmate-section-title faq-ekmate-ornate-title"><span>Your Queries, Enlightened</span></h2>
              <Accordion defaultActiveKey="0" id="faq-ekmate-accordion-main" className="faq-ekmate-accordion">
                {faqData.map(faq => (
                  <Accordion.Item
                    eventKey={faq.eventKey}
                    id={`faq-ekmate-item-${faq.id_suffix}`}
                    className="faq-ekmate-accordion-item"
                    key={faq.eventKey}
                  >
                    <Accordion.Header
                      id={`faq-ekmate-header-${faq.id_suffix}`}
                      className="faq-ekmate-accordion-header"
                    >
                      {faq.question}
                    </Accordion.Header>
                    <Accordion.Body
                      id={`faq-ekmate-body-${faq.id_suffix}`}
                      className="faq-ekmate-accordion-body"
                    >
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default FaqPage;