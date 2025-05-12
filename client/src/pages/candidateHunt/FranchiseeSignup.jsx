import React, { useState } from "react";

const FranchiseSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.email.includes("@")) newErrors.email = "Enter a valid email.";
        if (formData.phone.length < 10) newErrors.phone = "Enter a valid phone number.";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setSubmitted(true);
            setTimeout(() => {
                alert("Franchise signup successful!");
                setSubmitted(false);
                setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
            }, 1500);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-white">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Franchise Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600"
                        />
                        {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600"
                        />
                        {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600"
                        />
                        {errors.phone && <span className="text-red-600 text-sm">{errors.phone}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600"
                        />
                        {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600"
                        />
                        {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword}</span>}
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="mr-2"
                        />
                        <label htmlFor="showPassword" className="text-gray-700 select-none">Show Password</label>
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md text-white font-semibold ${submitted ? "bg-gray-400 cursor-not-allowed" : "bg-purple-800 hover:bg-purple-700"
                            }`}
                        disabled={submitted}
                    >
                        {submitted ? "Submitting..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FranchiseSignup;