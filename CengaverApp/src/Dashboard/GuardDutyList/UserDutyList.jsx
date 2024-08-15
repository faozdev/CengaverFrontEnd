import React, { useEffect, useState } from 'react';
import TopBar from '../../Dashboard/TopBar'; // If needed
import API_BASE_URL from '../../main'; 
import './GuardDutyList.css';

const UserDutyList = () => {
  const [guardDuties, setGuardDuties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuardDuties = async () => {
      const wardenUserId = localStorage.getItem('userId'); 
      if (!wardenUserId) {
        setError('Hata');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/GuardDuties/get-guard-duties-by-warden/${wardenUserId}`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setGuardDuties(data);
        } else {
          setError('Nöbetçi verisi hatalı');
        }
      } catch (error) {
        console.error('Error fetching guard duties:', error);
        setError('An error occurred while fetching guard duties.');
      }
    };

    fetchGuardDuties();
  }, []);

  return (
    <div>
      <TopBar user={{}} handleLogout={() => {}} /> {/* Include TopBar; replace with actual user data and logout handler */}

      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <h2>Nöbetlerim</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nöbet Numarası</th>
              <th>Başlangıç Tarihi</th>
              <th>Bitiş Tarihi</th>
              <th>Nöbet Verilme Tarihi</th>
              <th>Nöbeti Tanımlayan Kişi</th>
            </tr>
          </thead>
          <tbody>
            {guardDuties.map((duty) => (
              <tr key={duty.id}>
                <td>{duty.id}</td>
                <td>{new Date(duty.startDate).toLocaleDateString()}</td>
                <td>{new Date(duty.endDate).toLocaleDateString()}</td>
                <td>{new Date(duty.dateOfAssignment).toLocaleDateString()}</td>
                <td>{duty.guardAssignedByUser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDutyList;
