import { Link } from 'react-router-dom';
import JobCard from '../components/jobsearch/JobCard';
import JobDetailsModal from '../components/jobsearch/JobDetailsModal';
import { useJobContext } from '../contexts/useJobContext';

const SavedJobsPage = () => {
    const { savedJobs } = useJobContext();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap">
                <div className="lg:w-10/12 mx-auto">
                    {savedJobs.length > 0 && (
                        <h1 className="text-2xl font-semibold mb-4">
                            Saved Jobs
                        </h1>
                    )}

                    {savedJobs.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <i className="bi bi-bookmark text-blue-600 text-5xl"></i>
                            </div>
                            <h3 className="text-2xl font-semibold">
                                No saved jobs yet
                            </h3>
                            <p className="text-gray-600 mb-3">
                                Jobs you save will appear here for easy access
                            </p>
                            <Link
                                to="/"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Find Jobs to Save
                            </Link>
                        </div>
                    ) : (
                        <div className="saved-jobs-list">
                            {savedJobs.map((job) => (
                                <JobCard key={job.job_id} job={job} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <JobDetailsModal />
        </div>
    );
};

SavedJobsPage.propTypes = {};

export default SavedJobsPage;
