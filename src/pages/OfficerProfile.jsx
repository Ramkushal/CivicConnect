import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, CheckCircle, Star, Clock, ArrowLeft } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { mockOfficers, mockAssignments, mockIssues, mockUsers } from '../context/mockData';

const OfficerProfile = () => {
  const { id } = useParams();
  const [officer, setOfficer] = useState(null);
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfficerDetails();
  }, [id]);

  const fetchOfficerDetails = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const officerData = mockOfficers.find(o => o.id === id);
      
      if (!officerData) {
        throw new Error("Officer not found");
      }

      // Join with User Data
      const userData = mockUsers.find(u => u.id === officerData.user_id);
      
      // Combine data
      const fullOfficer = {
        ...officerData,
        name: userData ? userData.name : 'Unknown Officer',
        email: userData ? userData.email : '',
        profile_photo: userData ? userData.profile_photo : null,
        // Use pre-defined stats or fallback
        stats: officerData.stats || {
            solved: 0,
            rating: 'N/A',
            avgTime: 'N/A'
        }
      };

      setOfficer(fullOfficer);

      // Fetch Assigned Issues
      // 1. Find assignments for this officer
      const assignments = mockAssignments.filter(a => a.officer_id === id);
      // 2. Get the issues from those assignments
      const issues = assignments.map(a => {
        const issue = mockIssues.find(i => i.id === a.issue_id);
        return issue ? { ...issue, assignment_status: a.status } : null;
      }).filter(i => i !== null);

      setAssignedIssues(issues);

    } catch (err) {
      console.error("Error fetching officer details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading officer profile...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  if (!officer) return <div className="text-center py-12 text-gray-500">Officer not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Back Button */}
      <div>
        <Link to="/accountability" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
            <div className="md:flex items-start space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                {officer.profile_photo ? (
                  <img 
                    src={officer.profile_photo} 
                    alt={officer.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <User className="h-16 w-16" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{officer.name}</h1>
                    <p className="text-blue-600 font-medium text-lg">
                      {officer.designation} • {officer.department}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        Responsible for: {officer.area_of_responsibility} ({officer.ward})
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {officer.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {officer.area}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex space-x-6 pt-4 border-t mt-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-green-600 font-bold text-xl">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            {officer.stats.solved}
                        </div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Issues Solved</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-yellow-500 font-bold text-xl">
                            <Star className="h-5 w-5 mr-1" />
                            {officer.stats.rating}
                        </div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Rating</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-blue-500 font-bold text-xl">
                            <Clock className="h-5 w-5 mr-1" />
                            {officer.stats.avgTime}
                        </div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Avg Time</span>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Assigned Issues */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Issues</h2>
        {assignedIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No active assignments found for this officer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerProfile;
