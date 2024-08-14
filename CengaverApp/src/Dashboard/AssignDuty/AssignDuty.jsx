import TopBar from '../../Dashboard/TopBar'; 
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuardDutyAssignmentPage = () => {
    const [guardDuties, setGuardDuties] = useState([]);
    const [newGuardDuty, setNewGuardDuty] = useState({
        id: 0,
        startDate: '',
        endDate: '',
        wardenUserId: '',
        dateOfAssignment: '', // This will be set to current date on button click
        guardAssignedByUser: '' // This will be auto-filled
    });
    const [username, setUsername] = useState('');
    const [userNames, setUserNames] = useState([]); // List of user names
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch existing guard duties
        const fetchGuardDuties = async () => {
            try {
                const response = await fetch('https://localhost:7266/api/GuardDuties/get-guard-duties');
                const data = await response.json();
                setGuardDuties(data);
            } catch (error) {
                console.error('Error fetching guard duties:', error);
            }
        };

        fetchGuardDuties();
    }, []);

    useEffect(() => {
        // Fetch user names for the combo box
        const fetchUserNames = async () => {
            try {
                const response = await fetch('https://localhost:7266/api/Users/get-names');
                const data = await response.json();
                if (data.isSuccess) {
                    setUserNames(data.data);
                } else {
                    console.error('Error fetching user names:', data.errorMessage);
                }
            } catch (error) {
                console.error('Error fetching user names:', error);
            }
        };

        fetchUserNames();
    }, []);

    useEffect(() => {
        // Fetch username when wardenUserId changes
        const fetchUsername = async () => {
            if (newGuardDuty.wardenUserId) {
                try {
                    const response = await fetch(`https://localhost:7266/api/Users/get-username/${newGuardDuty.wardenUserId}`);
                    const data = await response.json();
                    if (data.isSuccess) {
                        setUsername(data.data);
                        setNewGuardDuty(prevState => ({
                            ...prevState,
                            guardAssignedByUser: data.data
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
            }
        };

        fetchUsername();
    }, [newGuardDuty.wardenUserId]);

    const fetchUserIdByName = async (name) => {
        try {
            const response = await fetch(`https://localhost:7266/api/Users/GetUserIdByName/${encodeURIComponent(name)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userId = await response.text(); // Read response as text
            if (userId) {
                setNewGuardDuty(prevState => ({
                    ...prevState,
                    wardenUserId: userId
                }));
            } else {
                console.error('No user ID received');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGuardDuty(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'guardAssignedByUser') {
            fetchUserIdByName(value); // Fetch user ID when name changes
        }
    };

    const handleAddGuardDuty = async () => {
        try {
            // Set dateOfAssignment to current date and time
            const currentDateTime = new Date().toISOString();
            setNewGuardDuty(prevState => ({
                ...prevState,
                dateOfAssignment: currentDateTime
            }));

            // Get the next ID
            const nextId = guardDuties.length > 0 ? Math.max(guardDuties.map(duty => duty.id)) + 1 : 1;
            setNewGuardDuty(prevState => ({
                ...prevState,
                id: nextId
            }));

            const response = await fetch('https://localhost:7266/api/GuardDuties/add-guard-duty', {
                method: 'POST', // Changed to POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newGuardDuty)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error('Error adding guard duty');
            }

            // Optionally, refresh the guard duties list
            const dataResponse = await fetch('https://localhost:7266/api/GuardDuties/get-guard-duties');
            const data = await dataResponse.json();
            setGuardDuties(data);

            // Clear form fields
            setNewGuardDuty({
                id: 0,
                startDate: '',
                endDate: '',
                wardenUserId: '',
                dateOfAssignment: '',
                guardAssignedByUser: ''
            });

            // Show success toast
            toast.success('Guard duty added successfully!');
        } catch (error) {
            console.error('Error adding guard duty:', error);
            // Show error toast
            toast.error('Failed to add guard duty.');
        }
    };

    const handleLogout = () => {
        // Clear local storage and navigate to login page
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <div>
            <TopBar user={{ isPermitted: 'admin' }} handleLogout={handleLogout} />
            <div className="container mt-5">
                <h2>Nöbet Atama</h2>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={newGuardDuty.startDate}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        value={newGuardDuty.endDate}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="wardenUserId">Warden User</label>
                    <select
                        id="wardenUserId"
                        name="guardAssignedByUser"
                        value={newGuardDuty.guardAssignedByUser}
                        onChange={handleInputChange}
                        className="form-control"
                    >
                        <option value="">Select a user</option>
                        {userNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddGuardDuty}>
                    Add Guard Duty
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default GuardDutyAssignmentPage;
