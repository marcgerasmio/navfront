import PNavbar from './PNavbar.js';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { MdNavigateNext } from "react-icons/md";
import { NavLink } from 'react-router-dom';

function PTbiCategory() {
    const [tbiData, settbiData] = useState([]);

    useEffect(() => {
        const fetchTbiData = async () => {
            try {
                const response = await fetch(`http://navigatu.test/api/viewtbi`);
                const data = await response.json();
                console.log(data);
                settbiData(data);
            } catch (error) {
                console.error("Error fetching competition data:", error);
            }
        };
        fetchTbiData();

    }, []);

    const handleClick = (competitionId) => {
        // Define your logic for handling the click event here
        console.log("Clicked on competition with ID:", competitionId);
    };

    return (
        <>
            <PNavbar />
            <Container>
                <Container>
                    <div className="d-flex flex-wrap gap-3 mt-4">
                        {tbiData.slice(0, 4).map((tbi, index) => (
                            <div key={index} className='card-container'>
                                <div onClick={() => handleClick(tbi.competition_id)}>
                                    <Card className="mb-3 box">
                                        <Card.Img
                                            className='image-fluid card-image'
                                            variant="top"
                                            src={`http://navigatu.test/storage/${tbi.tbi_logo}`}
                                            alt={tbi.name}
                                        />
                                        <Card.Body>
                                            <Card.Title>{tbi.tbi_name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </Container>
        </>
    );
}

export default PTbiCategory;
