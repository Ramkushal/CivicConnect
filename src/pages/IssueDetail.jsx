import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft, CheckCircle, AlertCircle, Circle, Send, Upload, Camera, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { mockOfficers, mockComments, mockResolutions, mockStatusHistory, mockAssignments, mockUsers } from '../context/mockData';

import OfficerCard from '../components/OfficerCard';

const IssueDetail = () => {
  const { id } = useParams();
  const { issues, toggleVote, myVotes } = useData();
  const { user } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const commentsEndRef = useRef(null);

  // Resolution state
  const [resolution, setResolution] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionImage, setResolutionImage] = useState(null);
  const [resolutionPreview, setResolutionPreview] = useState(null);
  const [uploadingResolution, setUploadingResolution] = useState(false);
  
  // Resolution interactions
  const [resolutionComments, setResolutionComments] = useState([]);
  const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
  const [newResolutionComment, setNewResolutionComment] = useState('');
  const [resolutionVotes, setResolutionVotes] = useState(0);
  const [resolutionDislikes, setResolutionDislikes] = useState(0);
  const [userVoteType, setUserVoteType] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [assignedOfficer, setAssignedOfficer] = useState(null);
  const [showOfficerModal, setShowOfficerModal] = useState(false);

  // Find issue in real data
  const issue = issues.find(i => i.id === id || i.id === parseInt(id));
  const isVoted = issue && myVotes.has(issue.id);

  const handleVote = () => {
    if (!user) {
        alert("Please login to vote");
        return;
    }
    toggleVote(issue.id);
  };

  // Fetch comments
  useEffect(() => {
    if (!issue) return;

    const fetchComments = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const issueComments = mockComments.filter(c => c.issue_id === issue.id);
      setComments(issueComments);
      setLoadingComments(false);
    };

    fetchComments();
  }, [issue?.id]);

  // Fetch Resolution Data
  useEffect(() => {
    if (!issue || issue.status !== 'Solved') return;

    const fetchResolution = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const res = mockResolutions.find(r => r.issue_id === issue.id);
      
      if (res) {
        setResolution(res);
        // Mock interactions
        setResolutionComments([]); // Empty for now or add to mockData
        setResolutionVotes(5);
        setResolutionDislikes(0);
      } else {
        setResolution(null);
      }
    };

    fetchResolution();
  }, [issue?.id, issue?.status]);

  // Fetch Status History
  useEffect(() => {
    if (!issue) return;

    const fetchHistory = async () => {
      const history = mockStatusHistory.filter(h => h.issue_id === issue.id);
      setStatusHistory(history);
    };

    fetchHistory();
  }, [issue?.id]);

  // Fetch Assigned Officer
  useEffect(() => {
    if (!issue) return;

    const fetchAssignment = async () => {
        // 1. Check for direct assignment
        const assignment = mockAssignments.find(a => a.issue_id === issue.id);
        
        if (assignment) {
            const officer = mockOfficers.find(o => o.id === assignment.officer_id);
            if (officer) {
                const officerUser = mockUsers.find(u => u.id === officer.user_id);
                setAssignedOfficer({
                    id: officer.id,
                    name: officerUser ? officerUser.name : 'Unknown Officer',
                    role: officer.designation,
                    department: officer.department,
                    image: officerUser ? officerUser.profile_photo : null,
                    solved: officer.stats?.solved || 0,
                    rating: officer.stats?.rating || 'N/A',
                    avgTime: officer.stats?.avgTime || 'N/A',
                    users: { // Keep for backward compatibility if needed locally
                        name: officerUser ? officerUser.name : 'Unknown Officer',
                        profile_photo: officerUser ? officerUser.profile_photo : null,
                        email: officerUser ? officerUser.email : ''
                    }
                });
                return;
            }
        }

        // 2. Fallback: Find officer by matching ward/area from issue (if no direct assignment)
        const mockOfficer = mockOfficers.find(o => 
            (o.ward && o.ward === issue.ward) || 
            (o.area && o.area === issue.area)
        );
        
        if (mockOfficer) {
            const officerUser = mockUsers.find(u => u.id === mockOfficer.user_id);
            setAssignedOfficer({
                id: mockOfficer.id,
                name: officerUser ? officerUser.name : 'Officer',
                role: mockOfficer.designation,
                department: mockOfficer.department,
                image: officerUser ? officerUser.profile_photo : null,
                solved: mockOfficer.stats?.solved || 0,
                rating: mockOfficer.stats?.rating || 'N/A',
                avgTime: mockOfficer.stats?.avgTime || 'N/A',
                users: {
                    name: officerUser ? officerUser.name : 'Officer',
                    profile_photo: officerUser ? officerUser.profile_photo : null,
                    email: officerUser ? officerUser.email : ''
                }
            });
        } else {
            setAssignedOfficer(null);
        }
    };

    fetchAssignment();
  }, [issue?.id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      issue_id: issue.id,
      user_id: user.id,
      text: newComment.trim(),
      created_at: new Date().toISOString(),
      users: {
        name: user.name,
        role: user.role,
        profile_photo: user.profile_photo
      }
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePostResolutionComment = async (e) => {
    e.preventDefault();
    if (!newResolutionComment.trim() || !user || !resolution) return;

    const newCommentObj = {
        id: `rc${Date.now()}`,
        resolution_id: resolution.id,
        user_id: user.id,
        text: newResolutionComment.trim(),
        created_at: new Date().toISOString(),
        users: {
            name: user.name,
            role: user.role,
            profile_photo: user.profile_photo
        }
    };
      
    setResolutionComments(prev => [...prev, newCommentObj]);
    setNewResolutionComment('');
  };

  const handleResolutionVote = async (type) => {
    if (!user) {
      alert("Please login to vote.");
      return;
    }
    
    if (userVoteType === type) {
        setUserVoteType(null);
        if (type === 'up') setResolutionVotes(prev => prev - 1);
        else setResolutionDislikes(prev => prev - 1);
    } else {
        setUserVoteType(type);
        if (type === 'up') {
            setResolutionVotes(prev => prev + 1);
            if (userVoteType === 'down') setResolutionDislikes(prev => prev - 1);
        } else {
            setResolutionDislikes(prev => prev + 1);
            if (userVoteType === 'up') setResolutionVotes(prev => prev - 1);
        }
    }
  };

  const updateStatus = async (newStatus, photoUrl = null) => {
    // In a real mock app, we'd update the issue in DataContext or mockData
    // For now, we just alert and reload to simulate
    alert(`Status updated to ${newStatus} (Mock)`);
    // window.location.reload(); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResolutionImage(file);
      setResolutionPreview(URL.createObjectURL(file));
    }
  };

  const handleSolveIssue = async () => {
    if (!resolutionImage) {
      alert("Please upload a photo proof of resolution.");
      return;
    }

    setUploadingResolution(true);
    try {
      // Simulate Upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const publicUrl = resolutionPreview; // Use the preview URL as the "uploaded" URL

      // Create Mock Resolution
      const newResolution = {
          id: `r${Date.now()}`,
          issue_id: issue.id,
          officer_id: user.id,
          photo_url: publicUrl,
          description: "Issue resolved successfully."
      };
      
      setResolution(newResolution);
      
      // Update Issue Status
      await updateStatus('Solved', publicUrl);
      
      setShowResolutionModal(false);
    } catch (error) {
      console.error('Error uploading resolution photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingResolution(false);
    }
  };

  if (!issue) {
    return <div className="p-8 text-center text-gray-500">Issue not found.</div>;
  }

  const getStatusDate = (status) => {
    const entry = statusHistory.find(h => h.status === status);
    if (!entry) return null;
    return new Date(entry.changed_at).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const statusSteps = [
    { status: 'Pending', icon: Circle, color: 'text-yellow-500', label: 'Reported', date: getStatusDate('Pending') || new Date(issue.created_at).toLocaleDateString() },
    { status: 'In Progress', icon: AlertCircle, color: 'text-blue-500', label: 'Working', date: getStatusDate('In Progress') },
    { status: 'Solved', icon: CheckCircle, color: 'text-green-500', label: 'Resolved', date: getStatusDate('Solved') },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.status === issue.status);

  const isOfficer = user?.role === 'officer' || user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 relative">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Feed
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-64 md:h-96 relative">
            <img 
              src={issue.photo_url || issue.image} 
              alt={issue.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                  {issue.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
              </div>
              
              {/* Status Badge */}
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  issue.status === 'Solved' ? 'bg-green-100 text-green-800' : 
                  issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {issue.address || issue.location}
            </div>

            <p className="text-gray-700">{issue.description}</p>

            {/* Assigned Officer Display */}
            {assignedOfficer && (
              <div 
                onClick={() => setShowOfficerModal(true)}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  {assignedOfficer.image ? (
                    <img src={assignedOfficer.image} alt={assignedOfficer.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl">
                      {(assignedOfficer.name || 'O').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Assigned Officer</h4>
                  <p className="text-base font-semibold text-gray-900">{assignedOfficer.name}</p>
                  <p className="text-xs text-gray-600">{assignedOfficer.role} • {assignedOfficer.department}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-4">
                <button 
                    onClick={handleVote}
                    className={`flex items-center hover:text-blue-600 transition-colors ${isVoted ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                >
                  <ThumbsUp className={`h-5 w-5 mr-1 ${isVoted ? 'fill-current' : ''}`} />
                  <span>{issue.upvotes || 0} Upvotes</span>
                </button>
                <button 
                  onClick={() => document.getElementById('comment-input')?.focus()}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  <MessageSquare className="h-5 w-5 mr-1" />
                  <span>{comments.length} Comments</span>
                </button>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(issue.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Officer Actions */}
      {isOfficer && issue.status !== 'Solved' && (
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Update Status</h3>
            <p className="text-sm text-gray-500">Move this issue to the next stage of resolution.</p>
          </div>
          <div>
            {issue.status === 'Pending' && (
              <button 
                onClick={() => updateStatus('In Progress')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Mark In Progress
              </button>
            )}

            {issue.status === 'In Progress' && (
              <button 
                onClick={() => setShowResolutionModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                Mark Solved
              </button>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resolution Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              
              return (
                <div key={step.status} className="relative flex items-center ml-1">
                  <div className={`absolute left-0 p-1 rounded-full bg-white border-2 ${isActive ? step.color.replace('text', 'border') : 'border-gray-300'}`}>
                    <Icon className={`h-4 w-4 ${isActive ? step.color : 'text-gray-300'}`} />
                  </div>
                  <div className="ml-10">
                    <h4 className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.status}</h4>
                    {isActive && step.date && <p className="text-xs text-gray-500">{step.label}: {step.date}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resolution Photo Display & Interactions */}
      {issue.status === 'Solved' && (resolution || issue.resolution_photo_url) && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Proof of Resolution
            </h3>
          </div>
          
          <div className="bg-green-50 p-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img 
                src={resolution?.photo_url || issue.resolution_photo_url} 
                alt="Resolution" 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 flex flex-col">
              <div className="flex-1">
                <p className="text-gray-700 italic mb-4">
                  "{resolution?.description || 'Issue resolved successfully.'}"
                </p>
                
                {/* Only show interactions if resolution record exists */}
                {resolution ? (
                  <div className="flex items-center space-x-4 mb-6">
                    <button 
                      onClick={() => handleResolutionVote('up')}
                      className={`flex items-center px-4 py-2 rounded-full transition-colors border ${
                        userVoteType === 'up'
                          ? 'bg-green-100 text-green-700 border-green-200 font-bold' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsUp className={`h-5 w-5 mr-2 ${userVoteType === 'up' ? 'fill-current' : ''}`} />
                      {resolutionVotes}
                    </button>

                    <button 
                      onClick={() => handleResolutionVote('down')}
                      className={`flex items-center px-4 py-2 rounded-full transition-colors border ${
                        userVoteType === 'down'
                          ? 'bg-red-100 text-red-700 border-red-200 font-bold' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsDown className={`h-5 w-5 mr-2 ${userVoteType === 'down' ? 'fill-current' : ''}`} />
                      {resolutionDislikes}
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-md border border-yellow-100">
                    Interactions are disabled for this legacy resolution.
                  </div>
                )}
              </div>

              {/* Resolution Comments */}
              {resolution && (
                <div className="bg-white rounded-lg p-4 shadow-sm flex-1 flex flex-col">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Community Feedback</h4>
                  <div className="flex-1 overflow-y-auto max-h-40 space-y-3 mb-3">
                    {resolutionComments.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No feedback yet.</p>
                    ) : (
                      <>
                        {resolutionComments.slice(0, 3).map(c => (
                          <div key={c.id} className="text-sm">
                            <span className="font-semibold text-gray-800">{c.users?.name}: </span>
                            <span className="text-gray-600">{c.text}</span>
                          </div>
                        ))}
                        {resolutionComments.length > 6 && (
                          <button 
                            onClick={() => setShowAllCommentsModal(true)}
                            className="text-xs text-blue-600 hover:underline mt-2"
                          >
                            View all {resolutionComments.length} comments
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  {user && (
                    <form onSubmit={handlePostResolutionComment} className="flex gap-2">
                      <input 
                        type="text" 
                        value={newResolutionComment}
                        onChange={(e) => setNewResolutionComment(e.target.value)}
                        placeholder="Say thanks..." 
                        className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 border p-2"
                      />
                      <button 
                        type="submit"
                        disabled={!newResolutionComment.trim()}
                        className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Issue Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Discussion</h3>
        
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {loadingComments ? (
            <p className="text-gray-500 text-center">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to start the discussion!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  comment.users?.role === 'officer' ? 'bg-blue-100 text-blue-600' : 
                  comment.users?.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  {comment.users?.profile_photo ? (
                    <img src={comment.users.profile_photo} alt={comment.users.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    (comment.users?.name || 'U').charAt(0).toUpperCase()
                  )}
                </div>
                <div className={`p-3 rounded-lg flex-1 ${
                  comment.users?.role === 'officer' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${
                      comment.users?.role === 'officer' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {comment.users?.name || 'Unknown User'} 
                      {comment.users?.role === 'officer' && ' (Officer)'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{comment.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {user ? (
          <form onSubmit={handlePostComment} className="mt-4 flex gap-2">
            <input 
              id="comment-input"
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..." 
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
            />
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <div className="mt-4 text-center p-3 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">
              Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to join the discussion.
            </p>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Mark Issue as Solved</h3>
              <button onClick={() => setShowResolutionModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Please upload a photo as proof that this issue has been resolved.
            </p>

            <div className="mb-4">
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  {resolutionPreview ? (
                    <div className="relative">
                      <img src={resolutionPreview} alt="Preview" className="mx-auto h-48 object-cover rounded-md" />
                      <button 
                        type="button"
                        onClick={() => { setResolutionPreview(null); setResolutionImage(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="resolution-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a photo</span>
                          <input id="resolution-upload" name="resolution-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSolveIssue}
              disabled={uploadingResolution || !resolutionImage}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {uploadingResolution ? 'Uploading...' : 'Confirm Resolution'}
            </button>
          </div>
        </div>
      )}

      {/* All Comments Modal */}
      {showAllCommentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full h-[80vh] flex flex-col md:flex-row shadow-2xl">
            
            {/* Left Side: Image */}
            <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4 flex-shrink-0">
              <img 
                src={resolution?.photo_url || issue.resolution_photo_url} 
                alt="Resolution Proof" 
                className="max-w-full max-h-full object-contain rounded-md shadow-sm"
              />
            </div>

            {/* Right Side: Comments */}
            <div className="md:w-1/2 p-6 flex flex-col h-full bg-white overflow-hidden">
              <div className="flex justify-between items-center mb-4 border-b pb-2 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Community Feedback</h3>
                  <p className="text-xs text-gray-500">{resolutionComments.length} comments</p>
                </div>
                <button onClick={() => setShowAllCommentsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {resolutionComments.length === 0 ? (
                   <p className="text-center text-gray-500 italic mt-10">No comments yet.</p>
                ) : (
                  resolutionComments.map(c => (
                    <div key={c.id} className="text-sm border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                            c.users?.role === 'officer' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {(c.users?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className={`font-semibold ${c.users?.role === 'officer' ? 'text-blue-700' : 'text-gray-800'}`}>
                            {c.users?.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 pl-8">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}
      {/* Officer Modal */}
      {showOfficerModal && assignedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowOfficerModal(false)}>
          <div className="max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="relative">
                <button 
                    onClick={() => setShowOfficerModal(false)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>
                <OfficerCard officer={assignedOfficer} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetail;
