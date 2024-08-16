import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import userImage from '../assets/user-icon.png';
import API_BASE_URL from '../main';
import { useNavigate } from 'react-router-dom'; 
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import TopBar from './TopBar';

const Dashboard = () => {
  const [user, setUser] = useState({ name: null, IsPermitted: null, role: null });
  const [teams, setTeams] = useState([]);
  const [guardDuties, setGuardDuties] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPanel, setShowPanel] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDutyUser, setSelectedDutyUser] = useState(null);
  const [selectedDutyColor, setSelectedDutyColor] = useState(null);
  const [dutyNotes, setDutyNotes] = useState([]);

  const teamCardsRef = useRef(null);
  const navigate = useNavigate(); 

  const TeamsList = ({ teams }) => {
    return (
      <div className="team-cards">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <p className="card-title">{team.teamName}</p>
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
          const isAdmin = permissions.some(permission => permission.userPermission === 'admin');
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
  
        const teamsData = await Promise.all(teamIds.map(async (teamId) => {
          try {
            const teamResponse = await fetch(`${API_BASE_URL}/api/Teams/get-team/${teamId}`);
            const teamData = await teamResponse.json();
            const team = teamData || { id: teamId, teamName: 'Unknown Team', members: [] };
  
            const usersResponse = await fetch(`${API_BASE_URL}/api/UserTeams/get-users-by-team/${teamId}`);
            const usersData = await usersResponse.json();
  
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
              teamName: 'Unknown Team',
              members: []
            };
          }
        }));
  
        setTeams(teamsData);

        const guardDutiesResponse = await fetch(`${API_BASE_URL}/api/GuardDuties/get-guard-duties`);
        const guardDutiesData = await guardDutiesResponse.json();
        setGuardDuties(guardDutiesData);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

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
  const handleGuardBreak = () => {
    navigate('/dashboard/duty-break'); 
  };
  const handleGuardDutyAssignmentClick = () => {
    navigate('/dashboard/guard-duty-assignment'); 
  };

  const getColorByWardenUserId = (wardenUserId) => {
    const colors = ['#2C3E50', '#E74C3C', '#34495E', '#8E44AD', '#C0392B'];
    return colors[parseInt(wardenUserId, 10) % colors.length];
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const duty = guardDuties.find(d => {
        const dutyStart = new Date(d.startDate).toISOString().split('T')[0];
        const dutyEnd = new Date(d.endDate).toISOString().split('T')[0];
        return dateStr >= dutyStart && dateStr <= dutyEnd;
      });
  
      if (duty) {
        const color = getColorByWardenUserId(duty.wardenUserId);
        return (
          <div
            style={{ color: color, backgroundColor: color, borderRadius: '0%', height: '20px', width: '20px', margin: 'auto' }}
            onClick={() => fetchUserName(duty.wardenUserId)}
          />
        );
      } else {
        return <span></span>;
      }
    }
    return null;
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
  
    const dateStr = date.toISOString().split('T')[0];
    const duty = guardDuties.find(d => {
      const dutyStart = new Date(d.startDate).toISOString().split('T')[0];
      const dutyEnd = new Date(d.endDate).toISOString().split('T')[0];
      return dateStr >= dutyStart && dateStr <= dutyEnd;
    });
  
    if (duty) {
      await fetchUserName(duty.wardenUserId);
      fetchGuardDutyNotes(duty.id);
    } else {
      setSelectedDutyUser(null);
      setSelectedDutyColor(null);
      setDutyNotes([]);
    }
  };
  

  const fetchUserName = async (wardenUserId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Users/get-username/${wardenUserId}`);
      const data = await response.json();
      if (data.isSuccess) {
        setSelectedDutyUser(data.data);
        setSelectedDutyColor(getColorByWardenUserId(wardenUserId));
      } else {
        console.error('Failed to fetch user name:', data.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const fetchGuardDutyNotes = async (guardDutyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/GuardDutyNotes/get-guard-duty-notes-by-guard-duty/${guardDutyId}`);
      const notesData = await response.json();
      setDutyNotes(notesData.length > 0 ? notesData : [{ content: '--' }]);
    } catch (error) {
      console.error('Error fetching guard duty notes:', error);
      setDutyNotes([{ content: '--' }]);
    }
  };

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div>
      <TopBar user={{}} handleLogout={() => {}} /> 
      <div className="user-calendar-container">
        <div className="user-card">
          <div className="user-card-body">
            <h5 className="user-card-title">Kullanıcı Bilgileri</h5>
            <p className="user-card-text">Ad: {user.name}</p>
            <p className="user-card-text">Rol: {user.role}</p>
            <h1 className="user-card-title">Takımlarım: </h1>
            <TeamsList teams={teams} /> 
          </div>
        </div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
        />
        <div className="calendar-guard-duty">
          <h1>Nöbetçi Bilgileri</h1>
          {selectedDutyUser && (
            <div>
              <p>Tarih: {formatDate(selectedDate)}</p>
              <p>Nöbetçi: {selectedDutyUser}</p>
              <div className="duty-notes">
              <p>Nöbet Notu:</p>
                {dutyNotes.map((note, index) => (
                  <li key={index}>{note.content}</li>
                ))}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
