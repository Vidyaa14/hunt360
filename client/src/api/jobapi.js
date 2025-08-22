// jobapi.js
import axios from "axios";
import rateLimiter from "./rateLimiter";
import apiCache from "./cache";

// Load API key & host from .env
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST || "jsearch.p.rapidapi.com";

if (!RAPID_API_KEY || !RAPID_API_HOST) {
  console.error("❌ CRITICAL: Missing RapidAPI credentials");
  console.error("Please create .env file in project root with:");
  console.error("VITE_RAPID_API_KEY=e8ef76be58msha831215bb4bf64fp1cfaa3jsn65a66f901f07");
  console.error("VITE_RAPID_API_HOST=jsearch.p.rapidapi.com");
}

// ✅ Create axios instance for JSearch
const jobsApi = axios.create({
  baseURL: `https://${RAPID_API_HOST}`,
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": RAPID_API_HOST,
  },
  timeout: 15000,
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async (fn, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      const retryAfter = error.response.headers["retry-after"] || delay;
      const waitTime = Math.max(retryAfter * 1000, delay);
      console.warn(`🔄 Rate limited. Waiting ${waitTime}ms before retry...`);
      await sleep(waitTime);
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// 🔹 Search Jobs
export const searchJobs = async (params) => {
  try {
    if (!params.query) throw new Error("Search query is required");
    if (!RAPID_API_KEY || !RAPID_API_HOST) {
      throw new Error("Missing RapidAPI credentials. Check your .env file.");
    }

    const cacheKey = { type: "search", ...params };
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    await rateLimiter.throttle();

    const response = await retryWithBackoff(() =>
      jobsApi.get("/search", {
        params: {
          query: params.query,
          page: params.page || 1,
          num_pages: params.num_pages || 1,
          country: params.country || "us",
          date_posted: params.date_posted || "all",
          remote_jobs_only: params.remote_jobs_only || false,
          employment_types: params.employment_types || "",
          job_titles: params.job_titles || "",
        },
      })
    );

    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleError(error, "searchJobs");
  }
};

// 🔹 Job Details
export const getJobDetails = async (jobId) => {
  try {
    if (!jobId) throw new Error("Job ID is required");
    if (!RAPID_API_KEY || !RAPID_API_HOST) {
      throw new Error("Missing RapidAPI credentials. Check your .env file.");
    }

    const cacheKey = { type: "job-details", jobId };
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    await rateLimiter.throttle();

    const response = await retryWithBackoff(() =>
      jobsApi.get("/job-details", { params: { job_id: jobId } })
    );

    apiCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleError(error, "getJobDetails");
  }
};

// 🔹 API Connection Check
export const checkApiConnection = async () => {
  try {
    if (!RAPID_API_KEY || !RAPID_API_HOST) {
      return { success: false, status: 401, message: "Missing API credentials. Check .env file." };
    }

    await rateLimiter.throttle();

    const response = await retryWithBackoff(() =>
      jobsApi.get("/search", {
        params: { query: "developer jobs in chicago", page: 1, num_pages: 1, country: "us" },
      })
    );

    return { success: true, status: response.status, message: "✅ API connection successful" };
  } catch (error) {
    return { success: false, status: error.response?.status, message: error.message };
  }
};

// 🔹 Error Handler
const handleError = (error, source) => {
  console.error(`❌ Error in ${source}:`, error.message);
  if (error.response) {
    console.error("🔍 Response Error:", {
      status: error.response.status,
      data: error.response.data,
    });
  }
  throw error;
};

// 🔹 Clear Cache
export const clearCache = () => {
  apiCache.clear();
  console.log("🗑️ API cache cleared");
};

export default { searchJobs, getJobDetails, checkApiConnection, clearCache };
