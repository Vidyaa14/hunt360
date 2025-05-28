import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Mail, Trash2, Save, X } from 'lucide-react';

const initialUserData = {
    name: 'Jason Ranti',
    email: 'jason.ranti@example.com',
    profile_picture: 'https://via.placeholder.com/60',
};

const SettingsPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialUserData);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [preferences, setPreferences] = useState({
        notifications: true,
        emailAlerts: true,
        darkMode: false,
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const formErrors = {};
        if (!formData.name.trim()) formErrors.name = 'Name is required';
        if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
            formErrors.email = 'Invalid email format';
        if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
            if (passwordData.currentPassword.length < 6)
                formErrors.currentPassword = 'Current password must be at least 6 characters';
            if (passwordData.newPassword.length < 6)
                formErrors.newPassword = 'New password must be at least 6 characters';
            if (passwordData.newPassword !== passwordData.confirmPassword)
                formErrors.confirmPassword = 'Passwords do not match';
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
            console.log('Saving settings:', { formData, passwordData, preferences });
            alert('Settings saved successfully!');
        }
    };

    const handleCancel = () => {
        setFormData(initialUserData);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('Account deletion requested');
            navigate('/login');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

            {/* Profile Settings */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <User size={18} className="text-purple-600" /> Profile Settings
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center">
                            <img
                                src={formData.profile_picture}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover mb-3"
                            />
                            <button className="text-sm text-purple-600 hover:text-purple-700">
                                Change Picture
                            </button>
                        </div>
                        <div className="sm:col-span-2 space-y-4">
                            <div>
                                <label className="text-sm text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleProfileChange}
                                    className={`w-full mt-1 p-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm`}
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleProfileChange}
                                    className={`w-full mt-1 p-2 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm`}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Preferences */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-purple-600" /> Preferences
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Enable Notifications</span>
                            <button
                                className={`w-10 h-5 rounded-full p-1 ${preferences.notifications ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                onClick={() => handlePreferenceChange('notifications')}
                            >
                                <div
                                    className={`w-3 h-3 bg-white rounded-full transform transition-transform ${preferences.notifications ? 'translate-x-5' : ''
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Email Alerts</span>
                            <button
                                className={`w-10 h-5 rounded-full p-1 ${preferences.emailAlerts ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                onClick={() => handlePreferenceChange('emailAlerts')}
                            >
                                <div
                                    className={`w-3 h-3 bg-white rounded-full transform transition-transform ${preferences.emailAlerts ? 'translate-x-5' : ''
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Dark Mode</span>
                            <button
                                className={`w-10 h-5 rounded-full p-1 ${preferences.darkMode ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                onClick={() => handlePreferenceChange('darkMode')}
                            >
                                <div
                                    className={`w-3 h-3 bg-white rounded-full transform transition-transform ${preferences.darkMode ? 'translate-x-5' : ''
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Settings */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Lock size={18} className="text-purple-600" /> Account Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className={`w-full mt-1 p-2 rounded-md border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm`}
                            />
                            {errors.currentPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className={`w-full mt-1 p-2 rounded-md border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm`}
                            />
                            {errors.newPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className={`w-full mt-1 p-2 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                        <div className="pt-2">
                            <button
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                onClick={handleDeleteAccount}
                            >
                                <Trash2 size={16} /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1"
                    onClick={handleCancel}
                >
                    <X size={16} /> Cancel
                </button>
                <button
                    className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                    onClick={handleSave}
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;