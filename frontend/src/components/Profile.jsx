
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, MapPin, Lock, Edit2, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const Profile = () => {
  const { user: contextUser, login } = useAuth(); // Assuming login updates context
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '' // Only used when changing password
  });

  // Fetch fresh user details when the page loads
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      // Note: Make sure you have this route in your backend!
      const res = await axios.get("http://localhost:3000/api/users/profile", config);
      
      if (res.data.success) {
        const { name, email, address } = res.data.user;
        setFormData({ name: name || '', email: email || '', address: address || '', password: '' });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      
      // We only send the password if the user actually typed a new one
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ...(formData.password && { password: formData.password }) 
      };

      const res = await axios.put("http://localhost:3000/api/users/update", payload, config);
      
      if (res.data.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        setFormData({ ...formData, password: '' }); // clear password field
        // If your AuthContext needs updating (like if name changed)
        // login(res.data.user, localStorage.getItem("pos-token"));
        fetchProfile(); // Refresh data
      }
    } catch (error) {
      console.error("Update error", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50 flex justify-center items-start pt-10">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="px-8 pb-8">
          {/* Avatar Profile Picture */}
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={40} />
              </div>
            </div>
            
            {/* Edit / Cancel Buttons */}
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-md font-semibold"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset unsaved changes
                }}
                className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition font-semibold"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl text-gray-800 font-semibold">{formData.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email Address
                  </label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl text-gray-800 font-semibold">{formData.email}</p>
                  )}
                </div>

                {/* Address Field (Spans full width) */}
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                    <MapPin size={16} /> Address
                  </label>
                  {isEditing ? (
                    <textarea 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      rows="2"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-xl text-gray-800 font-semibold min-h-[3rem]">
                      {formData.address || "No address provided"}
                    </p>
                  )}
                </div>

                {/* Password Field - ONLY SHOWS IN EDIT MODE */}
                {isEditing && (
                  <div className="md:col-span-2 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <label className="text-sm font-bold text-orange-600 mb-2 flex items-center gap-2">
                      <Lock size={16} /> Change Password (Optional)
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <p className="text-xs text-orange-400 mt-2">Only fill this if you want to change your current password.</p>
                  </div>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="cursor-pointer flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition font-bold disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


