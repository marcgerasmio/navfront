import { useEffect, useState } from "react";
import PNavbar from "./PNavbar.js";
import { Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../Styles/PStartupTeams.css';

function Members() {
    const [teamData, setTeamData] = useState(null);
    const [tbiData, setTbiData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch("http://navigatu.test/api/teams");
                const data = await response.json();
                setTeamData(data);
            } catch (error) {
                console.error("Error fetching teams data:", error);
            }
        };

        const fetchTbi = async () => {
            try {
                const response = await fetch("http://navigatu.test/api/viewtbi");
                const data = await response.json();
                // Convert tbiData to an object for easier lookup
                const tbiDataObject = {};
                data.forEach(tbi => {
                    tbiDataObject[tbi.tbi_id] = tbi.tbi_name;
                });
                setTbiData(tbiDataObject);
            } catch (error) {
                console.error("Error fetching TBI data:", error);
            }
        };

        fetchTeams();
        fetchTbi();
    }, []);

    const handleClick = (teamId) => {
        sessionStorage.setItem('team_id', teamId);
        navigate('/pteammembers');
    };

    return (
        <>
            <PNavbar />
            <Container>
                <div className="d-flex flex-wrap justify-content-evenly gap-5 p-5">
                    {teamData && teamData.map((team) => (
                        <div key={team.team_id}>
                            <Card 
                                className="team-card"
                                onClick={() => handleClick(team.team_id)} 
                            >
                                <div
                                    className='fw-bold'
                                    style={{
                                        position: "absolute",
                                        right: "20px",
                                        padding: "8px",
                                        borderRadius: '3px',
                                        backgroundColor: '#14183c',
                                        color: "white"
                                    }}
                                >
                                    {/* Display corresponding tbi_name */}
                                    <small>{tbiData[team.tbi_id]}</small>
                                </div>
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

export default Members;
