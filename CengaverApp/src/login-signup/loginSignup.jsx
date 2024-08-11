import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginSignup.css'

const LoginSignup = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      navigate('/dashboard');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  /*
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Replace with your API endpoint
    const apiEndpoint = 'https://your-api-endpoint.com/login';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) { 
        // Navigate to dashboard on successful login
        navigate('/dashboard');
      } else {
        // Handle errors
        console.error('Login failed:', result.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
*/
  return (
      <div className="container">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={handleSubmit}>
        <div className="input"> 
          <img src="" alt="" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
          <div className="input">
            <img src="" alt="" />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
        <div className="submit-container">
        <button type="submit" className="submit">
          Login
        </button>
        </div>
        </form>
      </div>
  );
};

export default LoginSignup;
