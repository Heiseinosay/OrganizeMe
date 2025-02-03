import React, { useState } from 'react'
import axios from 'axios'

// STYLES
import '../styles/createsubject.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'


function CreateSubject({ onCancel, userdata, reloadSubjects }) {
    const [subjectName, setSubjectName] = useState("")
    const handleSubjectChange = (e) => setSubjectName(e.target.value);

    const saveSubject = () => {
        if (subjectName.length != 0) {
            axios.post('/add_subject', {
                uid: userdata[0],
                subjectName: subjectName
            }) // Send user ID as query param
                .then((response) => {
                    if (response.data.status === false) {
                        alert("Subject name already exist.")
                    } else {
                        reloadSubjects()
                        onCancel()
                        console.log("Status:", response.data);
                    }

                })
                .catch((error) => {
                    console.error("Error fetching subjects:", error);
                });
        }
    }

    return (

        <div className='comp-create-subject'>
            <div className="center-create-subject">
                <h1 className='konkhmer-sleokchher-regular'>Create Subject</h1>
                <input type="text" placeholder='Enter subject name' onChange={handleSubjectChange} />
                <div className="create-subject-buttons">
                    <button className='cb-btn-cancel' onClick={onCancel}>Cancel</button>
                    <button className='cb-btn-create' onClick={saveSubject}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default CreateSubject
