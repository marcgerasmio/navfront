import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../Styles/App.css';

function ALogin() {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('1');
    const [errorMessage, setErrorMessage] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    function handleClick() {
        const form = document.getElementById('loginForm');
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        setLoading(true);
        login();
    }

    const showToastMessage = () => {
        toast.success("Login Successfully !", {
          position: "top-right"
        });
    };

    const showerror = () => {
        toast.error("Invalid Email or Password !", {
          position: "top-right"
        });
    };
    
    const showerr = () => {
        toast.error("Unauthorized Login !", {
          position: "top-right"
        });
    };

    const login = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/userlogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
        
                const id = data.user.id;
                sessionStorage.setItem("id", id);
                console.log(id);
                const name = data.user.name;
                sessionStorage.setItem("name", name);
                console.log(name);
                showToastMessage();
                setTimeout(() => {
              navigate("/adashboard");
                }, 1500);
                setErrorMessage('');
        } catch (error) {
            showerror();
            setLoading(false);
            console.error('Login Error', error);
        }
    };



    const personnelRole = () => {
        setUserType('1');
        setRole('Personnel');
    }

    const incubateeRole = () => {
        setUserType('3');
        setRole('Incubatee');
    }

    const mentorRole = () => {
        setUserType('2');
        setRole('Mentor');
    }

    return(
        <>
            <Navbar className="navbar">
                <div className='container'>
                    <Navbar.Brand>
                        <Image src="logo.png" width={200} height={50} fluid />
                    </Navbar.Brand>
                </div>
            </Navbar>
            <div className='container mt-5'>
                <Row>
                    <Col className="d-none d-md-block">
                        <Image src='finalnavigatu.png' fluid />
                        <h1>Navigate to victory with us</h1>
                    </Col>
                    <Col>
                        <Card className={`mt-2 p-md-4 card-login`}>
                            <Card.Body>
                                <p className="text-muted">
                                    ADMIN LOGIN &nbsp;&nbsp; 
                                    <span className='fw-bold'>{role}</span>
                                </p>
                                <Form id="loginForm" noValidate validated={validated}>
                                    <InputGroup className="mb-3 mt-3">
                                        <FloatingLabel controlId="floatingInput" label="Email address">
                                            <Form.Control
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                size="lg"
                                                type="email"
                                                placeholder="name@example.com"
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid email address.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </InputGroup>
                                    <InputGroup className="mb-4">
                                        <FloatingLabel controlId="floatingPassword" label="Password">
                                            <Form.Control
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                size="lg"
                                                type="password"
                                                placeholder="Password"
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a password.
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </InputGroup>
                                    <Button 
                                        onClick={handleClick}
                                        variant='primary' 
                                        className="login-button w-100 p-3 mb-3 fw-bold" 
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="grow"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                                Loading...
                                            </>
                                        ) : "Login"}
                                    </Button>
                                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                </Form>
                                <ToastContainer />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div class="footer text-center p-5 mt-md-5">
                <p class="mb-0 text-muted">Navigatu TBI&nbsp; | &nbsp;Caraga State University - CCIS</p>
            </div>
        </>
    );
}

export default ALogin;