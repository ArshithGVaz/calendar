import React, { useState } from "react";
import CalendarEventModal from './CalendarEventModal'; // Ensure this is correctly imported
import './cal.css';

const Calendar1 = ({ onDateClick, isToday }) => {
  const now = new Date();
  const today = new Date(); // Today's date for comparison
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(months.indexOf(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleDateClick = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    setSelectedDate(date);
    setModalVisible(true);
    onDateClick(date);  // Pass date to parent component
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const days = daysInMonth(selectedMonth, selectedYear);
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1;

  // Adjusted for comparing dates using isToday function
  const checkIsToday = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return isToday(date);
  };

  return (
    <div className="calendar">
      <div className="header">
        <select value={months[selectedMonth]} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={handleYearChange}>
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
            className={`date-button ${checkIsToday(index + 1) ? "today" : ""}`}
            onClick={() => handleDateClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {modalVisible && <CalendarEventModal isVisible={modalVisible} onClose={closeModal} selectedDate={selectedDate} />}
    </div>
  );
};

export default Calendar1;
