import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../main';
import TopBar from '../../Dashboard/TopBar';
import './TeamsPage.css';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Teams/get-teams`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setTeams(data.filter(team => !team.isDeleted));
        } else {
          setError('Team verisi hatalı');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('An error occurred while fetching teams.');
      }
    };

    fetchTeams();
  }, []);

  const handleTeamClick = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/UserTeams/get-users-by-team/${teamId}`);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setTeamUsers(data);
        setSelectedTeam(teamId);
      } else {
        setError('Kullanıcı verisi hatalı');
      }
    } catch (error) {
      console.error('Error fetching team users:', error);
      setError('An error occurred while fetching team users.');
    }
  };

  return (
    <div>
      <TopBar user={{}} handleLogout={() => {}} />

      <div className="container mt-5">
        {error && <div>{error}</div>}
        
        <div className="row">
          <div className="col-md-4">
            <h2>Takımlar</h2>
            <ul className="list-group">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className={`list-group-item d-flex justify-content-between align-items-center 
                    ${team.id === selectedTeam ? 'selected-team' : 'team-item'}`}
                  onClick={() => handleTeamClick(team.id)}
                >
                  {team.teamName}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-md-8">
            {selectedTeam && (
              <div>
                <h2>Team Users</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.userId}</td>
                        <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;