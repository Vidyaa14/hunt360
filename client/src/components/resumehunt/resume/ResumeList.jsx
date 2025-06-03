import ResumeCard from './ResumeCard'

function ResumeList({ resumes }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
            ))}
        </div>
    )
}

export default ResumeList