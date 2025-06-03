function FilterSection({ filters, setFilters, positions, experiences, industries }) {
    const handleFilterChange = (filterName, value) => {
        setFilters({
            ...filters,
            [filterName]: value
        })
    }

    const clearFilters = () => {
        setFilters({
            position: '',
            experience: '',
            industry: '',
            salary: ''
        })
    }

    const isFiltersApplied = Object.values(filters).some(value => value !== '')

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-secondary-900">Filter by</h3>
                {isFiltersApplied && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-primary-600 hover:text-primary-800"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select
                    className="select"
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                >
                    <option value="">All Positions</option>
                    {positions.map((position) => (
                        <option key={position} value={position}>{position}</option>
                    ))}
                </select>

                <select
                    className="select"
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                    <option value="">All Levels</option>
                    {experiences.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                    ))}
                </select>

                <select
                    className="select"
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                >
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                    ))}
                </select>

                <select
                    className="select"
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                >
                    <option value="">Any Salary</option>
                    <option value="0-50000">$0 - $50,000</option>
                    <option value="50000-100000">$50,000 - $100,000</option>
                    <option value="100000-150000">$100,000 - $150,000</option>
                    <option value="150000+">$150,000+</option>
                </select>
            </div>
        </div>
    )
}

export default FilterSection