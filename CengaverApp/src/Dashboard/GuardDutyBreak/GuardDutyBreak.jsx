import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../../Dashboard/TopBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function GuardDutyBreak() {
    const [formData, setFormData] = useState({
        id: 0,
        userId: '',
        startDate: '',
        endDate: '',
        typeId: 1,
        dateOfClaim: ''
    });

    const [breakTypes, setBreakTypes] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setFormData(prevState => ({ ...prevState, userId }));

        const fetchBreakTypes = async () => {
            try {
                const response = await axios.get('https://localhost:7266/api/GuardDutyBreakTypes');
                setBreakTypes(response.data);
            } catch (error) {
                console.error('Error fetching break types:', error);
                toast.error('Error fetching break types.');
            }
        };

        fetchBreakTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDateOfClaim = () => {
        setFormData(prevState => ({
            ...prevState,
            dateOfClaim: new Date().toISOString()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleDateOfClaim();
        try {
            const response = await axios.post('https://localhost:7266/api/GuardDutyBreaks/add-guard-duty-break', formData);
            console.log('Response:', response.data);
            toast.success('İzin başarıyla alındı.');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Hata!! Tekrar deneyin.');
        }
    };

    return (
        <div>
            <TopBar user={{}} handleLogout={() => {}} />
            <form onSubmit={handleSubmit}>
                <h1>İzin Talebi Oluşturma</h1>
                <div>
                    <label htmlFor="startDate">İzin başlangıç:</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate">İzin bitiş:</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="typeId">Sebep:</label>
                    <select
                        id="typeId"
                        name="typeId"
                        value={formData.typeId}
                        onChange={handleChange}
                        required
                        style={{ height: '40px' }} 
                    >
                        {breakTypes.map(breakType => (
                            <option key={breakType.typeId} value={breakType.typeId}>
                                {breakType.typeName}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    type="hidden"
                    id="dateOfClaim"
                    name="dateOfClaim"
                    value={formData.dateOfClaim}
                />
                <button type="submit" onClick={handleDateOfClaim}>
                    İzin İste
                </button>
            </form>
            <ToastContainer /> {/* Add ToastContainer to render notifications */}
        </div>
    );
}

export default GuardDutyBreak;
