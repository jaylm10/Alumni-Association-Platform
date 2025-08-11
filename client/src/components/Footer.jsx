import React from "react";
import { 
  Menu, 
  GraduationCap, 
  Briefcase, 
  Lightbulb, 
  Star,
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  MapPin,
  Mail,
  Phone,
  CalendarDays
} from "lucide-react";

const Footer = () => {
  return (
    <div className="home-container">
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-primary">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <span>AC</span>
                </div>
                <span className="footer-logo-text">Alumni Connect</span>
              </div>
              <p>
                Bridging the gap between students and alumni to create
                meaningful professional connections.
              </p>
              <div className="social-links">
                <a href="#" className="social-icon">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            <div className="footer-links-section">
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/about">About Us</a>
                  </li>
                  <li>
                    <a href="/alumni">Alumni Directory</a>
                  </li>
                  <li>
                    <a href="/events">Events</a>
                  </li>
                  <li>
                    <a href="/jobs">Jobs & Internships</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Resources</h4>
                <ul>
                  <li>
                    <a href="/success-stories">Success Stories</a>
                  </li>
                  <li>
                    <a href="/mentorship">Mentorship Program</a>
                  </li>
                  <li>
                    <a href="/resources">Career Resources</a>
                  </li>
                  <li>
                    <a href="/faq">FAQ</a>
                  </li>
                  <li>
                    <a href="/support">Contact Support</a>
                  </li>
                </ul>
              </div>

              <div className="footer-contact">
                <h4>Contact Us</h4>
                <ul>
                  <li className="contact-item">
                    <MapPin className="contact-icon" />
                    <span>
                      123 University Avenue
                      <br />
                      Campus Building, Room 456
                      <br />
                      City, State 12345
                    </span>
                  </li>
                  <li className="contact-item">
                    <Mail className="contact-icon" />
                    <span>contact@alumniconnect.edu</span>
                  </li>
                  <li className="contact-item">
                    <Phone className="contact-icon" />
                    <span>(123) 456-7890</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-secondary">
            <p>
              &copy; {new Date().getFullYear()} Alumni Connect. All rights
              reserved.
            </p>
            <div className="legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
