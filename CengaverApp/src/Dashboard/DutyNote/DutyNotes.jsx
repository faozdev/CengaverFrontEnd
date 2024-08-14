import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../../Dashboard/TopBar';
import './DutyNotes.css';

const GuardDutyNotes = () => {
    const [guardDuties, setGuardDuties] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [noteTypeId, setNoteTypeId] = useState(1); // Default to Text
    const [noteTypes, setNoteTypes] = useState([
        { id: 1, name: 'Text' },
        { id: 2, name: 'Resim' },
        { id: 3, name: 'URL' },
        { id: 4, name: 'File' },
    ]);
    const [addedNotes, setAddedNotes] = useState([]);
    const [pendingNotes, setPendingNotes] = useState([]);

    useEffect(() => {
        const fetchGuardDuties = async () => {
            const wardenUserId = localStorage.getItem('userId');
            if (wardenUserId) {
                try {
                    const response = await axios.get(`https://localhost:7266/api/GuardDuties/get-guard-duties-by-warden/${wardenUserId}`);
                    setGuardDuties(response.data);
                    setPendingNotes(response.data.map(duty => ({
                        id: duty.id,
                        isAdded: false,
                    })));
                } catch (error) {
                    console.error('Error fetching guard duties:', error);
                }
            }
        };
        fetchGuardDuties();
    }, []);

    const handleAddNote = async (guardDutyId) => {
        const newNote = {
            id: 0,
            guardDutyId: guardDutyId,
            noteTypeId: noteTypeId,
            createdDate: new Date().toISOString(),
            content: noteContent,
            isDeleted: false,
        };

        try {
            await axios.post('https://localhost:7266/api/GuardDutyNotes/add-guard-duty-note', newNote);
            setAddedNotes(prev => [...prev, guardDutyId]);
            setPendingNotes(prev => prev.map(note =>
                note.id === guardDutyId ? { ...note, isAdded: true } : note
            ));
            alert('Note added successfully');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div>
            <TopBar user={{}} handleLogout={() => {}} /> {/* Adjust as needed */}
            <div className="container">
                <div className='Note-Add'>
                    <h1>Guard Duty Notes</h1>
                    <div>
                        <label>
                            Note Type:
                            <select value={noteTypeId} onChange={(e) => setNoteTypeId(parseInt(e.target.value))}>
                                {noteTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Enter note content"
                        />
                    </div>
                </div>
                <div className='Note-Listed'>
                    <div>
                        <h2>Not Bekleyenler</h2>
                        <ul>
                            {pendingNotes.filter(note => !note.isAdded).map(duty => (
                                <li key={duty.id}>
                                    <strong>Guard Duty ID:</strong> {duty.id}
                                    <button onClick={() => handleAddNote(duty.id)}>Add Note</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Not Eklenenler</h2>
                        <ul>
                            {addedNotes.map(id => (
                                <li key={id}>
                                    <strong>Guard Duty ID:</strong> {id}
                                    {/* Optionally, add additional info about the note here */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuardDutyNotes;
