import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginSignup from './login-signup/loginSignup';
import Dashboard from './Dashboard/dashboard';
import UserPage from './Dashboard/usersPage/users';
import TeamsPage from './Dashboard/teams/teams';
import GuardDutiesPage from './Dashboard/GuardDutyList/GuardDutyList';
import GuardDutyAssignmentPage from './Dashboard/AssignDuty/AssignDuty';
import GuardDutyNotes from './Dashboard/DutyNote/DutyNotes';
import GuardDutiesUserPage from './Dashboard/GuardDutyList/UserDutyList';
import GuardDutyBreak from './Dashboard/GuardDutyBreak/GuardDutyBreak';
import TeamDutyList from './Dashboard/TeamDutyList/TeamDutyList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/users" element={<UserPage />} />
      <Route path="/dashboard/teams" element={<TeamsPage />} />
      <Route path="/dashboard/duty-list" element={<GuardDutiesPage />} />
      <Route path="/dashboard/guard-duty-assignment" element={<GuardDutyAssignmentPage />} />
      <Route path="/dashboard/duty-note" element={<GuardDutyNotes />} />
      <Route path="/dashboard/user-duty-list" element={<GuardDutiesUserPage />} />
      <Route path="/dashboard/duty-break" element={<GuardDutyBreak />} />
      <Route path="/dashboard/team-duty-list" element={<TeamDutyList />} />
      <Route path="*" element={<div>404 Not Found</div>} /> 
    </Routes>
  );
}

export default App;
