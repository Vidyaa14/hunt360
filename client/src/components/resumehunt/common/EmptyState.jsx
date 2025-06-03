function EmptyState({ type }) {
    if (type === 'no-resumes') {
        return (
            <div className="text-center py-16">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-secondary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No resumes</h3>
                <p className="mt-1 text-sm text-secondary-500">
                    You haven't uploaded any resumes yet.
                </p>
                <div className="mt-6">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                            document.querySelector('[data-tab="upload"]')?.click()
                        }}
                    >
                        Upload Resumes
                    </button>
                </div>
            </div>
        )
    }

    if (type === 'no-results') {
        return (
            <div className="text-center py-16">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-secondary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No matching resumes</h3>
                <p className="mt-1 text-sm text-secondary-500">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
            </div>
        )
    }

    return null
}

export default EmptyState