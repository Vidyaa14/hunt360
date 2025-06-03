function UploadedList({ files }) {
    if (!files || files.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Recently Uploaded ({files.length})</h3>

            <div className="border border-secondary-200 rounded-lg divide-y divide-secondary-200">
                {files.map((file, index) => (
                    <div key={index} className="p-4 flex justify-between items-center">
                        <div>
                            <div className="font-medium text-secondary-900">{file.fileName}</div>
                            <div className="text-sm text-secondary-500">
                                {file.position ? file.position : 'Position not detected'}
                                {file.skills && file.skills.length > 0 && (
                                    <span> • {file.skills.length} skills detected</span>
                                )}
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-success-100 text-success-800 text-xs font-medium rounded-full">
                            Saved
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UploadedList