import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useResume } from '../../../contexts/ResumeContext'

function ResumeUploader({ onFilesUploaded }) {
    const { parseAndSaveResumes } = useResume()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const onDrop = useCallback(async (acceptedFiles) => {
        setIsLoading(true)
        setError(null)

        try {
            // Filter out unsupported file types
            const docxFiles = acceptedFiles.filter(file =>
                file.name.endsWith('.docx') || file.name.endsWith('.doc')
            )

            if (docxFiles.length === 0) {
                throw new Error('Only .doc and .docx files are supported')
            }

            if (docxFiles.length !== acceptedFiles.length) {
                console.warn('Some files were skipped because they are not .doc or .docx files')
            }

            // Parse and save the resumes
            const savedResumes = await parseAndSaveResumes(docxFiles)
            onFilesUploaded(savedResumes)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [parseAndSaveResumes, onFilesUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc']
        }
    })

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-300 hover:border-primary-400 hover:bg-secondary-50'
                    }`}
            >
                <input {...getInputProps()} />

                <div className="space-y-3">
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>

                    <div>
                        <p className="text-lg font-medium text-secondary-900">
                            {isDragActive ? 'Drop your resumes here' : 'Drag & drop resumes here'}
                        </p>
                        <p className="text-secondary-500 mt-1">
                            or click to browse your files
                        </p>
                    </div>

                    <p className="text-xs text-secondary-500">
                        Supported file types: .doc, .docx
                    </p>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-400 border-t-transparent"></div>
                    <p className="mt-2 text-secondary-600">Processing resumes...</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-md text-error-700">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}
        </div>
    )
}

export default ResumeUploader