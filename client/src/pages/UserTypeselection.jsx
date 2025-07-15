import React, { useState } from 'react';
import "../pages/UserTypeselection.css";
import { Link } from 'react-router-dom';

const UserTypeselection = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [buttonText, setButtonText] = useState('Sign Up');

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setButtonText(`Join as a ${selectedValue === 'student' ? 'Student' : 'Alumni'}`);
  };

  console.log("Navigating to Register with userType:", selectedOption); // Debugging

  return (
    <div className="container">
      <h1>Join as a Student or Alumni</h1>
      <div className="options-container">
        <label className={`option ${selectedOption === 'student' ? 'selected' : ''}`}>
          <input
            type="radio"
            value="student"
            checked={selectedOption === 'student'}
            onChange={handleOptionChange}
          />
          I’m a Student
        </label>
        <label className={`option ${selectedOption === 'alumni' ? 'selected' : ''}`}>
          <input
            type="radio"
            value="alumni"
            checked={selectedOption === 'alumni'}
            onChange={handleOptionChange}
          />
          I’m an Alumni
        </label>
      </div>
      
      <Link className='signup-btn' to="/register" state={{ userType: selectedOption }}>
        <button disabled={!selectedOption}>{buttonText}</button>
      </Link>

      <div className="login">
        <p>Already have an account <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default UserTypeselection;
