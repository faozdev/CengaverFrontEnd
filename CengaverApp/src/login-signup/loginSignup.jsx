import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginSignup.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../main';

const LoginSignup = ({ setUser, setLogged }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const accessToken = null;
  const handleLoginSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        if (setLogged && typeof setLogged === 'function') {
          setLogged(true);
        }

        const loginResponse = await fetch(`${API_BASE_URL}/login?useCookies=true`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
            
          const usersResponse = await fetch(`${API_BASE_URL}/api/Users/get-users`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
            },
          });
    
          const usersData = await usersResponse.json();

          if (usersResponse.ok && !usersData.isSuccess) {
            const user = usersData.data.find(user => user.userName === email);
            if (user) {
              localStorage.setItem('userId', user.id);
            } else {
              console.error('User not found');
            }
          } else {
            console.error('Failed to fetch users');
          }
      }
        navigate('/dashboard'); 
      } else {
        console.error('Login failed');
        if (setLogged && typeof setLogged === 'function') {
          setLogged(false);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    handleLoginSubmit();
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form className="inputs" onSubmit={handleSubmit}>
        <div className="input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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