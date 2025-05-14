import { useEffect, useState } from 'react';
import { getJobDetails } from '../../api/jobapi';
import { useJobContext } from '../../contexts/useJobContext';

const JobDetailsModal = () => {
    const { selectedJob, clearSelectedJob, isJobSaved, toggleSaveJob } = useJobContext();
    const [fullJobDetails, setFullJobDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedJob?.job_id) {
            setLoading(true);
            setError(null);

            if (selectedJob.job_description) {
                setFullJobDetails(selectedJob);
                setLoading(false);
            } else {
                getJobDetails(selectedJob.job_id)
                    .then(response => {
                        setFullJobDetails(response.data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('Error fetching job details:', err);
                        setError('Failed to load job details');
                        setLoading(false);
                    });
            }
        } else {
            setFullJobDetails(null);
        }
    }, [selectedJob]);

    if (!selectedJob) return null;

    /**
     * Toggle save/unsave job.
     */
    const handleSaveToggle = () => {
        if (selectedJob) {
            toggleSaveJob(selectedJob);
        }
    };

    /**
     * Open job application link in a new tab.
     */
    const handleApply = () => {
        if (fullJobDetails?.job_apply_link) {
            window.open(fullJobDetails.job_apply_link, '_blank');
        }
    };

    const isSavedJob = selectedJob ? isJobSaved(selectedJob.job_id) : false;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h5 className="text-xl font-semibold">
                        {selectedJob.job_title}
                    </h5>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                        onClick={clearSelectedJob}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-3">Loading job details...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">{error}</div>
                    ) : fullJobDetails ? (
                        <div className="job-details">
                            {/* Company info */}
                            <div className="company-info flex mb-4">
                                {fullJobDetails.employer_logo ? (
                                    <img
                                        src={fullJobDetails.employer_logo}
                                        alt={fullJobDetails.employer_name}
                                        className="company-logo mr-3 w-20 h-20 object-contain"
                                    />
                                ) : (
                                    <div
                                        className="company-logo-placeholder mr-3 bg-gray-100 flex items-center justify-center w-20 h-20"
                                    >
                                        <span className="text-2xl text-gray-600">{fullJobDetails.employer_name?.[0] || '?'}</span>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-2xl font-semibold">{fullJobDetails.job_title}</h4>
                                    <h6 className="text-lg">{fullJobDetails.employer_name}</h6>
                                    <div className="job-meta flex gap-3 text-gray-600">
                                        <span>
                                            <i className="bi bi-geo-alt mr-1"></i>
                                            {fullJobDetails.job_city || fullJobDetails.job_country || 'Remote'}
                                        </span>

                                        {fullJobDetails.job_employment_type && (
                                            <span>
                                                <i className="bi bi-briefcase mr-1"></i>
                                                {fullJobDetails.job_employment_type.replace('_', ' ').toLowerCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="job-overview bg-gray-100 p-4 rounded-md mb-4">
                                <h5 className="text-xl font-semibold">Job Overview</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {fullJobDetails.job_min_salary && fullJobDetails.job_max_salary && (
                                        <div className="mb-3">
                                            <div className="font-bold text-gray-600 text-sm">Salary Range</div>
                                            <div className="text-green-600 font-bold">
                                                {fullJobDetails.job_min_salary.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: fullJobDetails.job_salary_currency || 'USD',
                                                    maximumFractionDigits: 0
                                                })} - {fullJobDetails.job_max_salary.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: fullJobDetails.job_salary_currency || 'USD',
                                                    maximumFractionDigits: 0
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <div className="font-bold text-gray-600 text-sm">Job Type</div>
                                        <div>{fullJobDetails.job_employment_type?.replace('_', ' ').toLowerCase() || 'N/A'}</div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="font-bold text-gray-600 text-sm">Posted</div>
                                        <div>{new Date(fullJobDetails.job_posted_at_datetime_utc).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                            {fullJobDetails.job_description && (
                                <div className="job-description mb-4">
                                    <h5 className="text-xl font-semibold">Job Description</h5>
                                    <div dangerouslySetInnerHTML={{ __html: fullJobDetails.job_description }} />
                                </div>
                            )}

                            {fullJobDetails.job_highlights?.Qualifications && (
                                <div className="job-qualifications mb-4">
                                    <h5 className="text-xl font-semibold">Qualifications</h5>
                                    <ul className="list-disc pl-5">
                                        {fullJobDetails.job_highlights.Qualifications.map((qual, index) => (
                                            <li key={index}>{qual}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {fullJobDetails.job_highlights?.Responsibilities && (
                                <div className="job-responsibilities mb-4">
                                    <h5 className="text-xl font-semibold">Responsibilities</h5>
                                    <ul className="list-disc pl-5">
                                        {fullJobDetails.job_highlights.Responsibilities.map((resp, index) => (
                                            <li key={index}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {fullJobDetails.job_highlights?.Benefits && (
                                <div className="job-benefits mb-4">
                                    <h5 className="text-xl font-semibold">Benefits</h5>
                                    <ul className="list-disc pl-5">
                                        {fullJobDetails.job_highlights.Benefits.map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>No job details available</div>
                    )}
                </div>
                <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${isSavedJob ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'border border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}
                        onClick={handleSaveToggle}
                    >
                        <i className={`bi ${isSavedJob ? 'bi-bookmark-fill' : 'bi-bookmark'} mr-1`}></i>
                        {isSavedJob ? 'Saved' : 'Save'}
                    </button>

                    <button
                        type="button"
                        className="border border-gray-500 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                        onClick={clearSelectedJob}
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleApply}
                        disabled={!fullJobDetails?.job_apply_link}
                    >
                        <i className="bi bi-send-fill mr-1"></i>
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

JobDetailsModal.propTypes = {};

export default JobDetailsModal;