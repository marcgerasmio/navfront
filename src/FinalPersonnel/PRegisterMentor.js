import { Card,Form,Row,Col,Button,FloatingLabel } from 'react-bootstrap';
import PNavbar from './PNavbar.js';
import { useState } from 'react';
// import '../App.css';

function RegisterMentor(){
    const role_id = sessionStorage.getItem("role_id");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [expertise, setExpertise] = useState('');
    const [password, setPassword] = useState(''); // State for holding the generated password
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 20;

    const randompass = () => {
        let generatedPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            generatedPassword += chars.substring(randomNumber, randomNumber + 1);
        }
        setPassword("NAVIGATU" + generatedPassword); // Update the password state with the generated password
    };

    const register = async () => {
        try {
            const response = await fetch('http://navigatu.test/api/registermentor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role_id: role_id,
                    expertise,
                    phone_number: phonenumber,
                }),
            });
            alert('register successfully!');
            if (!response.ok) {
                alert('missing values');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <>
                <PNavbar />
                <div className='d-flex p-4 mt-2 gap-5 justify-content-center'>
                    <div>
                        <Card className='card-create'>
                            <Card.Header className='text-muted'>MENTOR CONTACT DETAILS</Card.Header>
                            <Card.Body>
                                <Form>
                                    <FloatingLabel label="Full Name" className='mb-3 mt-4'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Full Name" 
                                            value={name} onChange={(e) => setName(e.target.value)} 
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
                                    <FloatingLabel label="Expertise" className='mb-3'>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Expertise" 
                                            value={expertise} 
                                            onChange={(e) => setExpertise(e.target.value)} 
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
                                    <Row className='g-2'>
                                        <Col xs={8}>
                                            <FloatingLabel label="Password">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Password" 
                                                    value={password} 
                                                    readOnly 
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col>
                                            <Button className='btn-register fw-bold h-100' onClick={randompass}>
                                                Generate Password
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div className='d-flex justify-content-center mt-5'>
                                        <Button className='btn-register-save fw-bold' onClick={register}>
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

export default RegisterMentor;
