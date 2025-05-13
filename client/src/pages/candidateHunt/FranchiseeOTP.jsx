import React, { useState } from 'react';

const FranchiseOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) {
            setError('OTP must be 6 digits.');
            return;
        }
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            alert('OTP verified successfully');
            // Proceed to dashboard or next step
        }, 1500);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-white">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="mb-5 text-indigo-800">Enter OTP</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full p-3 text-lg mb-5 border border-gray-300 rounded-md"
                    />
                    {error && (
                        <p className="text-red-600 text-sm mb-2">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-3 text-white font-bold rounded-md ${
                            loading
                                ? 'bg-gray-400'
                                : 'bg-indigo-800 hover:bg-indigo-700'
                        }`}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FranchiseOTP;
