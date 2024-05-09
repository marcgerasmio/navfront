import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

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
        const currentDate = new Date();
        return scheduleData.slice().sort((a, b) => {
            const dateA = new Date(a.year, a.month, a.date);
            const dateB = new Date(b.year, b.month - 1 + 1, b.date);
            const diffA = Math.abs(dateA - currentDate);
            const diffB = Math.abs(dateB - currentDate);
            return diffA - diffB;
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
                                <Button onClick={() => handleEdit(scheduleItem)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal to display scheduling details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Scheduling Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSchedule && (
                        <div>
                             <p>Scheduled Team: {getTeamName(selectedSchedule.team_id)}</p>
                            <p>Date: {formatDate(selectedSchedule.date)}</p>
                            <p>Time: {selectedSchedule.time}</p>
                            <Form.Group controlId="editedStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" value={editedStatus} onChange={handleStatusChange}>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Approved">Approved</option>  
                                    </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="editedRemarks">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control type="text" value={editedRemarks} onChange={handleRemarksChange} />
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MViewAppointment;
