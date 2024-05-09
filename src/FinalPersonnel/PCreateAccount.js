import PNavbar from './PNavbar.js';
import { Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Styles/PCreateAccount.css';

function CreateAccount(){
    const navigate = useNavigate();
    const registerincubatee = () =>{
        navigate("/pregisterincubatee");
        sessionStorage.setItem("role_id", '3');
    }
    const registermentor = () =>{
        navigate("/pregistermentor");
        sessionStorage.setItem("role_id", '2');
    }

    return(
        <>
            <PNavbar />
            <Container>
                <div className='d-flex justify-content-center mt-5'>
                    <h2 className='title-text'>Create Account for :</h2>
                </div>
                <Container className='d-flex p-4 gap-5 justify-content-center'>
                    <Card className='p-5 card-hover' onClick={registerincubatee}>
                        <Card.Img 
                            height={280}
                            width={180}
                            variant='top'
                            src='Incubatee.png' 
                            alt='Incubatee' 
                        />
                        <div className='d-flex justify-content-center'>
                            <h1 className='fw-bold title-text'>INCUBATEE</h1>
                        </div>
                    </Card>
                    <Card className='p-5 card-hover' onClick={registermentor}>
                        <Card.Img 
                            height={280}
                            width={180}
                            variant='top'
                            src='mentor.png' 
                            alt='Mentor'
                        />
                        <div className='d-flex justify-content-center'>
                            <h1 className='fw-bold title-text'>MENTOR</h1>
                        </div>
                    </Card>
                </Container>
            </Container>
        </>
    );
}

export default CreateAccount;