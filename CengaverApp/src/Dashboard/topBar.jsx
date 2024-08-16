import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import userImage from '../assets/user-icon.png';
import Logo from '../assets/Cengaver.png';
import './topBar.css';

const TopBar = ({ user, handleLogout }) => {
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();

  const handleUsersClick = () => navigate('/dashboard/users');
  const handleTeamsClick = () => navigate('/dashboard/teams');
  const handleDutyListClick = () => navigate('/dashboard/duty-list'); 
  const handleDutyAssignmentClick = () => navigate('/dashboard/guard-duty-assignment'); 
  const handleDashboardClick = () => navigate('/dashboard'); 
  const handleUserDutyListClick = () => navigate('/dashboard/user-duty-list'); 
  const handleDutyNoteClick = () => navigate('/dashboard/duty-note'); 
  const handleGuardBreak = () => navigate('/dashboard/duty-break'); 
  const handleTeamDutyListClick = () => navigate('/dashboard/team-duty-list'); 
  console.log('userIsPermitted:', user.isPermitted);

  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  user.isPermitted = isAdmin ? 'admin' : 'notAdmin';
  const handleLogout2 = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };
  return (
    <div className="fixed-top top-bar d-flex align-items-center bg-light p-3 border-bottom "style={{ marginBottom: '20px' }}>
      <div className="d-flex align-items-center flex-grow-1">
      <img 
          src={Logo} 
          alt="Logo" 
          className="logo" 
          onClick={handleDashboardClick} 
          style={{ cursor: 'pointer' , width: '180px', height: '50px'}} 
        />
      </div>
      <div className="top-bar-links d-flex ms-4">
        {user.isPermitted === 'admin' ? (
          <>
            <span className="top-bar-link" onClick={handleUsersClick}>Kişiler</span>
            <span className="top-bar-link" onClick={handleTeamsClick}>Takımlar</span>
            <span className="top-bar-link" onClick={handleDutyListClick}>Nöbet Listesi</span>
            <span className="top-bar-link" onClick={handleDutyAssignmentClick}>Nöbet Atama</span>
          </>
        ) : (
          <>
            <span className="top-bar-link" onClick={handleUserDutyListClick}>Nöbet Listem</span>
            <span className="top-bar-link" onClick={handleTeamDutyListClick}>Takımın Nöbetleri</span>
            <span className="top-bar-link" onClick={handleDutyNoteClick}>Nöbet Notu</span>
            <span className="top-bar-link" onClick={handleGuardBreak}>İzin Alma</span>
          </>
        )}
      </div>
      <div className="profile-container d-flex align-items-center">
        <img 
          src={userImage} 
          alt="Profile" 
          className="profile-pic rounded-circle"  
          onClick={() => setShowPanel(prev => !prev)} 
        />
        {showPanel && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleLogout2}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
