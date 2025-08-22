import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  Mail,
  Trash2,
  Save,
  X,
} from "lucide-react";

const initialUserData = {
  name: "Jason Ranti",
  email: "jason.ranti@example.com",
  profile_picture: "https://via.placeholder.com/60",
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialUserData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState(() => {
    // Load theme preference from localStorage
    return {
      notifications: true,
      emailAlerts: true,
      darkMode: localStorage.getItem("theme") === "dark",
    };
  });
  const [errors, setErrors] = useState({});

  // ✅ Apply dark mode when preferences change
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [preferences.darkMode]);

  const validateForm = () => {
    const formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      formErrors.email = "Invalid email format";
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      if (passwordData.currentPassword.length < 6)
        formErrors.currentPassword =
          "Current password must be at least 6 characters";
      if (passwordData.newPassword.length < 6)
        formErrors.newPassword =
          "New password must be at least 6 characters";
      if (passwordData.newPassword !== passwordData.confirmPassword)
        formErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Saving settings:", {
        formData,
        passwordData,
        preferences,
      });
      alert("✅ Settings saved successfully!");
    }
  };

  const handleCancel = () => {
    setFormData(initialUserData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Account deletion requested");
      navigate("/login");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Manage your account, preferences, and security
        </p>
      </div>

      {/* Profile Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
          <User size={20} className="text-purple-600" />
          Profile Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center space-y-3">
            <img
              src={formData.profile_picture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover shadow"
            />
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition">
              Change Picture
            </button>
          </div>
          <div className="sm:col-span-2 space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                className={`w-full mt-1 p-2 rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white dark:bg-gray-700 dark:text-gray-100`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className={`w-full mt-1 p-2 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white dark:bg-gray-700 dark:text-gray-100`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
          <Bell size={20} className="text-purple-600" />
          Preferences
        </h2>
        <div className="space-y-5">
          {[
            { key: "notifications", label: "Enable Notifications" },
            { key: "emailAlerts", label: "Email Alerts" },
            { key: "darkMode", label: "Dark Mode" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.label}
              </span>
              <button
                className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${
                  preferences[item.key] ? "bg-purple-600" : "bg-gray-300"
                }`}
                onClick={() => handlePreferenceChange(item.key)}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    preferences[item.key] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Account Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
          <Lock size={20} className="text-purple-600" />
          Account Security
        </h2>
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={`w-full mt-1 p-2 rounded-md border ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white dark:bg-gray-700 dark:text-gray-100`}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>
          {/* New Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`w-full mt-1 p-2 rounded-md border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white dark:bg-gray-700 dark:text-gray-100`}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.newPassword}
              </p>
            )}
          </div>
          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full mt-1 p-2 rounded-md border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white dark:bg-gray-700 dark:text-gray-100`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Delete Account */}
          <div className="pt-4">
            <button
              className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          className="bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-700 text-sm px-5 py-2.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
          onClick={handleCancel}
        >
          <X size={16} /> Cancel
        </button>
        <button
          className="bg-purple-600 text-white text-sm px-5 py-2.5 rounded-md hover:bg-purple-700 transition flex items-center gap-2"
          onClick={handleSave}
        >
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
