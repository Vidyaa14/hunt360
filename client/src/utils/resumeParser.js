import mammoth from 'mammoth'

// Extract position/role using common patterns
function extractPosition(text) {
    // Look for patterns like "Position: Software Engineer" or "Role: Data Scientist"
    const positionMatch = text.match(/(?:position|role|title|job|designation)[\s:]+([^\n.,]+)/i)

    if (positionMatch && positionMatch[1]) {
        return positionMatch[1].trim()
    }

    // Try to extract from the first few lines (often contains the job title)
    const firstLines = text.split('\n').slice(0, 5).join(' ')
    const commonTitles = [
        'Software Engineer', 'Frontend Developer', 'Backend Developer',
        'Full Stack Developer', 'Data Scientist', 'Product Manager',
        'Project Manager', 'UX Designer', 'UI Designer', 'DevOps Engineer',
        'QA Engineer', 'Web Developer', 'Mobile Developer',
        'Machine Learning Engineer', 'Business Analyst'
    ]

    for (const title of commonTitles) {
        if (firstLines.includes(title)) {
            return title
        }
    }

    return null
}

// Extract skills from the text
function extractSkills(text) {
    const commonSkills = [
        'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
        'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'PHP', 'Laravel',
        'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'Ruby',
        'Rails', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
        'Git', 'REST API', 'GraphQL', 'Redux', 'HTML', 'CSS', 'Sass',
        'LESS', 'Tailwind', 'Bootstrap', 'Material UI', 'Figma', 'Sketch',
        'Adobe XD', 'Photoshop', 'Illustrator', 'Agile', 'Scrum', 'Jira',
        'TDD', 'BDD', 'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium',
        'Swift', 'Kotlin', 'Flutter', 'React Native', 'Firebase', 'Redux',
        'MobX', 'Svelte', 'WebSockets', 'Machine Learning', 'AI',
        'Data Analysis', 'Power BI', 'Tableau', 'Excel', 'VBA',
        'Linux', 'Windows', 'MacOS', 'iOS', 'Android', 'Webpack', 'Babel'
    ]

    // Look for skills section
    const skillsSection = text.match(/(?:skills|technical skills|core competencies|technologies)[\s:]+([^\n]+(?:\n[^\n]+)*)/i)

    const foundSkills = []

    if (skillsSection && skillsSection[1]) {
        const skillsText = skillsSection[1]

        // Check each skill against the skills text
        for (const skill of commonSkills) {
            const skillRegex = new RegExp(`\\b${skill}\\b`, 'i')
            if (skillRegex.test(skillsText)) {
                foundSkills.push(skill)
            }
        }
    }

    // If no skills section found or few skills found, search the entire text
    if (foundSkills.length < 5) {
        for (const skill of commonSkills) {
            const skillRegex = new RegExp(`\\b${skill}\\b`, 'i')
            if (skillRegex.test(text) && !foundSkills.includes(skill)) {
                foundSkills.push(skill)
            }
        }
    }

    return foundSkills
}

// Extract years of experience
function extractYearsOfExperience(text) {
    // Look for patterns like "5 years of experience" or "experienced for 7 years"
    const yearsMatch = text.match(/(\d+)[\s-]*(year|yr|years|yrs)[\s-]*(of)?[\s-]*(experience|exp)/i)

    if (yearsMatch && yearsMatch[1]) {
        return parseInt(yearsMatch[1], 10)
    }

    // Count the number of different positions/employers as a rough estimate
    const employmentSections = text.match(/(\d{4}[\s-]+\d{4}|\d{4}[\s-]+present)/gi)
    if (employmentSections && employmentSections.length > 0) {
        return Math.min(employmentSections.length, 15) // Cap at 15 years
    }

    return null
}

// Extract education information
function extractEducation(text) {
    // Look for education section
    const educationSection = text.match(/(?:education|academic background)[\s:]+([^\n]+(?:\n[^\n]+)*)/i)

    if (educationSection && educationSection[1]) {
        return educationSection[1].trim()
    }

    // Look for common degree patterns
    const degreeMatch = text.match(/(Bachelor|Master|PhD|BSc|MSc|MBA|BA|BS|MS|MD|JD)[\s\w]+(\d{4}|\d{4}[\s-]+\d{4})/i)

    if (degreeMatch) {
        return degreeMatch[0].trim()
    }

    return null
}

// Main parsing function
export async function parseResume(file) {
    try {
        // Read file contents
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
        const text = result.value

        // Extract information
        const position = extractPosition(text)
        const skills = extractSkills(text)
        const yearsOfExperience = extractYearsOfExperience(text)
        const education = extractEducation(text)

        // Parse some industry information if possible
        let industry = null
        const industryMatch = text.match(/(?:industry|sector|field)[\s:]+([^\n.,]+)/i)
        if (industryMatch && industryMatch[1]) {
            industry = industryMatch[1].trim()
        }

        return {
            fullText: text,
            position,
            skills,
            yearsOfExperience,
            education,
            industry,
            parseDate: new Date().toISOString()
        }
    } catch (error) {
        console.error('Error parsing resume:', error)
        throw new Error('Failed to parse resume. Please make sure it is a valid .doc or .docx file.')
    }
}