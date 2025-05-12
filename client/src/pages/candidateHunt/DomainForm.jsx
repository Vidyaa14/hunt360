
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'https://saarthi360-backend.vercel.app/api/candidate';

const domainMap = {
    'Information Technology': [
        'Software Developer', 'Data Analysis', 'Cyber Security', 'UI/UX Design',
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

const questionBank = {
    'Information Technology': {
        'Web Development': [
            {
                question: 'What does HTML stand for?',
                correct: 'HyperText Markup Language',
                options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTool Multi Language', 'HyperText Main Language']
            },
            {
                question: 'Which CSS property controls text size?',
                correct: 'font-size',
                options: ['font-size', 'text-size', 'font-style', 'text-scale']
            },
            {
                question: 'What is the purpose of JavaScript?',
                correct: 'Add interactivity to web pages',
                options: ['Add interactivity to web pages', 'Style web pages', 'Define web structure', 'Manage databases']
            },
            {
                question: 'Which HTML tag is used for a hyperlink?',
                correct: '<a>',
                options: ['<a>', '<link>', '<href>', '<url>']
            }
        ],
        'Data Analysis': [
            {
                question: 'What library is commonly used for data analysis in Python?',
                correct: 'pandas',
                options: ['pandas', 'numpy', 'matplotlib', 'scikit-learn']
            },
            {
                question: 'Which tool is used for data visualization?',
                correct: 'Tableau',
                options: ['Tableau', 'Excel', 'SQL', 'Jupyter']
            },
            {
                question: 'What does SQL stand for?',
                correct: 'Structured Query Language',
                options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language']
            },
            {
                question: 'Which Python library is used for machine learning?',
                correct: 'scikit-learn',
                options: ['scikit-learn', 'pandas', 'numpy', 'matplotlib']
            }
        ]
    }
};

const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

const DomainForm = () => {
    const navigate = useNavigate();
    const token = new URLSearchParams(window.location.search).get('token');
    const timerRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        college: '',
        university: '',
        degree: '',
        domain: '',
        subdomain: '',
        answers: {}
    });
    const [timer, setTimer] = useState(300);
    const [tokenValid, setTokenValid] = useState(null);
    const [error, setError] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
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

    useEffect(() => {
        const { domain, subdomain } = formData;
        const selected = questionBank[domain]?.[subdomain];
        if (Array.isArray(selected)) {
            const shuffled = shuffleArray(selected).slice(0, 4);
            setQuestions(shuffled);
        } else {
            setQuestions([]);
        }
    }, [formData.domain, formData.subdomain]);

    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        setTimer(300);
        setTimerActive(true);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleDomainChange = useCallback((e) => {
        setFormData((prev) => ({ ...prev, domain: e.target.value, subdomain: '', answers: {} }));
        setQuestions([]);
        clearInterval(timerRef.current);
        setTimerActive(false);
    }, []);

    const handleSubdomainChange = useCallback((e) => {
        const sub = e.target.value;
        setFormData((prev) => ({ ...prev, subdomain: sub, answers: {} }));
        startTimer();
    }, [startTimer]);

    const handleAnswerChange = useCallback((idx, val) => {
        setFormData((prev) => ({
            ...prev,
            answers: { ...prev.answers, [idx]: val }
        }));
    }, []);

    const formatTime = useMemo(() => (s) => `${Math.floor(s / 60)}:${('0' + (s % 60)).slice(-2)}`, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let score = 0;
            questions.forEach((q, idx) => {
                const ans = (formData.answers[idx] || '').trim().toLowerCase();
                if (q.correct && ans === q.correct.toLowerCase()) score++;
            });

            const payload = {
                token,
                Full_Name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
                Email: formData.email,
                Phone_No: formData.phone,
                college: formData.college,
                university: formData.university,
                degree: formData.degree,
                Domain: formData.domain,
                Sub_Domain: formData.subdomain,
                assessment_score: score,
                answers: JSON.stringify(formData.answers),
                submittedAt: new Date().toISOString()
            };

            const response = await fetch(`${BACKEND_URL}/submitAssessment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/form-success');
            } else {
                throw new Error(data.error || 'Failed to submit assessment.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError('Failed to submit the form. Please try again.');
            navigate('/form-error');
        } finally {
            setLoading(false);
        }
    }, [formData, questions, token, navigate]);

    const handleClearForm = useCallback(() => {
        setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            college: '',
            university: '',
            degree: '',
            domain: '',
            subdomain: '',
            answers: {}
        });
        setQuestions([]);
        setTimer(300);
        setTimerActive(false);
        clearInterval(timerRef.current);
    }, []);

    if (tokenValid === null) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8 animate-fade-in">
                <div className="flex items-center justify-center">
                    <span className="w-8 h-8 border-4 border-t-[#570e88] border-gray-200 rounded-full animate-spin mr-2"></span>
                    Validating token...
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8 animate-fade-in">
                <div className="text-center text-red-600 font-bold text-xl" role="alert">
                    ⚠️ {error || 'Invalid or expired token.'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8 animate-fade-in">
            <header className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <img
                    src="/logo.png"
                    alt="Talent Corner Logo"
                    className="h-12"
                    aria-hidden="true"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#570e88] to-[#6a1b9a] bg-clip-text text-transparent">
                    Talent Corner HR Services Pvt. Ltd
                </h1>
            </header>

            <h2 className="text-3xl font-bold text-[#6a1b9a] mb-4">Domain Knowledge Assessment</h2>
            <p className="text-gray-600 mb-6">
                Note: This form contains domain-specific questions designed to assess your knowledge and expertise in the chosen field
            </p>

            {error && (
                <div
                    className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-bold mb-4"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-[#6a1b9a] mb-4">Basic Details</h3>
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
                                placeholder="First Name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
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
                                placeholder="Middle Name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
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
                                placeholder="Last Name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Last Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Email"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Phone"
                            />
                        </div>
                    </div>
                </section>

                <section className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-[#6a1b9a] mb-4">Educational Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="college" className="text-sm font-medium text-gray-700 mb-1">
                                College <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                placeholder="College"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="College"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="university" className="text-sm font-medium text-gray-700 mb-1">
                                University <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="university"
                                value={formData.university}
                                onChange={handleInputChange}
                                placeholder="University"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="University"
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
                                placeholder="Degree"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Degree"
                            />
                        </div>
                    </div>
                </section>

                <section className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-[#6a1b9a] mb-4">Domain Selection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="domain" className="text-sm font-medium text-gray-700 mb-1">
                                Domain <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="domain"
                                value={formData.domain}
                                onChange={handleDomainChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Domain"
                            >
                                <option value="">Select Domain</option>
                                {Object.keys(domainMap).map((dom) => (
                                    <option key={dom} value={dom}>{dom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="subdomain" className="text-sm font-medium text-gray-700 mb-1">
                                Subdomain <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="subdomain"
                                value={formData.subdomain}
                                onChange={handleSubdomainChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#570e88] bg-[#f5f3fa]"
                                required
                                aria-required="true"
                                aria-label="Subdomain"
                            >
                                <option value="">Select Subdomain</option>
                                {(domainMap[formData.domain] || []).map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {timerActive && (
                        <p className="text-red-600 font-bold text-right mt-4">
                            <strong>Time left:</strong> {formatTime(timer)}
                        </p>
                    )}
                </section>

                {questions.length > 0 && (
                    <section>
                        <h3 className="text-xl font-semibold text-[#6a1b9a] mb-4">Questions</h3>
                        {questions.map((q, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                                    {q.question} <span className="text-red-500">*</span>
                                </label>
                                {q.options && q.options.map((option, optIdx) => (
                                    <div key={optIdx} className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            name={`question-${idx}`}
                                            value={option}
                                            checked={formData.answers[idx] === option}
                                            onChange={() => handleAnswerChange(idx, option)}
                                            className="mr-2"
                                            required
                                            aria-required="true"
                                            aria-label={`Option ${option} for question ${q.question}`}
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                )}

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#570e88] text-white rounded-full font-semibold hover:bg-[#290541] focus:ring-2 focus:ring-[#570e88] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
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

DomainForm.propTypes = {};

export default DomainForm;