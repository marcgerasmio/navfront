import React, { useEffect, useState } from 'react';
import { Card, Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import PNavbar from './PNavbar.js';
import { useNavigate } from 'react-router-dom';

function EditProfile () {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const id = sessionStorage.getItem("id");

    const personnelfind = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/personnel/${id}`);
            const data = await response.json();
            console.log(data);
            setName(data[0].name);
            setEmail(data[0].email);
            setPhoneNumber(data[0].phone_number);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const update = async (e) => {
        e.preventDefault(); // Prevent form submission
        if (!password) {
            setAlertVariant('danger');
            setAlertMessage('Password cannot be empty.');
            return;
        }
        try {
            const response = await fetch(`http://navigatu.test/api/updatepersonnel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone_number: phonenumber,
                }),
            });
            if (response.ok) {
                setAlertVariant('success');
                setAlertMessage('Update successful.');
                navigate("/peditprofile");
            } else {
                setAlertVariant('danger');
                setAlertMessage('Update failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertVariant('danger');
            setAlertMessage('Update failed.');
        }
    };

    useEffect(() => {
        personnelfind();
    }, []);

    return (
        <>
            <PNavbar />
                <div className='d-flex p-5 justify-content-center'>
                    <Card style={{
                        width: '40rem',
                        padding: '10px'
                    }}>
                        <Card.Header className='text-muted'>UPDATE PERSONNEL CONTACT DETAILS</Card.Header>
                        <Card.Body>
                            {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}
                            <Form>
                                <FloatingLabel label="Full Name" className='mb-3 mt-4'>
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Email" className='mb-3'>
                                    <Form.Control 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Phone Number" className='mb-3'>
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    value={phonenumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Input New Password">
                                    <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    />
                                </FloatingLabel>
                                <div className='d-flex justify-content-center mt-5'>
                                    <Button type="submit" className='btn-register-save fw-bold' onClick={update}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
        </>
    );
}

export default EditProfile;