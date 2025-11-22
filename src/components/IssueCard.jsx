import React from 'react';
import { MapPin, Clock, ThumbsUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Solved': 'bg-green-100 text-green-800',
};

const IssueCard = ({ issue }) => {
  const { toggleVote, myVotes } = useData();
  const { user } = useAuth();
  const isVoted = myVotes.has(issue.id);

  const handleVote = (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) {
        alert("Please login to vote");
        return;
    }
    toggleVote(issue.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={issue.photo_url || issue.image} 
          alt={issue.title} 
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status] || 'bg-gray-100 text-gray-800'}`}>
          {issue.status}
        </span>
        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {issue.category}
        </span>
      </div>
      <div className="p-4">
        <Link to={`/issue/${issue.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 truncate">{issue.title}</h3>
        </Link>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate mr-2">{issue.address || issue.location}</span>
          <span>({issue.distance})</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {issue.description}
        </p>
        <div className="flex items-center justify-between text-gray-400 text-sm border-t pt-3">
          <div className="flex items-center space-x-4">
            <button 
                onClick={handleVote}
                className={`flex items-center hover:text-blue-600 transition-colors ${isVoted ? 'text-blue-600 font-bold' : ''}`}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${isVoted ? 'fill-current' : ''}`} />
              {issue.upvotes || 0}
            </button>
            <Link to={`/issue/${issue.id}`} className="flex items-center hover:text-blue-600 transition-colors">
              <MessageSquare className="h-4 w-4 mr-1" />
              {issue.comments?.[0]?.count || 0}
            </Link>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(issue.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
