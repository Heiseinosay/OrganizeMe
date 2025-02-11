import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Helmet } from 'react-helmet'

// COMPONENTS
import Navigation from '../components/Navigation'
import CreateTask from '../components/CreateTask';
import Loading from '../components/Loading';

// STYLES
import '../styles/fonts.css'
import '../styles/root_variables.css'
import '../styles/completed.css'

// IMAGES
import ImgCompleted from '../images/completed.png'


function Completed() {
    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [completedTask, setCompletedTask] = useState(null)

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
                .get('/get_all_accomplished', { params: { uid: user[0] } }) // Send user ID as query param
                .then((response) => {
                    setCompletedTask(response.data);
                    console.log("Fetched subjects:", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching accomplishments:", error);
                });
        }
    }, [user]);

    useEffect(() => {
        console.log(completedTask)
    }, [completedTask])

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


    if (user == null || completedTask == null) {
        return (
            <div className='comp-loading'>
                <Loading />
            </div>
        )
    }
    return (
        <div className='page-completed'>
            <Helmet>
                <title>OrganizeMe | Completed</title>
            </Helmet>
            {isCreateTaskVisible && (
                <CreateTask onClose={handleCloseCreateTask} uid={user[0]} openedSubject={null} />
            )}
            <div className="completed-container completed-section1"><Navigation userdata={user} onCreateTaskClick={handleCreateTaskToggle} /></div>
            <div className="completed-section2">
                <div className="completed-section2-header">
                    <img src={ImgCompleted} alt="compelted icon" />
                    <h1 className='konkhmer-sleokchher-regular'>Completed</h1>
                </div>

                <div className="completed-section2-body" id='scroll-bar-style'>
                    {completedTask != null ? (
                        completedTask.map((completed, i) => (
                            <div className="completed-item-container" key={i} >
                                <div className="completed-item-circle">
                                    <img src={ImgCompleted} alt="compelted icon" />
                                </div>

                                <div className="completed-item-text">
                                    <h3 className='inter-semi-bold'>{completed[4]}</h3>
                                    <h1 className='inter-bold'>{completed[5]}</h1>
                                    <p className='inter-regular'>{completed[6]}</p>
                                </div>

                                <div className="completed-item-dates inter-regular">
                                    <div className="item-date-box item-date-1">
                                        <h6>Created: {completed[7]}</h6>
                                    </div>
                                    <div className="item-date-box item-date-2">
                                        <h6>Due: {completed[8].slice(0, 16)}</h6>
                                    </div>
                                    <div className="item-date-box item-date-3">
                                        <h6>Completed: {completed[9].slice(0, 16)}</h6>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='inter-regular'>Accomplished Something</p>
                    )}


                </div>
            </div>
        </div>
    )
}

export default Completed
