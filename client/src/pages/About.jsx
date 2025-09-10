import React from 'react';
import './About.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Briefcase, Users, Calendar, MessageSquare, Target, Zap, Award } from 'lucide-react';

const About = () => {
    const token = localStorage.getItem("token")
  return (
    <div className="about-page">
      <Header />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <h1 className="about-hero__title">Connecting Generations, Empowering Futures.</h1>
          <p className="about-hero__subtitle">
            Welcome to Alumni Connect, the exclusive platform dedicated to fostering lifelong bonds within our university community and unlocking a world of opportunity.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-mission">
            <div className="about-mission__text">
              <h2>Our Mission</h2>
              <p>
                Our mission is to bridge the gap between current students and our esteemed alumni. We believe that the experience, wisdom, and network of our graduates are invaluable assets. This platform provides the tools to share that knowledge, foster mentorship, and create powerful professional and personal connections that last a lifetime.
              </p>
            </div>
            <div className="about-mission__image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students and alumni connecting" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-section about-features">
        <div className="about-container">
          <h2 className="about-section__title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon"><Users /></div>
              <h3>Dynamic Directories</h3>
              <p>Easily find and connect with students and alumni. Search by name, skills, major, or company to find the right connection.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon"><Briefcase /></div>
              <h3>Exclusive Career Portal</h3>
              <p>Alumni can post job opportunities directly from their companies, giving our students a unique advantage in their careers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon"><Calendar /></div>
              <h3>Engaging Community Events</h3>
              <p>Stay updated on official university events, from networking nights and workshops to annual reunions, all in one place.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon"><MessageSquare /></div>
              <h3>Direct Mentorship & Connection</h3>
              <p>Our secure messaging and meeting request system allows for meaningful 1:1 interactions between students and alumni.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* For Students / For Alumni Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="for-whom-grid">
            <div className="for-whom-card">
              <div className="for-whom-card__icon"><Target /></div>
              <h3>For Students</h3>
              <p>Find mentors in your desired field, get invaluable career advice, discover exclusive job and internship opportunities, and build your professional network before you even graduate.</p>
            </div>
            <div className="for-whom-card">
              <div className="for-whom-card__icon"><Award /></div>
              <h3>For Alumni</h3>
              <p>Give back by mentoring the next generation, recruit top talent directly from your alma mater, reconnect with old classmates, and stay engaged with the university community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project By Section */}
      {/* <section className="about-section about-creator">
        <div className="about-container">
            <img src="https://via.placeholder.com/150" alt="Project Creator" className="creator-avatar" />
            <h2 className="about-section__title">A Project By [Your Name]</h2>
            <p className="creator-bio">
                This platform was developed as a final year project for the [Your Degree Program, e.g., B.Tech in Computer Engineering] at [Your University Name]. It represents a passion for technology and a commitment to building a stronger, more connected university community.
            </p>
        </div>
      </section> */}

      {/* Call to Action Section */}
      {token==undefined &&<section className="about-cta">
        <div className="about-container">
          <h2>Ready to be a part of something bigger?</h2>
          <p>Join our growing network today and start building connections that matter.</p>
          <div className="cta-buttons">
            <a href="/userTypeSelection" className="btn btn--primary">Register Now</a>
            <a href="/alumni" className="btn btn--secondary">Browse Alumni</a>
          </div>
        </div>
      </section>
}

      <Footer />
    </div>
  );
};

export default About;
