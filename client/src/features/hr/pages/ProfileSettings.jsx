import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const purple = '#a000c8';
const hoverPurple = '#8a00c2';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 60px 1rem 1rem 1rem; /* Default for mobile */
  background-color: #fff;

  @media (min-width: 641px) {
    padding: 70px 1.5rem 1.5rem 1.5rem;
  }

  @media (min-width: 1025px) {
    padding: 80px 2rem 2rem 2rem;
  }
`;

const SettingsTitle = styled.h1`
  font-size: 1.5rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.4rem;

  @media (min-width: 641px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1025px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem; /* Default for mobile */
  color: #718096;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 641px) {
    font-size: 0.9375rem;
    margin-bottom: 1.75rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const FormSection = styled.div`
  width: 100%;
  max-width: 400px; /* Default for mobile */
  margin-bottom: 1.5rem;

  @media (min-width: 641px) {
    max-width: 500px;
    margin-bottom: 1.75rem;
  }

  @media (min-width: 1025px) {
    max-width: 600px;
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    font-size: 1.375rem;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Default for mobile */

  @media (min-width: 641px) {
    gap: 0.875rem;
  }

  @media (min-width: 1025px) {
    gap: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem; /* Default for mobile */
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* Default for mobile */
  color: #4A5568;

  &::placeholder {
    color: #a0aec0;
  }

  @media (min-width: 641px) {
    padding: 0.625rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem; /* Default for mobile */
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* Default for mobile */
  color: #4A5568;
  resize: vertical;
  min-height: 80px; /* Default for mobile */

  @media (min-width: 641px) {
    padding: 0.625rem;
    font-size: 0.9375rem;
    min-height: 90px;
  }

  @media (min-width: 1025px) {
    padding: 0.75rem;
    font-size: 1rem;
    min-height: 100px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem; /* Default for mobile */
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* Default for mobile */
  color: #4A5568;

  @media (min-width: 641px) {
    padding: 0.625rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const Label = styled.label`
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

const UploadSection = styled.div`
  margin-bottom: 1.5rem; /* Default for mobile */

  @media (min-width: 641px) {
    margin-bottom: 1.75rem;
  }

  @media (min-width: 1025px) {
    margin-bottom: 2rem;
  }
`;

const UploadLabel = styled.label`
  display: inline-block;
  padding: 0.4rem 0.75rem; /* Default for mobile */
  background-color: #e2e8f0;
  color: #4A5568;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem; /* Default for mobile */

  &:hover {
    background-color: #d1d5db;
  }

  @media (min-width: 641px) {
    padding: 0.5rem 0.875rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
`;

const NotificationSection = styled.div`
  width: 100%;
  max-width: 400px; /* Default for mobile */

  @media (min-width: 641px) {
    max-width: 500px;
  }

  @media (min-width: 1025px) {
    max-width: 600px;
  }
`;

const NotificationOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem; /* Default for mobile */
  font-size: 0.875rem; /* Default for mobile */
  color: #4A5568;

  @media (min-width: 641px) {
    margin-bottom: 0.875rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 32px; /* Default for mobile */
  height: 16px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e2e8f0;
    transition: background-color 0.3s ease;
    border-radius: 16px;
  }

  span:before {
    position: absolute;
    content: '';
    height: 12px; /* Default for mobile */
    width: 12px;
    left: 2px;
    bottom: 2px;
    background-color: #fff;
    transition: transform 0.3s ease;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ${purple};
  }

  input:checked + span:before {
    transform: translateX(16px); /* Default for mobile */
  }

  @media (min-width: 641px) {
    width: 36px;
    height: 18px;

    span {
      border-radius: 18px;
    }

    span:before {
      height: 14px;
      width: 14px;
    }

    input:checked + span:before {
      transform: translateX(18px);
    }
  }

  @media (min-width: 1025px) {
    width: 40px;
    height: 20px;

    span {
      border-radius: 20px;
    }

    span:before {
      height: 16px;
      width: 16px;
    }

    input:checked + span:before {
      transform: translateX(20px);
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem; /* Default for mobile */
  margin-top: 0.75rem;

  @media (min-width: 641px) {
    gap: 0.875rem;
    margin-top: 0.875rem;
  }

  @media (min-width: 1025px) {
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem; /* Default for mobile */
  background-color: ${props => (props.primary ? purple : '#e2e8f0')};
  color: ${props => (props.primary ? '#fff' : '#4A5568')};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem; /* Default for mobile */
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => (props.primary ? hoverPurple : '#d1d5db')};
  }

  @media (min-width: 641px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 0.8rem; /* Default for mobile */
  margin-top: 0.2rem;

  @media (min-width: 641px) {
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const SuccessMessage = styled.p`
  color: #38a169;
  font-size: 0.875rem; /* Default for mobile */
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    font-size: 0.9375rem;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const ProfileSettings = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-555-9902',
        locationCity: 'New York',
        locationState: 'NY',
        locationCountry: 'USA',
        bio: 'Experienced software engineer with a passion for building scalable web applications.',
        currentJobTitle: 'Software Engineer',
        currentCompany: 'Tech Corp',
        yearsExperience: '5',
        workExperience: [{ title: 'Software Engineer', company: 'Tech Corp', startDate: '2020-01', endDate: 'Present', responsibilities: 'Developed web applications.' }],
        skills: ['JavaScript', 'React', 'Node.js'],
        education: [{ degree: 'B.S. Computer Science', institution: 'State University', year: '2019', field: 'Computer Science' }],
        preferredRoles: 'Senior Software Engineer, Full Stack Developer',
        preferredIndustries: 'Tech, Finance',
        jobType: 'Full-time',
        workSetup: 'Remote',
        willingToRelocate: 'Yes',
        availability: '2 weeks',
        linkedIn: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        portfolio: 'https://johndoe.com',
        profilePublic: true,
        showResume: true,
        openToWork: true,
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.bio.length > 500) newErrors.bio = 'Bio must be 500 characters or less';
        if (!formData.currentJobTitle.trim()) newErrors.currentJobTitle = 'Current job title is required';
        if (!formData.currentCompany.trim()) newErrors.currentCompany = 'Current company is required';
        if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required';
        if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
        if (formData.education.length === 0) newErrors.education = 'At least one education entry is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayInput = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleWorkExperienceChange = (index, field, value) => {
        const updatedWork = [...formData.workExperience];
        updatedWork[index][field] = value;
        setFormData({ ...formData, workExperience: updatedWork });
    };

    const addWorkExperience = () => {
        setFormData({
            ...formData,
            workExperience: [...formData.workExperience, { title: '', company: '', startDate: '', endDate: '', responsibilities: '' }],
        });
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...formData.education];
        updatedEducation[index][field] = value;
        setFormData({ ...formData, education: updatedEducation });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { degree: '', institution: '', year: '', field: '' }],
        });
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Saving profile changes:', formData);
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 2000);
        }
    };

    const handleBackToHome = () => {
        navigate('/dashboard');
    };

    return (
        <div>
            <SettingsContainer>
                <SettingsTitle>Edit Profile</SettingsTitle>
                <Subtitle>
                    Update your profile details to showcase your skills and experience to potential employers.
                </Subtitle>

                {success && <SuccessMessage>Profile updated successfully!</SuccessMessage>}

                <FormSection>
                    <SectionTitle>Basic Information</SectionTitle>
                    <Form onSubmit={handleSaveChanges}>
                        <div>
                            <Label>Full Name *</Label>
                            <Input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
                        </div>
                        <div>
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <Label>City</Label>
                            <Input
                                type="text"
                                name="locationCity"
                                value={formData.locationCity}
                                onChange={handleInputChange}
                                placeholder="Enter your city"
                            />
                        </div>
                        <div>
                            <Label>State</Label>
                            <Input
                                type="text"
                                name="locationState"
                                value={formData.locationState}
                                onChange={handleInputChange}
                                placeholder="Enter your state"
                            />
                        </div>
                        <div>
                            <Label>Country</Label>
                            <Input
                                type="text"
                                name="locationCountry"
                                value={formData.locationCountry}
                                onChange={handleInputChange}
                                placeholder="Enter your country"
                            />
                        </div>
                    </Form>
                </FormSection>

                <UploadSection>
                    <SectionTitle>Profile Picture</SectionTitle>
                    <UploadLabel>
                        Upload a new profile picture
                        <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} />
                    </UploadLabel>
                    <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.4rem' }}>
                        PNG or JPG (max. 800x800px)
                    </p>
                </UploadSection>

                <FormSection>
                    <SectionTitle>Professional Summary</SectionTitle>
                    <Form>
                        <div>
                            <Label>About Me / Bio (max 500 characters) *</Label>
                            <TextArea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Write a short summary about your career"
                            />
                            {errors.bio && <ErrorMessage>{errors.bio}</ErrorMessage>}
                        </div>
                    </Form>
                </FormSection>

                <FormSection>
                    <SectionTitle>Job & Experience Details</SectionTitle>
                    <Form>
                        <div>
                            <Label>Current Job Title *</Label>
                            <Input
                                type="text"
                                name="currentJobTitle"
                                value={formData.currentJobTitle}
                                onChange={handleInputChange}
                                placeholder="Enter your current job title"
                            />
                            {errors.currentJobTitle && <ErrorMessage>{errors.currentJobTitle}</ErrorMessage>}
                        </div>
                        <div>
                            <Label>Current Company *</Label>
                            <Input
                                type="text"
                                name="currentCompany"
                                value={formData.currentCompany}
                                onChange={handleInputChange}
                                placeholder="Enter your current company"
                            />
                            {errors.currentCompany && <ErrorMessage>{errors.currentCompany}</ErrorMessage>}
                        </div>
                        <div>
                            <Label>Years of Total Experience *</Label>
                            <Select
                                name="yearsExperience"
                                value={formData.yearsExperience}
                                onChange={handleInputChange}
                            >
                                <option value="">Select years</option>
                                {[...Array(31).keys()].map(i => (
                                    <option key={i} value={i}>{i} years</option>
                                ))}
                            </Select>
                            {errors.yearsExperience && <ErrorMessage>{errors.yearsExperience}</ErrorMessage>}
                        </div>
                        <div>
                            <Label>Work Experience</Label>
                            {formData.workExperience.map((exp, index) => (
                                <div key={index} style={{ marginBottom: '0.75rem', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem' }}>
                                    <Input
                                        type="text"
                                        placeholder="Job Title"
                                        value={exp.title}
                                        onChange={(e) => handleWorkExperienceChange(index, 'title', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Start Date (YYYY-MM)"
                                        value={exp.startDate}
                                        onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="End Date (YYYY-MM or Present)"
                                        value={exp.endDate}
                                        onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <TextArea
                                        placeholder="Responsibilities"
                                        value={exp.responsibilities}
                                        onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button type="button" onClick={addWorkExperience}>Add Work Experience</Button>
                        </div>
                    </Form>
                </FormSection>

                <FormSection>
                    <SectionTitle>Skills</SectionTitle>
                    <Form>
                        <div>
                            <Label>Key Skills *</Label>
                            <Input
                                type="text"
                                placeholder="Enter skills (comma-separated)"
                                value={formData.skills.join(', ')}
                                onChange={(e) => handleArrayInput('skills', e.target.value.split(',').map(s => s.trim()))}
                            />
                            {errors.skills && <ErrorMessage>{errors.skills}</ErrorMessage>}
                        </div>
                    </Form>
                </FormSection>

                <FormSection>
                    <SectionTitle>Education</SectionTitle>
                    <Form>
                        <div>
                            <Label>Education *</Label>
                            {formData.education.map((edu, index) => (
                                <div key={index} style={{ marginBottom: '0.75rem', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem' }}>
                                    <Input
                                        type="text"
                                        placeholder="Degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Institution"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Graduation Year"
                                        value={edu.year}
                                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                        style={{ marginBottom: '0.4rem' }}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Field of Study"
                                        value={edu.field}
                                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button type="button" onClick={addEducation}>Add Education</Button>
                            {errors.education && <ErrorMessage>{errors.education}</ErrorMessage>}
                        </div>
                    </Form>
                </FormSection>

                <UploadSection>
                    <SectionTitle>Resume & Documents</SectionTitle>
                    <UploadLabel>
                        Upload Resume (PDF or DOC)
                        <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                    </UploadLabel>
                    <UploadLabel style={{ marginLeft: '0.75rem' }}>
                        Upload Cover Letter (Optional)
                        <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                    </UploadLabel>
                    <div style={{ marginTop: '0.75rem' }}>
                        <Label>Portfolio Links (Optional)</Label>
                        <Input
                            type="text"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            placeholder="Enter portfolio URL"
                        />
                    </div>
                </UploadSection>

                <FormSection>
                    <SectionTitle>Job Preferences</SectionTitle>
                    <Form>
                        <div>
                            <Label>Preferred Job Roles</Label>
                            <Input
                                type="text"
                                name="preferredRoles"
                                value={formData.preferredRoles}
                                onChange={handleInputChange}
                                placeholder="Enter preferred roles"
                            />
                        </div>
                        <div>
                            <Label>Preferred Industries</Label>
                            <Input
                                type="text"
                                name="preferredIndustries"
                                value={formData.preferredIndustries}
                                onChange={handleInputChange}
                                placeholder="Enter preferred industries"
                            />
                        </div>
                        <div>
                            <Label>Job Type Preference</Label>
                            <Select name="jobType" value={formData.jobType} onChange={handleInputChange}>
                                <option value="">Select job type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Work Setup</Label>
                            <Select name="workSetup" value={formData.workSetup} onChange={handleInputChange}>
                                <option value="">Select work setup</option>
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Willing to Relocate?</Label>
                            <Select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleInputChange}>
                                <option value="">Select option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Availability</Label>
                            <Select name="availability" value={formData.availability} onChange={handleInputChange}>
                                <option value="">Select availability</option>
                                <option value="Immediately">Immediately</option>
                                <option value="2 weeks">2 weeks</option>
                                <option value="1 month">1 month</option>
                            </Select>
                        </div>
                    </Form>
                </FormSection>

                <FormSection>
                    <SectionTitle>Social Links</SectionTitle>
                    <Form>
                        <div>
                            <Label>LinkedIn</Label>
                            <Input
                                type="url"
                                name="linkedIn"
                                value={formData.linkedIn}
                                onChange={handleInputChange}
                                placeholder="Enter LinkedIn URL"
                            />
                        </div>
                        <div>
                            <Label>GitHub</Label>
                            <Input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleInputChange}
                                placeholder="Enter GitHub URL"
                            />
                        </div>
                        <div>
                            <Label>Personal Portfolio / Website</Label>
                            <Input
                                type="url"
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleInputChange}
                                placeholder="Enter portfolio URL"
                            />
                        </div>
                    </Form>
                </FormSection>

                <NotificationSection>
                    <SectionTitle>Privacy & Visibility Settings</SectionTitle>
                    <NotificationOption>
                        <span>Make Profile Public</span>
                        <ToggleSwitch>
                            <input
                                type="checkbox"
                                checked={formData.profilePublic}
                                onChange={() => setFormData({ ...formData, profilePublic: !formData.profilePublic })}
                            />
                            <span />
                        </ToggleSwitch>
                    </NotificationOption>
                    <NotificationOption>
                        <span>Show Resume to Employers</span>
                        <ToggleSwitch>
                            <input
                                type="checkbox"
                                checked={formData.showResume}
                                onChange={() => setFormData({ ...formData, showResume: !formData.showResume })}
                            />
                            <span />
                        </ToggleSwitch>
                    </NotificationOption>
                    <NotificationOption>
                        <span>Open to Work</span>
                        <ToggleSwitch>
                            <input
                                type="checkbox"
                                checked={formData.openToWork}
                                onChange={() => setFormData({ ...formData, openToWork: !formData.openToWork })}
                            />
                            <span />
                        </ToggleSwitch>
                    </NotificationOption>
                    <NotificationOption>
                        <span>Receive Email Notifications</span>
                        <ToggleSwitch>
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                            />
                            <span />
                        </ToggleSwitch>
                    </NotificationOption>
                    <NotificationOption>
                        <span>Receive SMS Notifications</span>
                        <ToggleSwitch>
                            <input
                                type="checkbox"
                                checked={smsNotifications}
                                onChange={() => setSmsNotifications(!smsNotifications)}
                            />
                            <span />
                        </ToggleSwitch>
                    </NotificationOption>
                </NotificationSection>

                <ButtonContainer>
                    <Button onClick={handleBackToHome}>Back to Home</Button>
                    <Button primary type="submit" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </ButtonContainer>
            </SettingsContainer>
        </div>
    );
};

export default ProfileSettings;