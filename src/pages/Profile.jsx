import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2, LogOut } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { issues } = useData();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    profile_photo: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fetchProfile = async () => {
    if (user) {
      const userData = {
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        phone: user.phone || '',
        area: user.area || '',
        role: user.role || 'citizen',
        department: user.department || '',
        profile_photo: user.profile_photo || ''
      };
      setProfile(userData);
      setFormData({
        name: userData.name,
        phone: userData.phone,
        area: userData.area,
        profile_photo: userData.profile_photo
      });
    }
    setLoading(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let photoUrl = formData.profile_photo;

      // 1. Upload new photo if selected (Mock)
      if (photoFile) {
        photoUrl = URL.createObjectURL(photoFile);
      }

      // 2. Update local state
      const updates = {
        name: formData.name,
        phone: formData.phone,
        area: formData.area,
        profile_photo: photoUrl
      };

      setProfile({ ...profile, ...updates });
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      
      // In a real app, we'd update the AuthContext user here too
      // For now, just alert
      alert('Profile updated successfully! (Mock)');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Please Log In</h2>
        <p className="text-gray-500 mt-2">You need to be logged in to view your profile.</p>
        <Link to="/login" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
  }

  // Filter issues reported by this user
  const myReports = issues.filter(issue => issue.user_id === user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Profile Header / Edit Form */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          {!isEditing ? (
            // View Mode
            <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                {profile?.profile_photo ? (
                  <img 
                    src={profile.profile_photo} 
                    alt={profile.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <User className="h-16 w-16" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile?.name || 'User'}</h1>
                    <p className="text-blue-600 font-medium capitalize">
                      {profile?.role || 'Citizen'} {profile?.department ? `• ${profile.department}` : ''}
                    </p>
                  </div>
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-gray-600">
                  <div className="flex items-center justify-center md:justify-start">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    {profile?.email}
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center justify-center md:justify-start">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      {profile.phone}
                    </div>
                  )}
                  {profile?.area && (
                    <div className="flex items-center justify-center md:justify-start">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      {profile.area}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(false); setPhotoPreview(null); setPhotoFile(null); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="md:flex gap-8">
                {/* Photo Upload */}
                <div className="md:w-1/3 flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <img 
                      src={photoPreview || profile?.profile_photo || 'https://via.placeholder.com/150'} 
                      alt="Profile Preview" 
                      className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                    />
                    <label htmlFor="photo-upload" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105">
                      <Camera className="h-5 w-5" />
                      <input 
                        id="photo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Click camera icon to change</p>
                </div>

                {/* Fields */}
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area / Locality</label>
                    <input 
                      type="text" 
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      placeholder="e.g. Indiranagar, Bangalore"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                  </div>

                  <div className="pt-4 flex justify-end space-x-3">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* My Reports */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Reports</h2>
        {myReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myReports.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">You haven't reported any issues yet.</p>
            <Link to="/upload" className="mt-4 inline-block text-blue-600 hover:text-blue-500 font-medium">
              Report an Issue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
