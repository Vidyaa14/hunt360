/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import SearchBar from '../../../components/resumehunt/search/SearchBar';
import FilterSection from '../../../components/resumehunt/search/FilterSection';
import ResumeList from '../../../components/resumehunt/resume/ResumeList';
import EmptyState from '../../../components/resumehunt/common/EmptyState';

function SearchResumes() {
    const { resumes } = useResume()
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({
        position: '',
        experience: '',
        industry: '',
        salary: ''
    })
    const [filteredResumes, setFilteredResumes] = useState([])

    // Extract unique values for filter options
    const positions = [...new Set(resumes.map(r => r.position).filter(Boolean))]
    const experiences = ['Entry Level', 'Mid Level', 'Senior Level']
    const industries = [...new Set(resumes.map(r => r.industry).filter(Boolean))]

    // Apply search and filters
    useEffect(() => {
        let results = [...resumes]

        // Apply search
        if (searchQuery) {
            const searchTerms = searchQuery.toLowerCase().split(/\s+AND\s+|\s+OR\s+|\s+/)
            const hasAND = searchQuery.includes(' AND ')
            const hasOR = searchQuery.includes(' OR ')

            if (hasAND) {
                results = results.filter(resume => {
                    return searchTerms.every(term => {
                        const searchableText = `${resume.fullText} ${resume.position} ${resume.skills.join(' ')} ${resume.education}`.toLowerCase()
                        return searchableText.includes(term)
                    })
                })
            } else {
                results = results.filter(resume => {
                    return searchTerms.some(term => {
                        const searchableText = `${resume.fullText} ${resume.position} ${resume.skills.join(' ')} ${resume.education}`.toLowerCase()
                        return searchableText.includes(term)
                    })
                })
            }
        }

        // Apply filters
        if (filters.position) {
            results = results.filter(r => r.position === filters.position)
        }

        if (filters.experience) {
            results = results.filter(r => {
                if (filters.experience === 'Entry Level') return r.yearsOfExperience <= 2
                if (filters.experience === 'Mid Level') return r.yearsOfExperience > 2 && r.yearsOfExperience <= 5
                if (filters.experience === 'Senior Level') return r.yearsOfExperience > 5
                return true
            })
        }

        if (filters.industry) {
            results = results.filter(r => r.industry === filters.industry)
        }

        setFilteredResumes(results)
    }, [resumes, searchQuery, filters])

    if (resumes.length === 0) {
        return <EmptyState type="no-resumes" />
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-secondary-900">
                    <span className="text-primary-600">Resumes</span> ({resumes.length})
                </h2>

                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <FilterSection
                    filters={filters}
                    setFilters={setFilters}
                    positions={positions}
                    experiences={experiences}
                    industries={industries}
                />
            </div>

            {filteredResumes.length > 0 ? (
                <ResumeList resumes={filteredResumes} />
            ) : (
                <EmptyState type="no-results" />
            )}
        </div>
    )
}

export default SearchResumes