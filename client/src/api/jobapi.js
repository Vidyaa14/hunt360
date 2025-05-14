import axios from 'axios';

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

if (!RAPID_API_KEY) {
    console.warn('VITE_RAPID_API_KEY is missing. Check your .env file.');
}

const jobsApi = axios.create({
    baseURL: 'https://jsearch.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
});

export const searchJobs = async (params) => {
    try {
        if (!params.query) throw new Error('Search query is required');

        const response = await jobsApi.get('/search', {
            params: {
                query: params.query,
                page: params.page || 1,
                num_pages: params.num_pages || 1,
                date_posted: params.date_posted || 'all',
                remote_jobs_only: params.remote_jobs_only || false,
                employment_types: params.employment_types || '',
                job_requirements: params.job_requirements || '',
                job_titles: params.job_titles || '',
                company_types: params.company_types || ''
            }
        });

        return response.data;
    } catch (error) {
        handleError(error, 'searchJobs');
    }
};

export const getJobDetails = async (jobId) => {
    try {
        if (!jobId) throw new Error('Job ID is required');

        const response = await jobsApi.get('/job-details', {
            params: {
                job_id: jobId
            }
        });

        return response.data;
    } catch (error) {
        handleError(error, 'getJobDetails');
    }
};

export const checkApiConnection = async () => {
    try {
        const response = await jobsApi.get('/search', {
            params: {
                query: 'developer',
                page: 1,
                num_pages: 1
            }
        });

        return {
            success: true,
            status: response.status,
            message: 'API connection successful'
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status,
            message: error.message
        };
    }
};

const handleError = (error, source) => {
    console.error(`Error in ${source}:`, error.message);

    if (error.response) {
        console.error('🔍 Response Error:', {
            status: error.response.status,
            data: error.response.data
        });

        if (error.response.status === 429) {
            console.warn('Too Many Requests: You might be hitting your plan limit on RapidAPI.');
        }
    }

    throw error;
};

export default {
    searchJobs,
    getJobDetails,
    checkApiConnection
};