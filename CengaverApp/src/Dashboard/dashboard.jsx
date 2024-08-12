import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import userImage from '../assets/user-icon.png'; 

const user = {
  name: "John Doe"
};

const teams = [
  { name: "Team A", members: ["Alice", "Bob"] },
  { name: "Team B", members: ["Charlie", "David"] },
  { name: "Team C", members: ["Eve", "Frank"] },
  { name: "Team D", members: ["Grace", "Heidi"] }
];

const guardDuties = [
  { name: "Guard 1", dutyStart: "10.08.2024", dutyEnd: "11.08.2024" },
  { name: "Guard 2", dutyStart: "14.08.2024", dutyEnd: "15.08.2024" }
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
    <div className="container">
      <div className="fixed-top top-bar d-flex align-items-center bg-light p-3 border-bottom">
        <div className="col">
          <h1>Dashboard</h1>
        </div>
        <div className="col text-end">
          <img src={userImage} alt="Profile" className="profile-pic rounded-circle" />
        </div>
      </div>
      <div className="cards row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Kullanıcı Bilgileri</h5>
              <p className="card-text">Ad: {user.name}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-primary" onClick={() => scroll('left')}>{'<'}</button>
            <div className="team-cards d-flex overflow-auto" ref={teamCardsRef}>
              {teams.map((team, index) => (
                <div key={index} className="card team-card mr-3">
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <ul className="list-unstyled">
                      {team.members.map((member, memberIndex) => (
                        <li key={memberIndex}>{member}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => scroll('right')}>{'>'}</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2>Nöbetçilerin Listesi</h2>
          <table className="table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Nöbet Başlangıç</th>
                <th>Nöbet Bitiş</th>
              </tr>
            </thead>
            <tbody>
              {guardDuties.map((duty, index) => (
                <tr key={index}>
                  <td>{duty.name}</td>
                  <td>{duty.dutyStart}</td>
                  <td>{duty.dutyEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
