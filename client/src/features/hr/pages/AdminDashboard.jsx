/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const purple = '#a000c8';
const darkPurple = '#8a00c2';

// Top Navbar Styles
const TopNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem; /* Default for mobile */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(160, 0, 200, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;

  @media (min-width: 641px) {
    padding: 1rem 1.5rem;
  }

  @media (min-width: 1025px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 32px; /* Default for mobile */
  height: 32px;

  @media (min-width: 641px) {
    width: 36px;
    height: 36px;
  }

  @media (min-width: 1025px) {
    width: 40px;
    height: 40px;
  }
`;

const LogoText = styled.h1`
  font-size: 1rem; /* Default for mobile */
  color: ${purple};
  margin-left: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${darkPurple};
  }

  @media (min-width: 641px) {
    font-size: 1.1rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.2rem;
  }
`;

const Hamburger = styled.button`
  display: none; /* Hidden by default */
  background: none;
  border: none;
  color: ${purple};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 640px) {
    display: block; /* Show on mobile */
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* Default for mobile */
  transition: transform 0.3s ease;

  @media (max-width: 640px) {
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(160, 0, 200, 0.3);
    padding: 1rem;
    z-index: 10;
  }

  @media (min-width: 641px) {
    gap: 1.25rem;
  }

  @media (min-width: 1025px) {
    gap: 1.5rem;
  }
`;

const NavLink = styled.div`
  color: ${purple};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem; /* Default for mobile */
  transition: transform 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    color: ${darkPurple};
  }

  @media (min-width: 641px) {
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  font-size: 0.875rem; /* Default for mobile */

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 641px) {
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
  }
`;

const UserPhoto = styled.img`
  width: 1.5rem; /* Default for mobile */
  height: 1.5rem;
  border-radius: 50%;
  object-fit: cover;

  @media (min-width: 641px) {
    width: 1.75rem;
    height: 1.75rem;
  }

  @media (min-width: 1025px) {
    width: 2rem;
    height: 2rem;
  }
`;

const UserName = styled.span`
  color: ${purple};
  font-weight: 500;
`;

// Admin Dashboard Styles
const AdminDashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  padding-top: 60px; /* Adjust for navbar height */
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1rem; /* Default for mobile */
  margin-left: ${props => (props.$isCollapsed ? '40px' : '200px')}; /* Sync with AdminNavbar */
  transition: margin-left 0.3s ease;
  background-color: #f9fafb;

  @media (min-width: 641px) {
    padding: 1.5rem;
    margin-left: ${props => (props.$isCollapsed ? '50px' : '220px')};
  }

  @media (min-width: 1025px) {
    padding: 2rem;
    margin-left: ${props => (props.$isCollapsed ? '60px' : '250px')};
  }
`;

const ProfilesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Smaller min width for mobile */
  gap: 0.75rem; /* Default for mobile */

  @media (min-width: 641px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  @media (min-width: 1025px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const ProfileCard = styled.div`
  background-color: #fff;
  padding: 0.75rem; /* Default for mobile */
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px ${hexToRgba(purple, 0.3)};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: ${purple};
  text-align: left;
  cursor: pointer;
  height: 160px; /* Default for mobile */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px ${hexToRgba(darkPurple, 0.4)};
  }

  @media (min-width: 641px) {
    padding: 0.875rem;
    height: 180px;
  }

  @media (min-width: 1025px) {
    padding: 1rem;
    height: 200px;
  }
`;

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem; /* Default for mobile */

  @media (min-width: 641px) {
    gap: 0.25rem;
  }
`;

const CardTitle = styled.h4`
  margin: 0;
  font-size: 0.875rem; /* Default for mobile */
  font-weight: 600;

  @media (min-width: 641px) {
    font-size: 0.9375rem;
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
  }
`;

const CardText = styled.p`
  margin: 0;
  font-size: 0.8rem; /* Default for mobile */
  color: #4A5568;

  @media (min-width: 641px) {
    font-size: 0.85rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.9rem;
  }
`;

const HiringBadge = styled.span`
  background-color: #facc15;
  color: #000;
  padding: 0.2rem 0.4rem; /* Default for mobile */
  border-radius: 0.25rem;
  font-size: 0.7rem;
  margin-top: 0.4rem;

  @media (min-width: 641px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  @media (min-width: 1025px) {
    font-size: 0.8rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem; /* Default for mobile */
  color: ${purple};

  @media (min-width: 641px) {
    margin-top: 0.875rem;
  }

  @media (min-width: 1025px) {
    margin-top: 1rem;
  }
`;

const ActionIcon = styled.span`
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 1rem; /* Default for mobile */

  &:hover {
    color: ${darkPurple};
  }

  @media (min-width: 641px) {
    font-size: 1.1rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.2rem;
  }
`;

const mockHRProfiles = [
  { name: 'Jessica Williams', role: 'Talent Acquisition Specialist', company: 'Amazon', location: 'New York', hiringStatus: 'Hiring Now' },
  { name: 'Emily Thompson', role: 'Recruitment Manager', company: 'Meta', location: 'Remote', hiringStatus: 'Hiring Now' },
  { name: 'John Smith', role: 'HR Manager', company: 'TCS', location: 'Mumbai', hiringStatus: '' },
  { name: 'Emily Brown', role: 'HR Manager', company: 'Amazon', location: 'New York', hiringStatus: '' },
  { name: 'Sarah Johnson', role: 'Recruitment Specialist', company: 'Meta', location: 'Remote', hiringStatus: 'Hiring Now' },
  { name: 'Michael Lee', role: 'HR Manager', company: 'TCS', location: 'Mumbai', hiringStatus: '' },
];

// Admin Top Navbar Component
const AdminTopNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <TopNavbar>
      <Logo>
        <LogoImg src="comlogo.png" alt="HR Hunt Logo" />
        <LogoText>HR Hunt</LogoText>
      </Logo>
      <Hamburger onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </Hamburger>
      <NavLinks $isOpen={isMobileMenuOpen}>
        <NavLink onClick={handleLogout}>Logout</NavLink>
      </NavLinks>
    </TopNavbar>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const [profiles, setProfiles] = useState(mockHRProfiles);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleVerify = (index) => {
    console.log(`Verifying profile: ${profiles[index].name}`);
  };

  const handleMessage = (index) => {
    console.log(`Messaging profile: ${profiles[index].name}`);
  };

  const handleDelete = (index) => {
    const updatedProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(updatedProfiles);
  };

  return (
    <AdminDashboardContainer>
      <AdminTopNavbar />
      <ContentWrapper>
        <MainContent $isCollapsed={isCollapsed}>
          <ProfilesList>
            {profiles.map((profile, index) => (
              <ProfileCard key={index}>
                <CardContent>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardText>{profile.role}</CardText>
                  <CardText>{profile.company}</CardText>
                  <CardText>{profile.location}</CardText>
                  {profile.hiringStatus && <HiringBadge>{profile.hiringStatus}</HiringBadge>}
                </CardContent>
                <IconContainer>
                  <ActionIcon onClick={() => handleVerify(index)}>📞</ActionIcon>
                  <ActionIcon onClick={() => handleMessage(index)}>💬</ActionIcon>
                  <ActionIcon onClick={() => handleDelete(index)}>🗑️</ActionIcon>
                </IconContainer>
              </ProfileCard>
            ))}
          </ProfilesList>
        </MainContent>
      </ContentWrapper>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;