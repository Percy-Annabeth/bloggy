import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaPaperPlane
} from 'react-icons/fa';
import './ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="container">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="container contact-container">
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="section-title">Send Us a Message</h2>
            
            {submitted && (
              <div className="success-message">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            <div className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={6}
                  required
                />
              </div>

              <button 
                onClick={handleSubmit}
                className="btn btn-primary btn-lg submit-btn"
              >
                <FaPaperPlane />
                Send Message
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <aside className="contact-info-section">
            <div className="contact-info-card">
              <h3 className="info-title">Contact Information</h3>
              <p className="info-description">
                Have a question or feedback? Reach out to us through any of these channels.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <FaEnvelope />
                  </div>
                  <div className="method-details">
                    <div className="method-label">Email</div>
                    <div className="method-value">contact@bloggy.com</div>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <FaPhone />
                  </div>
                  <div className="method-details">
                    <div className="method-label">Phone</div>
                    <div className="method-value">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="method-details">
                    <div className="method-label">Address</div>
                    <div className="method-value">
                      123 Bloggy Street<br />
                      San Francisco, CA 94102
                    </div>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h4 className="social-title">Follow Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="social-icon" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-icon" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-icon" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <h3 className="info-title">Office Hours</h3>
              <div className="office-hours">
                <div className="hours-row">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How do I create an account?</h3>
              <p className="faq-answer">
                Click on the "Sign Up" button in the top right corner and fill in your details. It only takes a minute!
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Is Bloggy free to use?</h3>
              <p className="faq-answer">
                Yes! Bloggy is completely free for all users. Create and share as many posts as you like.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Can I monetize my content?</h3>
              <p className="faq-answer">
                Monetization features are coming soon! Stay tuned for updates on our premium plans.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">How do I report inappropriate content?</h3>
              <p className="faq-answer">
                You can report any post or comment by clicking the report button. Our team reviews all reports promptly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;