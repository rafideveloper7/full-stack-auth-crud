import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const { register, loading, error } = useAuth();

  // Cloudinary config
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log(`a: ${CLOUDINARY_UPLOAD_PRESET} and b: ${CLOUDINARY_URL}`);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simple validation
    if (!file.type.startsWith('image/')) {
      setLocalError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      setLocalError("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError("");

  // Validation
  if (!form.name || !form.email || !form.password) {
    setLocalError("All fields are required");
    return;
  }

  if (form.password.length < 8) {
    setLocalError("Password must be at least 8 characters");
    return;
  }

  // Upload image if selected
  let profileImage = "";
  if (imageFile) {
    const imageUrl = await uploadImage();
    if (!imageUrl) return;
    profileImage = imageUrl;
    console.log("🖼️ Image uploaded, URL:", profileImage);
  }

  // Data to send
  const registrationData = {
    name: form.name,
    email: form.email,
    password: form.password,
    profileImage: profileImage
  };

  console.log("📦 Sending to register:", registrationData);

  // Register with all data
  const result = await register(registrationData);
  
  console.log("📥 Register result:", result);
  
  if (result.success) {
    console.log("✅ Registration successful! User:", result.user);
  } else {
    console.log("❌ Registration failed:", result.error);
  }
};



  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">Join us and get started</p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{displayError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image - Simple */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                  <Camera className="h-3 w-3 text-white" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500">Optional profile picture</p>
              {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum 8 characters</p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-semibold">
                {loading || uploading ? "Please wait..." : "Create Account"}
              </span>
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;