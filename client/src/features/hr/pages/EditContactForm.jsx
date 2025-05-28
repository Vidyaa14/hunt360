import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const FieldGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const SubText = styled.div`
  font-size: 0.75rem;
  color: gray;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  background-color: ${props => props.cancel ? '#ccc' : '#6a1b9a'};
  color: ${props => props.cancel ? '#000' : '#fff'};
  border: none;
  border-radius: 0.4rem;
  font-weight: bold;
  cursor: pointer;
`;

const EditContactForm = ({ contactData = {}, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(contactData);
    }, [contactData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // This should trigger a backend PATCH/PUT request
        onClose();
    };

    return (
        <Overlay>
            <ModalBox>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Label>Name</Label>
                        <Input name="name" value={formData.name || ''} onChange={handleChange} />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Contact</Label>
                        <Input name="contact" value={formData.contact || ''} onChange={handleChange} />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Date of contact</Label>
                        <Input name="date" type="date" value={formData.date || ''} onChange={handleChange} />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Number of times contacted</Label>
                        <Input name="times" type="number" value={formData.times || ''} onChange={handleChange} />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Contacted By</Label>
                        <SubText>(Person who initiated the contact)</SubText>
                        <Input name="contactedBy" value={formData.contactedBy || ''} onChange={handleChange} />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Contacted Person</Label>
                        <SubText>(Person who was contacted)</SubText>
                        <Input name="contactedPerson" value={formData.contactedPerson || ''} onChange={handleChange} />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>Feedback / Notes</Label>
                        <Textarea name="notes" rows="3" value={formData.notes || ''} onChange={handleChange} />
                    </FieldGroup>

                    <Footer>
                        <Button cancel type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </Footer>
                </form>
            </ModalBox>
        </Overlay>
    );
};

export default EditContactForm;
