import { Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Styles/App.css';
import ANavbar from './ANavbar';

function ADashboard(){
    const navigate = useNavigate();
    const registerincubatee = () =>{
        navigate("/aregisterincubatee");
        sessionStorage.setItem("role_id", '3');
    }
    const registermentor = () =>{
        navigate("/aregistermentor");
        sessionStorage.setItem("role_id", '2');
    }
    const registerpersonnel = () =>{
        navigate("/aregisterpersonnel");
        sessionStorage.setItem("role_id", '1');
    }


    return(
        <>
<ANavbar />
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
                    <Card className='p-5 card-hover' onClick={registerpersonnel}>
                        <Card.Img 
                            height={280}
                            width={180}
                            variant='top'
                            src='personnel.png' 
                            alt='Personnel'
                        />
                        <div className='d-flex justify-content-center'>
                            <h1 className='fw-bold title-text'>PERSONNEL</h1>
                        </div>
                    </Card>
                </Container>
            </Container>
        </>
    );
}

export default ADashboard;