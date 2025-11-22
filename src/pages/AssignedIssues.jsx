import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const AssignedIssues = () => {
  const { user } = useAuth();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/assignments/my-assignments');
      
      // Transform API response to match IssueCard expectations if needed
      // The API returns assignments with included issue details
      // We need to flatten this or update IssueCard. 
      // Let's map it to look like an issue object with assignment status
      const issues = data.map(assignment => ({
        ...assignment.issue,
        assignment_status: assignment.status,
        assignment_id: assignment.id
      }));

      setAssignedIssues(issues);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'officer') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">This page is only accessible to officers.</p>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        </div>
        <p className="text-gray-600">
          Track and manage the issues assigned to you.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading assignments...</div>
      ) : assignedIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignedIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Assignments</h3>
          <p className="text-gray-500">You don't have any active issue assignments at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
