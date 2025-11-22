import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import OfficerCard from '../components/OfficerCard';
import { mockOfficers, mockAssignments, mockIssues, mockUsers } from '../context/mockData';

const Accountability = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Accountability component mounted");
    fetchOfficersData();
  }, []);

  const fetchOfficersData = async () => {
    console.log("Fetching officers data...");
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("Mock Officers:", mockOfficers);
      if (!mockOfficers) {
        throw new Error("mockOfficers is undefined or null");
      }

      // Process Data from Mock Data
      const processedOfficers = mockOfficers.map(officer => {
        // Find the user details for this officer
        const user = mockUsers.find(u => u.id === officer.user_id);
        const officerName = user ? user.name : "Unknown Officer";
        const officerImage = user ? user.profile_photo : null;

        // Use pre-defined stats from mockData if available for a populated look
        if (officer.stats) {
          return {
            id: officer.id,
            name: officerName,
            role: officer.designation,
            department: officer.department,
            solved: officer.stats.solved,
            rating: officer.stats.rating,
            avgTime: officer.stats.avgTime,
            image: officerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(officerName)}&background=random`,
          };
        }

        // Fallback: Calculate from assignments (if no static stats)
        const myAssignments = mockAssignments.filter(a => a.officer_id === officer.id);
        
        // Calculate Solved: Count assignments where the LINKED ISSUE is 'Solved'
        const solvedCount = myAssignments.filter(a => {
            const issue = mockIssues.find(i => i.id === a.issue_id);
            return issue && issue.status === 'Solved';
        }).length;

        // Calculate Rating (Random fallback)
        const rating = (4.0 + Math.random()).toFixed(1);

        return {
          id: officer.id,
          name: officerName,
          role: officer.designation,
          department: officer.department,
          solved: solvedCount,
          rating: rating,
          avgTime: '2d', // Placeholder
          image: officerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(officerName)}&background=random`,
        };
      });

      console.log("Processed Officers:", processedOfficers);
      setOfficers(processedOfficers);

    } catch (error) {
      console.error("Error fetching accountability data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOfficers = officers.filter(officer => 
    (officer.name && officer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (officer.department && officer.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 text-xl font-bold mb-2">Something went wrong</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transparency Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We believe in open governance. Track the performance of our civic officers and see how they are serving the community.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Top Performing Officers</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search officers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading officers...</div>
      ) : filteredOfficers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredOfficers.map(officer => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No officers found.</div>
      )}
    </div>
  );
};

export default Accountability;
