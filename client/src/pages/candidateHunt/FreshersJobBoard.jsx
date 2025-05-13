import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const domainData = {
    'Information Technology': [
        'Software Developer',
        'Data Analyst',
        'System Administrator',
        'DevOps Engineer',
        'Cybersecurity Specialist',
    ],
    Healthcare: [
        'Doctor',
        'Nurse',
        'Pharmacist',
        'Medical Technician',
        'Therapist',
    ],
    Education: [
        'Teacher',
        'Professor',
        'Academic Counselor',
        'Librarian',
        'Curriculum Developer',
    ],
    Finance: [
        'Accountant',
        'Financial Analyst',
        'Auditor',
        'Investment Banker',
        'Tax Consultant',
    ],
    Marketing: [
        'Digital Marketer',
        'Content Strategist',
        'SEO Specialist',
        'Brand Manager',
        'Market Research Analyst',
    ],
    'Human Resources': [
        'HR Manager',
        'Recruiter',
        'Training Coordinator',
        'Compensation Analyst',
        'Employee Relations Specialist',
    ],
    Engineering: [
        'Mechanical Engineer',
        'Civil Engineer',
        'Electrical Engineer',
        'Chemical Engineer',
        'Industrial Engineer',
    ],
    Legal: [
        'Lawyer',
        'Paralegal',
        'Legal Advisor',
        'Compliance Officer',
        'Judge',
    ],
    Sales: [
        'Sales Executive',
        'Account Manager',
        'Business Development Manager',
        'Retail Sales Associate',
        'Sales Analyst',
    ],
    'Customer Service': [
        'Customer Service Representative',
        'Call Center Agent',
        'Technical Support Specialist',
        'Client Relations Manager',
        'Help Desk Technician',
    ],
    Operations: [
        'Operations Manager',
        'Logistics Coordinator',
        'Supply Chain Analyst',
        'Production Supervisor',
        'Inventory Manager',
    ],
    Administration: [
        'Administrative Assistant',
        'Office Manager',
        'Executive Assistant',
        'Receptionist',
        'Clerical Staff',
    ],
    Construction: [
        'Construction Manager',
        'Site Engineer',
        'Architect',
        'Surveyor',
        'Safety Officer',
    ],
    Hospitality: [
        'Hotel Manager',
        'Chef',
        'Housekeeping Supervisor',
        'Front Desk Agent',
        'Event Coordinator',
    ],
    Transportation: [
        'Driver',
        'Logistics Manager',
        'Fleet Coordinator',
        'Dispatcher',
        'Transportation Planner',
    ],
    'Real Estate': [
        'Real Estate Agent',
        'Property Manager',
        'Appraiser',
        'Leasing Consultant',
        'Real Estate Analyst',
    ],
    Manufacturing: [
        'Production Worker',
        'Quality Control Inspector',
        'Manufacturing Engineer',
        'Plant Manager',
        'Machine Operator',
    ],
    'Media & Entertainment': [
        'Journalist',
        'Editor',
        'Producer',
        'Actor',
        'Camera Operator',
    ],
    Agriculture: [
        'Farmer',
        'Agricultural Scientist',
        'Horticulturist',
        'Agronomist',
        'Farm Manager',
    ],
    'Research & Development': [
        'Research Scientist',
        'Lab Technician',
        'Product Developer',
        'Clinical Research Associate',
        'Innovation Manager',
    ],
};

const stateCityData = {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Bengaluru', 'Mysore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur'],
};

