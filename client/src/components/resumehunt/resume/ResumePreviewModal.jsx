function ResumePreviewModal({ resume, onClose }) {
    // Prevent background scrolling when modal is open
    const handleContainerClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-secondary-900/75 flex items-center justify-center p-4 z-50"
            onClick={handleContainerClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in">
                <div className="flex justify-between items-center px-6 py-4 border-b border-secondary-200">
                    <h3 className="text-xl font-semibold text-secondary-900 truncate">
                        {resume.fileName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-secondary-500 hover:text-secondary-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {resume.position && (
                            <div>
                                <h4 className="text-sm font-medium text-secondary-500 uppercase">Position</h4>
                                <p className="text-lg font-medium text-secondary-900">{resume.position}</p>
                            </div>
                        )}

                        {resume.yearsOfExperience && (
                            <div>
                                <h4 className="text-sm font-medium text-secondary-500 uppercase">Experience</h4>
                                <p className="text-secondary-900">{resume.yearsOfExperience} years</p>
                            </div>
                        )}

                        {resume.skills && resume.skills.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-secondary-500 uppercase">Skills</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {resume.skills.map((skill, index) => (
                                        <span key={index} className="badge-skill">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {resume.education && (
                            <div>
                                <h4 className="text-sm font-medium text-secondary-500 uppercase">Education</h4>
                                <p className="text-secondary-900">{resume.education}</p>
                            </div>
                        )}

                        <div>
                            <h4 className="text-sm font-medium text-secondary-500 uppercase">Full Text</h4>
                            <div className="mt-2 p-4 bg-secondary-50 rounded-md text-sm text-secondary-800 max-h-60 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-sans">{resume.fullText}</pre>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-secondary-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResumePreviewModal