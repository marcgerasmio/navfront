import React, { useEffect, useState } from "react";
import INavbar from './INavbar.js';
import { TbEdit } from "react-icons/tb";
import { IoAddCircle } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { 
    Card, Row, 
    Col, Container, 
    Form, Button, 
    Modal, FloatingLabel 
} from "react-bootstrap";

function ITeamMembers() {
    const [teamData, setTeamData] = useState(null);
    const [membersData, setMembersData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [memberId, setMemberId] = useState(null);
    const [memberName, setMemberName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(""); 
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
            formData.append("role", role); 
            formData.append("team_id", teamId);
            const response = await fetch(`http://navigatu.test/api/registermember`, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                fetchMembers(teamId); 
                setMemberName("");
                setEmail("");
                setRole("");
                setImage(null);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const handleEditMember = async () => {
        try {
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
            formData.append("team_id", teamId);
            formData.append("member_name", memberName);
            formData.append("email", email);
            formData.append("role", role);
            const response = await fetch(`http://navigatu.test/api/updatemember/${memberId}`, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                fetchMembers(teamId); 
                setMemberId(null);
                setMemberName("");
                setEmail("");
                setRole("");
                setImage(null);
                setShowEditModal(false); 
            }
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    const openEditModal = (member) => {
        setMemberId(member.member_id);
        setMemberName(member.member_name || ""); 
        setEmail(member.email || ""); 
        setRole(member.role || ""); 
        setShowEditModal(true);
    };

    const clearFormData = () => {
        setMemberId(null);
        setMemberName("");
        setEmail("");
        setRole("");
        setImage(null);
    };

    return (
        <>
        <INavbar />
        <Container className="p-4">
            {teamData && teamData.map((team) => (
                <Container className="d-flex justify-content-center mt-2">
                    <Card key={team.team_id} className="p-3 team w-100">
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
                                <Card.Text>
                                    <p className="text-justify">
                                        {team.product_details}
                                        A startup typically refers to a newly established business enterprise, 
                                        usually in its early stages of development. These ventures are often 
                                        characterized by their innovative ideas, dynamic approach, and potential
                                        for rapid growth. Startups can emerge in various industries, ranging from 
                                        technology and finance to healthcare and consumer goods.
                                    </p>
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            ))}
        </Container>
        <Container className="mb-5">
            <div className="gap-4 d-flex flex-wrap justify-content-center mb-5">
                {membersData && membersData.map((member) => (
                    <div>
                        <Card key={member.member_id} className="team-members p-2" style={{width: "24rem"}}>
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
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={() => openEditModal(member)}
                                            className="fw-bold w-50"
                                        >
                                            <TbEdit />
                                        </Button>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                ))}
            </div>
            <Container className="d-flex justify-content-center mt-5 gap-3">
                {/* <Button 
                    variant="outline-danger" 
                    className="fw-bold p-3"
                >
                    <RiDeleteBin5Fill size={27} className="mb-1" />
                    Remove
                </Button> */}
                <Button 
                    variant="primary" 
                    onClick={() => setShowAddModal(true)}
                    className="login-button fw-bold p-3"
                >
                    <IoAddCircle size={27} className="mb-1" />
                    Add Member
                </Button>
            </Container>
        </Container>
            
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header>
                    <Modal.Title className="fw-bold title-text">Add Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="memberName" className="mb-3">
                            <FloatingLabel controlId="memberName" label="Member Name">
                                <Form.Control type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <FloatingLabel controlId="email" label="Email">
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="role" className="mb-3">
                            <FloatingLabel controlId="role" label="Role">
                                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Select Role</option>
                                    <option value="CEO">CEO</option>
                                    <option value="Hacker">Hacker</option>
                                    <option value="Hustler">Hustler</option>
                                    <option value="Hipster">Hipster</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="image" className="mb-3">
                            <FloatingLabel controlId="image" label="Image">
                                <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                            </FloatingLabel>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="outline-secondary" onClick={() => setShowAddModal(false)} className="fw-bold p-3 w-25">Close</Button>
                    <Button variant="primary" onClick={handleAddMember} className="fw-bold p-3 w-25 login-button">Add</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearFormData(); }}>
                <Modal.Header>
                    <Modal.Title className="fw-bold title-text">Edit Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="memberName" className="mb-3">
                            <FloatingLabel controlId="memberName" label="Member Name">
                                <Form.Control type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <FloatingLabel controlId="email" label="Email">
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="role" className="mb-3">
                            <FloatingLabel controlId="role" label="Role">
                                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Select Role</option>
                                    <option value="CEO">CEO</option>
                                    <option value="Hacker">Hacker</option>
                                    <option value="Hustler">Hustler</option>
                                    <option value="Hipster">Hipster</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="image" className="mb-3">
                            <FloatingLabel controlId="image" label="Image">
                                <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                            </FloatingLabel>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="outline-secondary" onClick={() => { setShowEditModal(false); clearFormData(); }} className="fw-bold p-3 w-25">Close</Button>
                    <Button variant="primary" onClick={handleEditMember} className="login-button fw-bold p-3 w-25">Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ITeamMembers;
