import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [myVotes, setMyVotes] = useState(new Set()); // Set of issue IDs voted by user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data } = await client.get('/issues');
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's votes when user changes
  // Note: The current API doesn't have a dedicated "my votes" endpoint yet, 
  // but we can assume for now we track it locally or add an endpoint later.
  // For this implementation, we'll skip fetching 'myVotes' from server 
  // unless we add that endpoint. We can persist it in localStorage for now 
  // or rely on the issue object if it returns "voted_by_me" field.
  // Let's stick to local state for optimistic UI for now.
  useEffect(() => {
    if (!user) {
        setMyVotes(new Set());
    }
  }, [user]);

  const createIssue = async (formData) => {
    try {
      // formData should be a FormData object if containing files
      const { data } = await client.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setIssues([data, ...issues]);
      return { success: true };
    } catch (error) {
      console.error('Error creating issue:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create issue' };
    }
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
            // Handle BigInt or string IDs
            return { ...issue, upvotes: (issue.upvotes || 0) + (isVoted ? -1 : 1) };
        }
        return issue;
    }));

    try {
      await client.put(`/issues/${issueId}/upvote`);
      return { success: true };
    } catch (error) {
      console.error('Error voting:', error);
      // Revert on error
      if (isVoted) newVotes.add(issueId);
      else newVotes.delete(issueId);
      setMyVotes(newVotes);
      return { success: false, error: 'Failed to vote' };
    }
  };

  return (
    <DataContext.Provider value={{ issues, loading, createIssue, myVotes, toggleVote, fetchIssues }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
