import React, { useEffect, useState } from 'react';
import TopBar from '../../Dashboard/TopBar';
import API_BASE_URL from '../../main'; 
import './GuardDutyList.css';
import removeIcon from '../../assets/remove.png';

const GuardDutiesPage = () => {
  const [guardDuties, setGuardDuties] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuardDuties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/GuardDuties/get-guard-duties`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setGuardDuties(data);
          // Fetch names for each wardenUserId
          const userIds = [...new Set(data.map(duty => duty.wardenUserId))];
          const nameRequests = userIds.map(id =>
            fetch(`${API_BASE_URL}/api/Users/get-username/${id}`)
              .then(response => response.json())
              .then(data => ({
                id,
                name: data.data
              }))
          );
          const nameResults = await Promise.all(nameRequests);
          const nameMap = nameResults.reduce((map, { id, name }) => {
            map[id] = name;
            return map;
          }, {});
          setUserNames(nameMap);
        } else {
          setError('Guard duties verisi hatalı');
        }
      } catch (error) {
        console.error('Error fetching guard duties:', error);
        setError('An error occurred while fetching guard duties.');
      }
    };

    fetchGuardDuties();
  }, []);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/GuardDuties/delete-guard-duty/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGuardDuties((prevDuties) => prevDuties.filter((duty) => duty.id !== id));
      } else {
        setError('Failed to delete guard duty.');
      }
    } catch (error) {
      console.error('Error deleting guard duty:', error);
      setError('An error occurred while deleting guard duty.');
    }
  };

  return (
    <div>
      <TopBar user={{}} handleLogout={() => {}} /> 
      <div className="container mt-5">
        {error && <div>{error}</div>}
        
        <h2>Nöbet Tablosu</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Başlama Tarihi</th>
              <th>Bitiş Tarihi</th>
              <th>İsim Soyisim</th> 
              <th>Atama Tarihi</th>
              <th>Atayan Kişi</th>
            </tr>
          </thead>
          <tbody>
            {guardDuties.map((duty) => (
              <tr key={duty.id}>
                <td>{new Date(duty.startDate).toLocaleDateString()}</td>
                <td>{new Date(duty.endDate).toLocaleDateString()}</td>
                <td>{userNames[duty.wardenUserId] || 'Loading...'}</td> 
                <td>{new Date(duty.dateOfAssignment).toLocaleDateString()}</td>
                <td>{duty.guardAssignedByUser}</td>
                <td>
                  <img
                    src={removeIcon}
                    alt="Remove"
                    className="remove-icon"
                    onClick={() => handleRemove(duty.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuardDutiesPage;
