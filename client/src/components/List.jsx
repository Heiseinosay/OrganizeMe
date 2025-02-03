import React, { useEffect, useState } from 'react'
import axios from 'axios'

// STYLES
import '../styles/list.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

// IMAGES
import Check from '../images/checklist.png'
import AddTask from '../images/image-gallery.png'
import PopSound from '../audio/Popsoundeffect.mp3'

// LOADING
import Loading from './Loading'

function List({ userData, sid, onTaskSelect, onAddTaskClick, tasks }) {

    const [listTask, setListTask] = useState([])

    useEffect(() => {
        setListTask(tasks); // Initialize `listTask` with `tasks` when component mounts or `tasks` updates
    }, [tasks]);
    console.log(tasks)


    const addTask = () => {
        // alert(true)
        onAddTaskClick()
        // console.log(tasks)
    }

    // OPEN TASK INFORMATION
    const [openedTask, setOpenedTask] = useState(null)
    const openTaskInformation = (find) => {
        for (let i = 0; i < listTask.length; i++) {
            if (listTask[i][3] == find) {
                setOpenedTask(listTask[i])
                break;
            }
        }
    }

    useEffect(() => {
        if (openedTask) {
            console.log('Opened Task:', openedTask);
            onTaskSelect(openedTask);
        }
    }, [openedTask]);


    // TASK COMPLETION
    const [holdTimeout, setHoldTimeout] = useState(null);

    const handleMouseDown = (tid, uid, sid) => {
        // Start a timer when the mouse button is pressed down
        const timeout = setTimeout(() => {
            // alert("You held the click for 2 seconds!");


            // MOVE TO NEW COMPLETE TABLE  
            axios.post('/moveToAccomplish', {
                TaskID: tid,
                UserID: uid,
                SubjectID: sid
            }).then((response) => {
                let status = response.data.status
                console.log(status)

                if (status === true) {
                    console.log("Successfully moved to accomplish")
                    const audio = new Audio(PopSound)
                    audio.play();

                    setListTask((prevList) => prevList.filter((item) => item[0] !== tid));
                    if (openedTask != null) {
                        if (tid == openedTask[0]) {
                            onTaskSelect(null);
                        }
                    }
                }

            }).catch((err) => {
                console.error("Error accomplishing.")
            })


        }, 1000);
        setHoldTimeout(timeout);
    };

    const handleMouseUp = () => {

        // Clear the timer if the user releases the mouse before 2 seconds
        if (holdTimeout) {
            clearTimeout(holdTimeout);
            setHoldTimeout(null);
        }
    };

    return (
        <div className='comp-list'>
            <h1 className='konkhmer-sleokchher-regular'>Action Plan</h1>
            <div className="list-header-container">
                <div className="remaining">
                    <img src={Check} alt="check icon" />
                    <h6 className='inter-regular'>{tasks.length}</h6>
                </div>
                <img src={AddTask} alt="image" onClick={addTask} />
            </div>
            <div className="list-task-container" id='scroll-bar-style'>
                {listTask.length > 0 ? (
                    listTask.map((task, i) => {
                        // Parse the date string
                        const dueDate = new Date(task[5]);

                        // Check if the date is valid before formatting
                        const formattedDate = !isNaN(dueDate)
                            ? `${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(
                                dueDate.getDate()
                            ).padStart(2, '0')}-${dueDate.getFullYear()}`
                            : "Invalid Date";

                        // Determine the priority class based on task[7]
                        let priorityClass = "";
                        switch (task[7]) {
                            case 1:
                                priorityClass = "user-task-priority-low";
                                break;
                            case 2:
                                priorityClass = "user-task-priority-medium";
                                break;
                            case 3:
                                priorityClass = "user-task-priority-high";
                                break;
                            default:
                                priorityClass = "";
                        }

                        return (
                            <div className={`user-task-value ${priorityClass}`} key={i} >
                                <div className="user-task-value-sec1">
                                    <div className="completion-circle"
                                        onMouseDown={() => handleMouseDown(task[0], task[1], task[2])}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}></div>
                                    <h1
                                        className="inter-regular"
                                        onClick={() => openTaskInformation(task[3])}
                                    >
                                        {task[3]}
                                    </h1>
                                </div>

                                <div className="user-task-value-sec2">
                                    <p className="inter-regular">{task[9]}</p>
                                    <p className="inter-regular">Due on {formattedDate}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className='nothing-display inter-regular'>No tasks available.</p>
                )}



            </div>
        </div>
    )
}

export default List
