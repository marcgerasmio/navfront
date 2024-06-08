import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MNavbar from './MNavbar';
import { IoMdAddCircle } from "react-icons/io";
import { Modal, Button, Form, Table, Container, Card, InputGroup } from 'react-bootstrap';

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
          alert("Submission failed. Please try again.");
          console.error('Error submitting:', error.message);
        }
    };

    const editmentordate = async () => {
        try {
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
        setSelectedDate(new Date(schedule.date)); 
        setSelectedTimeSlots(schedule.time); 
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

    const formatSelectedDate = date => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatSelectedTimeSlots = () => {
        return selectedTimeSlots;
    };

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
            <Container className='d-flex justify-content-between mt-5 mb-4'>
                <h3 className='title-text fw-bold mt-2'>Available Dates</h3>
                <Button variant="primary" onClick={handleOpenAddModal} className='login-button fw-bold p-2'>
                    <IoMdAddCircle size={25} className="mb-1 me-1" />
                        Available Date
                </Button>
            </Container>
            <Container>
                <Card className='submissions'>
                    <Card.Body>
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
                                        <td><Button variant="primary" onClick={() => handleOpenEditModal(schedule)} className='login-button w-50 fw-bold'>Edit</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title className='title-text fw-bold'>Add Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDate">
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                calendarType="US"
                                selectRange={false}
                                className="w-100 mb-2"
                            />
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Selected Date</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={formatSelectedDate(selectedDate)}
                                    readOnly
                                />
                            </InputGroup>
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
                        <Form.Group controlId="selectedTime" className='mt-2'>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1">Selected Time</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={formatSelectedTimeSlots()}
                                    readOnly
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="outline-secondary" onClick={handleCloseAddModal} className='w-25 fw-bold title-text p-3'>Close</Button>
                    <Button variant="primary" onClick={addmentordate} className='login-button w-25 fw-bold title-text p-3'>Save</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title className='title-text fw-bold'>Edit Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDate">
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                calendarType="US"
                                selectRange={false}
                                className="w-100 mb-2"
                            />
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1">Selected Date</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={formatSelectedDate(selectedDate)}
                                    readOnly
                                />
                            </InputGroup>
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
                        <Form.Group controlId="selectedTime" className='mt-2'>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1">Selected Time</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={formatSelectedTimeSlots()}
                                    readOnly
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="outline-secondary" onClick={handleCloseEditModal} className='w-25 fw-bold title-text p-3'>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editmentordate} className='login-button w-25 fw-bold title-text p-3'>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MAddDate;