const FresherJobBoard = () => {
    const [formData, setFormData] = useState({
        name: '',
        skills: '',
        desiredJobDomain: '',
        desiredSubDomain: '',
        location: '',
        state: '',
        city: '',
        email: '',
        phone: '',
    });
    const [subDomains, setSubDomains] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (
            formData.desiredJobDomain &&
            domainData[formData.desiredJobDomain]
        ) {
            setSubDomains(domainData[formData.desiredJobDomain]);
        } else {
            setSubDomains([]);
        }
    }, [formData.desiredJobDomain]);

    useEffect(() => {
        if (formData.state && stateCityData[formData.state]) {
            setCities(stateCityData[formData.state]);
        } else {
            setCities([]);
        }
    }, [formData.state]);

    const validate = useCallback(() => {
        const newErrors = {};
        const requiredFields = [
            'name',
            'skills',
            'desiredJobDomain',
            'desiredSubDomain',
            'location',
            'state',
            'city',
            'email',
            'phone',
        ];
        requiredFields.forEach((field) => {
            if (!formData[field].trim()) {
                newErrors[field] = 'This field is required';
            }
        });
        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = 'Invalid email format';
        }
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Must be a 10-digit number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (validate()) {
                setSubmitting(true);
                setTimeout(() => {
                    setSubmitting(false);

                    console.log('Job Post Data:', formData);

                    navigate('/dashboard/candidate-results', {
                        state: {
                            domain: formData.desiredJobDomain,
                            subDomain: formData.desiredSubDomain,
                        },
                    });
                }, 2000);
            }
        },
        [formData, navigate, validate]
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className={`flex-1 p-6 transition-all duration-300`}>
                <header className="flex items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-[#55208d]">
                        Freshers Job Board
                    </h1>
                </header>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md"
                    noValidate
                >
                    <h2 className="text-xl font-semibold text-[#5e239d] mb-6">
                        Create Job Post
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: 'Job Title', id: 'name', type: 'text' },
                            { label: 'Skills', id: 'skills', type: 'text' },
                            {
                                label: 'Desired Job Domain',
                                id: 'desiredJobDomain',
                                type: 'select',
                                options: ['', ...Object.keys(domainData)],
                            },
                            {
                                label: 'Desired Sub Domain',
                                id: 'desiredSubDomain',
                                type: 'select',
                                options: ['', ...subDomains],
                            },
                            { label: 'Location', id: 'location', type: 'text' },
                            {
                                label: 'State',
                                id: 'state',
                                type: 'select',
                                options: ['', ...Object.keys(stateCityData)],
                            },
                            {
                                label: 'City',
                                id: 'city',
                                type: 'select',
                                options: ['', ...cities],
                            },
                            { label: 'Email ID', id: 'email', type: 'email' },
                            {
                                label: 'Contact Number',
                                id: 'phone',
                                type: 'tel',
                            },
                        ].map(({ label, id, type, options }) => (
                            <div key={id} className="flex flex-col">
                                <label
                                    htmlFor={id}
                                    className="text-sm font-semibold text-gray-700 mb-2"
                                >
                                    {label}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                {type === 'select' ? (
                                    <select
                                        id={id}
                                        value={formData[id]}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5e239d] focus:border-transparent"
                                        aria-invalid={!!errors[id]}
                                        aria-label={label}
                                    >
                                        {options.map((option) => (
                                            <option key={option} value={option}>
                                                {option || 'Select'}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={id}
                                        type={type}
                                        value={formData[id]}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5e239d] focus:border-transparent"
                                        aria-invalid={!!errors[id]}
                                        aria-label={label}
                                    />
                                )}
                                {errors[id] && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors[id]}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 text-red-800 p-4 rounded-lg mt-4">
                            {Object.values(errors).map((msg, idx) => (
                                <p key={idx}>{msg}</p>
                            ))}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-6 px-6 py-3 bg-[#5e239d] text-white rounded-lg font-semibold hover:bg-[#4b1e84] disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#5e239d] focus:ring-opacity-50 transition-all duration-200"
                        aria-label="Generate job post"
                    >
                        {submitting ? 'Submitting...' : 'Generate Job Post'}
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            navigate('/dashboard/candidate-results', {
                                state: {
                                    domain: 'Information Technology',
                                    subDomain: 'Software Developer',
                                },
                            })
                        }
                        className="mt-4 px-6 py-3 bg-[#5b2c91] text-white rounded-lg font-semibold hover:bg-[#4b1e84] focus:ring-2 focus:ring-[#5b2c91] focus:ring-opacity-50 transition-all duration-200"
                        aria-label="Test Candidate Results"
                    >
                        Test Candidate Results
                    </button>
                </form>
            </div>
        </div>
    );
};

FresherJobBoard.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

FresherJobBoard.defaultProps = {
    isSidebarCollapsed: false,
};

export default FresherJobBoard;
