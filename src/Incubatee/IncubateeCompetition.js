import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

function IncubateeCompetition() {
  const [competitionData, setCompetitionData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/competition`);
      const data = await response.json();
      setCompetitionData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const daysLeft = (submissionDate) => {
    const currentDate = new Date();
    const submissionDateParts = submissionDate.split("/");
    const submissionDateTime = new Date(
      submissionDateParts[2],
      submissionDateParts[1] - 1,
      submissionDateParts[0]
    );

    if (currentDate > submissionDateTime) {
      return "event has ended";
    } else {
      const differenceInTime = submissionDateTime.getTime() - currentDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays;
    }
  };

  const getColor = (days) => {
    if (days === "event has ended") {
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
  sessionStorage.setItem("competitionid", competitionId);
  };

  return (
    <div className="d-flex flex-wrap">
      {competitionData &&
        competitionData.map((competition, index) => (
          <div key={index} style={{ flex: "0 0 30%", margin: "10px" }}>
            <div onClick={() => handleClick(competition.competition_id)}>
              <Card className="mb-3 dash" style={{ position: "relative" }}>
                <Card.Img
                  variant="top"
                  src={`http://navigatu.test/storage/${competition.image_path}`}
                  alt={competition.name}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "1px",
                    right: "20px",
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor: getColor(daysLeft(competition.date_submission)),
                    color: "white",
                  }}
                >
                  {daysLeft(competition.date_submission) !== "event has ended" ? (
                    <small>{daysLeft(competition.date_submission)} Days Left</small>
                  ) : (
                    <small>Event has ended</small>
                  )}
                </div>
                <Card.Body>
                  <Card.Title>{competition.competition_name}</Card.Title>
                  <Card.Text>{competition.competition_description}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Deadline: {competition.date}
                    </small>
                    <br />
                    <small className="text-muted">
                      Event Date: {competition.date_submission}
                    </small>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        ))}
    </div>
  );
}

export default IncubateeCompetition;
