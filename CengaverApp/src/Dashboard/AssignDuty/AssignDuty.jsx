import TopBar from '../../Dashboard/TopBar'; 
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignDuty.css';

const GuardDutyAssignmentPage = () => {
  const [formData, setFormData] = useState({
    id: 0,
    startDate: '',
    endDate: '',
    wardenUserId: '',
    dateOfAssignment: '',
    guardAssignedByUser: '',
  });
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamUsers, setTeamUsers] = useState([]);
  
  useEffect(() => {
    const fetchUserName = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`https://localhost:7266/api/Users/get-user/${userId}`);
          if (response.data.isSuccess) {
            const userName = response.data.data.name;
            setFormData(prevFormData => ({
              ...prevFormData,
              guardAssignedByUser: userName
            }));
          } else {
            console.error('Failed to fetch user information');
          }
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      }
    };

    fetchUserName();

    // Set the current date and time for dateOfAssignment
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
    setFormData(prevFormData => ({
      ...prevFormData,
      dateOfAssignment: formattedDate
    }));
    
    // Fetch teams
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://localhost:7266/api/Teams/get-teams');
        if (response.data) {
          setTeams(response.data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    // Fetch team users when a team is selected
    const fetchTeamUsers = async () => {
      if (selectedTeamId) {
        try {
          const response = await axios.get(`https://localhost:7266/api/UserTeams/get-users-by-team/${selectedTeamId}`);
          if (response.data) {
            const usersWithNames = await Promise.all(response.data.map(async (user) => {
              const userResponse = await axios.get(`https://localhost:7266/api/Users/get-username/${user.userId}`);
              return {
                userId: user.userId,
                userName: userResponse.data.data,
              };
            }));
            setTeamUsers(usersWithNames);
          }
        } catch (error) {
          console.error('Error fetching team users:', error);
        }
      }
    };

    fetchTeamUsers();
  }, [selectedTeamId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTeamChange = (e) => {
    setSelectedTeamId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7266/api/GuardDuties/add-guard-duty', formData);
      alert('Nöbet başarıyla atandı!');
    } catch (error) {
      alert('Bir hata oluştu: ' + error.message);
    }
  };

  return (
    <div>
      <TopBar user={{}} handleLogout={() => {}} /> {/* Adjust as needed */}
        <div className="assignDuty">
      <h1>Nöbet Atama Sayfası</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Başlangıç Tarihi:
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Bitiş Tarihi:
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Takım:
          <select
            name="teamId"
            value={selectedTeamId}
            onChange={handleTeamChange}
            required
          >
            <option value="">Takım seç</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Kullanıcı:
          <select
            name="wardenUserId"
            value={formData.wardenUserId}
            onChange={handleChange}
            required
          >
            <option value="">Kullanıcı seç</option>
            {teamUsers.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.userName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <input
          type="hidden"
          name="dateOfAssignment"
          value={formData.dateOfAssignment}
        />
        <input
          type="hidden"
          name="guardAssignedByUser"
          value={formData.guardAssignedByUser}
        />
        <button type="submit">Atamayı Yap</button>
      </form>
      </div>
    </div>
  );
};

export default GuardDutyAssignmentPage;
