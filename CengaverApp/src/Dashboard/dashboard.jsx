import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import userImage from '../assets/user-icon.png';
import API_BASE_URL from '../main';
import { useNavigate } from 'react-router-dom'; 
import GuardDutiesTable from '../Dashboard/GuardDutyList/GuardDutiesTable'; 

const Dashboard = () => {
  const [user, setUser] = useState({ name: null, IsPermitted: null, role: null });
  const [teams, setTeams] = useState([]);
  const [guardDuties, setGuardDuties] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPanel, setShowPanel] = useState(false); 
  const teamCardsRef = useRef(null);
  const navigate = useNavigate(); 

  const TeamsList = ({ teams }) => {
    return (
      <div className="team-cards">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h5 className="card-title">{team.teamName}</h5>
            <ul className="list-unstyled">
              {team.members.length > 0 ? (
                team.members.map((member, memberIndex) => (
                  <li key={member.id || memberIndex} className="mb-1">
                    {member.username || 'No Username'}
                  </li>
                ))
              ) : (
                <li>No members</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
  
      try {
        const userRolesResponse = await fetch(`${API_BASE_URL}/api/UserRoles/get-user-roles-by-user/${userId}`);
        const userRoles = await userRolesResponse.json();
  
        const role = userRoles.length > 0 ? userRoles[0].role : null;
        const userRole = role?.roleName ? role.roleName : null;
  
        if (role) {
          const permissionsResponse = await fetch(`${API_BASE_URL}/api/Permissions/get-permissions-by-role/${role.id}`);
          const permissions = await permissionsResponse.json();
          console.log('permissions:', permissions);
          const isAdmin = permissions.some(permission => permission.userPermission === 'admin');
          console.log('isAdmin:', isAdmin);
          localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
          const userNameResponse = await fetch(`${API_BASE_URL}/api/Users/get-username/${userId}`);
          const userNameData = await userNameResponse.json();
          let userName = userNameData.data || null;
          
          setUser({
            name: userName,
            IsPermitted: isAdmin ? 'admin' : 'user',
            role: userRole
          });
        }
        
        const teamIdsResponse = await fetch(`${API_BASE_URL}/api/UserIsInTeamRelation/get-team-ids-by-user/${userId}`);
        const teamIdsData = await teamIdsResponse.json();
        const teamIds = teamIdsData.data || [];
        console.log('teamIds:', teamIds);
  
        const teamsData = await Promise.all(teamIds.map(async (teamId) => {
          try {
            const teamResponse = await fetch(`${API_BASE_URL}/api/Teams/get-team/${teamId}`);
            const teamData = await teamResponse.json();
            console.log('teamData:', teamData);
            const team = teamData || { id: teamId, name: 'Unknown Team', members: [] };
  
            const usersResponse = await fetch(`${API_BASE_URL}/api/UserTeams/get-users-by-team/${teamId}`);
            const usersData = await usersResponse.json();
            console.log('usersData:', usersData);
  
            const userPromises = usersData.map(async (user) => {
              if (user.userId) {
                const usernameResponse = await fetch(`${API_BASE_URL}/api/Users/get-username/${user.userId}`);
                const usernameData = await usernameResponse.json();
                return {
                  ...user,
                  username: usernameData.data || 'Unknown'
                };
              }
              return {
                ...user,
                username: 'Unknown'
              };
            });
  
            const usersWithNames = await Promise.all(userPromises);
  
            return {
              ...team,
              members: usersWithNames 
            };
  
          } catch (error) {
            console.error(`Error fetching data for team ${teamId}:`, error);
            return {
              id: teamId,
              name: 'Unknown Team',
              members: []
            };
          }
        }));
  
        setTeams(teamsData);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const scroll = (direction) => {
    if (teamCardsRef.current) {
      const scrollAmount = 200; 
      const { scrollLeft, scrollWidth, clientWidth } = teamCardsRef.current;
      
      let newScrollLeft;
      if (direction === 'right') {
        newScrollLeft = scrollLeft + scrollAmount;
        if (newScrollLeft > scrollWidth - clientWidth) {
          newScrollLeft = 0; 
        }
      } else {
        newScrollLeft = scrollLeft - scrollAmount;
        if (newScrollLeft < 0) {
          newScrollLeft = scrollWidth - clientWidth;
        }
      }
      
      teamCardsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };
  const handleUsersClick = () => {
    navigate('/dashboard/users'); 
  };
  const handleTeamsClick = () => {
    navigate('/dashboard/teams');
  };
  const handleGuardDutiesClick = () => {
    navigate('/dashboard/duty-list'); 
  };
  const handleGuardDutyNote = () => {
    navigate('/dashboard/duty-note'); 
  };

  const handleGuardDutyAssignmentClick = () => {
    navigate('/dashboard/guard-duty-assignment'); 
  };

  return (
    <div className="container">
      <div className="fixed-top top-bar d-flex align-items-center bg-light p-3 border-bottom">
        <div className="d-flex align-items-center flex-grow-1">
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
        <div className="top-bar-links d-flex ms-4">
          {user.IsPermitted === 'admin' ? (
            <>
              <span className="top-bar-link" onClick={handleUsersClick}>Kişiler</span>
              <span className="top-bar-link" onClick={handleTeamsClick}>Takımlar</span>
              <span className="top-bar-link" onClick={handleGuardDutiesClick}>Nöbet Listesi</span>
              <span className="top-bar-link" onClick={handleGuardDutyAssignmentClick} >Nöbet Atama</span>
            </>
          ) : (
            <>
              <span className="top-bar-link" onClick={handleGuardDutiesClick}>Nöbet Listesi</span>
              <span className="top-bar-link" onClick={handleGuardDutyNote}>Nöbet Notu</span>
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
              <TeamsList teams={teams} />
            </div>
            <button className="btn btn-primary" onClick={() => scroll('right')}>{'>'}</button>
          </div>
        </div>
      </div>
      {/* Button to scroll left 
      <GuardDutiesTable />
      */ }
    </div>
  );
};

export default Dashboard;
