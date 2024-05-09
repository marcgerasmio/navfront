import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import PNavbar from './PNavbar.js';
import '../Styles/PTeamMembers.css';

function TeamMembers() {
    const [teamData, setTeamData] = useState(null);
    const [membersData, setMembersData] = useState(null);
    const team_id = sessionStorage.getItem('team_id');
    console.log(team_id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://navigatu.test/api/team/${team_id}`);
                const data = await response.json();
                console.log(data);
                setTeamData(data);
                fetchMembers();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [team_id]);

    const fetchMembers = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/members/${team_id}`);
            const data = await response.json();
            console.log(data);
            setMembersData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <PNavbar />
            <div className="p-5">
                    {teamData && teamData.map((team) => (
                        <Container className="d-flex justify-content-center mt-2">
                            <Card key={team.team_id} className="p-3 team">
                                <Row>
                                    <Col xs={3}>
                                        <Card.Img 
                                            variant="top" 
                                            src={`http://navigatu.test/storage/${team.logo_path}`} 
                                            alt=""
                                            fluid
                                        />
                                    </Col>
                                    <Col sm={9}>
                                        <Card.Body>
                                            <Card.Text className='fw-bold fs-1'>{team.team_name}</Card.Text>
                                        </Card.Body>
                                        <div>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
                                            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
                                            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Container>
                    ))}
                </div>

                <Container className="gap-5 d-flex flex-wrap justify-content-center">
                    {membersData && membersData.map((member) => (
                        <div>
                            <Card key={member.member_id} className="team-members">
                                <Row>
                                    <Col>
                                        <Card.Img 
                                            variant="top" 
                                            src={`http://navigatu.test/storage/${member.image_path}`} 
                                            alt="" 
                                        />
                                    </Col>
                                    <Col sm={8}>
                                        <Card.Body>
                                            <Card.Text>
                                                <p className='fw-bold'>{member.member_name}</p>
                                                <p>{member.role}</p>{member.email}
                                            </Card.Text>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    ))}
                </Container>
        </>
    );
}

export default TeamMembers;