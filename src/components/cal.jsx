// src/components/Calendar1.jsx

import React, { useState } from "react";

const Calendar1 = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2022);

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

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const currentMonthIndex = months.indexOf(selectedMonth);

  // Calculate the days in the selected month
  const days = daysInMonth(currentMonthIndex, selectedYear);

  // Get the first day of the month (Sunday = 0, Monday = 1, etc.)
  const firstDay = new Date(selectedYear, currentMonthIndex, 1).getDay();

  // Calculate the number of empty days before the first day of the month
  const emptyDays = (firstDay === 0 ? 7 : firstDay) - 1;

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-gray-200 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-gray-200 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            {/* Add more years as needed */}
            {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
          Add Event
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        {selectedMonth} {selectedYear}
      </h1>

      <div className="grid grid-cols-7 gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="text-center font-bold col-span-1 text-xs md:text-sm lg:text-base"
          >
            {day}
          </div>
        ))}

        {/* Display empty days before the first day of the month */}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-100 text-center col-span-1 h-20 md:h-24 lg:h-28"
          />
        ))}

        {/* Display days of the month */}
        {Array.from({ length: days }).map((_, index) => (
          <div
            key={index + 1}
            className="bg-white text-center border rounded-md shadow-sm col-span-1 h-20 md:h-24 lg:h-28 flex items-start justify-end p-2"
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar1;
