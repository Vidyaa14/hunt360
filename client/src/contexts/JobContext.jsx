import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { searchJobs } from '../api/jobapi';
import { processQueryWithBooleanLogic } from './jobUtils';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalJobs, setTotalJobs] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        jobCategory: '',
        datePosted: 'all',
        remoteJobsOnly: false,
        employmentType: '',
        page: 1,
    });

    const [selectedJob, setSelectedJob] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);

    const SAVED_JOBS_KEY = 'jobsearch_saved_jobs';

    // Load saved jobs from localStorage
    useEffect(() => {
        const storedSavedJobs = localStorage.getItem(SAVED_JOBS_KEY);
        if (storedSavedJobs) {
            try {
                setSavedJobs(JSON.parse(storedSavedJobs));
            } catch (err) {
                console.error('Error parsing saved jobs from localStorage:', err);
            }
        }
    }, []);

    // 🔍 Main search handler
    const handleSearch = async (query, newFilters = {}) => {
        if (!query) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const processedQuery = processQueryWithBooleanLogic(query);
            const updatedFilters = { ...filters, ...newFilters, page: newFilters.page || 1 };

            setFilters(updatedFilters);
            setSearchQuery(query);

            const params = {
                query: processedQuery,
                page: updatedFilters.page,
                date_posted: updatedFilters.datePosted,
                remote_jobs_only: updatedFilters.remoteJobsOnly,
                employment_types: updatedFilters.employmentType,
                job_titles: updatedFilters.jobCategory,
            };

            const data = await searchJobs(params);

            if (data && data.data) {
                // Append jobs if loading more, otherwise reset
                setJobs(updatedFilters.page > 1 ? [...jobs, ...data.data] : data.data);
                setTotalJobs(data.total_jobs || data.data.length);
            } else {
                setJobs([]);
                setTotalJobs(0);
                setError('No jobs found matching your criteria');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to fetch jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // 📄 Load more jobs (pagination)
    const loadMoreJobs = () => {
        const newPage = filters.page + 1;
        handleSearch(searchQuery, { ...filters, page: newPage });
    };

    // 🎯 Select job
    const selectJob = (job) => {
        setSelectedJob(job);
    };

    const clearSelectedJob = () => {
        setSelectedJob(null);
    };

    // 🔧 Update filters and reset pagination
    const updateFilters = (newFilters) => {
        handleSearch(searchQuery, { ...newFilters, page: 1 });
    };

    // 💾 Save jobs locally
    const isJobSaved = (jobId) => {
        return savedJobs.some((job) => job.job_id === jobId);
    };

    const toggleSaveJob = (job) => {
        const alreadySaved = isJobSaved(job.job_id);
        let updatedSavedJobs;

        if (alreadySaved) {
            updatedSavedJobs = savedJobs.filter((savedJob) => savedJob.job_id !== job.job_id);
        } else {
            updatedSavedJobs = [...savedJobs, job];
        }

        setSavedJobs(updatedSavedJobs);
        localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedSavedJobs));

        return !alreadySaved;
    };

    const value = {
        jobs,
        loading,
        error,
        totalJobs,
        selectedJob,
        searchQuery,
        filters,
        savedJobs,
        handleSearch,
        loadMoreJobs,
        selectJob,
        clearSelectedJob,
        updateFilters,
        isJobSaved,
        toggleSaveJob,
    };

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

JobProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default JobContext;
