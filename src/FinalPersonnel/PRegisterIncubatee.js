import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import PNavbar from './PNavbar.js';
import "../Styles/App.css";

function RegisterIncubatee() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [courseyear, setCourseYear] = useState('');
    const [image, setImage] = useState(null);
    const [selectedTbiId, setSelectedTbiId] = useState(null);
    const [formData, setFormData] = useState({
        team_name: '',
        product_details: '',
        team_ceo: '',
        logo_path: null,
    });
    const [tbiNames, setTbiNames] = useState([]);
    const passwordLength = 5;
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        fetchTbiNames();
    }, []);

    const fetchTbiNames = async () => {
        try {
            const response = await fetch('http://navigatu.test/api/viewtbi');
            if (response.ok) {
                const data = await response.json();
                setTbiNames(data); 
            } else {
                console.error('Failed to fetch TBI names');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "tbi_category") {
            const selectedOption = e.target.options[e.target.selectedIndex];
            setSelectedTbiId(selectedOption.getAttribute('data-tbi-id'));
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        setFormData({
            ...formData,
            logo_path: file,
        });
        reader.onload = () => {
            setImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('team_name', formData.team_name);
        formDataToSend.append('product_details', formData.product_details);
        formDataToSend.append('team_ceo', name);
        formDataToSend.append('tbi_id', selectedTbiId); 
        if (formData.logo_path !== null) {
            formDataToSend.append('logo_path', formData.logo_path);
        }
        try {
            const response = await fetch('http://navigatu.test/api/registerteam', {
                method: 'POST',
                body: formDataToSend,
            });
            if (response.ok) {
                register();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to create team');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create team');
        }
    };

    const register = async () => {
        try {
            const response = await fetch('http://navigatu.test/api/registerceo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role_id: sessionStorage.getItem("role_id"),
                    course_year: courseyear,
                    phone_number: phonenumber,
                }),
            });
            alert("Account Register Successfully!");
            navigate("/members");
        } catch (error) {
            alert('missing values');
            console.error('Error:', error);
        }
    };

    const randompass = () => {
        let generatedPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            generatedPassword += chars.substring(randomNumber, randomNumber + 1);
        }
        setPassword(generatedPassword);
    };

    return (
        <>
            <PNavbar />
            <Container className='d-flex flex-wrap gap-5 justify-content-center mt-3'>
                <div>
                    <label htmlFor="imageUpload">
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <div>
                            <Image
                                src={image || 'default.png'}
                                alt="Submitted"
                                roundedCircle
                                className='profile-register mb-5'
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </label>
                    <FloatingLabel label="Product Name">
                        <Form.Control
                            type="text"
                            placeholder="Team Names"
                            name="team_name"
                            value={formData.team_name}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingSelect" label="Select TBI Category" className='mt-3'>
                        <Form.Select aria-label="Floating label select example" name="tbi_category" onChange={handleChange}>
                            {tbiNames.map((tbi, index) => (
                                <option key={index} value={tbi.tbi_name} data-tbi-id={tbi.tbi_id}>{tbi.tbi_name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingTextarea2"
                        label="Startup Idea"
                        className='mt-3'
                    >
                        <Form.Control
                            as="textarea"
                            style={{ height: '130px' }}
                            placeholder="Startup Idea"
                            name="product_details"
                            value={formData.product_details}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                </div>

                <div>
                    <Card
                        className='p-md-4'
                        style={{
                            width: '40rem',
                            padding: '10px'
                        }}
                    >
                        <Card.Header className='text-muted'>INCUBATEE CONTACT DETAILS</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
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
                                <FloatingLabel label="Course & Year" className='mb-3'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Course & Year"
                                        value={courseyear}
                                        onChange={(e) => setCourseYear(e.target.value)}
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
                                    <Button
                                        type="submit"
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
        </>
    );
}

export default RegisterIncubatee;
