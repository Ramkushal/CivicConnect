import React, { useState } from 'react';
import { Camera, MapPin, Upload, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const ReportIssue = () => {
  const navigate = useNavigate();
  const { createIssue } = useData();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    category: 'Road',
    description: '',
    severity: 'Medium',
    location: '',
    ward: '',
    area: '',
    latitude: null,
    longitude: null,
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Road', 'Waste', 'Water', 'Electricity', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    // Reverse Geocoding using OpenStreetMap Nominatim API
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    let address = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`; // Fallback
                    
                    if (data && data.address) {
                        const addr = data.address;
                        console.log('Nominatim Address Data:', addr); // Debugging

                        const areaName = addr.suburb || addr.neighbourhood || addr.residential || addr.village || '';
                        const city = addr.city || addr.town || addr.county || '';
                        
                        // Attempt to extract Ward
                        const wardName = addr.ward || addr.quarter || '';

                        if (areaName && city) {
                            address = `${areaName}, ${city}`;
                        } else if (data.display_name) {
                             // Fallback to a shorter version of display_name if specific fields are missing
                             address = data.display_name.split(',').slice(0, 3).join(',');
                        }

                        setFormData(prev => ({ 
                            ...prev, 
                            location: address,
                            latitude: latitude,
                            longitude: longitude,
                            ward: wardName, // Auto-fill Ward
                            area: areaName  // Auto-fill Area
                        }));
                    } else {
                        setFormData(prev => ({ 
                            ...prev, 
                            location: address,
                            latitude: latitude,
                            longitude: longitude
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    // Fallback to coords if API fails
                    setFormData({ 
                        ...formData, 
                        location: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
                        latitude: latitude,
                        longitude: longitude
                    });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Error getting location", error);
                alert("Could not get location. Please enter manually.");
                setIsLocating(false);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
        setIsLocating(false);
    }
  };

  const uploadImage = async (file) => {
    // Mock Upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return the local preview URL as the "uploaded" URL for mock purposes
    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);

    try {
        let photo_url = null;
        if (formData.image) {
            photo_url = await uploadImage(formData.image);
        }

        const newIssue = {
            user_id: user ? user.id : null, // Handle anonymous user
            category: formData.category,
            title: `${formData.category} Issue at ${formData.location.substring(0, 20)}...`, // Auto-generate title
            description: formData.description,
            priority: formData.severity, // Mapping form severity to db priority
            location: null, 
            address: formData.location,
            ward: formData.ward,
            area: formData.area,
            photo_url: photo_url,
            status: 'Pending'
        };

        if (formData.latitude && formData.longitude) {
             // Use WKT (Well-Known Text) format for PostGIS
             newIssue.location = `POINT(${formData.longitude} ${formData.latitude})`;
        } else {
            // Fallback for manual entry or legacy format
            const latLongMatch = formData.location.match(/Lat: ([0-9.-]+), Long: ([0-9.-]+)/);
            if (latLongMatch) {
                const lat = parseFloat(latLongMatch[1]);
                const long = parseFloat(latLongMatch[2]);
                newIssue.location = `POINT(${long} ${lat})`; 
            }
        }

        const { success, error } = await createIssue(newIssue);

        if (success) {
            alert('Issue Reported Successfully! (Mock)');
            navigate('/');
        } else {
            throw error;
        }

    } catch (error) {
        console.error('Error submitting issue:', error);
        alert('Failed to report issue. Please try again.');
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report a Civic Issue</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Photo</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="mx-auto h-64 object-cover rounded-md" />
                  <button 
                    type="button"
                    onClick={() => { setPreviewUrl(null); setFormData({...formData, image: null}); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ) : (
                <>
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Tap to fetch location or enter manually"
              className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLocating ? 'Locating...' : <><MapPin className="h-4 w-4 mr-2" /> Get GPS</>}
            </button>
          </div>
        </div>

        {/* Ward and Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ward Number</label>
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => setFormData({...formData, ward: e.target.value})}
              placeholder="e.g. Ward 10"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area / Locality</label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
              placeholder="e.g. Indiranagar"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <div className="flex space-x-4">
            {['Low', 'Medium', 'High'].map((level) => (
              <label key={level} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="severity"
                  value={level}
                  checked={formData.severity === level}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                />
                <span className="ml-2">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="Describe the issue..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {submitting ? <><Loader className="animate-spin h-5 w-5 mr-2" /> Submitting...</> : 'Submit Report'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ReportIssue;
