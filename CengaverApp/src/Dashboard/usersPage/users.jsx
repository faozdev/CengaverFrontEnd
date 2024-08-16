import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../main';
import TopBar from '../../Dashboard/TopBar'; 

const UserPage = () => {
  const [user, setUser] = useState({ name: null, role: null, isPermitted: null });
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login'); 
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('No user ID found');
        return;
      }

      try {
        const userRolesResponse = await fetch(`${API_BASE_URL}/api/UserRoles/get-user-roles-by-user/${userId}`);
        const userRoles = await userRolesResponse.json();
        const role = userRoles.length > 0 ? userRoles[0].role : null;

        if (role) {
          const permissionsResponse = await fetch(`${API_BASE_URL}/api/Permissions/get-permissions-by-role/${role.id}`);
          const permissions = await permissionsResponse.json();

          const isAdmin = permissions.some(permission => permission.userPermission === 'admin');

          const userNameResponse = await fetch(`${API_BASE_URL}/api/Users/get-username/${userId}`);
          const userNameData = await userNameResponse.json();
          const userName = userNameData.data || 'Unknown';

          setUser({
            name: userName,
            role: role.roleName,
            isPermitted: isAdmin ? 'admin' : 'user'
          });

          if (!isAdmin) {
            setError('Yetkili değilsin'); 
            return;
          }
          const usersResponse = await fetch(`${API_BASE_URL}/api/Users/get-users`);
          const usersData = await usersResponse.json();

          if (usersData && Array.isArray(usersData.data)) {
            setUsers(usersData.data); 
          } else {
            setError('Kullanıcı verisi hatalı');
          }
        } else {
          setError('No role found for user');
        }
      } catch (error) {
        console.error('Error fetching user data or permissions:', error);
        setError('An error occurred while fetching data.');
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div>{error}</div>;

  if (user.isPermitted === 'user') return <div>Loading...</div>;

  return (
    <div>
      <TopBar user={user} handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="user-list">
          <h2>Kullanıcılar</h2>
          <table className="table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Email</th>
                <th>Sicil No</th>
                <th>Kayit Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.userName}</td>
                  <td>{user.sicilNo}</td>
                  <td>{new Date(user.userRegistrationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;