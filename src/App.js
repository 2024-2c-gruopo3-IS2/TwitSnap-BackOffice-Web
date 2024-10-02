import React from 'react';
import './App.css';

function App() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src="https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg" className="logo" alt="Twitter Logo" />
        <h2>Log in to Twitter</h2>
        <form className="login-form">
          <input type="text" placeholder="Phone, email, or username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Log in</button>
        </form>
        <div className="extra-links">
          <a href="/">Forgot password?</a>
          <span>·</span>
          <a href="/">Sign up for Twitter</a>
        </div>
      </div>
    </div>
  );
}

export default App;
