import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Container, Card, InputGroup } from "react-bootstrap";
import MNavbar from './MNavbar';

function MViewAppointment() {
    const [mentorschedule, setMentorSchedule] = useState(null);
    const [teamNames, setTeamNames] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editedTime, setEditedTime] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedRemarks, setEditedRemarks] = useState("");
    const id = sessionStorage.getItem('id');

    const fetchTeamSchedule = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/viewmentorevent/${id}`);
            const data = await response.json();
            const sortedData = sortScheduleByNearestDate(data);
            setMentorSchedule(sortedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchTeamName = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/teams`);
            const data = await response.json();
            setTeamNames(data); 
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchTeamSchedule();
        fetchTeamName();
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }


    const sortScheduleByNearestDate = (scheduleData) => {
        return scheduleData.slice().sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
    };
    

    function getTeamName(teamId) {
        if (teamNames === null) {
            return 'Loading...'; 
        }
        const team = teamNames.find(team => team.team_id === teamId);
        return team ? team.team_name : 'Unknown Team';
    }

    const handleEdit = (scheduleItem) => {
        setSelectedSchedule(scheduleItem);
        setEditedTime(scheduleItem.time);
        setEditedStatus(scheduleItem.status);
        setShowModal(true);
    };

    const handleRemarksChange = (event) => {
        setEditedRemarks(event.target.value);
    };

    const handleStatusChange = (event) => {
        setEditedStatus(event.target.value);
    };



    const handleCloseModal = () => {
        setShowModal(false);
        setEditedRemarks('');
    };

    const updateSchedule = async () => {
        try {
            const { appointment_id, team_id, mentor_id, date, time } = selectedSchedule;
    
            const response = await fetch(`http://navigatu.test/api/updatementorevent/${appointment_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    team_id,
                    mentor_id,
                    date,
                    viewed:'yes',
                    time,
                    status: editedStatus,
                    remarks: editedRemarks,
                    
                })
            });
    
            if (response.ok) {
                console.log("Schedule updated successfully");
          fetchTeamSchedule();
            } else {
                console.error("Failed to update schedule");
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };
    

    const handleSaveChanges = () => {
        updateSchedule();
        setEditedRemarks('');
        setShowModal(false);
    };

    return (
        <>
            <MNavbar />
            <Container>
                <Container className="d-flex justify-content-center mt-4">
                    <h2 className="title-text fw-bold">My Appointments</h2>
                </Container>
                <Card className="submissions mt-3 mb-5">
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Team Name</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mentorschedule && mentorschedule.map((scheduleItem, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(scheduleItem.date)}</td>
                                        <td>{getTeamName(scheduleItem.team_id)}</td>
                                        <td>{scheduleItem.time}</td>
                                        <td>{scheduleItem.status}</td>
                                        <td>{scheduleItem.remarks}</td>
                                        <td>
                                            <Button onClick={() => handleEdit(scheduleItem)} className="login-button fw-bold w-50">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="title-text fw-bold">Scheduling Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSchedule && (
                        <>
                            <InputGroup className="mb-2">
                                <InputGroup.Text id="basic-addon1" className="title-text">Scheduled Team</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={getTeamName(selectedSchedule.team_id)}
                                    readOnly
                                />
                            </InputGroup>
                            <InputGroup className="mb-2">
                                <InputGroup.Text id="basic-addon1" className="title-text">Scheduled Date</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={formatDate(selectedSchedule.date)}
                                    readOnly
                                />
                            </InputGroup>
                            <InputGroup className="mb-2">
                                <InputGroup.Text id="basic-addon1" className="title-text">Scheduled Time</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={selectedSchedule.time}
                                    readOnly
                                />
                            </InputGroup>
                            <InputGroup className="mb-2">
                                <InputGroup.Text id="basic-addon1" className="title-text">Status</InputGroup.Text>
                                <Form.Control as="select" value={editedStatus} onChange={handleStatusChange}>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Approved">Approved</option>  
                                </Form.Control>
                            </InputGroup>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1" className="title-text">Remarks</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={editedRemarks} 
                                    onChange={handleRemarksChange}
                                />
                            </InputGroup>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="outline-secondary" onClick={handleCloseModal} className="title-text fw-bold p-3 w-25">
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges} className="login-button title-text fw-bold p-3 w-25">
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MViewAppointment;
