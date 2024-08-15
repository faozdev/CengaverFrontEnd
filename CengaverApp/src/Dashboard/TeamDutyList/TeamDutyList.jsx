import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../main'; 
import TopBar from '../TopBar';
import './TeamDutyList.css'; // Import the CSS file

const TeamDutyList = () => {
  const [guardDuties, setGuardDuties] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [error, setError] = useState(null);

  // Fetches the username for a given wardenUserId
  const fetchUsername = async (wardenUserId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Users/get-username/${wardenUserId}`);
      const data = await response.json();
      return data.data; // Assuming the username is in the 'data' field
    } catch (err) {
      console.error(`Failed to fetch username for ${wardenUserId}:`, err);
      return 'Unknown';
    }
  };

  // Fetches the guard duties by team ID and includes usernames
  const fetchGuardDutiesByTeam = async (teamId) => {
    try {
      // Fetch users in the selected team
      const usersResponse = await fetch(`${API_BASE_URL}/api/UserTeams/get-users-by-team/${teamId}`);
      const usersData = await usersResponse.json();

      const userIds = usersData.map(user => user.userId);

      // Fetch guard duties for each user
      const guardDutyPromises = userIds.map(id =>
        fetch(`${API_BASE_URL}/api/GuardDuties/get-guard-duties-by-warden/${id}`).then(res => res.json())
      );
      const guardDutiesData = await Promise.all(guardDutyPromises);

      // Flatten the array
      const flattenedDuties = guardDutiesData.flat();

      // Fetch usernames and update guard duties
      const updatedGuardDuties = await Promise.all(flattenedDuties.map(async (duty) => {
        const username = await fetchUsername(duty.wardenUserId);
        return { ...duty, wardenUsername: username };
      }));

      setGuardDuties(updatedGuardDuties);

    } catch (err) {
      setError('Failed to fetch guard duties.');
    }
  };

  // Fetches the teams for the current user
  const fetchGuardDuties = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Fetch user teams
      const userTeamsResponse = await fetch(`${API_BASE_URL}/api/UserTeams/get-user-teams/${userId}`);
      const userTeamsData = await userTeamsResponse.json();
      
      const teamIds = userTeamsData.map(team => team.teamId);

      // Fetch team details
      const teamPromises = teamIds.map(id =>
        fetch(`${API_BASE_URL}/api/Teams/get-team/${id}`).then(res => res.json())
      );
      const teamsData = await Promise.all(teamPromises);
      setTeams(teamsData);

    } catch (err) {
      setError('Failed to fetch teams.');
    }
  };

  // Handles the team change event
  const handleTeamChange = (event) => {
    const selectedTeamId = event.target.value;
    setSelectedTeamId(selectedTeamId);
    fetchGuardDutiesByTeam(selectedTeamId);
  };

  // Fetches the initial data
  useEffect(() => {
    fetchGuardDuties();
  }, []);

  return (
    <div className="team-duty-list">
      <TopBar user={{}} handleLogout={() => {}} />
      <h1>Takımlarımın Görev Listeleri</h1>
      {error && <p className="error">{error}</p>}
      <select onChange={handleTeamChange} value={selectedTeamId || ''} className="team-select">
        <option value="">Select a Team</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>{team.teamName}</option>
        ))}
      </select>
      {selectedTeamId && guardDuties.length > 0 && (
        <table className="duty-table">
          <thead>
            <tr>
              
              <th>Başlangıç Tarihi</th>
              <th>Başlangıç Tarihi</th>
              <th>İsim Soyisim</th> {/* Updated column header */}
              <th>Nöbet Atanma Tarihi</th>
              <th>Nöbet Atayan Kişi</th>
            </tr>
          </thead>
          <tbody>
            {guardDuties.map(duty => (
              <tr key={duty.id}>
                
                <td>{new Date(duty.startDate).toLocaleDateString()}</td>
                <td>{new Date(duty.endDate).toLocaleDateString()}</td>
                <td>{duty.wardenUsername}</td> {/* Updated cell */}
                <td>{new Date(duty.dateOfAssignment).toLocaleDateString()}</td>
                <td>{duty.guardAssignedByUser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeamDutyList;
