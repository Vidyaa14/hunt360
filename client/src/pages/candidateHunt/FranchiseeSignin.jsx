import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye as FaEye, EyeClosed as FaEyeSlash } from "lucide-react";

const BACKEND_URL = `https://saarthi360-backend.vercel.app/api/candidate`;


const FranchiseSignin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organization, setOrganization] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const setupEnterKeyNavigation = () => {
            const inputFields = document.querySelectorAll("#email, #password, #organization");
            inputFields.forEach((field, index) => {
                field.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        if (index < inputFields.length - 1) {
                            inputFields[index + 1].focus();
                        } else {
                            signIn();
                        }
                    }
                });
            });
        };
        setupEnterKeyNavigation();
    }, []);

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            displayError("Invalid email format. Please enter a valid email.");
            return false;
        }
        return true;
    };

    const displayError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(""), 3000);
    };

    const setLoadingState = (isLoading) => {
        setLoading(isLoading);
    };

    const signIn = () => {
        if (!email || !password || !organization) {
            displayError("All fields are required");
            return;
        }
        if (!validateEmail()) return;

        setErrorMessage("");
        setLoadingState(true);

        fetch(`${BACKEND_URL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.trim().toLowerCase(),
                password,
                organization: organization.trim(),
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setTimeout(() => {
                        navigate(`/dashboard?org=${result.org}`);
                    }, 3000);
                } else {
                    setTimeout(() => {
                        setLoadingState(false);
                        displayError(result.error);
                    }, 2000);
                }
            })
            .catch((error) => {
                setTimeout(() => {
                    setLoadingState(false);
                    displayError("An unexpected error occurred: " + error.message);
                }, 2000);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <img src="/logo.png" alt="Talent Corner" className="w-20 mx-auto mb-4 mt-1" />

                {/* Spinner */}
                {loading && (
                    <div
                        className="absolute top-1/2 left-1/2 w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin -translate-x-1/2 -translate-y-1/2 z-50"
                        aria-label="Loading"
                    ></div>
                )}

                <h1 className="text-2xl font-bold text-purple-800 mb-2 text-center">Sign In</h1>
                <p className="text-gray-600 mb-4 text-center">Please enter your details to sign in.</p>
                {errorMessage && (
                    <div className="text-red-600 bg-red-200 rounded p-2 mb-4 text-center">{errorMessage}</div>
                )}

                <form
                    id="myForm"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        signIn();
                    }}
                >
                    <input
                        type="email"
                        id="email"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-full text-center focus:outline-none focus:border-purple-600 focus:ring focus:ring-purple-200"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                    />

                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="w-full p-3 border border-gray-300 rounded-full text-center focus:outline-none focus:border-purple-600 focus:ring focus:ring-purple-200"
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-purple-700 select-none"
                        >
                            {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                        </span>
                    </div>

                    <input
                        type="text"
                        id="organization"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-full text-center focus:outline-none focus:border-purple-600 focus:ring focus:ring-purple-200"
                        placeholder="Enter your Organization Name"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                    />

                    <input
                        type="submit"
                        value="Sign In"
                        className={`w-full p-3 rounded-full text-white text-lg font-semibold cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
                            }`}
                        disabled={loading}
                    />
                </form>

                <button
                    id="signUpButton"
                    className={`w-full mt-4 p-3 rounded-full text-white text-lg font-semibold cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
                        }`}
                    onClick={() => navigate("/franchisee-signup")}
                    disabled={loading}
                >
                    Don't have an account? Sign Up
                </button>

                <div className="mt-4 text-center">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/franchisee-reset-otp");
                        }}
                        className="text-purple-700 hover:underline text-sm"
                    >
                        Forgot Password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FranchiseSignin;