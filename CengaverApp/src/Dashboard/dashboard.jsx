import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import userImage from '../assets/user-icon.png';
import API_BASE_URL from '../main';
import { useNavigate } from 'react-router-dom'; 

const Dashboard = () => {
  const [user, setUser] = useState({ name: null, role: null });
  const [teams, setTeams] = useState([]);
  const [guardDuties, setGuardDuties] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const teamCardsRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const userRolesResponse = await fetch(`${API_BASE_URL}/api/UserRoles/get-user-roles-by-user/${userId}`);
        const userRoles = await userRolesResponse.json();

        const roleId = userRoles.length > 0 ? userRoles[0].roleId : null;
        if (roleId) {
          const permissionsResponse = await fetch(`${API_BASE_URL}/api/Permissions/get-permissions-by-role/${roleId}`);
          const permissions = await permissionsResponse.json();

          const isAdmin = permissions.some(permission => permission.userPermission === 'admin');
          
          const userNameResponse = await fetch(`${API_BASE_URL}/api/Users/get-username/${userId}`);
          const userNameData = await userNameResponse.json();
          let userName = null;
          if (userNameData.data !== undefined && userNameData.data !== null) {
            userName = userNameData.data;
          }
          
          setUser({
            name: userName,
            role: isAdmin ? 'admin' : 'user'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const scroll = (direction) => {
    if (teamCardsRef.current) {
      const scrollAmount = 200;
      teamCardsRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); 
    //navigate('/');
  };

  return (
    <div className="container">
      <div className="fixed-top top-bar d-flex align-items-center bg-light p-3 border-bottom">
        <div className="d-flex align-items-center flex-grow-1">
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
        <div className="top-bar-links d-flex ms-4">
          {user.role === 'admin' ? (
            <>
              <span className="top-bar-link">Kişiler</span>
              <span className="top-bar-link">Takımlar</span>
              <span className="top-bar-link">Nöbet Listesi</span>
              <span className="top-bar-link">Nöbet Atama</span>
            </>
          ) : (
            <>
              <span className="top-bar-link">Nöbet Listesi</span>
              <span className="top-bar-link">Nöbet Notu</span>
            </>
          )}
        </div>
        <div className="profile-container d-flex align-items-center">
        <img 
            src={userImage} 
            alt="Profile" 
            className="profile-pic rounded-circle" 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="cards row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Kullanıcı Bilgileri</h5>
              <p className="card-text">Ad: {user.name}</p>
              <p className="card-text">Rol: {user.role}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-primary" onClick={() => scroll('left')}>{'<'}</button>
            <div className="team-cards d-flex overflow-auto" ref={teamCardsRef}>
              {teams.map((team, index) => (
                <div key={index} className="card team-card mr-3">
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <ul className="list-unstyled">
                      {team.members.map((member, memberIndex) => (
                        <li key={memberIndex}>{member}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => scroll('right')}>{'>'}</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2>Nöbetçilerin Listesi</h2>
          <table className="table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Nöbet Başlangıç</th>
                <th>Nöbet Bitiş</th>
              </tr>
            </thead>
            <tbody>
              {guardDuties.map((duty, index) => (
                <tr key={index}>
                  <td>{duty.name}</td>
                  <td>{duty.dutyStart}</td>
                  <td>{duty.dutyEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};
export default Dashboard;
