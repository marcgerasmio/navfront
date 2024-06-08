import React, { useState } from 'react';
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
import '../Styles/App.css';

function ANavbar() {
    const [show, setShow] = useState(false);
    const [expanded, setExpanded] = useState(false);

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

    const handleClose = () => {
        setShow(false);
        setExpanded(false);
    };

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
                        <NavLink to="/idashboard">
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
                    <div className="d-lg-none">
                        <Offcanvas 
                            show={show} 
                            onHide={handleClose} 
                            placement='start'
                            className='my-offcanvas custom-offcanvas'
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Menu</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="flex-column">
                                    <Nav.Link href="#features">Create Account</Nav.Link>
                                    <Nav.Link href="#pricing">Startup Teams</Nav.Link>
                                    <Nav.Link href="#pricing">Milestone</Nav.Link>
                                    <Nav.Link href="#pricing">Competition</Nav.Link>
                                    <Nav.Link href="#pricing">Seed Funding</Nav.Link>
                                    <Nav.Link href="#pricing">User Profile</Nav.Link>
                                    <Nav.Link href="#pricing">Logout</Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                    <div className="d-lg-block d-none me-3">
                        <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                                <BsFillPersonFill size={22} className='me-1' />
                                <span className='fw-bold'>User</span>
                                <FaCaretDown className="ms-1" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item href="/adashboard">Create Account</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/admin">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </Navbar>
        </>
    );
}

export default ANavbar;