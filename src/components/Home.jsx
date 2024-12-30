import React from 'react';
import './Home.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <main className="main-content " style={{ paddingTop: '280px' }}>
        <h1>
          Find Your Dream Job
          <br />
          <span>and get <span className="hired-logo">Hired</span></span>
        </h1>
        <br />
        <p>Explore thousands of job listings or find the perfect candidate</p>
        <div className="buttons">
          <button className="find-jobs-button">Find Jobs</button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
