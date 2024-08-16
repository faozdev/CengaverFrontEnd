import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../main';
import TopBar from '../../Dashboard/TopBar';
import addIcon from '../../assets/add.png'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showComboBox, setShowComboBox] = useState(false); 
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
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

  const fetchUsername = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Users/get-username/${userId}`);
      const result = await response.json();

      if (result.isSuccess) {
        return result.data;
      } else {
        setError('Kullanıcı ismi alınırken hata oluştu');
        return null;
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      setError('An error occurred while fetching username.');
      return null;
    }
  };

  const fetchUserRoles = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/UserRoles/get-user-roles-by-user/${userId}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return data.map(item => item.role.roleName).join(', ');
      } else {
        setError('Kullanıcı rolleri alınırken hata oluştu');
        return 'No roles';
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setError('An error occurred while fetching user roles.');
      return 'Error';
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Users/get-users`);
      const data = await response.json();

      if (data.isSuccess) {
        setUserOptions(data.data);
      } else {
        setError('Kullanıcılar alınırken hata oluştu');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred while fetching users.');
    }
  };

  const handleTeamClick = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/UserTeams/get-users-by-team/${teamId}`);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        const usersWithDetails = await Promise.all(data.map(async (user) => {
          const username = await fetchUsername(user.userId);
          const roles = await fetchUserRoles(user.userId);
          return {
            ...user,
            username: username || user.userId,
            roles: roles
          };
        }));

        setTeamUsers(usersWithDetails);
        setSelectedTeam(teamId);
        setShowComboBox(false);
      } else {
        setError('Kullanıcı verisi hatalı');
      }
    } catch (error) {
      console.error('Error fetching team users:', error);
      setError('An error occurred while fetching team users.');
    }
  };

  const handleAddIconClick = async () => {
    if (!showComboBox) {
      await fetchUsers();
    }
    setShowComboBox(!showComboBox);
  };

  const handleAddUserToTeam = async () => {
    if (selectedUser && selectedTeam) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/UserIsInTeamRelation/add-user-team-relation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedUser,
            teamId: selectedTeam,
            createdDate: new Date().toISOString()
          })
        });

        const result = await response.json();
        if (result.isSuccess) {
          toast.success('Kullanıcı başarıyla eklendi!');
          await handleTeamClick(selectedTeam);
          setShowComboBox(false);
        } else {
          toast.success('Kullanıcı başarıyla eklendi!');
        }
      } catch (error) {
        console.error('Error adding user to team:', error);
        toast.error('Hata!!');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <TopBar user={{}} handleLogout={() => {}} />
      <div className="container mt-5">
        {error && <div>{error}</div>}
        <div className="row">
          <div className="col-md-4">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Takımlar</h2>
            <ul className="list-group">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className={`list-group-item d-flex justify-content-between align-items-center 
                    ${team.id === selectedTeam ? 'selected-team' : 'team-item'}`}
                  onClick={() => handleTeamClick(team.id)}
                  style={{
                    fontSize: '1.2rem',
                    padding: '15px',
                    cursor: 'pointer',
                    backgroundColor: team.id === selectedTeam ? '#f8f9fa' : '#ffffff'
                  }}
                >
                  {team.teamName}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-md-8">
            {selectedTeam && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Takımdaki Kişiler</h2>
                <table className="table" style={{ fontSize: '1.1rem', marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px' }}>İsim Soyisim</th>
                      <th style={{ padding: '12px' }}>Rol</th>
                      <th style={{ padding: '12px' }}>Eklenme Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.roles}</td>
                        <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <img
                  src={addIcon}
                  alt="Add"
                  className="add-icon"
                  onClick={handleAddIconClick}
                  style={{
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                />
                {showComboBox && (
                  <div style={{ marginTop: '20px' }}>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      style={{
                        height: '50px',
                        padding: '10px',
                        fontSize: '1rem',
                        border: '1px solid #ced4da',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="">Select User</option>
                      {userOptions.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddUserToTeam}
                      style={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        cursor: 'pointer',
                        marginTop: '10px'
                      }}
                    >
                      Add User
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default TeamsPage;
