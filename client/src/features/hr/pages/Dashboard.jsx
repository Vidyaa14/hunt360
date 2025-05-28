import React, { useState } from 'react';
import styled from 'styled-components';
import EditContactForm from './EditContactForm';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const purple = '#a000c8';
const darkPurple = '#8a00c2';

const DashboardContainer = styled.div`
`;

const MainContent = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${purple};
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
`;

const ContentSection = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: row;
`;

const FilterSection = styled.div`
  width: 300px;
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px ${hexToRgba(purple, 0.3)};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  background-color: ${purple};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background-color: ${darkPurple};
  }
`;

const ReportsSection = styled.div`
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 4px ${hexToRgba(purple, 0.2)};
`;

const TableHeader = styled.thead`
  background-color: ${hexToRgba(purple, 0.1)};
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const EditButton = styled.button`
  background-color: ${purple};
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 0.3rem;
  cursor: pointer;

  &:hover {
    background-color: ${darkPurple};
  }
`;

const Dashboard = () => {
  const [professionals, setProfessionals] = useState([
    { name: 'Jessica Williams', title: 'Talent Acquisition Specialist', company: 'Amazon', location: 'New York', status: 'Hiring Now' },
    { name: 'Emily Thompson', title: 'Recruitment Manager', company: 'Meta', location: 'Remote', status: 'Hiring Now' },
    { name: 'John Smith', title: 'HR Manager', company: 'TCS', location: 'Mumbai', status: '' },
  ]);

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (professional) => {
    setSelected(professional);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await fetch(`/api/professionals/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update professional');

      const updatedList = professionals.map((item) =>
        item.id === selected.id ? updatedData : item
      );
      setProfessionals(updatedList);
      closeModal();
    } catch (error) {
      console.error('Error updating:', error);
      alert('Failed to save changes. Please try again.');
    }
  };


  return (
    <div>
      <DashboardContainer>
        <MainContent>
          <ContentSection>
            <FilterSection>
              <SectionTitle>Filters</SectionTitle>
              <label>Industry</label>
              <Select><option>Select industry</option></Select>
              <label>Location</label>
              <Select><option>Select location</option></Select>
              <label>Company</label>
              <Select><option>Select company</option></Select>
              <label>Hiring Status</label>
              <Select><option>Select status</option></Select>
              <label>Experience</label>
              <Select><option>Select experience</option></Select>
              <SearchButton>Search</SearchButton>
            </FilterSection>

            <ReportsSection>
              <SectionTitle>Results</SectionTitle>
              <Table>
                <TableHeader>
                  <tr>
                    <Th>Name</Th>
                    <Th>Title</Th>
                    <Th>Company</Th>
                    <Th>Location</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </tr>
                </TableHeader>
                <tbody>
                  {professionals.map((pro, index) => (
                    <tr key={index}>
                      <Td>{pro.name}</Td>
                      <Td>{pro.title}</Td>
                      <Td>{pro.company}</Td>
                      <Td>{pro.location}</Td>
                      <Td>{pro.status || '-'}</Td>
                      <Td>
                        <EditButton onClick={() => openEditModal(pro)}>Edit</EditButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ReportsSection>
          </ContentSection>
        </MainContent>

        {isModalOpen && (
          <EditContactForm
            contactData={selected}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </DashboardContainer>
    </div>
  );
};

export default Dashboard;
