import React, { useState } from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function IncubateeSidebar() {
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        sessionStorage.clear();
        navigate("/");
    };

    React.useEffect(() => {
        const path = location.pathname;
        setActiveItem(path);
    }, [location]);

    return (
        <div  className='sidebar' style={{overflow:"scroll initial"}}>
            <CDBSidebar className='sidebar-text fw-bold'>
            <CDBSidebarHeader  prefix={
            <i className="fa fa-bars fa-large"></i>
          }>
                    <div className="container sidebar-logo">
                        <img src={'navi-logo.png'} className='navi-logo' alt=''/>
                        <img src={'logo.png'} style={{ width: '120px' }} alt=''/>
                    </div>
                </CDBSidebarHeader>
                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact to="/incubateehome" activeClassName="activeClicked">
                            <div className={`sidebar-menu ${activeItem === '/incubateehome' ? 'activeClicked' : ''}`}>
                                <CDBSidebarMenuItem icon="columns" className='sidebar-menu-text'>
                                    Dashboard
                                </CDBSidebarMenuItem>
                            </div>
                        </NavLink>
                        <NavLink exact to="/incubateemembers" activeClassName="activeClicked">
                            <div className={`sidebar-menu ${activeItem === '/incubateemembers' ? 'activeClicked' : ''}`}>
                                <CDBSidebarMenuItem icon="fa-solid fa-users" className='sidebar-menu-text'>
                                    Team Members
                                </CDBSidebarMenuItem>
                            </div>
                        </NavLink>
                        <NavLink exact to="/incubatee-milestone" activeClassName="activeClicked">
                            <div className={`sidebar-menu ${activeItem === '/incubatee-milestone' ? 'activeClicked' : ''}`}>
                                <CDBSidebarMenuItem icon="medal" className='sidebar-menu-text'>
                                    Milestone
                                </CDBSidebarMenuItem>
                            </div>
                        </NavLink>
                        <NavLink exact to="/incubatee-competition">
                            <div className={`sidebar-menu ${activeItem === '/incubatee-competition' ? 'activeClicked' : ''}`}>
                                <CDBSidebarMenuItem icon="trophy" className='sidebar-menu-text'>
                                    Competition
                                </CDBSidebarMenuItem>
                            </div>
                        </NavLink>
                        <NavLink exact to="/seedfunding" activeClassName="activeClicked">
                            <div className={`sidebar-menu ${activeItem === '/seedfunding' ? 'activeClicked' : ''}`}>
                                <CDBSidebarMenuItem icon="dollar-sign" className='sidebar-menu-text'>
                                    Seed Funding
                                </CDBSidebarMenuItem>
                            </div>
                        </NavLink>
                        <NavLink exact to="/profile" activeClassName="activeClicked">
                            <div className={`sidebar-menu ${activeItem === '/profile' ? 'activeClicked' : ''}`}>
                                <CDBSidebarMenuItem icon="user" className='sidebar-menu-text'>
                                    User Profile
                                </CDBSidebarMenuItem>
                            </div>
                        </NavLink>
                        <NavLink exact to="/" activeClassName="activeClicked" onClick={handleClick}>
                             <div className={`sidebar-menu`}>
                                 <CDBSidebarMenuItem icon="out" className='sidebar-menu-text'>
                                     Incubatee Logout
                                 </CDBSidebarMenuItem>
                              </div>
                      </NavLink>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
            </CDBSidebar>
        </div>
    );
}

export default IncubateeSidebar;