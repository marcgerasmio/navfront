import { useState, useEffect } from "react";
import INavbar from "./INavbar";
import { Card, Container } from "react-bootstrap";

function ISeedFunding() {
    const [seedFundingData, setSeedFundingData] = useState([]);
    const cardCount = 6;

    const fetchSeedFundingData = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/seedfunding`);
            const data = await response.json();
            const currentDate = new Date();
            data.sort((a, b) => {
                const daysLeftA = daysLeft(a.deadline, currentDate);
                const daysLeftB = daysLeft(b.deadline, currentDate);
                if (daysLeftA === -1 && daysLeftB !== -1) return 1;
                if (daysLeftB === -1 && daysLeftA !== -1) return -1;
                return daysLeftA - daysLeftB;
            });
            setSeedFundingData(data);
        } catch (error) {
            console.error("Error fetching seed funding data:", error);
        }
    };
    
    useEffect(() => {
        fetchSeedFundingData();
    }, []); 

    const daysLeft = (deadline) => {
        const currentDate = new Date();
        const deadlineParts = deadline.split("-");
        const deadlineTime = new Date(
            parseInt(deadlineParts[0]),
            parseInt(deadlineParts[1]) - 1,
            parseInt(deadlineParts[2])
        );
        if (currentDate > deadlineTime) {
            return -1;
        } else {
            const differenceInTime = deadlineTime.getTime() - currentDate.getTime();
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            return differenceInDays;
        }
    };
    
    const getColor = (days) => {
        if (days === -1) { return "gray"; } 
        else if (days < 5) { return "red"; } 
        else if (days < 10) {return "orange"; } 
        else { return "green"; }
    };

    const formatDeadline = (deadline) => {
        const dateParts = deadline.split("-");
        const monthIndex = parseInt(dateParts[1]) - 1;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[monthIndex]} ${parseInt(dateParts[2])}, ${dateParts[0]}`;
    };

    return (
        <>
            <INavbar />
            <Container>
                <div className='mt-4 mb-4 d-flex justify-content-center'>
                    <h1 className='title-text'>Seed Fundings</h1>
                </div>
                <div className="d-flex flex-wrap justify-content-evenly gap-3 mt-4 mb-5">
                    {seedFundingData.slice(0, cardCount).map((seedfunding, index) => (
                        <div key={index}>
                            <div>
                                <Card className="mb-3 box">
                                    <Card.Img 
                                        className='image-fluid card-image'
                                        variant="top"
                                        src={seedfunding.image || "dash.jpg"} 
                                        alt={seedfunding.title} 
                                    />
                                    <div
                                        className='fw-bold'
                                        style={{
                                            position: "absolute",
                                            right: "20px",
                                            padding: "5px",
                                            backgroundColor: getColor(daysLeft(seedfunding.deadline)),
                                            color: "white"
                                        }}
                                    >
                                        {daysLeft(seedfunding.deadline) !== -1 ? (
                                            <small>
                                                {daysLeft(seedfunding.deadline) === 1 ? "1 Day Left" : `${daysLeft(seedfunding.deadline)} Days Left`}
                                            </small>
                                        ) : (
                                            <small>Event has ended</small>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{seedfunding.grant_name}</Card.Title>
                                        <Card.Text>{seedfunding.description}</Card.Text>
                                        <Card.Text>
                                            <small className="text-muted">Amount: ${seedfunding.budget_allocated}</small><br/>
                                            <small className="text-muted">Deadline: {formatDeadline(seedfunding.deadline)}</small>
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

export default ISeedFunding;
