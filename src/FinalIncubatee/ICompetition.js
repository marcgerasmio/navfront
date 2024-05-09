import INavbar from './INavbar.js';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import '../Styles/PDashboard.css';

function ICompetition() {
    const [competitionData, setCompetitionData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://navigatu.test/api/competition`);
                const data = await response.json();
                setCompetitionData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const daysLeft = (submissionDate) => {
        const currentDate = new Date();
        let submissionDateTime;
        if (submissionDate.includes("/")) {
            const submissionDateParts = submissionDate.split("/");
            submissionDateTime = new Date(
                parseInt(submissionDateParts[2]),
                parseInt(submissionDateParts[1]) - 1,
                parseInt(submissionDateParts[0])
            );
        } else if (submissionDate.includes("-")) {
            const submissionDateParts = submissionDate.split("-");
            submissionDateTime = new Date(
                parseInt(submissionDateParts[0]),
                parseInt(submissionDateParts[1]) - 1,
                parseInt(submissionDateParts[2])
            );
        } else {
            console.error("Invalid date format:", submissionDate);
            return -1;
        }
        if (currentDate > submissionDateTime) {
            return -1;
        } else {
            const differenceInTime = submissionDateTime.getTime() - currentDate.getTime();
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            return differenceInDays;
        }
    };
    
    const getColor = (days) => {
        if (days === -1) {
          return "gray"; 
        } else if (days < 5) {
          return "red";
        } else if (days < 10) {
          return "orange";
        } else {
          return "green";
        }
    };

    const handleClick = (competitionId) => {
        console.log("Clicked card ID:", competitionId);
    };

    const formatDeadline = (deadline) => {
        if (!deadline) {
            console.error("Deadline is undefined or null");
            return "N/A"; 
        }
    
        const dateParts = deadline.split("-");
        if (dateParts.length !== 3) {
            console.error("Invalid deadline format:", deadline);
            return "Invalid Deadline"; 
        }
    
        const monthIndex = parseInt(dateParts[1]) - 1;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        return `${months[monthIndex]} ${parseInt(dateParts[2])}, ${dateParts[0]}`;
    };  

    const sortedCompetitions = competitionData ? competitionData.slice().sort((a, b) => {
        const daysLeftA = daysLeft(a.date_submission);
        const daysLeftB = daysLeft(b.date_submission);
        if (daysLeftA === -1 && daysLeftB !== -1) {
            return 1; 
        } else if (daysLeftB === -1 && daysLeftA !== -1) {
            return -1; 
        } else {
            return daysLeftA - daysLeftB;
        }
    }) : [];

    return(
        <>
            <INavbar />
            <Container>
                <div className='mt-4 mb-4 d-flex justify-content-center'>
                    <h1 className='title-text'>Startup Competitions</h1>
                </div>
                <div className="d-flex flex-wrap justify-content-evenly gap-3 mt-4 mb-5">
                    {sortedCompetitions.map((competition, index) => (
                        <div key={index}>
                            <div onClick={() => handleClick(competition.competition_id)}>
                                <Card className="mb-3 box">
                                    <Card.Img
                                        className='image-fluid card-image'
                                        variant="top"
                                        src={`http://navigatu.test/storage/${competition.image_path}`}
                                        alt={competition.name}
                                    />
                                    <div
                                        className='fw-bold'
                                        style={{
                                            position: "absolute",
                                            right: "20px",
                                            padding: "5px",
                                            backgroundColor: getColor(daysLeft(competition.date_submission)),
                                            color: "white"
                                        }}
                                    >
                                        {daysLeft(competition.date_submission) !== -1 ? (
                                            <small>
                                                {daysLeft(competition.date_submission) === 1 ? "1 Day Left" : `${daysLeft(competition.date_submission)} Days Left`}
                                            </small>
                                        ) : (
                                            <small>Event has ended</small>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{competition.competition_name}</Card.Title>
                                        <Card.Text>{competition.competition_description}</Card.Text>
                                        <Card.Text>
                                            <small className="text-muted">Event Date: {formatDeadline(competition.date)}</small><br/>
                                            <small className="text-muted">Deadline: {formatDeadline(competition.date_submission)}</small>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
}

export default ICompetition;
