import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { checkApiConnection } from '../api/jobapi';
import JobDetailsModal from '../components/jobsearch/JobDetailsModal';
import JobList from '../components/jobsearch/JobList';
import SearchBar from '../components/jobsearch/SearchBar';

const JobHomePage = () => {
    const [apiStatus, setApiStatus] = useState({
        checked: false,
        working: true,
        message: '',
    });

    useEffect(() => {
        const verifyApiConnection = async () => {
            try {
                const result = await checkApiConnection();
                setApiStatus({
                    checked: true,
                    working: result.success,
                    message: result.message,
                });

                if (!result.success) {
                    console.error('API connection failed:', result.message);
                }
            } catch (error) {
                console.error('Error checking API connection:', error);
                setApiStatus({
                    checked: true,
                    working: false,
                    message:
                        'Failed to connect to job search API. Please check your API key.',
                });
            }
        };

        verifyApiConnection();
    }, []);

    return (
        <div>
            <motion.div
                className="bg-gradient-to-r from-blue-100 to-indigo-100 py-5 mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center">
                        <div className="lg:w-2/3 mx-auto text-center">
                            <motion.h1
                                className="font-bold mb-3 text-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                Find Your Dream Job
                            </motion.h1>
                            <motion.p
                                className="text-xl mb-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                Search across thousands of jobs
                            </motion.p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
            >
                <div className="flex flex-wrap">
                    <div className="lg:w-10/12 mx-auto">
                        {!apiStatus.working && apiStatus.checked && (
                            <motion.div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"
                                role="alert"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h4 className="text-lg font-semibold">
                                    API Connection Issue
                                </h4>
                                <p>
                                    {apiStatus.message ||
                                        'Unable to connect to the job search API.'}
                                </p>
                                <hr className="my-2" />
                                <p className="mb-0">
                                    Make sure you've created a <code>.env</code>{' '}
                                    file in the root of your project with the
                                    following content:
                                    <br />
                                    <code>
                                        VITE_RAPID_API_KEY=your_rapidapi_key_here
                                    </code>
                                </p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <SearchBar />
                            <JobList />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <JobDetailsModal />
        </div>
    );
};

JobHomePage.propTypes = {};

export default JobHomePage;
