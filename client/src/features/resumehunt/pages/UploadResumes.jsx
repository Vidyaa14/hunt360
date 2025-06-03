import { useState } from 'react'
import ResumeUploader from '../../../components/resumehunt/upload/ResumeUploader'
import UploadedList from '../../../components/resumehunt/upload/UploadedList'
import SuccessMessage from '../../../components/resumehunt/common/SuccessMessage'

function UploadResumes() {
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)

    const handleFilesUploaded = (files) => {
        setUploadedFiles(files)
        setShowSuccess(true)

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccess(false)
        }, 3000)
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-secondary-900">Upload Resumes</h2>
                <p className="text-secondary-600">
                    Upload .doc or .docx resume files to extract and store important information.
                    Your resumes will be stored locally in your browser.
                </p>
            </div>

            {showSuccess && (
                <SuccessMessage
                    count={uploadedFiles.length}
                    onDismiss={() => setShowSuccess(false)}
                />
            )}

            <ResumeUploader onFilesUploaded={handleFilesUploaded} />

            {uploadedFiles.length > 0 && (
                <UploadedList files={uploadedFiles} />
            )}
        </div>
    )
}

export default UploadResumes