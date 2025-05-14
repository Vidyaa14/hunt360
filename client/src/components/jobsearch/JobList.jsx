import { useCallback, useRef } from 'react';
import { useJobContext } from '../../contexts/useJobContext';
import JobCard from './JobCard';

const JobList = () => {
    const {
        jobs,
        loading,
        error,
        totalJobs,
        loadMoreJobs,
        searchQuery
    } = useJobContext();

    const observer = useRef();
    const lastJobElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && jobs.length < totalJobs) {
                loadMoreJobs();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, jobs.length, totalJobs, loadMoreJobs]);

    const renderLoadingSkeleton = () => {
        return Array(3).fill(0).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white mb-3 shadow-sm border border-gray-200 rounded-md">
                <div className="p-4">
                    <div className="animate-pulse">
                        <span className="bg-gray-300 rounded w-1/2 h-4 mb-2 block"></span>
                        <span className="bg-gray-300 rounded w-2/3 h-4 mb-3 block"></span>
                        <span className="bg-gray-300 rounded w-1/3 h-4 mb-2 block"></span>
                        <span className="bg-gray-300 rounded w-1/2 h-4 block"></span>
                    </div>
                </div>
            </div>
        ));
    };

    const renderError = () => (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i>
            {error}
        </div>
    );

    const renderNoResults = () => (
        <div className="text-center py-5">
            <i className="bi bi-search text-5xl text-gray-600 mb-3 block"></i>
            <h3 className="text-2xl font-semibold">No Jobs Found</h3>
            <p className="text-gray-600">
                Try different keywords or remove some filters
            </p>
        </div>
    );

    const renderJobsList = () => {
        if (jobs.length === 0 && !loading && searchQuery) {
            return renderNoResults();
        }

        return (
            <>
                {jobs.map((job, index) => {
                    if (jobs.length === index + 1) {
                        return (
                            <div ref={lastJobElementRef} key={job.job_id}>
                                <JobCard job={job} />
                            </div>
                        );
                    } else {
                        return <JobCard key={job.job_id} job={job} />;
                    }
                })}

                {loading && renderLoadingSkeleton()}
            </>
        );
    };

    return (
        <div className="job-list-container">
            {jobs.length > 0 && !loading && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium mb-0">Showing {jobs.length} of {totalJobs} jobs</h2>
                    <div className="flex gap-2">
                        <button type="button" className="border border-gray-500 text-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-200">
                            <i className="bi bi-sort-down mr-1"></i>
                            Newest
                        </button>
                        <button type="button" className="border border-gray-500 text-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-200">
                            <i className="bi bi-sort-alpha-down mr-1"></i>
                            Relevance
                        </button>
                    </div>
                </div>
            )}
            {error && renderError()}

            <div className="job-list">
                {!error && renderJobsList()}
            </div>
        </div>
    );
};

JobList.propTypes = {};

export default JobList;