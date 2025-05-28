import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Utility function to convert hex to rgba
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const purple = '#a000c8';
const darkPurple = '#8a00c2';

const ProfileDetailsContainer = styled.div`
  min-height: 100vh;
  padding: 1rem; /* Default for mobile */
  padding-top: 60px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 641px) {
    padding: 1.5rem;
    padding-top: 70px;
  }

  @media (min-width: 1025px) {
    padding: 2rem;
    padding-top: 80px;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem; /* Default for mobile */
  color: #000;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 641px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 1025px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const ProfileCard = styled.div`
  background-color: #fff;
  padding: 1rem; /* Default for mobile */
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px ${hexToRgba(purple, 0.1)};
  width: 100%;
  max-width: 600px; /* Default for mobile */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-left: 0;
  align-self: flex-start;

  @media (min-width: 641px) {
    padding: 1.5rem;
    max-width: 700px;
    gap: 0.875rem;
  }

  @media (min-width: 1025px) {
    padding: 2rem;
    max-width: 800px;
    gap: 1rem;
  }
`;

const ProfileSubtitle = styled.p`
  font-size: 0.8rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.4rem;

  @media (min-width: 641px) {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const NameAndStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem; /* Default for mobile */

  @media (min-width: 641px) {
    margin-bottom: 0.5rem;
  }
`;

const ProfileName = styled.h2`
  font-size: 1.2rem; /* Default for mobile */
  color: #000;

  @media (min-width: 641px) {
    font-size: 1.35rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.5rem;
  }
`;

const HiringBadge = styled.span`
  background-color: #e2e8f0;
  color: #000;
  padding: 0.2rem 0.4rem; /* Default for mobile */
  border-radius: 0.25rem;
  font-size: 0.7rem; /* Default for mobile */
  align-self: center;

  @media (min-width: 641px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.8rem;
  }
`;

const ProfileDesignation = styled.p`
  font-size: 0.9rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    font-size: 0.95rem;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const ProfileDescription = styled.p`
  font-size: 0.9rem; /* Default for mobile */
  color: #4A5568;
  line-height: 1.5;
  width: 100%;

  @media (min-width: 641px) {
    font-size: 0.95rem;
    line-height: 1.55;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const ContactSection = styled.div`
  margin-top: 1rem; /* Default for mobile */
  width: 100%;
  text-align: center;

  @media (min-width: 641px) {
    margin-top: 1.5rem;
  }

  @media (min-width: 1025px) {
    margin-top: 2rem;
  }
`;

const ContactTitle = styled.h3`
  font-size: 1rem; /* Default for mobile */
  color: #000;
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    font-size: 1.1rem;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const ContactButton = styled.button`
  padding: 0.5rem 1rem; /* Default for mobile */
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem; /* Default for mobile */
  font-weight: 500;
  cursor: pointer;
  margin: 0 0.25rem;
  transition: background-color 0.3s ease;
  background-color: ${purple};
  color: #fff;

  &:hover {
    background-color: ${darkPurple};
  }

  @media (min-width: 641px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
    margin: 0 0.375rem;
  }

  @media (min-width: 1025px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    margin: 0 0.5rem;
  }
`;

const HRProfileDetails = () => {
    const location = useLocation();
    const { professional } = location.state || {};

    if (!professional) {
        return <div>No HR professional data available.</div>;
    }

    return (
        <div>
            <ProfileDetailsContainer>
                <Title>HR Profile Details</Title>
                <ProfileCard>
                    <ProfileSubtitle>{professional.name.toLowerCase()}'s profile</ProfileSubtitle>
                    <NameAndStatus>
                        <ProfileName>{professional.name}</ProfileName>
                        {/* Hardcoding Hiring Now badge for Emily Thompson as per the image */}
                        <HiringBadge>Hiring Now</HiringBadge>
                    </NameAndStatus>
                    <ProfileDesignation>Senior HR Manager</ProfileDesignation>
                    <ProfileDescription>
                        Senior HR manager with a wealth of experience in HR management and a passion for fostering positive workplace cultures. {professional.name} is dedicated to supporting the growth and success of both employees and organizations.
                    </ProfileDescription>
                </ProfileCard>
                <ContactSection>
                    <ContactTitle>Ready to Connect?</ContactTitle>
                    <ContactButton>Contact via WhatsApp</ContactButton>
                    <ContactButton>Contact via Email</ContactButton>
                </ContactSection>
            </ProfileDetailsContainer>
        </div>
    );
};

export default HRProfileDetails;