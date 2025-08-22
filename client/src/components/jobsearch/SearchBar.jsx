/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useJobContext } from "../../contexts/useJobContext";

const SearchBar = () => {
  const { handleSearch, loading, filters, error } = useJobContext();
  const [localQuery, setLocalQuery] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const jobCategories = [
    "Software Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UX/UI Designer",
    "Graphic Designer",
    "Product Manager",
    "Project Manager",
    "Data Analyst",
    "Data Scientist",
    "DevOps Engineer",
    "Marketing Specialist",
    "Content Writer",
  ];

  const employmentTypes = [
    { value: "", label: "All Employment Types" },
    { value: "FULLTIME", label: "Full-time" },
    { value: "CONTRACTOR", label: "Contractor" },
    { value: "PARTTIME", label: "Part-time" },
    { value: "INTERN", label: "Intern" },
  ];

  const datePostedOptions = [
    { value: "all", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "week", label: "Past week" },
    { value: "month", label: "Past month" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!localQuery.trim()) {
      setLocalError("Please enter a search term");
      return;
    }

    const formData = new FormData(e.target);
    const newFilters = {
      jobCategory: formData.get("jobCategory") || "",
      remoteJobsOnly: formData.get("remoteJobsOnly") === "on",
      employmentType: formData.get("employmentType") || "",
      datePosted: formData.get("datePosted") || "all",
    };

    handleSearch(localQuery, newFilters);
  };

  const onQueryChange = (e) => {
    setLocalQuery(e.target.value);
    if (localError) setLocalError("");
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-sm mb-4">
      {localError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-3"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill mr-2"></i>
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Search Input */}
        <div className="mb-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter job title, keywords, or company name..."
            value={localQuery}
            onChange={onQueryChange}
            aria-label="Search jobs"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-md text-lg disabled:opacity-50"
            disabled={loading || !localQuery.trim()}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Searching...
              </>
            ) : (
              <>
                <i className="bi bi-search mr-2"></i>
                Search
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label
              htmlFor="jobCategory"
              className="block text-sm text-gray-600 mb-1"
            >
              Job Category
            </label>
            <select
              id="jobCategory"
              name="jobCategory"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={filters.jobCategory}
            >
              <option value="">All Job Categories</option>
              {jobCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="employmentType"
              className="block text-sm text-gray-600 mb-1"
            >
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={filters.employmentType}
            >
              {employmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="datePosted"
              className="block text-sm text-gray-600 mb-1"
            >
              Date Posted
            </label>
            <select
              id="datePosted"
              name="datePosted"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={filters.datePosted}
            >
              {datePostedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remoteJobsOnly"
                id="remoteJobsOnly"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                defaultChecked={filters.remoteJobsOnly}
              />
              <label
                htmlFor="remoteJobsOnly"
                className="ml-2 text-sm text-gray-600"
              >
                Remote jobs only
              </label>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !localQuery.trim()}
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
