import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
const FranchiseResetOTP = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setMessage("OTP has been sent to your email address.");
            navigate('/franchisee-reset-password')
        }, 1500);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-white">
            <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full">
                <h2 className="text-center mb-5 text-indigo-900 font-semibold text-lg">
                    Reset Password - Request OTP
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 mb-4 border border-gray-300 rounded-md text-sm"
                    />
                    {error && (
                        <p className="text-red-600 text-center text-sm mb-3">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-600 text-center text-sm mb-3">{message}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-3 rounded-md font-bold text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-900 hover:bg-indigo-800"
                            }`}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FranchiseResetOTP;