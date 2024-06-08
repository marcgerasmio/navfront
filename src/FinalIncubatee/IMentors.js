import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import INavbar from "./INavbar.js";
import { 
    Modal, Button, 
    Table, Container, 
    Row, Col, Form,
    FloatingLabel
} from 'react-bootstrap';

function IMentor() {
    const [mentorData, setMentorData] = useState(null);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedMentorId, setSelectedMentorId] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [specialEvents, setSpecialEvents] = useState([]);
    const [specialEventName, setSpecialEventName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [timeInput, setTimeInput] = useState('');
    const [teamSchedule, setTeamSchedule] = useState([]);
    const [modalClosed, setModalClosed] = useState(true);
    const [teamid, setTeamId] = useState([]);
    const team_ceo = sessionStorage.getItem('name');

    
        const fetchTeamId = async () => {
            try {
                const response = await fetch(`http://navigatu.test/api/find/${team_ceo}`);
                const data = await response.json();
                console.log(data);
                const team_id = data[0].team_id;
                setTeamId(team_id);
                fetchTeamSchedule(team_id);
               
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
 

    const fetchData = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/showmentor`);
            const data = await response.json();
            setMentorData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchTeamSchedule = async (team_id) => {
        try {
            const response = await fetch(`http://navigatu.test/api/viewteamschedule/${team_id}`);
            const data = await response.json();
            const sortedData = sortScheduleByNearestDate(data);
            setTeamSchedule(sortedData);
            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchTeamId();      
        fetchData();
    }, []);
    
    const fetchSchedule = async (selectedId) => {
        try {
            const response = await fetch(`http://navigatu.test/api/viewmentorschedule/${selectedId}`);
            const data = await response.json();
            const dates = data.map(item => {
                const timeslots = Array.isArray(item.time) ? item.time : [item.time];
                return {
                    date: new Date(item.date),
                    timeslots: timeslots.map(time => time.toString())
                };
            });
            setSpecialEvents(dates);
            console.log(dates);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const handleSelectChange = (event) => {
        const selectedId = event.target.value; 
        setSelectedMentorId(selectedId);
        console.log("selected" + selectedId);
        sessionStorage.setItem("selectedId", selectedId);
        const selectedName = event.target.options[event.target.selectedIndex].text; 
        setSelectedMentor(selectedName); 
        fetchSchedule(selectedId);
    };

    function onChange(nextValue) {
        setSelectedDate(nextValue);
    }

    function handleSpecialDateClick(date) {
        const specialDate = specialEvents.find(
            specialDate => {
                if (specialDate.date instanceof Date) {
                    return date.toDateString() === specialDate.date.toDateString();
                }
                return false;
            }
        );
        if (specialDate) {
            setSelectedDate(date);
            const mentorName = selectedMentor;
            setSpecialEventName(mentorName);
            setSpecialEvents(specialDate.timeslots);
            setShowModal(true);
            setModalClosed(false);
            console.log("Timeslots:", specialDate.timeslots);
            const time = specialDate.timeslots.join();
            sessionStorage.setItem("timeslots", time);
            console.log(time);
        }
    }
    
    function closeModal() {
        const mentorId = sessionStorage.getItem('selectedId');
        console.log("mentor" + mentorId);
        fetchSchedule(mentorId);
        setShowModal(false);
        setModalClosed(true);
    }
    
    const handleSubmit = async () => {
        const date = formatDate(selectedDate);
        try {
            const response = await fetch('http://navigatu.test/api/createschedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mentor_id: selectedMentorId,
                    team_id: '52',
                    date: date,
                    time: timeInput,
                    viewed: 'yes',
                    remarks:'pending',
                    status:'pending',
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit schedule');
            }
          updatementor();
        } catch (error) {
            console.error('Error submitting schedule:', error.message);
        }
    };

    const updatementor = async () => {
        const timeremain = sessionStorage.getItem('time')
        const date = formatDate(selectedDate);
        try {
            const response = await fetch(`http://navigatu.test/api/updatementordate/${selectedMentorId}/${date}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mentor_id: selectedMentorId,
                    date: date,
                    time:timeremain,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit schedule');
            }
            console.log('Schedule submitted successfully');
            setTimeInput('');
            closeModal();
            fetchTeamId(); 
        } catch (error) {
            console.error('Error submitting schedule:', error.message);
        }
    };

    function tileContent({ date }) {
        const isSpecialDate = specialEvents.some(
            specialDate => {
                if (specialDate.date instanceof Date) {
                    return date.toDateString() === specialDate.date.toDateString();
                }
                return false;
            }
        );
        return (
            <div>
                {modalClosed && (
                    <div className="special-date-indicator">{isSpecialDate && "●"}</div>
                )}
            </div>
        );
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

    function getMentorName(mentorId) {
        if (!mentorData || !mentorId) {
            return 'Loading...'; 
        }
        const mentor = mentorData.find(mentor => mentor.id === mentorId);
        return mentor ? mentor.name : 'Unknown Mentor';
    }

    const handleCheckboxChange = (value) => {
        setTimeInput(value);
    };

    function formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(date).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
    }
    
    function logScheduleDetails() {
        console.log("Selected Date:", formatDate(selectedDate));
        console.log("Selected Mentor ID:", selectedMentorId);
        console.log("Selected Time:", timeInput);
        const timeslot = sessionStorage.getItem("timeslots");
        const timeslotsArray = timeslot.split(",");
        const remainingTimeslots = timeslotsArray.filter(slot => slot !== timeInput);
        const remaintime = remainingTimeslots.join(", ");
        sessionStorage.setItem("time", remaintime);
        console.log("Remaining Timeslots:", remaintime);
        handleSubmit();
    }
    
    return (
        <>
            <INavbar />
            <Container>
                <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
                    <h1 className='title-text text-center mt-2'>My Appointments</h1>
                    <FloatingLabel controlId="mentorSelect" label="Select Mentor">
    <Form.Select onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>Select Mentor</option>
        {mentorData && mentorData.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
        ))}
    </Form.Select>
</FloatingLabel>

                </div>
                <Container className="d-flex gap-4">
                    <Container className="calendar-container d-flex box w-50">
                        <Calendar
                            className="w-100"
                            onChange={onChange}
                            value={selectedDate}
                            onClickDay={(value) => handleSpecialDateClick(value)}
                            tileContent={tileContent}
                        />
                    </Container>
                    <Container 
                        style={{ maxHeight: '500px', overflowY: 'auto' }}
                        className="calendar-container box"
                    >
                        <Table bordered hover className="">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Mentor</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Remarks</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teamSchedule &&
                                teamSchedule.map((scheduleItem, index) => (
                                <tr key={index}>
                                    <td>{scheduleItem.date}</td>
                                    <td>{getMentorName(scheduleItem.mentor_id)}</td>
                                    <td>{scheduleItem.time}</td>
                                    <td>{scheduleItem.status}</td>
                                    <td>{scheduleItem.remarks}</td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Container>
            </Container>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold title-text">Please Select a Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Selected Date: {selectedDate && formatDate(selectedDate)}</p>
                        <p>Mentor Name: {specialEventName}</p>
                        <div>
                            <p>Select Time:</p>
                            {specialEvents.map((timeslot, index) => (
                                <div key={index}>
                                    {String(timeslot).split(',').map((slot, slotIndex) => (
                                        <>
                                            <label key={slotIndex}>
                                                <input
                                                    type="checkbox"
                                                    value={slot.trim()}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {slot.trim()}
                                            </label>
                                            <br />
                                        </>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {/* {timeInput === '' && <p style={{ color: 'red' }}>Please select a time</p>} */}
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="outline-secondary" onClick={closeModal} className="fw-bold p-3 w-25">Close</Button>
                    <Button variant="primary" onClick={logScheduleDetails} className="login-button fw-bold p-3 w-25">Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IMentor;