import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

// CALENDAR
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid, createViewMonthAgenda, createViewDay } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
// import '@schedule-x/theme-default/dist/calendar.css'
import '@schedule-x/theme-default/dist/index.css'



// COMPONENTS
import Navigation from '../components/Navigation'
import Quotes from '../components/Quotes'
import Summary from '../components/Summary'
import CreateSubject from '../components/CreateSubject'
import CreateTask from '../components/CreateTask';
import CalendarView from '../components/CalendarView';
import Loading from '../components/Loading';

// STYLES
import '../styles/home.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

// IMAGES
import AddFolder from '../images/add-folder.png'
import Notes from '../images/notes.png'
import Check from '../images/checklist.png'


function Home() {
    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);

    //* SUMMARY
    const [summaryOverdue, setSummaryOverdue] = useState(0)
    const [summaryAccomplished, setSummaryAccomplished] = useState(0)
    const [summaryPending, setSummaryPending] = useState(0)


    const eventsService = useState(() => createEventsServicePlugin())[0]
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Zero-pad day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Zero-pad month
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;

    const navigate = useNavigate();
    const [allTask, setAllTask] = useState(null)

    const getAllTask = () => {
        axios.get('get_all_task', {
            params: {
                uid: user[0]
            }
        }).then((resposne) => {
            // console.log(resposne.data)
            setAllTask(resposne.data)
        }).catch((err) => {
            console.log(err)
        })

    }


    useEffect(() => {
        // Retrieve user data from sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            console.log("No user data found in session storage.");
        }

    }, []); // Runs only once when the component mounts

    useEffect(() => {
        if (user) {
            axios
                .get('/get_all_subjects', { params: { uid: user[0] } }) // Send user ID as query param
                .then((response) => {
                    setSubjects(response.data); // Set the fetched subjects
                    console.log("Fetched subjects:", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching subjects:", error);
                });
            getAllTask()

            //* NOTIFICATION
            axios.post('/create_notification', {
                uid: user[0]
            }).then((response) => {
                console.log("Notification: ", response.data);
            }).catch((error) => {
                console.error("Error in notification: ", error);
            });

            //* SUMMARY
            axios.get('/get_summary', { params: { uid: user[0] } }) // Send user ID as query param
                .then((response) => {
                    setSummaryOverdue(response.data.overdue);
                    setSummaryAccomplished(response.data.completed);
                    setSummaryPending(response.data.pending);
                    console.log("Fetched Summary: ", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching summary:", error);
                });
        }
    }, [user]);

    const reload_subjects = () => {
        axios
            .get('/get_all_subjects', { params: { uid: user[0] } })
            .then((response) => {
                setSubjects(response.data)
                console.log("Fetched subjects:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });
    };

    // *FORMAT DATE
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US'); // Formats as mm/dd/yyyy
    }

    // *CREATE SUBJECT
    const [isPopupVisible, setPopupVisible] = useState(false);
    const createSubject = () => {
        document.body.style.overflow = 'hidden'
        setPopupVisible(true);
    }

    const closePopup = () => {
        setPopupVisible(false);
    };

    //* CLICK SUBJECT
    const goToSubject = (subjectName, subjectID) => {
        navigate(`/Subject?SubjectName=${subjectName}&SubjectID=${subjectID}`);
    };

    //* CREATE TASK
    const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);

    const handleCreateTaskToggle = () => {
        // console.log(subjects.length)
        if (subjects.length == 0) {
            createSubject()
        } else {
            setIsCreateTaskVisible((prev) => !prev); // Toggles the popup
        }

    };

    const handleCloseCreateTask = () => {
        setIsCreateTaskVisible(false);
    };



    if (user == null || allTask == null) {
        return (
            <div className='comp-summary'>
                <Loading />
            </div>
        )
    }

    return (
        <div className='page-home'>
            {isPopupVisible && (
                <CreateSubject onCancel={closePopup} userdata={user} reloadSubjects={reload_subjects} />
            )}
            {isCreateTaskVisible && (
                <CreateTask onClose={handleCloseCreateTask} uid={user[0]} openedSubject={null} />
            )}


            <div className="home-container home-section1"><Navigation userdata={user} onCreateTaskClick={handleCreateTaskToggle} /></div>
            <div className="home-container home-section2">
                <div className="home-header-1">
                    <p className='inter-regular'>Ready to start planning?</p>
                    <h1 className='konkhmer-sleokchher-regular'>{user[1]}'s Home</h1>
                </div>
                <div className="home-header-2">
                    <Summary userdata={user} summary1={summaryOverdue} summary2={summaryAccomplished} summary3={summaryPending} subjects={subjects} />
                    <Quotes />
                </div>
                {/* SUBJECTS */}
                <div className="home-body">
                    <div className="home-subjects-container">
                        <h1 className='konkhmer-sleokchher-regular'>Subjects</h1>
                        <div className="create-subject inter-regular" onClick={createSubject}>
                            <img src={AddFolder} alt="add-folder-icon" />
                            <h2>Create Subject</h2>
                        </div>

                        <div className="subjects-container">

                            {/* <div className="subject-box">
                                <div className="subject-upper">
                                    <h1 className='inter-bold'>Personal</h1>
                                    <img src={Notes} alt="notes-icon" />
                                </div>
                                <div className="subject-lower">
                                    <div className="remaining">
                                        <img src={Check} alt="check icon" />
                                        <h6 className='inter-regular'>4</h6>
                                    </div>
                                    <h6 className='inter-regular'>06/17/25</h6>
                                </div>
                            </div> */}
                            {subjects.length > 0 ? (
                                subjects.map((subject, index) => (
                                    <div className="subject-box" key={index} onClick={() => goToSubject(subject[2], subject[0])}>
                                        <div className="subject-upper">
                                            <h1 className='inter-bold'>{subject[2]}</h1>
                                            <img src={Notes} alt="notes-icon" />
                                        </div>
                                        <div className="subject-lower">
                                            <div className="remaining">
                                                <img src={Check} alt="check icon" />
                                                <h6 className='inter-regular'>{subject[4]}</h6>
                                            </div>
                                            <h6 className='inter-regular'>{formatDate(subject[3])}</h6>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>
                    </div>

                    <div className="home-calendar">
                        {/* <ScheduleXCalendar calendarApp={myalendar} /> */}
                        <CalendarView userData={user} calendarTask={allTask} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
