import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockIssues, mockOfficers, mockAssignments, mockVotes } from './mockData';

import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [myVotes, setMyVotes] = useState(new Set()); // Set of issue IDs voted by user
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(true); 

  useEffect(() => {
    const fetchIssues = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setIssues(mockIssues);
      setLoading(false);
    };

    fetchIssues();
  }, []);

  // Fetch user's votes when user changes
  useEffect(() => {
    if (!user) {
        setMyVotes(new Set());
        return;
    }

    const fetchVotes = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const userVotes = mockVotes.filter(v => v.user_id === user.id).map(v => v.issue_id);
        setMyVotes(new Set(userVotes));
    };

    fetchVotes();
  }, [user]);

  const createIssue = async (newIssue) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockId = Math.floor(Math.random() * 10000);
    const mockIssue = { ...newIssue, id: mockId, created_at: new Date().toISOString(), upvotes: 0 };
    
    // Mock Assignment Logic
    const assignedOfficer = mockOfficers.find(o => 
      (o.ward && o.ward === newIssue.ward) || 
      (o.area && o.area === newIssue.area)
    );

    if (assignedOfficer) {
      console.log("Mock Assignment: Assigned to", assignedOfficer.designation);
      // In a real mock app, we'd push to a mockAssignments array state
    }

    setIssues([mockIssue, ...issues]);
    return { success: true };
  };

  const toggleVote = async (issueId) => {
    if (!user) return { success: false, error: 'User not logged in' };

    const isVoted = myVotes.has(issueId);
    
    // Optimistic Update
    const newVotes = new Set(myVotes);
    if (isVoted) {
        newVotes.delete(issueId);
    } else {
        newVotes.add(issueId);
    }
    setMyVotes(newVotes);

    setIssues(prevIssues => prevIssues.map(issue => {
        if (issue.id === issueId) {
            return { ...issue, upvotes: (issue.upvotes || 0) + (isVoted ? -1 : 1) };
        }
        return issue;
    }));

    return { success: true };
  };

  return (
    <DataContext.Provider value={{ issues, loading, createIssue, useMock, myVotes, toggleVote }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
