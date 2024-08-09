import React from 'react'
import { useState } from 'react';
import './loginSignup.css'

const LoginSignup = () => {

  const [action, setAction] = useState('Login');

  return (
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
        {action === "Login"? <div></div> : <div className="input"> 
          <img src="" alt="" />
          <input type="text" placeholder='Name'/>
        </div>}
        <div className="input"> 
          <img src="" alt="" />
          <input type="email" placeholder='E mail'/>
        </div>
          <div className="input">
            <img src="" alt="" />
            <input type="password" placeholder='Password'/>
          </div>
        </div>
        <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => setAction('Sign Up')}>
          Sign Up
        </div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => setAction('Login')}>
          Login
        </div>
        </div>
      </div>
  );
};

export default LoginSignup;
