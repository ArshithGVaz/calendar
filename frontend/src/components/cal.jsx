import React, { useState, useEffect } from "react";

const Calendar1 = () => {
  const now = new Date();
  const [today, setToday] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate())); // Removes time part
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const newNow = new Date();
      setToday(new Date(newNow.getFullYear(), newNow.getMonth(), newNow.getDate())); // Update just the date part
    }, 60000);  // Update every minute rather than every second for performance
    return () => clearInterval(timer);
  }, []);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(months.indexOf(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const days = daysInMonth(selectedMonth, selectedYear);
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0">
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

      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        {months[selectedMonth]} {selectedYear}
      </h1>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-grow">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center font-bold col-span-1 text-xs sm:text-sm md:text-base">{day}</div>
        ))}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-gray-100 text-center col-span-1 flex-grow h-full" />
        ))}
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1;
          const isToday = today.getDate() === day && today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;
          return (
            <div
              key={day}
              className={` text-center border rounded-md shadow-sm col-span-1 flex-grow flex items-start justify-end p-2 h-full ${isToday ? 'bg-blue-500 text-white' : ''}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar1;
