import React, { useState } from "react";
import './cal.css';

const Calendar1 = ({ onDateClick, userid }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    onDateClick(date);  // Pass the selected date to ParentComponent
  };

  const days = daysInMonth(selectedMonth, selectedYear);
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1;

  const isToday = (day) => {
    return (
      day === now.getDate() &&
      selectedMonth === now.getMonth() &&
      selectedYear === now.getFullYear()
    );
  };

  return (
    <div className="calendar">
      <div className="header">
        <select value={months[selectedMonth]} onChange={(e) => setSelectedMonth(months.indexOf(e.target.value))}>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
          {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="day-names">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
      </div>
      <div className="date-grid">
        {Array.from({ length: emptyDays }, (_, i) => (
          <div key={i} className="empty-slot"></div>
        ))}
        {Array.from({ length: days }, (_, index) => (
          <button
            key={index}
            className={`date-button ${isToday(index + 1) ? "today" : ""}`}  // Highlight today
            onClick={() => handleDateClick(index + 1)}  // Handle date click
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar1;
