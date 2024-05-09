import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, FloatingLabel, Container } from 'react-bootstrap';
import PNavbar from './PNavbar';
import { useNavigate } from 'react-router-dom';

function PAddSeedFunding() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        funding_agency: '',
        grant_name: '',
        budget_allocated: '',
        funding_priorities: '',
        funding_description: '',
        requirements: '',
        submission_link: '',
        deadline: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "deadline") {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://navigatu.test/api/addseedfunding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Data submitted successfully!');
                navigate("/pseedfunding");
            } else {
                console.error('Failed to submit data');
                // You can handle failure response here, like showing an error message
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            // You can handle network errors here
        }
    };

    return (
        <>
            <div>
                <PNavbar/>
                    <div className='d-flex justify-content-center mt-5'>
                        <Card style={{
                            width: '50%'
                        }}>
                            <Card.Header className='text-muted'>SEED FUNDING</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel label="Funding Agency" className='mb-3 mt-4'>
                                                <Form.Control
                                                    type="text"
                                                    name="funding_agency"
                                                    placeholder="Enter Funding Agency"
                                                    value={formData.funding_agency}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid funding agency.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel label="Grant Name" className='mb-3 mt-4'>
                                                <Form.Control
                                                    type="text"
                                                    name="grant_name"
                                                    placeholder="Enter Grant Name"
                                                    value={formData.grant_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid grant name.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel label="Budget Allocated" className='mb-3'>
                                                <Form.Control
                                                    type="text"
                                                    name="budget_allocated"
                                                    placeholder="Enter Budget Allocated"
                                                    value={formData.budget_allocated}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid budget allocated.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel label="Funding Priorities" className='mb-3 mt-4'>
                                                <Form.Control
                                                    type="text"
                                                    name="funding_priorities"
                                                    placeholder="Enter Funding Priorities"
                                                    value={formData.funding_priorities}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide valid funding priorities.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel label="Funding Description" className='mb-3 mt-4'>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    name="funding_description"
                                                    placeholder="Enter Funding Description"
                                                    value={formData.funding_description}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid funding description.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel label="Requirements" className='mb-3 mt-4'>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    name="requirements"
                                                    placeholder="Enter Requirements"
                                                    value={formData.requirements}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide valid requirements.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel label="Submission Link" className='mb-3 mt-4'>
                                                <Form.Control
                                                    type="text"
                                                    name="submission_link"
                                                    placeholder="Enter Submission Link"
                                                    value={formData.submission_link}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid submission link.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                            <FloatingLabel label="Deadline" className='mb-3'>
                                                <Form.Control
                                                    type="date"
                                                    name="deadline"
                                                    placeholder="Enter Deadline"
                                                    value={formData.deadline}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid deadline.
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <div className='d-flex justify-content-center mt-3'>
                                        <Button className='btn-register-save fw-bold' onClick={handleSubmit}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
            </div>
        </>
    );
}

export default PAddSeedFunding;
