import React, { useState, useEffect } from 'react'
import axios from 'axios';

// COMPONENTS
import Navigation from '../components/Navigation'
import CreateTask from '../components/CreateTask';

// STYLES
import '../styles/fonts.css'
import '../styles/root_variables.css'
import '../styles/notifications.css'

// IMAGES
import Rocket from '../images/rocket.png'
import BellColored from '../images/bell-colored.png'
import Crisis from '../images/crisis.png'
import Bell from '../images/bell.png'


function Notifications() {

    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [notificationList, setNotificationList] = useState(null)

    useEffect(() => {
        // Retrieve user data from sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            console.log("No user data found in session storage.");
        }
    }, []);

    useEffect(() => {
        if (user) {
            axios
                .get('/get_all_subjects', { params: { uid: user[0] } }) // Send user ID as query param
                .then((response) => {
                    setSubjects(response.data);
                    console.log("Fetched subjects:", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching subjects:", error);
                });

            axios
                .get('/get_notification', { params: { uid: user[0] } }) // Send user ID as query param
                .then((response) => {
                    setNotificationList(response.data);
                    console.log("Fetched notifications:", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching notifications:", error);
                });
        }
    }, [user]);

    //* CREATE TASK
    const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);

    const handleCreateTaskToggle = () => {
        console.log(subjects)
        if (subjects.length == 0) {
            // createSubject()
            alert("Please create a subject ")
        } else {
            setIsCreateTaskVisible((prev) => !prev); // Toggles the popup
        }

    };

    const handleCloseCreateTask = () => {
        setIsCreateTaskVisible(false);
    };

    const renderTask = (notificationType) => {
        console.log(notificationType)
        switch (notificationType) {
            case "overdue":
                return (
                    <div className="notification-container">
                        overdue
                    </div>
                );
            case "reminder":
                return (
                    <div className="notification-container">
                        reminder
                    </div>
                );
            case "not started":
                return (
                    <div className="notification-container">
                        not started
                    </div>
                );
            default:
                return (
                    <div className="notification-container">
                        nothing
                    </div>
                )
        }
    }


    if (user == null) {
        return <div>Loading...</div>
    }
    return (
        <div className='page-notifications'>
            {isCreateTaskVisible && (
                <CreateTask onClose={handleCloseCreateTask} uid={user[0]} openedSubject={null} />
            )}
            <div className="notifications-container notifications-section1"><Navigation userdata={user} onCreateTaskClick={handleCreateTaskToggle} /></div>
            <div className="notifications-section2">
                <div className="notification-section2-header">
                    <img src={Bell} alt="bell icon" />
                    <h1 className='konkhmer-sleokchher-regular'>Notification</h1>
                </div>

                <div className="completed-section2-body" id='scroll-bar-style'>

                    {/** MAP HERE */}
                    {notificationList && notificationList.length > 0 ? (
                        notificationList.map((notification, index) => {
                            switch (notification[4]) {
                                case 'reminder':
                                    return (
                                        <div className="notification-item-container">
                                            <div className="notification-item-circle">
                                                <img src={Bell} alt="compelted icon" />
                                            </div>

                                            <div className="notification-item-text">
                                                <p className='inter-regular'>
                                                    Reminder: Don't forget to complete your task, ‘{notification[3]}’, due on {notification[5].slice(0, 16)}. Stay on track with OrganizeMe!
                                                </p>
                                            </div>
                                        </div>
                                    );
                                case 'overdue':
                                    return (
                                        <div className="notification-item-container">
                                            <div className="notification-item-circle">
                                                <img src={Crisis} alt="compelted icon" />
                                            </div>

                                            <div className="notification-item-text">
                                                <p className='inter-regular'>
                                                    Reminder: Don't forget to complete your task, ‘{notification[3]}’, due on {notification[5].slice(0, 16)}. Stay on track with OrganizeMe!
                                                </p>
                                            </div>
                                        </div>
                                    );
                                case 'not started':
                                    return (
                                        <div className="notification-item-container">
                                            <div className="notification-item-circle">
                                                <img src={Rocket} alt="compelted icon" />
                                            </div>

                                            <div className="notification-item-text">
                                                <p className='inter-regular'>
                                                    Reminder: Don't forget to complete your task, ‘{notification[3]}’, due on {notification[5].slice(0, 16)}. Stay on track with OrganizeMe!
                                                </p>
                                            </div>
                                        </div>
                                    );
                                default:
                                    return null;

                            }
                        })
                    ) : (
                        <p className='inter-regular'>No notifications</p>
                    )}





                    {/* <div className="notification-item-container">
                        <div className="notification-item-circle">
                            <img src={Crisis} alt="compelted icon" />
                        </div>

                        <div className="notification-item-text">
                            <p className='inter-regular'>
                                Reminder: Don't forget to complete your task, ‘[Task Title]’, due on [Due Date]. Stay on track with OrganizeMe!
                            </p>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    )
}

export default Notifications
