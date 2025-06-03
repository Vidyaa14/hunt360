/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { parseResume } from '../utils/resumeParser'
import { saveAs } from 'file-saver'

const ResumeContext = createContext()

export function ResumeProvider({ children }) {
    const [resumes, setResumes] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Load resumes from localStorage on initial render
    useEffect(() => {
        const storedResumes = localStorage.getItem('resumes')
        if (storedResumes) {
            try {
                setResumes(JSON.parse(storedResumes))
            } catch (error) {
                console.error('Failed to parse stored resumes:', error)
                localStorage.removeItem('resumes')
            }
        }
    }, [])

    // Update localStorage whenever resumes change
    useEffect(() => {
        localStorage.setItem('resumes', JSON.stringify(resumes))
    }, [resumes])

    const parseAndSaveResumes = async (files) => {
        setIsLoading(true)

        try {
            const parsedResumes = []

            for (const file of files) {
                const parsedResume = await parseResume(file)

                // Generate a unique ID
                const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

                const resumeData = {
                    id,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    uploadDate: new Date().toISOString(),
                    ...parsedResume,
                    // Store file as a blob for downloading later
                    file: file
                }

                parsedResumes.push(resumeData)
            }

            // Add new resumes to state
            setResumes(prevResumes => [...prevResumes, ...parsedResumes])

            return parsedResumes
        } catch (error) {
            console.error('Error parsing resumes:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deleteResume = (id) => {
        setResumes(prevResumes => prevResumes.filter(resume => resume.id !== id))
    }

    const downloadResume = (id) => {
        const resume = resumes.find(resume => resume.id === id)
        if (resume && resume.file) {
            saveAs(resume.file, resume.fileName)
        }
    }

    return (
        <ResumeContext.Provider
            value={{
                resumes,
                isLoading,
                parseAndSaveResumes,
                deleteResume,
                downloadResume
            }}
        >
            {children}
        </ResumeContext.Provider>
    )
}

export function useResume() {
    const context = useContext(ResumeContext)
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider')
    }
    return context
}