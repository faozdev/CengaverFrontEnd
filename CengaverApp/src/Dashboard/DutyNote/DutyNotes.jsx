import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../../Dashboard/TopBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './DutyNotes.css';

const GuardDutyNotes = () => {
    const [guardDuties, setGuardDuties] = useState([]);
    const [selectedDutyId, setSelectedDutyId] = useState(null);
    const [noteContent, setNoteContent] = useState('');
    const [noteTypeId, setNoteTypeId] = useState(0); 

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            axios.get(`https://localhost:7266/api/GuardDuties/get-guard-duties-by-warden/${userId}`)
                .then(response => {
                    setGuardDuties(response.data);
                })
                .catch(error => {
                    console.error('Error fetching guard duties:', error);
                    toast.error('Error fetching guard duties.');
                });
        }
    }, [userId]);

    const handleNoteSubmit = (e) => {
        e.preventDefault();

        if (selectedDutyId) {
            const newNote = {
                id: 0,
                guardDutyId: selectedDutyId,
                noteTypeId: 1,
                createdDate: new Date().toISOString(),
                content: noteContent,
                isDeleted: false
            };

            axios.post('https://localhost:7266/api/GuardDutyNotes/add-guard-duty-note', newNote)
                .then(response => {
                    console.log('Not başarıyla eklendi!:', response.data);
                    toast.success('Not başarıyla eklendi!');
                    setNoteContent(''); 
                })
                .catch(error => {
                    console.error('Hata!: ', error);
                    toast.error('Hata!: ');
                });
        }
    };

    return (
        <div className="container">
            <TopBar user={{}} handleLogout={() => {}} /> {/* Adjust as needed */}

            <div className="content">
                <div className="guard-duties-list">
                    {guardDuties.map(duty => (
                        <div key={duty.id} className="guard-duty">
                            <p>Başlangıç Tarihi: {new Date(duty.startDate).toLocaleDateString()}</p>
                            <p>Bitiş Tarihi: {new Date(duty.endDate).toLocaleDateString()}</p>
                            <button className="add-note-button" onClick={() => setSelectedDutyId(duty.id)}>Not Ekle</button>
                        </div>
                    ))}
                </div>

                {selectedDutyId && (
                    <form onSubmit={handleNoteSubmit} className="note-form">
                        <h2>Not</h2>
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Notunuzu buraya yazınız..."
                            required
                        />
                        <button type="submit">Gönder</button>
                    </form>
                )}
            </div>

            <ToastContainer /> {/* Add ToastContainer to render notifications */}
        </div>
    );
};

export default GuardDutyNotes;
    