import IncubateeSidebar from './Sidebar.js';
import { Card } from 'react-bootstrap';

function IncubateeDashboard(){
    const cardCount = 6;
    return(
        <>
            <div className='d-flex'>
                <div>
                <IncubateeSidebar />
                </div>
                <div style={{flex:"1 1 auto", display:"flex", flexFlow:"column", height:"100vh", overflowY:"hidden"}}>
                <div style={{height:"100%"}}>
          <div style={{padding:"20px 5%",height:"100%",overflowY:"scroll"}}>
                    {Array.from({ length: cardCount }, (_, index) => (
                        <div key={index} style={{ flex: '0 0 30%' }}>
                            <Card className='mb-3 dash'>
                                <Card.Img variant='top' src='dash.jpg' alt='...' />
                                <Card.Body>
                                    <Card.Title>Event Name</Card.Title>
                                    <Card.Text>
                                        This is a wider card with supporting text below as a natural lead-in to additional content.
                                    </Card.Text>
                                    <Card.Text>
                                    <small className='text-muted'>Last updated 3 mins ago</small>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default IncubateeDashboard;