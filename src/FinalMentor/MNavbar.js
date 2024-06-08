import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { RiTeamFill } from "react-icons/ri";
import { TbCategoryFilled } from "react-icons/tb";
import { FaBarsProgress } from "react-icons/fa6";
import { MdEmojiEvents } from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import { CgCalendarDates } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import '../Styles/App.css';

function MNavbar() {
    const [show, setShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [mentorDate, setMentorDate] = useState([]);
    const id = sessionStorage.getItem("id");

    const fetchMentorSchedule = async () => {
        try {
            const response = await fetch(`http://navigatu.test/api/viewedteamschedule/${id}`);
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


    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href="#/sample"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className='custom-toggle d-flex align-items-center'
        >
            {children}
        </a>
    ));

    const dataCount = mentorDate.length;

    const handleShow = () => {
        setShow(true);
        setExpanded(true);
    };

    return (
        <>
            <Navbar 
                sticky="top" 
                expanded={expanded} 
                expand="lg" 
                variant="dark" 
                className="flex-lg-column sidebar p-2"
            >
                <div className="container">
                    <Navbar.Brand>
                        <NavLink to="#">
                            <div className="d-flex align-items-center gap-2">
                                <Navbar.Toggle 
                                    aria-controls="offcanvasNavbar" 
                                    onClick={handleShow} 
                                    className="d-lg-none" 
                                />
                                <Image 
                                    src="navi-logo.png" 
                                    className='sidebar-logo'
                                    height={30} 
                                    width={45} 
                                    alt="" 
                                    fluid
                                />
                                <Image 
                                    src="logo.png" 
                                    height={40} 
                                    width={150} 
                                    alt="" 
                                    fluid
                                />
                            </div>
                        </NavLink>
                    </Navbar.Brand>
                    <Nav
                        variant="underline"
                        className="me-auto fw-bold d-lg-flex justify-content-center w-100 d-none d-lg-block gap-2"
                    >
                        <NavLink to="/madddate" className="nav-link text-white">
                            <CgCalendarDates size={20} className="me-1 mb-1" />
                            Available Dates
                        </NavLink>
                        <NavLink to="/mviewappointment" className="nav-link text-white">
                            <GrSchedule size={20} className="me-1 mb-1" />
                            View Appointments
                        </NavLink>
                        {/* <NavLink to="/mviewappointment" className="nav-link text-white">
                            <div className="position-relative">
                                <FaBell size={20} className="me-1 mb-1"/>
                                {dataCount > 0 && (
                                    <div className="notification-circle">{dataCount}</div>
                                )}
                            </div>
                        </NavLink> */}
                    </Nav>
                    <div className="d-lg-block d-none me-3">
                        <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                                <BsFillPersonFill size={22} className='me-1' />
                                <span className='fw-bold'>User</span>
                                <FaCaretDown className="ms-1" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                                <Dropdown.Item href="/meditprofile">Edit Account</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </Navbar>
        </>
    );
}

export default MNavbar;
