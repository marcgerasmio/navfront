import { useEffect, useState } from "react";
import PNavbar from "./PNavbar.js";
import { Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../Styles/App.css';

function Milestone () {
    const [teamData, setTeamData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://navigatu.test/api/teams");
                const data = await response.json();
                console.log(data);
                setTeamData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleClick = (teamId) => {
        sessionStorage.setItem('team_id', teamId);
        console.log(teamId);
        navigate('/pdeliverables');
    };

    return (
        <>
            <PNavbar />
            <Container>
                <div className="d-flex flex-wrap justify-content-evenly gap-5 p-5">
                    {teamData && teamData.map((team) => (
                        <div key={team.team_id}>
                            <Card 
                                className="p-4 milestone"
                                onClick={() => handleClick(team.team_id)} 
                            >
                            <Card.Img 
                                src={team.logo_path ? `http://navigatu.test/storage/${team.logo_path}` : 'navi-logo.png'} 
                            />
                            <Card.Text className='fw-bold d-flex justify-content-center mt-2 fs-2'>
                                <span className="title-text">{team.team_name}</span>
                            </Card.Text>
                            </Card> 
                        </div>
                    ))}
                </div> 
            </Container>
        </>
    );
    
}
export default Milestone;