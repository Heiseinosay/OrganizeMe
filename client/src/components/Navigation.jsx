import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// STYLES
import '../styles/navigation.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

// IMAGES
import LogoWhite from '../images/logo_white.png'
import Avatar from '../images/avatar.png'
import SearchBar from '../images/loupe.png'
import QuikAdd from '../images/addon.png'
import Hut from '../images/hut.png'
import Bell from '../images/bell.png'
import Completed from '../images/completed.png'
import Logout from '../images/logout.png'

// COMPONENTS
import CreateTask from './CreateTask'

function Navigation(props) {

    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault(); // Prevent default link navigation
        sessionStorage.removeItem('user'); // Remove data from session storage
        navigate('/login'); // Navigate to login page
    };

    //* SEARCH 
    const [searchTerm, setSearchTerm] = useState(null)
    const search = () => {
        if (searchTerm) {
            // window.location.reload()
            navigate(`/search?searchTerm=${searchTerm}`)
            // alert(searchTerm)
        }

    }

    return (
        <div className='comp-navigation'>
            <img src={LogoWhite} alt="logo" />
            <div className="profile-info">
                <img src={Avatar} alt="avatar" />
                <div className="profile-info-text">
                    <h1 className='konkhmer-sleokchher-regular'>{props.userdata[1]}</h1>
                    <h5 className='inter-light'>{props.userdata[3]}</h5>
                </div>
            </div>
            <div className="nav-search-bar inter-semi-bold">
                <img src={SearchBar} alt="search icon" />
                <input type="text" placeholder='Search' className='inter-regular'
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            search();
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="nav-quick-task inter-semi-bold" onClick={props.onCreateTaskClick}>
                <img src={QuikAdd} alt="add icon" />
                Task
            </button>
            <ul className='inter-regular'>
                <a href="/home"><li><img src={Hut} alt="hut icon" className='nav-icon' /><p>Dashboard</p></li></a>
                <a href="/notification"><li><img src={Bell} alt="hut icon" className='nav-icon' /><p>Notification</p></li></a>
                <a href="/completed"><li><img src={Completed} alt="hut icon" className='nav-icon' /><p>Completed</p></li></a>
                <a href="/login" onClick={handleLogout}><li><img src={Logout} alt="hut icon" className='nav-icon' /><p>Logout</p></li></a>
            </ul>
        </div>
    )
}

export default Navigation
