import React, { useState } from "react";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isToday(date, month, year) {
  const today = new Date();
  return (
    date === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

function getDateKey(year, month, date) {
  return `${year}-${month + 1}-${date}`;
}

function MonthCalendar({ year, month, events, onAddEvent }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate calendar grid with only current month dates
  const dates = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }

  // Current month dates only
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push({
      date: d,
      isCurrentMonth: true,
      month: month,
      year: year,
    });
  }

  return (
    <div className="month-container">
      <div className="month-header">
        {MONTH_NAMES[month]} {year}
      </div>
      <div className="calendar-grid">
        {WEEK_DAYS.map((day) => (
          <div className="calendar-day" key={day}>
            {day}
          </div>
        ))}
        {dates.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={idx} className="calendar-date empty-cell" />;
          }

          const key = getDateKey(dateObj.year, dateObj.month, dateObj.date);
          const hasEvent = events[key] && events[key].length > 0;
          const isSunday = idx % 7 === 0;

          return (
            <div
              key={idx}
              className={
                "calendar-date" +
                (isToday(dateObj.date, dateObj.month, dateObj.year) ? " today" : "") +
                (hasEvent ? " has-event" : "") +
                (isSunday ? " sunday" : "")
              }
              onClick={() => onAddEvent(dateObj.date, month)}
            >
              <span className="date-number">{dateObj.date}</span>
              {hasEvent && <div className="event-indicator" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({});

  const prevYear = () => {
    setCurrentYear((year) => year - 1);
  };

  const nextYear = () => {
    setCurrentYear((year) => year + 1);
  };

  const handleAddEvent = (date, month) => {
    const eventText = window.prompt(
      `🎉 Add event for ${MONTH_NAMES[month]} ${date}, ${currentYear}:`
    );
    if (eventText && eventText.trim()) {
      const key = getDateKey(currentYear, month, date);
      setEvents((prev) => ({
        ...prev,
        [key]: prev[key] ? [...prev[key], eventText.trim()] : [eventText.trim()],
      }));
    }
  };

  return (
    <>
      <div className="calendar-header">
        <button
          className="calendar-nav"
          onClick={prevYear}
          aria-label="Previous Year"
          title="Previous Year"
        >
          ←
        </button>
        <span className="calendar-title">✨ {currentYear} ✨</span>
        <button
          className="calendar-nav"
          onClick={nextYear}
          aria-label="Next Year"
          title="Next Year"
        >
          →
        </button>
      </div>
      <div className="year-grid">
        {Array.from({ length: 12 }, (_, month) => (
          <MonthCalendar
            key={month}
            year={currentYear}
            month={month}
            events={events}
            onAddEvent={handleAddEvent}
          />
        ))}
      </div>
    </>
  );
}
