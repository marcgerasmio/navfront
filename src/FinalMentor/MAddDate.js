import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MNavbar from './MNavbar';
import { Modal, Button, Form, Table } from 'react-bootstrap';

function MAddDate() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [mentorDate, setMentorDate] = useState({});
    const [selectedRowData, setSelectedRowData] = useState({});
    const id = sessionStorage.getItem("id");

    const fetchMentorSchedule = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/viewmentorschedule/${id}`);
            const data = await response.json();
            setMentorDate(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchMentorSchedule();
    }, []);

    const addmentordate = async () => {
        try {
          // Proceed with submission
          const response = await fetch('http://navigatu.test/api/addmentordate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mentor_id : id,
              time: selectedTimeSlots,
              date: formatSelectedDate(selectedDate),
            }),
          });
          const data = response.json();
          console.log(data);
          handleCloseAddModal();
        
        } catch (error) {
          // Handle errors
          alert("Submission failed. Please try again.");
          console.error('Error submitting:', error.message);
        }
    };

    const editmentordate = async () => {
        try {
          // Proceed with submission
          const response = await fetch(`http://navigatu.test/api/updatementordate/${selectedId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mentor_id: id,
              time: selectedTimeSlots,
              date: formatSelectedDate(selectedDate),
            }),
          });
          const data = response.json();
          console.log(data);
          handleCloseEditModal();
        
        } catch (error) {
          // Handle errors
          alert("Update failed. Please try again.");
          console.error('Error updating:', error.message);
        }
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setSelectedDate(null);
        setSelectedTimeSlots('');
        setShowAddModal(false);
        fetchMentorSchedule();
    };

    const handleOpenEditModal = (schedule) => {
        console.log(schedule);
        const id = schedule.mentorschedule_id;
        setSelectedId(id);
        setSelectedDate(new Date(schedule.date)); // Set selected date to the date of the selected row
        setSelectedTimeSlots(schedule.time); // Set selected time slots to the time of the selected row
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setSelectedDate(null);
        setSelectedTimeSlots('');
        setShowEditModal(false);
        fetchMentorSchedule();
    };

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleTimeSlotChange = timeSlot => {
        // Toggle selected time slot
        if (selectedTimeSlots.includes(timeSlot)) {
            setSelectedTimeSlots(selectedTimeSlots.replace(timeSlot + ',', ''));
        } else {
            if(selectedTimeSlots !== '') {
                setSelectedTimeSlots(selectedTimeSlots + ',' + timeSlot);
            } else {
                setSelectedTimeSlots(timeSlot);
            }
        }
    };

    // Format selected date as YYYY-MM-DD
    const formatSelectedDate = date => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
        return `${year}-${month}-${day}`;
    };

    // Format selected time slots as [08:00-09:00, 9:00-10:00]
    const formatSelectedTimeSlots = () => {
        return selectedTimeSlots;
    };

    // Array of time slots
    const timeSlots = [
        '8:00-9:00',
        '9:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00'
    ];

    return (
        <>
            <MNavbar />
            <Button variant="primary" onClick={handleOpenAddModal}>
                Add Available Date
            </Button>
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                calendarType="US"
                                selectRange={false}
                            />
                            <Form.Control
                                type="text"
                                value={formatSelectedDate(selectedDate)}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formTimeSlots">
                            <Form.Label>Time Slots</Form.Label>
                            {timeSlots.map((timeSlot, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={timeSlot}
                                    checked={selectedTimeSlots.includes(timeSlot)}
                                    onChange={() => handleTimeSlotChange(timeSlot)}
                                />
                            ))}
                        </Form.Group>
                        <Form.Group controlId="selectedTime">
                            <Form.Label>Selected Time</Form.Label>
                            <Form.Control
                                type="text"
                                value={formatSelectedTimeSlots()}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addmentordate}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                calendarType="US"
                                selectRange={false}
                            />
                            <Form.Control
                                type="text"
                                value={formatSelectedDate(selectedDate)}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formTimeSlots">
                            <Form.Label>Time Slots</Form.Label>
                            {timeSlots.map((timeSlot, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={timeSlot}
                                    checked={selectedTimeSlots.includes(timeSlot)}
                                    onChange={() => handleTimeSlotChange(timeSlot)}
                                />
                            ))}
                        </Form.Group>
                        <Form.Group controlId="selectedTime">
                            <Form.Label>Selected Time</Form.Label>
                            <Form.Control
                                type="text"
                                value={formatSelectedTimeSlots()}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editmentordate}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(mentorDate).map((schedule, index) => (
                        <tr key={index}>
                            <td>{schedule.date}</td>
                            <td>{schedule.time}</td>
                            <td><Button variant="primary" onClick={() => handleOpenEditModal(schedule)}>Edit</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default MAddDate;
