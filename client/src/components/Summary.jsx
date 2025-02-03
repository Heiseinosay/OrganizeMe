import React, { useEffect, useState } from 'react'

// STYLES
import '../styles/summary.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

import CircularProgress from '@mui/joy/CircularProgress';

function Summary(props) {

    return (
        <div className='comp-summary'>
            <h1 className='inter-bold '>Summary</h1>
            <div className="comp-summary-container ">
                <div className="cs-box cs-box1">
                    <h6 className='inter-regular'>Subjects</h6>
                    <h1 className='konkhmer-sleokchher-regular'>{props.subjects.length}</h1>
                </div>

                <div className="cs-box cs-box2">
                    <h6 className='inter-regular'>Overdue</h6>
                    <h1 className='konkhmer-sleokchher-regular'>{props.summary1}</h1>
                </div>

                <div className="cs-box cs-box3">
                    <h6 className='inter-regular'>Total accomplished</h6>
                    <h1 className='konkhmer-sleokchher-regular'>{props.summary2}</h1>
                </div>

                <div className="cs-box cs-box4 inter-regular" id='scroll-bar-style'>
                    <h6 >Categories</h6>
                    {props.subjects.length > 0 ? (
                        props.subjects.map((subject, index) => (
                            <div className="cs-category">
                                <div className={`cat-circle-${index}`}></div>
                                <p>{subject[2]}</p>
                            </div>
                        ))
                    ) : (<p></p>)}

                </div>

                <div className="cs-box cs-box5">
                    <h3 className='konkhmer-sleokchher-regular'>Pending</h3>
                    <CircularProgress
                        determinate
                        value={70}
                        size={'lg'}
                        variant='soft'
                        sx={{
                            '--CircularProgress-trackColor': '#7A7A7A',
                            '--CircularProgress-progressColor': '#355D2D',
                            'fontSize': '1rem',
                            'color': '#4caf50',
                        }}
                    >
                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{props.summary1}</span>
                    </CircularProgress>

                </div>
            </div>

        </div>
    )
}

export default Summary
