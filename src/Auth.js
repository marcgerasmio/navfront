import { useState } from 'react';
import './App.css';
import { 
    Card, 
    Form, 
    FloatingLabel, 
    Button, 
    Row, 
    Col,
    Spinner,
    Image,
    Navbar,
    Container
} from 'react-bootstrap';

function Auth(){
    const [loading, setLoading] = useState(false);

    function handleClick(){
        setLoading(true);
    }

    return(
        <>
            <Navbar className="login-nav">
                <Container>
                    <Navbar.Brand href="#home">
                        <Image src="logo.png" className="login-logo"/>
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <div className='d-flex justify-content-center mt-5'>
                <Row>
                    <Col>
                        <Image src="navigatu.png" className="login-image" />
                        <div><h1>Navigate to victory with us.</h1></div>
                    </Col>
                    <Col>
                        <Card className='login-card'>
                            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-2">
                                <Form.Control type="email" placeholder="name@example.com" />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password" className='mb-3'>
                                <Form.Control type="password" placeholder="Password" />
                            </FloatingLabel>
                            <Button variant='primary' onClick={handleClick}>
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
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Auth;