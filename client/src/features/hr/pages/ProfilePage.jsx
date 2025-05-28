import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const purple = '#a000c8';
const hoverPurple = '#8a00c2';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 60px 1rem 1rem 1rem; /* Default for mobile */
  background-color: #f9fafb;

  @media (min-width: 641px) {
    padding: 70px 1.5rem 1.5rem 1.5rem;
  }

  @media (min-width: 1025px) {
    padding: 80px 2rem 2rem 2rem;
  }
`;

const ProfileWrapper = styled.div`
  width: 100%;
  max-width: 600px; /* Default for mobile */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Default for mobile */

  @media (min-width: 641px) {
    max-width: 700px;
    gap: 1.25rem;
  }

  @media (min-width: 1025px) {
    max-width: 800px;
    gap: 1.5rem;
  }
`;

const HeaderCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem; /* Default for mobile */
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(160, 0, 200, 0.3);
  text-align: center;

  @media (min-width: 641px) {
    padding: 1.5rem;
  }

  @media (min-width: 1025px) {
    padding: 2rem;
  }
`;

const ProfilePicture = styled.div`
  width: 80px; /* Default for mobile */
  height: 80px;
  background-color: #e2e8f0;
  border-radius: 50%;
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    width: 90px;
    height: 90px;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }
`;

const UserName = styled.h2`
  font-size: 1.25rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.2rem;

  @media (min-width: 641px) {
    font-size: 1.375rem;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.5rem;
  }
`;

const JobTitle = styled.p`
  font-size: 0.875rem; /* Default for mobile */
  color: #718096;
  margin-bottom: 0.2rem;

  @media (min-width: 641px) {
    font-size: 0.9375rem;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
  }
`;

