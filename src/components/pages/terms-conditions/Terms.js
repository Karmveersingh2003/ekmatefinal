import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './terms.css'; // Import the CSS file

// Optional: If you have a common theme context for dark/light mode
// import { useTheme } from '../../context/ThemeContext'; // Assuming path

const Terms = () => {
  // const { darkMode } = useTheme(); // Example if using theme context

  return (
    <main id="terms-ekmate-main" className="terms-ekmate-main-container">
      {/* Hero Section */}
      <section id="terms-ekmate-hero" className="terms-ekmate-hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={10} lg={8}>
              <h1 id="terms-ekmate-page-title" className="terms-ekmate-page-title">
                Terms and Conditions
              </h1>
              <p id="terms-ekmate-page-subtitle" className="terms-ekmate-page-subtitle">
                Please read these terms carefully before using the EKmate service. Your journey with us is governed by these articles.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Terms Content Section */}
      <section id="terms-ekmate-content" className="terms-ekmate-content-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={9}> {/* Slightly wider for readability */}
              <article id="terms-ekmate-article-main" className="terms-ekmate-article-wrapper">
                {/* Section 1: Introduction */}
                <h2 id="terms-ekmate-section1-heading" className="terms-ekmate-section-heading">
                  Article I: The Preamble of Engagement
                </h2>
                <p className="terms-ekmate-paragraph">
                  Hark, and welcome to EKmate (hereinafter referred to as the "Service" or "Platform"), a digital chronicle and guide for the scholastic conveyance within these hallowed campus grounds. These Terms and Conditions (the "Articles of Use" or "Terms") shall dictate the manner of your interaction with our mobile application and all attendant services rendered by EKmate. By venturing to access or partake in the Service, you hereby affirm your solemn agreement to be bound by these Articles. Should any part of these covenants prove disagreeable, you are thus advised to refrain from the use of this Service.
                </p>

                {/* Section 2: Definitions */}
                <h2 id="terms-ekmate-section2-heading" className="terms-ekmate-section-heading">
                  Article II: A Lexicon of Terms
                </h2>
                <p className="terms-ekmate-paragraph">
                  For the clarity of these Articles, the following terms shall bear the meanings ascribed:
                </p>
                <ul className="terms-ekmate-list">
                  <li className="terms-ekmate-list-item">
                    <strong>"Patron," "User," "Thou," "Thy"</strong>: Refers to the esteemed individual, scholar, faculty member, or administrator accessing or employing the Service, or the collegiate body or other lawful entity on whose behalf such an individual partakes.
                  </li>
                  <li className="terms-ekmate-list-item">
                    <strong>"The College," "The Institution"</strong>: Denotes the venerable seat of learning for which EKmate furnishes its digital stewardship.
                  </li>
                  <li className="terms-ekmate-list-item">
                    <strong>"Conveyance"</strong>: Refers to the buses, carriages, or other modes of transport managed or tracked via the Service.
                  </li>
                </ul>

                {/* Section 3: Use of Our Service */}
                <h2 id="terms-ekmate-section3-heading" className="terms-ekmate-section-heading">
                  Article III: The Right of Passage & Use
                </h2>
                <p className="terms-ekmate-paragraph">
                  EKmate bestows upon thee a non-transferable, non-exclusive, revocable, and limited license to utilize and access the Service. This grant is solely for thy personal, non-commercial edification and navigation, and must be exercised in strict adherence to these Articles.
                </p>
                <h3 id="terms-ekmate-section3-sub1-heading" className="terms-ekmate-sub-heading">
                  § 3.1. The Registry of Patrons (User Accounts)
                </h3>
                <p className="terms-ekmate-paragraph">
                  To avail thyself of certain boons offered by the Service, registration for a personal account may be requisite. Thou art obliged to furnish veracious and complete information and to maintain the currency of thy account particulars. The safeguarding of thy password and all activities conducted thereunder rests solely upon thy shoulders.
                </p>

                {/* Section 4: User Responsibilities */}
                <h2 id="terms-ekmate-section4-heading" className="terms-ekmate-section-heading">
                  Article IV: The Patron's Solemn Duties
                </h2>
                <p className="terms-ekmate-paragraph">
                  As a Patron of EKmate, thou art bound by the following duties:
                </p>
                <ul className="terms-ekmate-list">
                  <li className="terms-ekmate-list-item">Thou shalt not employ the Service for any nefarious purpose or any endeavor forbidden by these Articles.</li>
                  <li className="terms-ekmate-list-item">Thou shalt not engage in any act that could impair, overburden, or tarnish the Service, EKmate, or its good standing.</li>
                  <li className="terms-ekmate-list-item">Misuse of the real-time conveyance tracking or the submission of false chronicles is strictly proscribed.</li>
                  <li className="terms-ekmate-list-item">Thou shalt conduct thyself with decorum and respect towards fellow Patrons and administrators of the Service.</li>
                </ul>

                {/* Section 5: Intellectual Property */}
                <h2 id="terms-ekmate-section5-heading" className="terms-ekmate-section-heading">
                  Article V: Of Creations and Copyrights
                </h2>
                <p className="terms-ekmate-paragraph">
                  The Service, its original script, design, features, and functionalities (save for content provided by Patrons) are, and shall remain, the exclusive domain of EKmate and its licensors. The Service is shielded by the laws of copyright, trademark, and other statutes of this realm and foreign lands. Our sigils and livery may not be employed in connection with any product or service without the prior written consent of EKmate.
                </p>

                {/* Section 6: Disclaimers */}
                <h2 id="terms-ekmate-section6-heading" className="terms-ekmate-section-heading">
                  Article VI: Caveats and Disavowals
                </h2>
                <p className="terms-ekmate-paragraph">
                  The Service is proffered "AS IS" and "AS AVAILABLE," without pretense or promise. EKmate makes no warranties, whether expressed or implied, and hereby renounces all other warranties, including, but not limited to, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. We do not warrant that the Service will be uninterrupted, timely, secure, or free from error, nor that the information obtained will always be precise or reliable.
                </p>

                {/* Section 7: Limitation of Liability */}
                <h2 id="terms-ekmate-section7-heading" className="terms-ekmate-section-heading">
                  Article VII: On Liability's Bounds
                </h2>
                <p className="terms-ekmate-paragraph">
                  In no circumstance shall EKmate, nor its stewards, scribes, partners, agents, purveyors, or affiliates, be held accountable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, arising from (i) thy access to or use of, or inability to access or use, the Service; (ii) any conduct or content of any third party on the Service; (iii. any content obtained from the Service; and (iv) unauthorized access, use or alteration of thy transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>

                {/* Section 8: Governing Law */}
                <h2 id="terms-ekmate-section8-heading" className="terms-ekmate-section-heading">
                  Article VIII: The Law of the Land
                </h2>
                <p className="terms-ekmate-paragraph">
                  These Articles of Use shall be governed and construed in accordance with the laws of the jurisdiction in which The Institution resides, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>

                {/* Section 9: Amendments */}
                <h2 id="terms-ekmate-section9-heading" className="terms-ekmate-section-heading">
                  Article IX: Of Amendments and Alterations
                </h2>
                <p className="terms-ekmate-paragraph">
                  We reserve the sovereign right, at our sole discretion, to amend or replace these Articles at any time. Should a revision be deemed material, we shall endeavor to provide at least thirty days' notice prior to any new terms taking effect. What constitutes a material change shall be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>

                {/* Section 10: Contact */}
                <h2 id="terms-ekmate-section10-heading" className="terms-ekmate-section-heading">
                  Article X: Means of Parley
                </h2>
                <p className="terms-ekmate-paragraph">
                  Shouldst thou have any queries regarding these Articles of Use, we entreat thee to dispatch thy missive to: <a href="mailto:support@ekmate.com" id="terms-ekmate-contact-link" className="terms-ekmate-link">support@ekmate.com</a>.
                </p>

                <p id="terms-ekmate-update-date" className="terms-ekmate-paragraph terms-ekmate-last-updated">
                  <em>These Articles were last revised on this day: [Insert Current Date Here]</em>
                </p>
              </article>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Terms;