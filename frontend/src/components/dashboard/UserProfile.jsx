import { useState, useRef, useEffect } from "react";
import { 
  User, 
  Mail, 
  Camera, 
  X, 
  Save,
  Edit2,
  LogOut,
  Calendar,
  CheckCircle,
  Clock,
  Upload,
  AlertCircle,
  Check,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const UserProfile = ({ isOpen, onClose, stats }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Cloudinary config
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || ""
      });
      setImagePreview(user.profileImage || "");
    }
  }, [user]);

  const handleClose = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
    setImagePreview(user?.profileImage || "");
    setImageFile(null);
    setActiveTab('profile');
    setMobileMenuOpen(false);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return formData.profileImage;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "todo-app/profiles");

    try {
      setUploading(true);
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      throw new Error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let profileImageUrl = formData.profileImage;
      if (imageFile) {
        profileImageUrl = await uploadImageToCloudinary();
        if (!profileImageUrl) throw new Error("Image upload failed");
      }

      const result = await updateProfile({
        name: formData.name,
        email: formData.email,
        profileImage: profileImageUrl
      });

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setImageFile(null);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      profileImage: user?.profileImage || ""
    });
    setImagePreview(user?.profileImage || "");
    setImageFile(null);
    setError("");
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen || !user) return null;

  const completedTasks = stats?.completed || 0;
  const pendingTasks = stats?.pending || 0;
  const totalTasks = stats?.total || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div
        ref={modalRef}
        className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl animate-slideDown overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 sm:px-6 py-3 sm:py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Back Button */}
              {mobileMenuOpen ? (
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="sm:hidden w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-white">
                  {mobileMenuOpen ? 'Menu' : 'Profile Settings'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {mobileMenuOpen ? 'Navigate to sections' : 'Manage your account'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Mobile Tab Selector */}
          <div className="sm:hidden flex mt-3 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Tabs - Hidden on Mobile */}
        <div className="hidden sm:block border-b border-gray-200 px-6">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-slideDown">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-slideDown">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Left Column - Profile Image & Stats */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative group mb-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-xl">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                            {getInitials()}
                          </div>
                        )}
                      </div>
                      
                      {isEditing && (
                        <>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-lg hover:scale-110"
                          >
                            <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-white" />
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>

                    {uploading && (
                      <p className="text-xs sm:text-sm text-blue-600 mb-3 flex items-center gap-2">
                        <Upload className="h-3 w-3 sm:h-4 sm:w-4 animate-bounce" />
                        Uploading...
                      </p>
                    )}

                    {/* User info */}
                    {!isEditing && (
                      <div className="text-center mb-3">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
                      </div>
                    )}

                    {/* Edit button */}
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Stats - Mobile Horizontal Scroll */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Task Stats
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <Calendar className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="text-base sm:text-lg font-bold text-blue-700">{totalTasks}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 rounded-lg p-2">
                          <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-1" />
                          <p className="text-xs text-gray-600">Done</p>
                          <p className="text-base sm:text-lg font-bold text-green-700">{completedTasks}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 rounded-lg p-2">
                          <Clock className="h-4 w-4 mx-auto text-orange-600 mb-1" />
                          <p className="text-xs text-gray-600">Left</p>
                          <p className="text-base sm:text-lg font-bold text-orange-700">{pendingTasks}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Logout button */}
                    <button
                      onClick={logout}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </h4>

                  {!isEditing ? (
                    // View Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1 sm:mb-2">
                            Full Name
                          </label>
                          <p className="text-sm sm:text-base font-medium text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                            {user.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1 sm:mb-2">
                            Email
                          </label>
                          <p className="text-sm sm:text-base font-medium text-gray-900 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg break-all">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={loading || uploading}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {loading || uploading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={loading || uploading}
                          className="w-full sm:flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Change Password</h4>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  />
                  <button className="w-full bg-blue-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Dark Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            Todo Dashboard v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;