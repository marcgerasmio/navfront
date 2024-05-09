import React, { useState } from 'react';
import { Card, Form, Button, Col, FloatingLabel, Row, Container } from 'react-bootstrap';
import PNavbar from './PNavbar.js';
import { useNavigate } from 'react-router-dom';

const PAddCompetition = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        organization_host: '',
        competition_name: '',
        theme: '',
        competition_description: '',
        requirements: '',
        registration_link: '',
        venue: '',
        date: '',
        competition_mode: '',
        prize_details: '',
        date_submission: '',
        image_path: null // Initialize imagePath to null
    });

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData(prevState => ({
                ...prevState,
                image_path: e.target.files[0] // Store file object
            }));
        } else {
            const { name, value } = e.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSaveChanges = async () => {
        try {
            // Basic validation to check if any field is empty
            for (const key in formData) {
                if (!formData[key]) {
                    alert(`${key.replace('_', ' ').toUpperCase()} cannot be empty`);
                    return; // Exit function if any field is empty
                }
            }
    
            // Proceed with form submission if all fields are filled
            console.log("Form Data:", formData); // Log the form data
    
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
    
            const response = await fetch('http://navigatu.test/api/addcompetition', {
                method: 'POST',
                body: formDataToSend
            });
    
            if (response.ok) {
                alert('Competition Added Successfully');
                // Optionally reset the form after successful submission
                setFormData({
                    organization_host: '',
                    competition_name: '',
                    theme: '',
                    competition_description: '',
                    requirements: '',
                    registration_link: '',
                    venue: '',
                    date: '',
                    competition_mode: '',
                    prize_details: '',
                    date_submission: '',
                    image_path: null // Reset image_path to null
                });
                navigate("/pcompetition");
            } else {
                // Handle error response
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const handleCancel = () => {
        navigate("/pcompetition");
    };

    return (
        <div>
            <PNavbar/>
            <Container>
                <div className='d-flex justify-content-center mt-4'>
                <Card style={{
                    width: '70%'
                }}>
                    <Card.Header className='text-muted'>ADD COMPETITION</Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col xs={12} md={6}>
                                    <FloatingLabel label="Organization Host" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Organization Host" 
                                            value={formData.organization_host} 
                                            onChange={handleChange}
                                            name="organization_host"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Competition Name" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Competition Name" 
                                            value={formData.competition_name} 
                                            onChange={handleChange}
                                            name="competition_name"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Theme" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Theme" 
                                            value={formData.theme} 
                                            onChange={handleChange}
                                            name="theme"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Competition Description" className='mb-3'>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={4} 
                                            placeholder="Competition Description" 
                                            value={formData.competition_description} 
                                            onChange={handleChange}
                                            name="competition_description"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Requirements" className='mb-3'>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={4} 
                                            placeholder="Requirements" 
                                            value={formData.requirements} 
                                            onChange={handleChange}
                                            name="requirements"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Registration Link" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Registration link" 
                                            value={formData.registration_link} 
                                            onChange={handleChange}
                                            name="registration_link"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12} md={6}>
                                    <FloatingLabel label="Venue" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Venue" 
                                            value={formData.venue} 
                                            onChange={handleChange}
                                            name="venue"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Date" className='mb-3'>
                                        <Form.Control 
                                            type="date" 
                                            value={formData.date} 
                                            onChange={handleChange}
                                            name="date"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Competition Mode" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Competition Mode" 
                                            value={formData.competition_mode} 
                                            onChange={handleChange}
                                            name="competition_mode"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Prize Details" className='mb-3'>
                                        <Form.Control
                                            as="textarea" 
                                            rows={4} 
                                            placeholder="Prize Details" 
                                            value={formData.prize_details} 
                                            onChange={handleChange}
                                            name="prize_details"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Date Submission" className='mb-3'>
                                        <Form.Control 
                                            type="date" 
                                            value={formData.date_submission} 
                                            onChange={handleChange}
                                            name="date_submission"
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Image" className='mb-3'>
                                        <Form.Control 
                                            type="file" 
                                            onChange={handleChange}
                                            name="image_path"
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-center mt-2 gap-4'>
                                <Button 
                                    onClick={handleCancel} 
                                    className='btn-register-save fw-bold'
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSaveChanges} 
                                    className='btn-register-save fw-bold'
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                </div>
            </Container>
        </div>
    );
};

export default PAddCompetition;
