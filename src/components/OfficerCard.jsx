import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Clock } from 'lucide-react';

const OfficerCard = ({ officer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
      <img 
        src={officer.image} 
        alt={officer.name} 
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-100"
      />
      <h3 className="text-lg font-bold text-gray-900">{officer.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{officer.role} • {officer.department}</p>
      
      <div className="w-full grid grid-cols-3 gap-2 text-sm mb-4">
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
          <span className="font-bold text-gray-800">{officer.solved}</span>
          <span className="text-xs text-gray-500">Solved</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Star className="h-5 w-5 text-yellow-500 mb-1" />
          <span className="font-bold text-gray-800">{officer.rating}</span>
          <span className="text-xs text-gray-500">Rating</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-500 mb-1" />
          <span className="font-bold text-gray-800">{officer.avgTime}</span>
          <span className="text-xs text-gray-500">Avg Time</span>
        </div>
      </div>

      <Link to={`/officer/${officer.id}`} className="w-full block">
        <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium transition-colors">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default OfficerCard;
