import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

// STYLES
import '../styles/createtask.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

// IMAGES
import Notes from '../images/notes.png'
import Editing from '../images/editing.png'
import CalendarImg from '../images/calendar.png'
import Bell from '../images/bell.png'
import Danger from '../images/danger.png'
import Status from '../images/status.png'

function CreateTask({ onClose, uid, openedSubject, subjectID, onTaskCreated }) {
    let location = useLocation();

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get('/get_all_subjects', { params: { uid: uid } })
            .then((response) => {
                setSubjects(response.data); // Set the fetched subjects
                console.log("Fetched subjects:", response.data[0][2]);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });

    }, []);

    // SUBJECT
    const [selectedSubject, setSelectedSubject] = useState(subjectID || "");

    // TASK TITLE
    const [taskTitle, setTaskTitle] = useState("")

    // DUE DATE
    const [dateTime, setDateTime] = useState("");

    // DESCRIPTION
    const [descriptionLength, setDescriptionLength] = useState(0)
    const [descriptionValue, setDescriptionVAaue] = useState("")
    const handleInputChange = (e) => {
        setDescriptionLength(e.target.value.length);
        setDescriptionVAaue(e.target.value)
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



    // SAVE TASK
    const validateForm = () => {
        let missingFields = [];

        // Check if any field is missing and add to the missingFields array
        if (!selectedSubject) missingFields.push("Subject");
        if (!taskTitle) missingFields.push("Task Title");
        if (!dateTime || isNaN(Date.parse(dateTime))) missingFields.push("Due Date");
        if (!descriptionValue) missingFields.push("Description");
        if (activeReminder === 0) missingFields.push("Reminder");
        if (activePriority === 0) missingFields.push("Priority Level");
        if (!activeStatus) missingFields.push("Status");

        // If there are any missing fields, show the alert
        if (missingFields.length > 0) {
            alert(`Please fill out the following fields: ${missingFields.join(", ")}`);
            return false;
        }

        // If no fields are missing, return true
        return true;
    };

    const saveTask = () => {
        console.log(subjectID)
        console.log("Subject: ", selectedSubject,
            "\nTask title: ", taskTitle,
            "\nDescrition: ", descriptionValue,
            "\nDue Date: ", dateTime,
            "\nReminder: ", activeReminder,
            "\nPriority: ", activePriority,
            "\nStatus: ", activeStatus,
        )
        if (validateForm()) {
            if (loading) return;
            setLoading(true);
            axios.post('/create_task', {
                userID: uid,
                subjectID: selectedSubject,
                title: taskTitle,
                description: descriptionValue,
                dueDate: dateTime,
                reminder: activeReminder,
                priority: activePriority,
                status: activeStatus
            }).then((response) => {
                console.log(response.data)
                if (response.data.status == true) {
                    if (location.pathname == "/Subject") {
                        // alert(true)
                        onTaskCreated();
                    }

                    onClose()
                }

            }).catch((err) => {
                console.log(err)
            })
                .finally(() => {
                    setLoading(false);
                });
        }

    }

    return (
        <div className='comp-create-task'>
            <div className="center-create-task">
                <div className="cct-header1">
                    <img src={Notes} alt="notes" />
                    <select name="select-subject" id="select-subject" className="inter-regular" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                        {openedSubject ? (
                            // If `openedSubject` is not null, render it as the only option

                            <option value={subjectID} selected>
                                {openedSubject}
                            </option>
                        ) : (
                            // If `openedSubject` is null, render the default option and all subjects
                            <>
                                <option value="">--Select--</option>
                                {subjects.map((subject, i) => (
                                    <option key={i} value={subject[0]}>
                                        {subject[2]}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </div>
                <div className="cct-header2">
                    <div className="cct-header2-circle"></div>
                    <input type="text" name="Task name" autoComplete='off' id="" placeholder='Enter task title' className='inter-regular' onChange={(e) => setTaskTitle(e.target.value)} />
                </div>
                <div className="cct-body">
                    {/* DESCRIPTION */}
                    <div className="cct-body-description">
                        <div className="cct-body-description-col1">
                            <img src={Editing} alt="Editing" />
                            <h4 className='inter-semi-bold'>Description</h4>
                        </div>

                        <div className="cct-body-description-col2">
                            <textarea name="text-area" id="cct-body-description-text-area" maxLength={150} className='inter-regular' placeholder='What is this task about?' onChange={handleInputChange}></textarea>
                            <p className='inter-regular'>{descriptionLength}/150</p>
                        </div>
                    </div>
                    {/* DUE DATE */}
                    <div className="cct-body-duedate">
                        <div className="cct-body-duedate-col1">
                            <img src={CalendarImg} alt="Editing" />
                            <h4 className='inter-semi-bold'>Due date</h4>
                        </div>

                        <div className="cct-body-duedate-col2">
                            {/* <input type="datetime-local" name="date-time" id="date-time" onChange={(e) => setDateTime(e.target.value)} /> */}
                            <input
                                type="datetime-local"
                                name="date-time"
                                id="date-time"
                                min={new Date().toISOString().slice(0, 16)} // Set minimum date and time
                                onChange={(e) => setDateTime(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* REMINDER */}
                    <div className="cct-body-reminder">
                        <div className="cct-body-reminder-col1">
                            <img src={Bell} alt="Reminder" />
                            <h4 className='inter-semi-bold'>Reminder</h4>
                        </div>

                        <div className="cct-body-reminder-col2">
                            <button className={`reminder-btn inter-regular ${activeReminder === 1 ? "btn-set-active" : ""}`} onClick={() => reminderSelection(1)}>1 day</button>
                            <button className={`reminder-btn inter-regular ${activeReminder === 2 ? "btn-set-active" : ""}`} onClick={() => reminderSelection(2)}>2 days</button>
                            <button className={`reminder-btn inter-regular ${activeReminder === 3 ? "btn-set-active" : ""}`} onClick={() => reminderSelection(3)}>3 days</button>
                        </div>
                    </div>
                    {/* PRIORITY */}
                    <div className="cct-body-priority-level">
                        <div className="cct-body-priority-level-col1">
                            <img src={Danger} alt="priority-level" />
                            <h4 className='inter-semi-bold'>Priority</h4>
                        </div>

                        <div className="cct-body-priority-level-col2">
                            <button className={`priority-level-btn inter-regular ${activePriority === 1 ? "btn-active-green" : ""}`} onClick={() => priorityLevelSelection(1)}>Low</button>
                            <button className={`priority-level-btn inter-regular ${activePriority === 2 ? "btn-active-yellow" : ""}`} onClick={() => priorityLevelSelection(2)}>Medium</button>
                            <button className={`priority-level-btn inter-regular ${activePriority === 3 ? "btn-active-red" : ""}`} onClick={() => priorityLevelSelection(3)}>High</button>
                        </div>
                    </div>
                    {/* STATUS */}
                    <div className="cct-body-status">
                        <div className="cct-body-status-col1">
                            <img src={Status} alt="status" />
                            <h4 className='inter-semi-bold'>Status</h4>
                        </div>

                        <div className="cct-body-status-col2">
                            <button className={`status-btn inter-regular ${activeStatus === "Not started" ? "btn-set-active" : ""}`} onClick={() => setActiveStatus("Not started")}>Not Started</button>
                            <button className={`status-btn inter-regular ${activeStatus === "In progress" ? "btn-set-active" : ""}`} onClick={() => setActiveStatus("In progress")}>In Progress</button>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <br /> <br /> <br />
                    <div className="create-subject-buttons">
                        <button className='cb-btn-cancel' onClick={onClose} >Cancel</button>
                        <button className='cb-btn-create' onClick={saveTask}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTask
