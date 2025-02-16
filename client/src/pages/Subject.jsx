import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import dayjs from 'dayjs'
import { Helmet } from 'react-helmet'

// COMPONENTS
import Navigation from '../components/Navigation'
import CalendarView from '../components/CalendarView'
import List from '../components/List'
import CreateTask from '../components/CreateTask'
import Loading from '../components/Loading'

// STYLES
import '../styles/subject.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

// IMAGES
import Editing from '../images/editing.png'
import Delete from '../images/delete.png'
import Notes from '../images/notes.png'
import CalendarImg from '../images/calendar.png'
import Bell from '../images/bell.png'
import Danger from '../images/danger.png'
import Status from '../images/status.png'


function Subject() {

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSubjectName = queryParams.get('SubjectName');
    const paramsSubjectID = queryParams.get('SubjectID');
    const [loading, setLoading] = useState(false);

    const [paramsSubjectName, setSubjectName] = useState('')
    const [previousSubjectName, setPreviousSubjectName] = useState('');

    //* FETCH TASKS
    const [tasks, setTasks] = useState(null);

    const fetchTasks = () => {

        axios
            .get('/get_subject_task', {
                params: { uid: user[0], sid: paramsSubjectID },
            })
            .then((response) => {
                setTasks(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    };

    useEffect(() => {

        // Retrieve user data from sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            console.log("No user data found in session storage.");
        }

        axios.get('/get_subject_name', {
            params: { sid: paramsSubjectID }
        }).then(response => {
            const status = response.data.data[0];

            if (status !== false) {
                // console.log(status)
                setSubjectName(status)
            }
        }).catch(err => {
            console.log("Name fetch error:", err)
        })

    }, []);

    useEffect(() => {
        if (user) {
            // alert("Fetching")

            fetchTasks();

        }
    }, [user, paramsSubjectID]);

    const saveName = () => {
        console.log(paramsSubjectID)
        axios.post('/update_subject_name', {
            subjectID: paramsSubjectID,
            subjectName: paramsSubjectName
        }).then(response => {
            const status = response.data.status;
            console.log(status)
            if (status === true) {
                console.log("Successfully change!")
            } else {
                // console.log("Cannot change name")
                alert("Name already exist!")
                setSubjectName(previousSubjectName);
            }
        }).catch(err => {
            console.log("Name update error:", err)
        })
    }

    // BODY
    const [activeButton, setActiveButton] = useState("list");

    // DELETE SUBJECT
    const btnDelete = () => {
        let message = "Are you sure you want to delete " + paramsSubjectName + "?"
        console.log("paramsSubjectID: ", paramsSubjectID)
        if (window.confirm(message) == true) {
            axios.delete('/delete_subject', {
                params: { sid: paramsSubjectID }
            }).then(response => {
                const status = response.data.status;
                console.log(status)
                if (status === true) {
                    console.log("Subject successfully deleted!")
                    navigate('/home')
                } else {
                    console.log("Cannot delete subject")
                }
            }).catch(err => {
                console.log("Delete error:", err)
            })
        } else {
            // console.log("cancelled")
        }

    }

    //* OPEN TASK
    // TASK TITLE
    const [taskTitle, setTaskTitle] = useState("")

    // DUE DATE
    const [dateTime, setDateTime] = useState("");

    const convertToDateTimeLocalFormat = (dateString) => {
        const date = new Date(dateString); // Parse the input date string
        return date.toISOString().slice(0, 16); // Extract YYYY-MM-DDTHH:mm
    };


    // DESCRIPTION
    const [descriptionLength, setDescriptionLength] = useState(0)
    const [descriptionValue, setDescriptionValue] = useState("")
    const handleInputChange = (e) => {
        setDescriptionLength(e.target.value.length);
        setDescriptionValue(e.target.value)
    };

    // REMINDER
    const [activeReminder, setActiveReminder] = useState(0)
    const reminderSelection = (active) => {
        setActiveReminder(active)
    }

    // PRIORITY
    const [activePriority, setActivePriority] = useState(0)
    const priorityLevelSelection = (active) => {
        setActivePriority(active)
    }

    // STATUS
    const [activeStatus, setActiveStatus] = useState("")
    const statusSelection = (active) => {
        setActiveStatus(active)
    }


    const [selectedTask, setSelectedTask] = useState(null); // Store the opened task
    const handleTaskSelection = (task) => {
        if (task != null) {
            setSelectedTask(task);
            console.log("Task selected in parent:", task);
            setTaskTitle(task[3])
            setDescriptionValue(task[6])
            const formattedDate = convertToDateTimeLocalFormat(task[5]);
            setDateTime(formattedDate);
            setActiveReminder(task[8])
            setActivePriority(task[7])
            setActiveStatus(task[10])
        } else {
            setSelectedTask(null)
        }

    };

    //* UPDATE TASK
    const clickedUpdateTask = () => {
        if (loading) return;
        setLoading(true);
        axios.post('update_task', {
            taskID: selectedTask[0],
            userID: selectedTask[1],
            subjectID: selectedTask[2],
            title: taskTitle,
            description: descriptionValue,
            due: dateTime,
            reminder: activeReminder,
            priority: activePriority,
            status: activeStatus

        }).then((response) => {
            const status = response.data.status
            if (!status) {
                alert("Something went wrong, try again later!")
            } else {
                console.log("Task updated successfuly.")
                fetchTasks()
            }

        }).catch((err) => {
            console.error("Cannot update: " + err)
        }).finally(() => {
            setLoading(false); // Reset loading state after request completes
        });
    }

    //* DELETE TASK 
    const deleteTask = (taskid, uid, sid) => {
        if (loading) return;
        setLoading(true);
        // alert("Deleting...")
        console.log(taskid, uid, sid)
        axios.delete('/delete_subject_task', {
            params: {
                tid: taskid,
                uid: uid,
                sid: sid
            }
        }).then(response => {
            const status = response.data.status;
            console.log(status)
            if (status === true) {
                console.log("task successfully deleted!")
                window.location.reload();

            } else {
                console.log("Cannot delete task")
            }
        }).catch(err => {
            console.log("Delete error:", err)
        }).finally(() => {
            setLoading(false); // Reset loading state after request completes
        });
    }

    //* CREATE TASK
    const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);

    const handleCreateTaskToggle = () => {
        setIsCreateTaskVisible((prev) => !prev);
        // console.log(paramsSubjectName)
    };

    const handleCloseCreateTask = () => {
        setIsCreateTaskVisible(false);
    };

    //!!! TO CALENDAR


    if (user == null || tasks == null) {
        return (
            <div className='comp-loading'>
                <Loading />
            </div>
        )
    }

    return (
        <div className='page-subject'>
            <Helmet>
                <title>OrganizeMe | {paramsSubjectName} </title>
            </Helmet>
            {isCreateTaskVisible && (
                <CreateTask onClose={handleCloseCreateTask} uid={user[0]} openedSubject={paramsSubjectName} subjectID={paramsSubjectID} onTaskCreated={fetchTasks} />
            )}
            {/* {console.log(tasks)} */}
            <div className="page-subject-container subject-section1"><Navigation userdata={user} onCreateTaskClick={handleCreateTaskToggle} /></div>
            <div className="page-subject-container subject-section2">
                <div className="subject-name-container">
                    <img src={Editing} alt="editing" />
                    <input type="text" value={paramsSubjectName} onFocus={() => setPreviousSubjectName(paramsSubjectName)} className='konkhmer-sleokchher-regular' onChange={(e) => setSubjectName(e.target.value)} onBlur={saveName} maxLength={15} />
                </div>
                <div className="page-subject-wrapper">
                    <div className="page-subject-wrapper-1">
                        <div className="page-subject-wrapper-1-header">
                            <button className={`ps-btn-list inter-regular ${activeButton === "list" ? "ps-btn-active" : ""}`}
                                onClick={() => setActiveButton("list")}>List</button>
                            <button className={`ps-btn-calendar inter-regular ${activeButton === "calendar" ? "ps-btn-active" : ""}`}
                                onClick={() => setActiveButton("calendar")}>Calendar</button>
                        </div>
                        <br />
                        {activeButton === "list" && <List userData={user} sid={paramsSubjectID} onTaskSelect={handleTaskSelection} onAddTaskClick={handleCreateTaskToggle} tasks={tasks} />}
                        {activeButton === "calendar" && <CalendarView userData={user} calendarTask={tasks} />}
                    </div>

                    <div className="page-subject-wrapper-2">
                        <div className="page-subject-wrapper-2-header">
                            <button className='ps-btn-delete inter-regular' onClick={btnDelete}>Delete</button>
                        </div>
                        <div className="ps-task-information">
                            {selectedTask ? (
                                <>

                                    <div className="ps-task-information-header">
                                        <div className="task-information-header-circle"></div>
                                        <input type="text" id="" value={taskTitle} className='inter-regular' onChange={(e) => setTaskTitle(e.target.value)} />
                                        <img src={Delete} alt="delete-icon" onClick={() => deleteTask(selectedTask[0], selectedTask[1], selectedTask[2])} />
                                    </div>
                                    {/* DESCRIPTION */}
                                    <div className="ps-body-description">
                                        <div className="ps-body-description-col1">
                                            <img src={Editing} alt="Editing" />
                                            <h4 className='inter-semi-bold'>Description</h4>
                                        </div>
                                        <div className="ps-body-description-col2">
                                            <textarea name="text-area" id="ps-body-description-text-area" maxLength={150} className='inter-regular' placeholder='What is this task about?' onChange={handleInputChange} value={descriptionValue}></textarea>
                                            <p className='inter-regular'>{descriptionLength}/150</p>
                                        </div>
                                    </div>

                                    {/* DUE DATE */}
                                    <div className="ps-body-duedate">
                                        <div className="ps-body-duedate-col1">
                                            <img src={CalendarImg} alt="Editing" />
                                            <h4 className='inter-semi-bold'>Due date</h4>
                                        </div>

                                        <div className="ps-body-duedate-col2">
                                            <input type="datetime-local" name="date-time" id="date-time" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                                        </div>
                                    </div>

                                    {/* REMINDER */}
                                    <div className="ps-body-reminder">
                                        <div className="ps-body-reminder-col1">
                                            <img src={Bell} alt="Reminder" />
                                            <h4 className='inter-semi-bold'>Reminder</h4>
                                        </div>
                                        {/* <br /> */}
                                        <div className="ps-body-reminder-col2">
                                            <button className={`reminder-btn inter-regular ${activeReminder === 1 ? "btn-set-active" : ""}`} onClick={() => reminderSelection(1)}>1 day</button>
                                            <button className={`reminder-btn inter-regular ${activeReminder === 2 ? "btn-set-active" : ""}`} onClick={() => reminderSelection(2)}>2 days</button>
                                            <button className={`reminder-btn inter-regular ${activeReminder === 3 ? "btn-set-active" : ""}`} onClick={() => reminderSelection(3)}>3 days</button>
                                        </div>
                                    </div>

                                    {/* PRIORITY */}
                                    <div className="ps-body-priority-level">
                                        <div className="ps-body-priority-level-col1">
                                            <img src={Danger} alt="priority-level" />
                                            <h4 className='inter-semi-bold'>Priority</h4>
                                        </div>

                                        <div className="ps-body-priority-level-col2">
                                            <button className={`priority-level-btn inter-regular ${activePriority === 1 ? "btn-active-green" : ""}`} onClick={() => priorityLevelSelection(1)}>Low</button>
                                            <button className={`priority-level-btn inter-regular ${activePriority === 2 ? "btn-active-yellow" : ""}`} onClick={() => priorityLevelSelection(2)}>Medium</button>
                                            <button className={`priority-level-btn inter-regular ${activePriority === 3 ? "btn-active-red" : ""}`} onClick={() => priorityLevelSelection(3)}>High</button>
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div className="ps-body-status">
                                        <div className="ps-body-status-col1">
                                            <img src={Status} alt="status" />
                                            <h4 className='inter-semi-bold'>Status</h4>
                                        </div>

                                        <div className="ps-body-status-col2">
                                            <button className={`status-btn inter-regular ${activeStatus === "Not started" ? "btn-set-active" : ""}`} onClick={() => setActiveStatus("Not started")}>Not Started</button>
                                            <button className={`status-btn inter-regular ${activeStatus === "In progress" ? "btn-set-active" : ""}`} onClick={() => setActiveStatus("In progress")}>In Progress</button>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="ps-body-button">
                                        <button className='ps-btn-save' onClick={clickedUpdateTask}>Save</button>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className='ps-header-empty'>

                                    </div>
                                    <div className='ps-header-body'>
                                        <h5 className='inter-light'>Empty</h5>
                                    </div>
                                </>
                            )}

                        </div>


                    </div>
                </div>

            </div>
        </div>
    )
}

export default Subject
