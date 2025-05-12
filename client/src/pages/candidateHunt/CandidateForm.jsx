import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'https://saarthi360-backend.vercel.app/api/candidate';

const stateCityMap = {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Mangalore', 'Hubli'],
    TamilNadu: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirapalli'],
};

const jobDomainMap = {
    'Information Technology': [
        'Software Development', 'Data Analysis', 'Cyber Security', 'UI/UX Design',
        'Network Administration', 'Cloud Computing', 'DevOps', 'Database Management',
        'Web Development', 'Mobile App Development'
    ],
    'Healthcare': [
        'Nursing', 'Medical Research', 'Pharmacy', 'Healthcare Administration',
        'Physical Therapy', 'Occupational Therapy', 'Radiology', 'Public Health',
        'Health Informatics', 'Clinical Psychology'
    ],
    'Finance': [
        'Financial Analysis', 'Investment Banking', 'Accounting', 'Risk Management',
        'Insurance', 'Tax Consulting', 'Financial Planning', 'Corporate Finance',
        'Wealth Management', 'Auditing'
    ],
    'Education': [
        'Teaching', 'Curriculum Development', 'Educational Administration',
        'Special Education', 'Instructional Design', 'E-Learning Development',
        'Educational Technology', 'School Counseling', 'Adult Education', 'Tutoring'
    ],
    'Engineering': [
        'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
        'Chemical Engineering', 'Aerospace Engineering', 'Industrial Engineering',
        'Software Engineering', 'Environmental Engineering', 'Structural Engineering',
        'Robotics Engineering'
    ],
    'Marketing': [
        'Digital Marketing', 'Content Marketing', 'SEO Specialist', 'Brand Management',
        'Market Research', 'Social Media Management', 'Email Marketing', 'Product Marketing',
        'Advertising', 'Public Relations'
    ],
    'Sales': [
        'Sales Management', 'Business Development', 'Account Management', 'Retail Sales',
        'Inside Sales', 'Outside Sales', 'Sales Operations', 'Lead Generation',
        'Sales Training', 'Customer Success'
    ],
    'Human Resources': [
        'Recruitment', 'Employee Relations', 'Training and Development',
        'Compensation and Benefits', 'HR Consulting', 'Talent Management',
        'Organizational Development', 'HR Information Systems', 'Labor Relations',
        'Diversity and Inclusion'
    ],
    'Manufacturing': [
        'Production Management', 'Quality Assurance', 'Supply Chain Management',
        'Process Engineering', 'Manufacturing Engineering', 'Lean Manufacturing',
        'Industrial Design', 'Operations Management', 'Logistics', 'Inventory Management'
    ],
    'Retail': [
        'Store Management', 'Visual Merchandising', 'Inventory Control', 'Customer Service',
        'E-commerce Management', 'Retail Marketing', 'Sales Associate', 'Loss Prevention',
        'Buying and Merchandising', 'Product Management'
    ]
};

