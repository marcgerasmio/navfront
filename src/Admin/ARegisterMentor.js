import { Card,Form,Row,Col,Button,FloatingLabel } from 'react-bootstrap';
import ANavbar from './ANavbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../App.css';

function ARegisterMentor(){
    const role_id = sessionStorage.getItem("role_id");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [expertise, setExpertise] = useState('');
    const [password, setPassword] = useState(''); 
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 5;
    const navigate = useNavigate();

    const randompass = () => {
        let generatedPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            generatedPassword += chars.substring(randomNumber, randomNumber + 1);
        }
        setPassword(generatedPassword);
    };
    const register = async () => {
        if (!name || !email || !phonenumber || !expertise || !password) {
            alert('Please fill in all fields');
            return;
        }
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
            navigate("/pcreateaccount");
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
                <ANavbar />
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
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <Button className='btn-register w-100 h-100 fw-bold' onClick={randompass}>
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

export default ARegisterMentor;
