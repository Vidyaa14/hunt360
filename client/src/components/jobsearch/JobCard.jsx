import PropTypes from 'prop-types';
import { useJobContext } from '../../contexts/useJobContext';

const JobCard = ({ job }) => {
    const { selectJob, isJobSaved, toggleSaveJob } = useJobContext();

    const formatSalary = (min, max, currency) => {
        if (!min && !max) return 'Salary not specified';

        const formatNumber = (num) =>
            num.toLocaleString('en-US', {
                style: 'currency',
                currency: currency || 'USD',
                maximumFractionDigits: 0,
            });

        if (min && max) {
            return `${formatNumber(min)} - ${formatNumber(max)}`;
        } else if (min) {
            return `From ${formatNumber(min)}`;
        } else {
            return `Up to ${formatNumber(max)}`;
        }
    };

    const getRelativeTimeString = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const handleSaveToggle = (e) => {
        e.stopPropagation();
        toggleSaveJob(job);
    };

    const handleViewDetails = () => {
        selectJob(job);
    };

    const savedStatus = isJobSaved(job.job_id);

    return (
        <div
            className="bg-white mb-3 shadow-sm border border-gray-200 rounded-md job-card"
            onClick={handleViewDetails}
        >
            <div className="p-4">
                <div className="flex justify-between">
                    <div className="flex">
                        {job.employer_logo ? (
                            <img
                                src={job.employer_logo}
                                alt={job.employer_name}
                                className="company-logo mr-3 w-16 h-16 object-contain"
                            />
                        ) : (
                            <div className="company-logo-placeholder mr-3 bg-gray-100 flex items-center justify-center w-16 h-16">
                                <span className="text-gray-600">
                                    {job.employer_name?.[0] || '?'}
                                </span>
                            </div>
                        )}

                        <div>
                            <h5 className="text-xl font-semibold mb-1">
                                {job.job_title}
                            </h5>
                            <h6 className="text-base text-gray-600 mb-2">
                                {job.employer_name}
                            </h6>

                            <div className="job-meta flex gap-3 text-gray-600 text-sm">
                                <span>
                                    <i className="bi bi-geo-alt mr-1"></i>
                                    {job.job_city ||
                                        job.job_country ||
                                        'Remote'}
                                </span>

                                {job.job_employment_type && (
                                    <span>
                                        <i className="bi bi-briefcase mr-1"></i>
                                        {job.job_employment_type
                                            .replace('_', ' ')
                                            .toLowerCase()}
                                    </span>
                                )}

                                <span>
                                    <i className="bi bi-clock mr-1"></i>
                                    {getRelativeTimeString(
                                        job.job_posted_at_datetime_utc
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <button
                            className={`px-2 py-1 rounded-md text-sm ${savedStatus ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'border border-gray-500 text-gray-700 hover:bg-gray-200'}`}
                            onClick={handleSaveToggle}
                        >
                            <i
                                className={`bi ${savedStatus ? 'bi-bookmark-fill' : 'bi-bookmark'}`}
                            ></i>
                        </button>

                        {job.job_min_salary && job.job_max_salary && (
                            <div className="text-green-600 mt-2 font-bold">
                                {formatSalary(
                                    job.job_min_salary,
                                    job.job_max_salary,
                                    job.job_salary_currency
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {job.job_highlights?.Qualifications && (
                    <div className="mt-3">
                        <h6 className="text-sm text-gray-600">
                            Qualifications:
                        </h6>
                        <ul className="text-sm mb-0">
                            {job.job_highlights.Qualifications.slice(0, 2).map(
                                (qual, index) => (
                                    <li key={index}>{qual}</li>
                                )
                            )}
                            {job.job_highlights.Qualifications.length > 2 && (
                                <li>...</li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="flex mt-3 pt-2 border-t border-gray-200">
                    <button
                        className="border border-blue-500 text-blue-600 px-2 py-1 rounded-md text-sm w-full hover:bg-blue-50"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

JobCard.propTypes = {
    job: PropTypes.shape({
        job_id: PropTypes.string.isRequired,
        job_title: PropTypes.string.isRequired,
        employer_name: PropTypes.string,
        employer_logo: PropTypes.string,
        job_city: PropTypes.string,
        job_country: PropTypes.string,
        job_employment_type: PropTypes.string,
        job_posted_at_datetime_utc: PropTypes.string.isRequired,
        job_min_salary: PropTypes.number,
        job_max_salary: PropTypes.number,
        job_salary_currency: PropTypes.string,
        job_highlights: PropTypes.shape({
            Qualifications: PropTypes.arrayOf(PropTypes.string),
        }),
    }).isRequired,
};

export default JobCard;