const CandidateForm = () => {
    const navigate = useNavigate();
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [subDomains, setSubDomains] = useState([]);
    const [tokenValid, setTokenValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = new URLSearchParams(window.location.search).get('token');

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        dob: '',
        gender: '',
        currentLocation: '',
        pincode: '',
        state: '',
        city: '',
        country: '',
        emergencyContactNumber: '',
        emergencyContactName: '',
        emergencyContactRelation: '',
        highestQualification: '',
        degree: '',
        courseName: '',
        college: '',
        university: '',
        yearOfPassing: '',
        marks: '',
        desiredJobDomain: '',
        desiredJobSubdomain: '',
        internshipExperience: '',
        skills: '',
        resumeLink: '',
    });

    const years = useMemo(() => Array.from({ length: 2090 - 2000 + 1 }, (_, index) => 2000 + index), []);

    useEffect(() => {
        setStates(Object.keys(stateCityMap));

        const validateToken = async () => {
            if (!token) {
                setTokenValid(false);
                setError('No access token provided.');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/verifyToken`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                setTokenValid(data.success);
                if (!data.success) {
                    setError(data.error || 'Invalid or expired token.');
                }
            } catch (err) {
                setTokenValid(false);
                setError('Failed to validate token. Please try again.');
                console.error('Token validation error:', err);
            }
        };

        validateToken();
    }, [token]);

    const handleStateChange = useCallback((e) => {
        const selectedState = e.target.value;
        setFormData((prev) => ({ ...prev, state: selectedState }));
        setCities(stateCityMap[selectedState] || []);
    }, []);

    const handleJobDomainChange = useCallback((e) => {
        const domain = e.target.value;
        setFormData((prev) => ({ ...prev, desiredJobDomain: domain }));
        setSubDomains(jobDomainMap[domain] || []);
    }, []);

    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setResumeFileName(file.name);
        }
    }, []);

    const handleClearForm = useCallback(() => {
        setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            dob: '',
            gender: '',
            currentLocation: '',
            pincode: '',
            state: '',
            city: '',
            country: '',
            emergencyContactNumber: '',
            emergencyContactName: '',
            emergencyContactRelation: '',
            highestQualification: '',
            degree: '',
            courseName: '',
            college: '',
            university: '',
            yearOfPassing: '',
            marks: '',
            desiredJobDomain: '',
            desiredJobSubdomain: '',
            internshipExperience: '',
            skills: '',
            resumeLink: '',
        });
        setResumeFile(null);
        setResumeFileName('');
        setCities([]);
        setSubDomains([]);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formPayload = new FormData();
            formPayload.append('token', token);
            formPayload.append('Full_Name', `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim());
            formPayload.append('Email', formData.email);
            formPayload.append('Phone_No', formData.contactNumber);
            formPayload.append('Domain', formData.desiredJobDomain);
            formPayload.append('Sub_Domain', formData.desiredJobSubdomain);
            formPayload.append('dob', formData.dob);
            formPayload.append('gender', formData.gender);
            formPayload.append('location', formData.currentLocation);
            formPayload.append('pincode', formData.pincode);
            formPayload.append('state', formData.state);
            formPayload.append('city', formData.city);
            formPayload.append('country', formData.country);
            formPayload.append('emergencyPhone', formData.emergencyContactNumber);
            formPayload.append('contactName', formData.emergencyContactName);
            formPayload.append('contactRelation', formData.emergencyContactRelation);
            formPayload.append('highestQualification', formData.highestQualification);
            formPayload.append('degree', formData.degree);
            formPayload.append('courseName', formData.courseName);
            formPayload.append('collegeName', formData.college);
            formPayload.append('universityName', formData.university);
            formPayload.append('yearOfPassing', formData.yearOfPassing);
            formPayload.append('marks', formData.marks);
            formPayload.append('internship_experience', formData.internshipExperience);
            formPayload.append('skills', formData.skills);

            if (resumeFile) {
                formPayload.append('resume', resumeFile);
            } else {
                formPayload.append('resume_url', formData.resumeLink);
            }

            const response = await fetch(`${BACKEND_URL}/submitCandidate`, {
                method: 'POST',
                credentials: 'include',
                body: formPayload,
            });

            const data = await response.json();

            if (data.success) {
                navigate('/form-success');
            } else {
                throw new Error(data.error || 'Failed to submit candidate data.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError('Failed to submit the form. Please try again.');
            navigate('/form-error');
        } finally {
            setLoading(false);
        }
    }, [formData, resumeFile, token, navigate]);

    if (tokenValid === null) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
                <div className="text-center text-gray-600 font-bold" role="alert">
                    Validating token...
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
                <div className="text-center text-red-600 font-bold" role="alert">
                    ⚠️ Access Denied: {error || 'No access token provided or token already used.'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
            <header className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <img
                    src="/logo.png"
                    alt="Talent Corner Logo"
                    className="h-12"
                    aria-hidden="true"
                />
                <h1 className="text-2xl font-bold text-[#680f91] bg-gradient-to-r from-[#680f91] to-[#9d48a8] bg-clip-text">
                    Talent Corner HR Services Pvt. Ltd
                </h1>
            </header>

            {error && (
                <div
                    className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-bold mb-4"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <h2 className="text-3xl font-bold text-[#680f91]">Candidate Form</h2>

                <section className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-[#680f91] mb-4">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="First Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="middleName" className="text-sm font-medium text-gray-700 mb-1">
                                Middle Name
                            </label>
                            <input
                                type="text"
                                id="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                aria-label="Middle Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Last Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                                Email ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="abc@gmail.com"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Email ID"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 mb-1">
                                Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Contact Number"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-1">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Date of Birth"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Gender"
                            >
                                <option value="">Select</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="currentLocation" className="text-sm font-medium text-gray-700 mb-1">
                                Current Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="currentLocation"
                                value={formData.currentLocation}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Current Location"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="pincode" className="text-sm font-medium text-gray-700 mb-1">
                                Pin Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                placeholder="Eg: 421202"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Pin Code"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="state" className="text-sm font-medium text-gray-700 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="state"
                                value={formData.state}
                                onChange={handleStateChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="State"
                            >
                                <option value="">Select</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="City"
                            >
                                <option value="">Select</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="country" className="text-sm font-medium text-gray-700 mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Country"
                            >
                                <option value="">Select</option>
                                <option value="India">India</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="emergencyContactNumber" className="text-sm font-medium text-gray-700 mb-1">
                                Emergency Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="emergencyContactNumber"
                                value={formData.emergencyContactNumber}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Emergency Contact Number"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700 mb-1">
                                Contact Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Emergency Contact Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="emergencyContactRelation" className="text-sm font-medium text-gray-700 mb-1">
                                Contact Relation <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="emergencyContactRelation"
                                value={formData.emergencyContactRelation}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Emergency Contact Relation"
                            />
                        </div>
                    </div>
                </section>

                <section className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-[#680f91] mb-4">Educational Background</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="highestQualification" className="text-sm font-medium text-gray-700 mb-1">
                                Highest Qualification <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="highestQualification"
                                value={formData.highestQualification}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Highest Qualification"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="degree" className="text-sm font-medium text-gray-700 mb-1">
                                Degree <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="degree"
                                value={formData.degree}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Degree"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="courseName" className="text-sm font-medium text-gray-700 mb-1">
                                Course Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="courseName"
                                value={formData.courseName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Course Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="college" className="text-sm font-medium text-gray-700 mb-1">
                                College Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="College Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="university" className="text-sm font-medium text-gray-700 mb-1">
                                University Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="university"
                                value={formData.university}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="University Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="yearOfPassing" className="text-sm font-medium text-gray-700 mb-1">
                                Year of Passing <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="yearOfPassing"
                                value={formData.yearOfPassing}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Year of Passing"
                            >
                                <option value="">Select</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="marks" className="text-sm font-medium text-gray-700 mb-1">
                                Marks <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="marks"
                                value={formData.marks}
                                onChange={handleInputChange}
                                placeholder="Enter Percentage"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Marks"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="desiredJobDomain" className="text-sm font-medium text-gray-700 mb-1">
                                Desired Job Domain <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="desiredJobDomain"
                                value={formData.desiredJobDomain}
                                onChange={handleJobDomainChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Desired Job Domain"
                            >
                                <option value="">Select</option>
                                {Object.keys(jobDomainMap).map((domain) => (
                                    <option key={domain} value={domain}>
                                        {domain}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="desiredJobSubdomain" className="text-sm font-medium text-gray-700 mb-1">
                                Desired Job Subdomain <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="desiredJobSubdomain"
                                value={formData.desiredJobSubdomain}
                                onChange={(e) => setFormData((prev) => ({ ...prev, desiredJobSubdomain: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Desired Job Subdomain"
                            >
                                <option value="">Select</option>
                                {subDomains.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-[#680f91] mb-4">Professional Details</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="internshipExperience" className="text-sm font-medium text-gray-700 mb-1">
                                Internship Experience
                            </label>
                            <textarea
                                id="internshipExperience"
                                value={formData.internshipExperience}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa] min-h-[100px]"
                                aria-label="Internship Experience"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="skills" className="text-sm font-medium text-gray-700 mb-1">
                                Skills <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="skills"
                                value={formData.skills}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Skills"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-[#680f91] mb-4">Resume</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="resumeLink" className="text-sm font-medium text-gray-700 mb-1">
                                Resume Link
                            </label>
                            <input
                                type="url"
                                id="resumeLink"
                                value={formData.resumeLink}
                                onChange={handleInputChange}
                                placeholder="Paste your resume link here"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                aria-label="Resume Link"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="resumeFile" className="text-sm font-medium text-gray-700 mb-1">
                                Upload Resume <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="resumeFile"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#680f91] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Upload Resume"
                            />
                            {resumeFileName && (
                                <span className="text-sm text-green-600 mt-2">{resumeFileName}</span>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#680f91] text-white rounded-full font-semibold hover:bg-[#9d48a8] focus:ring-2 focus:ring-[#680f91] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                        disabled={loading}
                        aria-label="Submit Form"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <span className="w-5 h-5 border-4 border-t-[#ffffff] border-gray-200 rounded-full animate-spin mr-2"></span>
                                Submitting...
                            </span>
                        ) : (
                            'Submit'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleClearForm}
                        className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                        aria-label="Clear Form"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

CandidateForm.propTypes = {};

export default CandidateForm;