import React, { useRef } from 'react';
import './dashboard.css'

const user = {
  name: "John Doe",
  profilePic: "https://via.placeholder.com/50"
};

const teams = [
    { name: "Team A", members: ["Alice", "Bob"] },
    { name: "Team B", members: ["Charlie", "David"] },
    { name: "Team C", members: ["Eve", "Frank"] },
    { name: "Team D", members: ["Grace", "Heidi"] }
  ];

const guardDuties = [
  { name: "Guard 1", duty: "Morning" },
  { name: "Guard 2", duty: "Afternoon" }
];

const Dashboard = () => {
    const teamCardsRef = useRef(null);

  const scroll = (direction) => {
    if (teamCardsRef.current) {
      const scrollAmount = 200;
      teamCardsRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="dashboard">
      <div className="top-bar">
        <h1>Dashboard</h1>
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
      </div>
      <div className="content">
        <div className="user-and-teams">
            <div className="card user-info">
            <h2>Kullanıcı Bilgileri</h2>
            <p>Ad: {user.name}</p>
            </div>
            <div className="team-section">
            <button className="scroll-button left" onClick={() => scroll('left')}>{'<'}</button>
            <div className="team-cards" ref={teamCardsRef}>
                {teams.map((team, index) => (
                <div key={index} className="card team-card">
                    <h2>{team.name}</h2>
                    <ul>
                    {team.members.map((member, memberIndex) => (
                        <li key={memberIndex}>{member}</li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            <button className="scroll-button right" onClick={() => scroll('right')}>{'>'}</button>
            </div>
        </div>
      </div>
      <div className="guard-duties">
          <h2>Nöbetçilerin Listesi</h2>
          <table>
            <thead>
              <tr>
                <th>İsim</th>
                <th>Nöbet</th>
              </tr>
            </thead>
            <tbody>
              {guardDuties.map((duty, index) => (
                <tr key={index}>
                  <td>{duty.name}</td>
                  <td>{duty.duty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default Dashboard;
