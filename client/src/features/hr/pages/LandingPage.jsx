import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Utility function to convert hex to rgba
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const purple = '#a000c8';
const darkPurpleShadow = '#8a00c2';
const darkerPurpleShadow = '#7600bc';

const LandingContainer = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem; /* Default for mobile */
  padding-top: 60px;
  background-color: #fff;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-image: linear-gradient(90deg, ${purple}, #ca5cdd);
    opacity: 0.1;
  }

  > * {
    z-index: 1;
  }

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
  color: ${purple};
  margin-bottom: 0.75rem;

  @media (min-width: 641px) {
    font-size: 2rem;
    margin-bottom: 0.875rem;
  }

  @media (min-width: 1025px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem; /* Default for mobile */
  color: #4A5568;
  margin-bottom: 1.5rem;

  @media (min-width: 641px) {
    font-size: 1.1rem;
    margin-bottom: 1.75rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const Button = styled(Link)`
  padding: 0.5rem 1rem; /* Default for mobile */
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  font-size: 0.875rem; /* Default for mobile */

  @media (min-width: 641px) {
    padding: 0.625rem 1.25rem;
    margin: 0 0.375rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    padding: 0.75rem 1.5rem;
    margin: 0 0.5rem;
    font-size: 1rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${purple};
  color: #fff;

  &:hover {
    background-color: ${darkPurpleShadow};
    transform: scale(1.05);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f0e9f7;
  color: ${purple};
  border: 2px solid ${purple};

  &:hover {
    background-color: ${purple};
    color: #fff;
    transform: scale(1.05);
  }
`;

const FeatureSection = styled.div`
  display: flex;
  gap: 1rem; /* Default for mobile */
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 641px) {
    gap: 1.5rem;
    margin-top: 2rem;
  }

  @media (min-width: 1025px) {
    gap: 2rem;
    margin-top: 3rem;
  }
`;

const FeatureCard = styled.div`
  background-color: #fff;
  padding: 1rem; /* Default for mobile */
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px ${hexToRgba(darkPurpleShadow, 0.3)};
  width: 100%; /* Default for mobile */
  max-width: 160px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px ${hexToRgba(darkerPurpleShadow, 0.4)};
  }

  div {
    font-size: 1.5rem; /* Default for mobile */
    color: ${purple};
  }

  h3 {
    color: ${purple};
    margin-top: 0.4rem;
    font-size: 0.875rem; /* Default for mobile */
  }

  p {
    font-size: 0.8rem; /* Default for mobile */
    color: #4A5568;
  }

  @media (min-width: 641px) {
    padding: 1.25rem;
    max-width: 180px;
    div {
      font-size: 1.75rem;
    }
    h3 {
      font-size: 0.9375rem;
      margin-top: 0.5rem;
    }
    p {
      font-size: 0.85rem;
    }
  }

  @media (min-width: 1025px) {
    padding: 1.5rem;
    max-width: 200px;
    div {
      font-size: 2rem;
    }
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;

const LandingPage = () => {
    return (
        <div>
            <LandingContainer>
                <Title>HR Share Dashboard</Title>
                <Subtitle>Connect with HR professionals across industries. Find the right HR contact for your next career move.</Subtitle>
                <div>
                    <PrimaryButton to="/login">Browse HR Professionals</PrimaryButton>
                    <SecondaryButton to="/register">Login / Register</SecondaryButton>
                </div>
                <FeatureSection>
                    <FeatureCard>
                        <div>🔍</div>
                        <h3>Find HR Contacts</h3>
                        <p>Search and filter HR professionals by industry, location, and company.</p>
                    </FeatureCard>
                    <FeatureCard>
                        <div>📋</div>
                        <h3>Hiring Opportunities</h3>
                        <p>Discover HR professionals who are actively hiring for their companies.</p>
                    </FeatureCard>
                    <FeatureCard>
                        <div>💬</div>
                        <h3>Direct Contact</h3>
                        <p>Connect directly via WhatsApp, email, or phone with HR professionals.</p>
                    </FeatureCard>
                </FeatureSection>
            </LandingContainer>
        </div>
    );
};

export default LandingPage;