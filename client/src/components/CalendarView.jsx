import React, { useEffect, useState } from 'react'
import axios from 'axios';
import dayjs from 'dayjs';

// CALENDAR
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid, createViewMonthAgenda, createViewDay } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/calendar.css'
// import '@schedule-x/theme-default/dist/index.css'

// STYLE
import '../styles/calendarview.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

function CalendarView({ userData, calendarTask }) {

    const eventsService = useState(() => createEventsServicePlugin())[0]
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Zero-pad day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Zero-pad month
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;

    console.log(calendarTask)

    // Initialize the calendar once
    const sample = calendarTask.map((task, index) => ({
        id: index + 1, // Unique ID for each event
        title: task[3], // Assuming task[3] is the task title
        start: dayjs(task[4]).format('YYYY-MM-DD HH:mm'), // Format 'DateCreated'
        end: dayjs(task[5]).format('YYYY-MM-DD HH:mm'), // Format 'DueDate'
        description: task[6], // Assuming task[6] is the description
    }));

    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events: sample, // Dynamically update events
        selectedDate: currentDate,
        plugins: [eventsService, createEventModalPlugin()],

    });

    // console.log(calendar)

    return (
        <div className="comp-calendar">
            {/* {console.log(sample)} */}
            <ScheduleXCalendar calendarApp={calendar} />

        </div>
    );
}

export default CalendarView;