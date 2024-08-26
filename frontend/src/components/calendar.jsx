// src/components/Calendar.jsx

import React, { useState } from "react";
import { events } from "./event";
// List of months for the dropdown
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];




const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(0); // Start with January
  const [selectedYear, setSelectedYear] = useState(2022); // Set default year

  // Helper function to get the number of days in a given month/year
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate weeks and days dynamically for the selected month
  const generateWeeks = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const weeks = [];
    let week = [];
    let day = 1;

    // Fill initial empty cells before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null);
    }

    // Fill the days of the month
    while (day <= daysInMonth) {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      week.push(day);
      day++;
    }

    // Fill remaining cells of the last week
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);

    return weeks;
  };

  const getEventForDate = (date) => {
    const eventDate = `${selectedYear}-${(selectedMonth + 1)
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    return events.filter((event) => event.date === eventDate);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-white border border-gray-300 rounded-md p-2"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-white border border-gray-300 rounded-md p-2"
          >
            {Array.from({ length: 5 }, (_, i) => 2022 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add event
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs md:text-sm lg:text-base">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}

        {generateWeeks().map((week, i) => (
          <React.Fragment key={i}>
            {week.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between p-1 md:p-2 lg:p-3 border rounded-lg h-32 w-full bg-white ${
                  day ? "" : "bg-gray-100"
                }`}
                style={{ minHeight: "5rem" }} // Ensures minimum height
              >
                <div className="font-bold">{day ? day : ""}</div>
                {day &&
                  getEventForDate(day).map((event, eventIdx) => (
                    <div key={eventIdx} className="text-xs md:text-sm mt-1">
                      {event.title}
                      <br />
                      <span className="text-xs text-gray-600">{event.time}</span>
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
