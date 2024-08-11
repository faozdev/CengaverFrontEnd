import LoginSignup from './login-signup/loginSignup';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/dashboard'; 

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    );
  };

export default App;
