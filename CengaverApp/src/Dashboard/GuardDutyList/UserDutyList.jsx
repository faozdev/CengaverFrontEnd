import React, { useEffect, useState } from 'react';
import TopBar from '../../Dashboard/TopBar'; // If needed
import API_BASE_URL from '../../main'; 
import './GuardDutyList.css';

const UserDutyList = () => {
  const [guardDuties, setGuardDuties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuardDuties = async () => {
      const wardenUserId = localStorage.getItem('userId'); // Fetch the wardenUserId from localStorage
      if (!wardenUserId) {
        setError('Warden User ID is missing');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/GuardDuties/get-guard-duties-by-warden/${wardenUserId}`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setGuardDuties(data);
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

  return (
    <div>
      <TopBar user={{}} handleLogout={() => {}} /> {/* Include TopBar; replace with actual user data and logout handler */}

      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <h2>Guard Duties</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Warden User ID</th>
              <th>Date of Assignment</th>
              <th>Guard Assigned By</th>
            </tr>
          </thead>
          <tbody>
            {guardDuties.map((duty) => (
              <tr key={duty.id}>
                <td>{duty.id}</td>
                <td>{new Date(duty.startDate).toLocaleDateString()}</td>
                <td>{new Date(duty.endDate).toLocaleDateString()}</td>
                <td>{duty.wardenUserId}</td>
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
