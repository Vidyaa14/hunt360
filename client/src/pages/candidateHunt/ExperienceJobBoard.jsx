import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../../components/sidebar/Sidebar';

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

const ExperiencedJobBoard = () => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        skills: '',
        desiredDomain: '',
        desiredSubDomain: '',
        location: '',
        state: '',
        city: '',
        email: '',
        contactNumber: '',
        experience: '',
    });
    const [subDomains, setSubDomains] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = useCallback(() => {
        const newErrors = {};
        const requiredFields = [
            'jobTitle',
            'skills',
            'desiredDomain',
            'desiredSubDomain',
            'location',
            'state',
            'city',
            'email',
            'contactNumber',
            'experience',
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
        if (
            formData.contactNumber &&
            !/^\d{10}$/.test(formData.contactNumber)
        ) {
            newErrors.contactNumber = 'Must be a 10-digit number';
        }
        if (formData.experience && !/^\d+(\.\d+)?$/.test(formData.experience)) {
            newErrors.experience = 'Must be a valid number (e.g., 2 or 2.5)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === 'desiredDomain') {
            setSubDomains(domainData[value] || []);
            setFormData((prev) => ({ ...prev, desiredSubDomain: '' }));
        }
        if (name === 'state') {
            setCities(stateCityData[value] || []);
            setFormData((prev) => ({ ...prev, city: '' }));
        }
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (validate()) {
                setSubmitting(true);
                setTimeout(() => {
                    setSubmitting(false);
                    console.log('Job Post Data:', formData);
                    alert('Job post generated successfully!');
                    // TODO: Implement API call, e.g., axios.post('/api/job-posts', formData)
                }, 2000);
            }
        },
        [formData, validate]
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className={`flex-1 p-6 transition-all duration-300`}>
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-[#5b2c91]">
                        Experience Job Board
                    </h1>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md"
                    noValidate
                >
                    <h2 className="text-xl font-semibold text-[#5b2c91] mb-6">
                        Create Job Post
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                label: 'Job Title',
                                name: 'jobTitle',
                                type: 'text',
                            },
                            { label: 'Skills', name: 'skills', type: 'text' },
                            {
                                label: 'Desired Job Domain',
                                name: 'desiredDomain',
                                type: 'select',
                                options: ['', ...Object.keys(domainData)],
                            },
                            {
                                label: 'Desired Sub Domain',
                                name: 'desiredSubDomain',
                                type: 'select',
                                options: ['', ...subDomains],
                            },
                            {
                                label: 'Location',
                                name: 'location',
                                type: 'text',
                            },
                            {
                                label: 'State',
                                name: 'state',
                                type: 'select',
                                options: ['', ...Object.keys(stateCityData)],
                            },
                            {
                                label: 'City',
                                name: 'city',
                                type: 'select',
                                options: ['', ...cities],
                            },
                            { label: 'Email ID', name: 'email', type: 'email' },
                            {
                                label: 'Contact Number',
                                name: 'contactNumber',
                                type: 'tel',
                            },
                            {
                                label: 'Experience (Years)',
                                name: 'experience',
                                type: 'text',
                            },
                        ].map(({ label, name, type, options }) => (
                            <div key={name} className="flex flex-col">
                                <label
                                    htmlFor={name}
                                    className="text-sm font-semibold text-gray-700 mb-2"
                                >
                                    {label}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                {type === 'select' ? (
                                    <select
                                        id={name}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5b2c91] focus:border-transparent"
                                        aria-invalid={!!errors[name]}
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
                                        id={name}
                                        name={name}
                                        type={type}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5b2c91] focus:border-transparent"
                                        aria-invalid={!!errors[name]}
                                        aria-label={label}
                                    />
                                )}
                                {errors[name] && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors[name]}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-6 px-6 py-3 bg-[#5b2c91] text-white rounded-lg font-semibold hover:bg-[#4b1e84] disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#5b2c91] focus:ring-opacity-50 transition-all duration-200"
                        aria-label="Generate job post"
                    >
                        {submitting ? 'Submitting...' : 'Generate Job Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

ExperiencedJobBoard.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

ExperiencedJobBoard.defaultProps = {
    isSidebarCollapsed: false,
};

export default ExperiencedJobBoard;
