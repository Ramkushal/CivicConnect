import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import IssueDetail from './pages/IssueDetail';
import Accountability from './pages/Accountability';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import IssueMap from './pages/IssueMap';
import OfficerProfile from './pages/OfficerProfile';
import AssignedIssues from './pages/AssignedIssues';

import { DataProvider } from './context/DataContext';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';



function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="upload" element={<ReportIssue />} />
              <Route path="issue/:id" element={<IssueDetail />} />
              <Route path="accountability" element={<Accountability />} />
              <Route path="assigned-issues" element={<AssignedIssues />} />
              <Route path="officer/:id" element={<OfficerProfile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="map" element={<IssueMap />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