const UserInfo = styled.p`
  font-size: 0.8rem; /* Default for mobile */
  color: #718096;
  margin: 0.2rem 0;

  @media (min-width: 641px) {
    font-size: 0.85rem;
    margin: 0.25rem 0;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const EditButton = styled.button`
  margin-top: 0.75rem; /* Default for mobile */
  padding: 0.5rem 1rem; /* Default for mobile */
  background-color: ${purple};
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem; /* Default for mobile */
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${hoverPurple};
  }

  @media (min-width: 641px) {
    margin-top: 0.875rem;
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
`;

const Section = styled.div`
  background-color: #fff;
  padding: 1rem; /* Default for mobile */
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(160, 0, 200, 0.3);

  @media (min-width: 641px) {
    padding: 1.25rem;
  }

  @media (min-width: 1025px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    font-size: 1.125rem;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const SummaryText = styled.p`
  font-size: 0.8rem; /* Default for mobile */
  color: #718096;
  line-height: 1.4;

  @media (min-width: 641px) {
    font-size: 0.85rem;
    line-height: 1.45;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem; /* Default for mobile */

  @media (min-width: 641px) {
    gap: 0.5rem;
  }
`;

const SkillTag = styled.span`
  background-color: #e2e8f0;
  color: #4A5568;
  padding: 0.2rem 0.5rem; /* Default for mobile */
  border-radius: 0.25rem;
  font-size: 0.8rem; /* Default for mobile */

  @media (min-width: 641px) {
    padding: 0.25rem 0.625rem;
    font-size: 0.85rem;
  }

  @media (min-width: 1025px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 0.4rem; /* Default for mobile */

  @media (min-width: 641px) {
    margin-bottom: 0.5rem;
  }
`;

const WorkExperienceItem = styled.div`
  margin-bottom: 0.75rem; /* Default for mobile */

  @media (min-width: 641px) {
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    margin-bottom: 1rem;
  }
`;

const WorkTitle = styled.h4`
  font-size: 0.875rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.2rem;

  @media (min-width: 641px) {
    font-size: 0.9375rem;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
  }
`;

const WorkDetails = styled.p`
  font-size: 0.8rem; /* Default for mobile */
  color: #718096;

  @media (min-width: 641px) {
    font-size: 0.85rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const ViewMoreLink = styled.button`
  background: none;
  border: none;
  color: ${purple};
  font-size: 0.8rem; /* Default for mobile */
  cursor: pointer;
  padding: 0;
  margin-top: 0.4rem;

  &:hover {
    color: ${hoverPurple};
  }

  @media (min-width: 641px) {
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const ResumeButton = styled.button`
  padding: 0.4rem 0.75rem; /* Default for mobile */
  background-color: ${purple};
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8rem; /* Default for mobile */
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${hoverPurple};
  }

  @media (min-width: 641px) {
    padding: 0.5rem 0.875rem;
    font-size: 0.85rem;
  }

  @media (min-width: 1025px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 0.75rem; /* Default for mobile */

  @media (min-width: 641px) {
    gap: 1rem;
  }
`;

const LinkItem = styled.a`
  color: ${purple};
  text-decoration: none;
  font-size: 0.8rem; /* Default for mobile */

  &:hover {
    color: ${hoverPurple};
  }

  @media (min-width: 641px) {
    font-size: 0.85rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const PreferenceItem = styled.p`
  font-size: 0.8rem; /* Default for mobile */
  color: #718096;
  margin: 0.2rem 0;

  @media (min-width: 641px) {
    font-size: 0.85rem;
    margin: 0.25rem 0;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem; /* Default for mobile */
  font-size: 0.8rem; /* Default for mobile */
  color: #718096;

  @media (min-width: 641px) {
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const ToggleSwitch = styled.input`
  margin: 0;
`;

const RecruiterSection = styled.div`
  background-color: #fff;
  padding: 1rem; /* Default for mobile */
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(160, 0, 200, 0.3);

  @media (min-width: 641px) {
    padding: 1.25rem;
  }

  @media (min-width: 1025px) {
    padding: 1.5rem;
  }
`;

const CompanyLogo = styled.div`
  width: 32px; /* Default for mobile */
  height: 32px;
  background-color: #e2e8f0;
  border-radius: 0.25rem;
  margin-right: 0.4rem;

  @media (min-width: 641px) {
    width: 36px;
    height: 36px;
    margin-right: 0.5rem;
  }

  @media (min-width: 1025px) {
    width: 40px;
    height: 40px;
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem; /* Default for mobile */

  @media (min-width: 641px) {
    margin-bottom: 0.5rem;
  }
`;

const OpenPosition = styled.p`
  font-size: 0.8rem; /* Default for mobile */
  color: #718096;
  margin: 0.2rem 0;

  @media (min-width: 641px) {
    font-size: 0.85rem;
    margin: 0.25rem 0;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const ProfilePage = () => {
    const navigate = useNavigate();
    // Placeholder user data (in a real app, this would come from state or API)
    const user = {
        role: 'client', // Can be 'client', 'recruiter', etc.
        fullName: 'John Doe',
        jobTitle: 'Software Engineer',
        companyName: 'Tech Corp',
        location: 'New York, NY',
        experienceLevel: '3+ years experience',
        summary: 'Experienced Software Engineer with a passion for building scalable web applications. Skilled in JavaScript, React, and Node.js. Seeking opportunities in tech startups.',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        education: {
            degree: 'B.S. in Computer Science',
            school: 'University of New York',
            year: '2019',
        },
        workExperience: [
            {
                jobTitle: 'Software Engineer',
                company: 'Tech Corp',
                duration: '2020 - Present',
            },
            {
                jobTitle: 'Junior Developer',
                company: 'Startup Inc',
                duration: '2019 - 2020',
            },
        ],
        resumeUrl: '#',
        links: {
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            portfolio: 'https://johndoeportfolio.com',
        },
        jobPreferences: {
            roles: 'Software Engineer, Full-Stack Developer',
            location: 'Remote',
            type: 'Full-time',
            openToWork: true,
        },
        contactInfo: {
            email: 'john.doe@example.com',
            phone: '555-555-9902',
        },
        // Recruiter-specific fields
        hiringIndustries: ['Technology', 'Finance'],
        openPositions: ['Senior Developer', 'Product Manager'],
        companyWebsite: 'https://techcorp.com',
    };

    const handleEditProfile = () => {
        navigate('/profile-settings');
    };

    return (
        <div>
            <ProfileContainer>
                <ProfileWrapper>
                    {/* Header Card */}
                    <HeaderCard>
                        <ProfilePicture />
                        <UserName>{user.fullName}</UserName>
                        <JobTitle>{user.jobTitle}</JobTitle>
                        {user.companyName && <UserInfo>Company: {user.companyName}</UserInfo>}
                        <UserInfo>Location: {user.location}</UserInfo>
                        <UserInfo>Experience: {user.experienceLevel}</UserInfo>
                        <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
                    </HeaderCard>

                    {/* About Me / Summary */}
                    <Section>
                        <SectionTitle>About Me</SectionTitle>
                        <SummaryText>{user.summary}</SummaryText>
                    </Section>

                    {/* Skills */}
                    <Section>
                        <SectionTitle>Skills</SectionTitle>
                        <SkillsContainer>
                            {user.skills.map((skill, index) => (
                                <SkillTag key={index}>{skill}</SkillTag>
                            ))}
                        </SkillsContainer>
                    </Section>

                    {/* Education */}
                    <Section>
                        <SectionTitle>Education</SectionTitle>
                        <EducationItem>
                            <WorkTitle>{user.education.degree}</WorkTitle>
                            <WorkDetails>{user.education.school}, {user.education.year}</WorkDetails>
                        </EducationItem>
                    </Section>

                    {/* Work Experience */}
                    <Section>
                        <SectionTitle>Work Experience</SectionTitle>
                        {user.workExperience.map((job, index) => (
                            <WorkExperienceItem key={index}>
                                <WorkTitle>{job.jobTitle}</WorkTitle>
                                <WorkDetails>{job.company}, {job.duration}</WorkDetails>
                            </WorkExperienceItem>
                        ))}
                        <ViewMoreLink>View More</ViewMoreLink>
                    </Section>

                    {/* Resume */}
                    <Section>
                        <SectionTitle>Resume</SectionTitle>
                        <ResumeButton as="a" href={user.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View/Download Resume
                        </ResumeButton>
                    </Section>

                    {/* Links / Social Profiles */}
                    <Section>
                        <SectionTitle>Links</SectionTitle>
                        <LinksContainer>
                            {user.links.linkedin && <LinkItem href={user.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</LinkItem>}
                            {user.links.github && <LinkItem href={user.links.github} target="_blank" rel="noopener noreferrer">GitHub</LinkItem>}
                            {user.links.portfolio && <LinkItem href={user.links.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</LinkItem>}
                        </LinksContainer>
                    </Section>

                    {/* Job Preferences */}
                    {user.role !== 'recruiter' && (
                        <Section>
                            <SectionTitle>Job Preferences</SectionTitle>
                            <PreferenceItem>Preferred Roles: {user.jobPreferences.roles}</PreferenceItem>
                            <PreferenceItem>Preferred Location: {user.jobPreferences.location}</PreferenceItem>
                            <PreferenceItem>Job Type: {user.jobPreferences.type}</PreferenceItem>
                            <ToggleLabel>
                                Open to Work: <ToggleSwitch type="checkbox" checked={user.jobPreferences.openToWork} disabled />
                            </ToggleLabel>
                        </Section>
                    )}

                    {/* Contact Info */}
                    <Section>
                        <SectionTitle>Contact Info</SectionTitle>
                        <PreferenceItem>Email: {user.contactInfo.email}</PreferenceItem>
                        {user.contactInfo.phone && <PreferenceItem>Phone: {user.contactInfo.phone}</PreferenceItem>}
                    </Section>

                    {/* Recruiter-Specific Section */}
                    {user.role === 'recruiter' && (
                        <RecruiterSection>
                            <SectionTitle>Recruiter Profile</SectionTitle>
                            <CompanyInfo>
                                <CompanyLogo />
                                <div>
                                    <WorkTitle>{user.companyName}</WorkTitle>
                                    <WorkDetails>Hiring in: {user.hiringIndustries.join(', ')}</WorkDetails>
                                </div>
                            </CompanyInfo>
                            <SectionTitle>Open Positions</SectionTitle>
                            {user.openPositions.map((position, index) => (
                                <OpenPosition key={index}>{position}</OpenPosition>
                            ))}
                            <LinkItem href={user.companyWebsite} target="_blank" rel="noopener noreferrer">
                                Visit Company Website
                            </LinkItem>
                        </RecruiterSection>
                    )}
                </ProfileWrapper>
            </ProfileContainer>
        </div>
    );
};

export default ProfilePage;