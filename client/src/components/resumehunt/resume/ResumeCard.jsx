import { useState } from 'react';
import { useResume } from '../../../contexts/ResumeContext';
import ResumePreviewModal from './ResumePreviewModal';

function ResumeCard({ resume }) {
    const { deleteResume, downloadResume } = useResume()
    const [isExpanded, setIsExpanded] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            deleteResume(resume.id)
        }
    }

    const handleDownload = () => {
        downloadResume(resume.id)
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const showPreview = () => {
        setShowModal(true)
    }

    return (
        <>
            <div className="card hover:shadow-lg animate-fade-in">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-secondary-900 truncate" title={resume.fileName}>
                        {resume.fileName}
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={toggleExpand}
                            className="text-secondary-500 hover:text-secondary-700"
                        >
                            {isExpanded ? (
                                <svg xmlns="http://www.w3.org/2000/svg\" className="h-5 w-5\" viewBox="0 0 20 20\" fill="currentColor">
                                    <path fillRule="evenodd\" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z\" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-2">
                    {resume.position && (
                        <div className="text-primary-700 font-medium">
                            {resume.position}
                        </div>
                    )}

                    {resume.yearsOfExperience && (
                        <div className="text-sm text-secondary-600 mt-1">
                            {resume.yearsOfExperience} {resume.yearsOfExperience === 1 ? 'year' : 'years'} of experience
                        </div>
                    )}
                </div>

                {/* Always visible skills section */}
                {resume.skills && resume.skills.length > 0 && (
                    <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                            {resume.skills.slice(0, isExpanded ? resume.skills.length : 3).map((skill, index) => (
                                <span key={index} className="badge-skill">
                                    {skill}
                                </span>
                            ))}
                            {!isExpanded && resume.skills.length > 3 && (
                                <span className="badge bg-secondary-100 text-secondary-800">
                                    +{resume.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Expandable content */}
                {isExpanded && (
                    <div className="mt-4 space-y-3 animate-slide-up">
                        {resume.education && (
                            <div>
                                <h4 className="text-xs font-medium text-secondary-500 uppercase">Education</h4>
                                <p className="text-sm text-secondary-700">{resume.education}</p>
                            </div>
                        )}

                        <div className="pt-2 flex justify-between border-t border-secondary-200">
                            <button
                                onClick={showPreview}
                                className="text-sm text-primary-600 hover:text-primary-800"
                            >
                                View Preview
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    onClick={handleDownload}
                                    className="text-sm text-secondary-600 hover:text-secondary-800"
                                >
                                    Download
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-sm text-error-600 hover:text-error-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <ResumePreviewModal
                    resume={resume}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    )
}

export default ResumeCard