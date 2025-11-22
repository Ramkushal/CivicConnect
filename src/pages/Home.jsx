import React, { useState } from 'react';
import { List, Filter } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { useData } from '../context/DataContext';

const Home = () => {
  const { issues, loading } = useData();
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Road', 'Waste', 'Water', 'Electricity'];

  if (loading) return <div className="p-8 text-center">Loading issues...</div>;

  const filteredIssues = filterCategory === 'All' 
    ? issues 
    : issues.filter(issue => issue.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Community Feed</h1>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Category Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>


        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};

export default Home;
