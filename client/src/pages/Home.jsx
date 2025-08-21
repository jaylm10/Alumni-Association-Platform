import React, { useContext, useState } from 'react';
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
import "./Home.css";
import Header from '../components/Header';
import {AuthContext} from '../contexts/AuthContextProvider';
import Footer from '../components/Footer';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {role} = useContext(AuthContext);
  // console.log(role);
  const token = localStorage.getItem("token")
  


  // Stats data
  const stats = [
    { value: "5000+", label: "Alumni Network" },
    { value: "250+", label: "Partner Companies" },
    { value: "1200+", label: "Jobs Posted" },
    { value: "3800+", label: "Successful Connections" }
  ];

  // Features data
  const features = [
    {
      id: 1,
      icon: "GraduationCap",
      title: "Connect with Alumni",
      description: "Search for alumni based on industry, company, graduation year, and connect with them directly.",
      iconBgColor: "primary-light"
    },
    {
      id: 2,
      icon: "Briefcase",
      title: "Discover Opportunities",
      description: "Access exclusive job postings, internships, and networking events shared by our alumni community.",
      iconBgColor: "orange"
    },
    {
      id: 3,
      icon: "Lightbulb",
      title: "Get Mentorship",
      description: "Receive guidance from experienced professionals who have walked the same path at your university.",
      iconBgColor: "green"
    }
  ];

  // Success stories data
  const successStories = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      role: "Software Engineer at Google",
      graduation: "Computer Science 2020",
      testimony: "The alumni network connected me with a senior engineer who guided me through interview preparations. Their mentorship was invaluable in landing my dream job.",
      rating: 5
    },
    {
      id: 2,
      name: "David Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      role: "Founder of TechStart",
      graduation: "Business 2018",
      testimony: "I found my first investors through alumni connections. The support from my former professors and fellow graduates helped turn my startup idea into reality.",
      rating: 5
    }
  ];

  // Featured alumni data
  const featuredAlumni = [
    {
      id: 1,
      name: "James Wilson",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      graduationYear: "Class of 2015",
      role: "CEO at TechInnovate",
      slug: "james-wilson"
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      graduationYear: "Class of 2017",
      role: "Research Scientist at BioHealth",
      slug: "emily-rodriguez"
    },
    {
      id: 3,
      name: "Michael Chang",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", 
      graduationYear: "Class of 2012",
      role: "Partner at Global Ventures",
      slug: "michael-chang"
    },
    {
      id: 4,
      name: "Sophia Kim",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      graduationYear: "Class of 2016",
      role: "Lead Designer at Creative Studio",
      slug: "sophia-kim"
    }
  ];

  
  // Feature Icon component
  const FeatureIcon = ({ icon }) => {
    switch (icon) {
      case "GraduationCap":
        return <GraduationCap className="icon" />;
      case "Briefcase":
        return <Briefcase className="icon" />;
      case "Lightbulb":
        return <Lightbulb className="icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <Header/>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="background-pattern">
            <div className="circle-one"></div>
            <div className="circle-two"></div>
          </div>
          
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Connect with Alumni for Guidance and Opportunities</h1>
                <p>Build your professional network, find mentors, and explore career opportunities through our alumni community.</p>
                <div className="hero-buttons">
                  <a href="/register" className="btn btn-cta">Join the Network</a>
                  <a href="#how-it-works" className="btn btn-secondary">Learn More</a>
                </div>
              </div>
              <div className="hero-image">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Students networking with alumni" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="features-section">
          <div className="section-header">
            <h2>How Alumni Connect Works</h2>
            <p>Our platform connects current students with alumni to foster mentorship, professional development, and career opportunities.</p>
          </div>
          
          <div className="features-container">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className={`icon-circle ${feature.iconBgColor}`}>
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="success-stories-section">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>See how our platform has helped students and alumni achieve their goals.</p>
          </div>
          
          <div className="stories-container">
            {successStories.map((story) => (
              <div key={story.id} className="story-card">
                <div className="story-content">
                  <div className="story-image">
                    <img src={story.image} alt={story.name} />
                  </div>
                  <div className="story-details">
                    <h3>{story.name}</h3>
                    <p className="story-meta">{story.graduation} • {story.role}</p>
                    <p className="story-testimony">"{story.testimony}"</p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={i < story.rating ? "star-filled" : "star"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="stories-cta">
            <a href="/success-stories" className="link-with-arrow">
              View more success stories
              <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </section>

        {/* Featured Alumni Section */}
        <section className="featured-alumni-section">
          <div className="section-header">
            <h2>Featured Alumni</h2>
            <p>Meet some of our distinguished alumni who are making an impact in their fields.</p>
          </div>
          
          <div className="alumni-container">
            {featuredAlumni.map((alumnus) => (
              <div key={alumnus.id} className="alumni-card">
                <div className="alumni-image-container">
                  <img src={alumnus.image} alt={alumnus.name} />
                  <div className="overlay">
                    <a href={`/alumni/${alumnus.slug}`} className="btn btn-view">View Profile</a>
                  </div>
                </div>
                <div className="alumni-info">
                  <h3>{alumnus.name}</h3>
                  <p className="graduation-year">{alumnus.graduationYear}</p>
                  <p className="role">{alumnus.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="alumni-cta">
            <a href="/alumni" className="btn btn-primary">Browse All Alumni</a>
          </div>
        </section>

    

        {/* CTA Section */}
        {token == undefined &&
        <section className="cta-section">
          <div className="cta-container">
            <h2>Ready to Connect with Your Alumni Network?</h2>
            <p>Join thousands of students and alumni who are building valuable connections and advancing their careers.</p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-cta">Create Your Account</a>
              <a href="/login" className="btn btn-outline">Login</a>
            </div>
          </div>
        </section>
        }
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;