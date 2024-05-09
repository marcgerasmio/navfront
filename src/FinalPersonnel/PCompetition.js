import PNavbar from './PNavbar.js';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import '../Styles/PDashboard.css';

function PCompetition() {
    const [competitionData, setCompetitionData] = useState(null);
    const navigate = useNavigate();
    const cardCount = 4;

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
            return -1; // Error condition
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
            return "N/A"; // Or handle it as per your requirement
        }
    
        const dateParts = deadline.split("-");
        if (dateParts.length !== 3) {
            console.error("Invalid deadline format:", deadline);
            return "Invalid Deadline"; // Or handle it as per your requirement
        }
    
        const monthIndex = parseInt(dateParts[1]) - 1;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        // Add more error handling as needed
    
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

    const addCompetition = () => {
        navigate("/paddcompetition");
    }

    return(
        <>
            <PNavbar />
            <Container>
                <div className="d-flex justify-content-end mt-3">
                    <Button 
                        onClick={addCompetition} 
                        className="mt-3 btn-register-save fw-bold"
                    >
                        <IoMdAddCircle size={25} className="mb-1" />&nbsp;
                        Add Competition
                    </Button>
                </div>
                <div className="d-flex flex-wrap justify-content-evenly gap-3 mt-4">
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

export default PCompetition;
