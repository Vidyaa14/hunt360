function SuccessMessage({ count, onDismiss }) {
    return (
        <div className="bg-success-50 border border-success-200 rounded-md p-4 flex items-start animate-fade-in">
            <div className="flex-shrink-0 pt-0.5">
                <svg
                    className="h-5 w-5 text-success-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-success-800">
                    Success!
                </h3>
                <div className="mt-1 text-sm text-success-700">
                    {count} {count === 1 ? 'resume' : 'resumes'} uploaded and processed successfully.
                </div>
            </div>
            <div className="ml-4 flex-shrink-0">
                <button
                    type="button"
                    className="inline-flex text-success-500 hover:text-success-700"
                    onClick={onDismiss}
                >
                    <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default SuccessMessage