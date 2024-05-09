import React, { useEffect, useState } from "react";
import IncubateeSidebar from "../Incubatee/Sidebar.js";
import { Card, Row, Col, Container, Form, Button, Modal } from "react-bootstrap";

function IncubateeTeamMembers() {
    const [teamData, setTeamData] = useState(null);
    const [membersData, setMembersData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [memberId, setMemberId] = useState(null);
    const [memberName, setMemberName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(""); // New state for role
    const [image, setImage] = useState(null);

    const team_ceo = sessionStorage.getItem('name');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://navigatu.test/api/find/${team_ceo}`);
                const data = await response.json();
                console.log(data);
                const team_id = data[0].team_id;
                setTeamData(data);
                fetchMembers(team_id);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [team_ceo]);

    const fetchMembers = async (team_id) => {
        try {
            const response = await fetch(`http://navigatu.test/api/members/${team_id}`);
            const data = await response.json();
            console.log(data);
            setMembersData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleAddMember = async () => {
        try {
            const teamId = teamData && teamData.length > 0 ? teamData[0].team_id : null;
            if (!teamId) {
                console.error("Team ID not found");
                return;
            }

            // Validate memberName, email, and role
            if (!memberName || !email || !role) {
                alert("Member Name, Email, and Role cannot be null");
                return;
            }

            const formData = new FormData();
            if (image) {
                formData.append("image_path", image);
            }
            formData.append("member_name", memberName);
            formData.append("email", email);
            formData.append("role", role); // Include role in form data
            formData.append("team_id", teamId);

            const response = await fetch(`http://navigatu.test/api/registermember`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                fetchMembers(teamId); // Refresh members list
                // Reset form fields
                setMemberName("");
                setEmail("");
                setRole("");
                setImage(null);
                setShowAddModal(false); // Hide modal after adding member
            }
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const handleEditMember = async () => {
        try {
            // Check if memberId is valid
            if (!memberId) {
                console.error("Member ID not found");
                return;
            }
            const teamId = teamData && teamData.length > 0 ? teamData[0].team_id : null;
            if (!teamId) {
                console.error("Team ID not found");
                return;
            }

            const formData = new FormData();
            if (image) {
                formData.append("image_path", image);
            }
            formData.append("team_id", teamId); // Append teamId to form data
            formData.append("member_name", memberName);
            formData.append("email", email);
            formData.append("role", role); // Include role in form data

            const response = await fetch(`http://navigatu.test/api/updatemember/${memberId}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                fetchMembers(teamId); // Refresh members list
                // Reset form fields
                setMemberId(null);
                setMemberName("");
                setEmail("");
                setRole("");
                setImage(null);
                setShowEditModal(false); // Hide modal after updating member
            }
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    const openEditModal = (member) => {
        setMemberId(member.member_id);
        setMemberName(member.member_name || ""); // Ensure member_name is not undefined
        setEmail(member.email || ""); // Ensure email is not undefined
        setRole(member.role || ""); // Ensure role is not undefined
        // You may choose to load the current image here if needed
        setShowEditModal(true);
    };

    return (
        <>
            <div>
                <IncubateeSidebar />
                <div className="p-4" style={{ marginLeft: "250px" }}>
                    {teamData && teamData.map((team) => (
                        <Container className="d-flex justify-content-center mt-5 mb-3">
                            <Card key={team.team_id} className="team-name">
                                <Row>
                                    <Col xs={4}>
                                        <Card.Img 
                                            variant="top" 
                                            src={`http://navigatu.test/storage/${team.logo_path}`} 
                                            alt=""
                                        />
                                    </Col>
                                    <Col sm={8}>
                                        <Card.Body>
                                            <Card.Text className='fw-bold fs-1 mt-4'>
                                                {team.team_name}
                                            </Card.Text>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Container>
                    ))}
                </div>
                <div className="p-3 gap-4 d-flex flex-wrap justify-content-evenly" style={{ marginLeft: "250px" }}>
                    {membersData && membersData.map((member) => (
                        <div key={member.member_id}>
                            <Card className="card-member">
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
                                                <p>{member.email}</p>
                                                {member.role}
                                            </Card.Text>
                                            <Button variant="primary" onClick={() => openEditModal(member)}>Edit</Button>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="p-3 gap-4 d-flex flex-wrap justify-content-evenly" style={{ marginLeft: "250px" }}>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Member</Button>
                </div>
            </div>
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="memberName">
                            <Form.Label>Member Name</Form.Label>
                            <Form.Control type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Select Role</option>
                                <option value="CEO">CEO</option>
                                <option value="Hacker">Hacker</option>
                                <option value="Hustler">Hustler</option>
                                <option value="Hipster">Hipster</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddMember}>Add Member</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="memberName">
                            <Form.Label>Member Name</Form.Label>
                            <Form.Control type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Select Role</option>
                                <option value="CEO">CEO</option>
                                <option value="Hacker">Hacker</option>
                                <option value="Hustler">Hustler</option>
                                <option value="Hipster">Hipster</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditMember}>Update Member</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IncubateeTeamMembers;
