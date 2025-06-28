import React, { useState, useEffect } from "react";

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

function EventModal({ isOpen, onClose, onSave, event, date, month, year }) {
  const [eventData, setEventData] = useState({
    title: "",
    time: "",
    description: "",
    location: "",
    tags: "",
    type: "event",
  });

  useEffect(() => {
    if (event) {
      setEventData(event);
    } else {
      setEventData({
        title: "",
        time: "",
        description: "",
        location: "",
        tags: "",
        type: "event",
      });
    }
  }, [event, isOpen]);

  const handleSave = () => {
    if (eventData.title.trim()) {
      onSave(eventData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{event ? "Edit Event" : "Create Event"}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) =>
                setEventData({ ...eventData, title: e.target.value })
              }
              placeholder="Enter event title"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={`${MONTH_NAMES[month]} ${date}, ${year}`}
                readOnly
                className="form-input readonly"
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={eventData.time}
                onChange={(e) =>
                  setEventData({ ...eventData, time: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={eventData.type}
              onChange={(e) =>
                setEventData({ ...eventData, type: e.target.value })
              }
              className="form-select"
            >
              <option value="event">Event</option>
              <option value="reminder">Reminder</option>
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              placeholder="Event description (optional)"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              placeholder="Event location (optional)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              value={eventData.tags}
              onChange={(e) =>
                setEventData({ ...eventData, tags: e.target.value })
              }
              placeholder="Tags separated by commas (optional)"
              className="form-input"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {event ? "Update" : "Create"} Event
          </button>
        </div>
      </div>
    </div>
  );
}

function EventDetailsSidebar({
  isOpen,
  onClose,
  selectedDate,
  selectedMonth,
  events,
  currentYear,
  onEditEvent,
  onDeleteEvent,
}) {
  if (!isOpen || !selectedDate || selectedMonth === null) return null;

  const key = getDateKey(currentYear, selectedMonth, selectedDate);
  const dayEvents = events[key] || [];
  const dateString = `${MONTH_NAMES[selectedMonth]} ${selectedDate}, ${currentYear}`;

  return (
    <div className="event-sidebar-overlay" onClick={onClose}>
      <div className="event-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h3>Events for {dateString}</h3>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar-content">
          {dayEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <p>No events scheduled for this date</p>
            </div>
          ) : (
            <div className="events-list">
              {dayEvents.map((event, index) => (
                <div key={index} className={`event-card event-${event.type}`}>
                  <div className="event-card-header">
                    <div className="event-type-badge">{event.type}</div>
                    <div className="event-card-actions">
                      <button
                        className="btn-icon"
                        onClick={() => onEditEvent(selectedDate, selectedMonth, index)}
                        title="Edit Event"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => onDeleteEvent(selectedDate, selectedMonth, index)}
                        title="Delete Event"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="event-card-content">
                    <h4 className="event-card-title">{event.title}</h4>

                    {event.time && (
                      <div className="event-detail">
                        <span className="event-icon">🕒</span>
                        <span>{event.time}</span>
                      </div>
                    )}

                    {event.location && (
                      <div className="event-detail">
                        <span className="event-icon">📍</span>
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.description && (
                      <div className="event-detail">
                        <span className="event-icon">📝</span>
                        <span>{event.description}</span>
                      </div>
                    )}

                    {event.tags && (
                      <div className="event-detail">
                        <span className="event-icon">🏷️</span>
                        <div className="event-tags-list">
                          {event.tags.split(",").map((tag, i) => (
                            <span key={i} className="event-tag-pill">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthCalendar({
  year,
  month,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
  highlightedDates,
}) {
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
          const dayEvents = events[key] || [];
          const hasEvent = dayEvents.length > 0;
          const isSunday = idx % 7 === 0;
          const isHighlighted =
            highlightedDates &&
            highlightedDates.some(
              (h) =>
                h.year === dateObj.year &&
                h.month === dateObj.month &&
                h.date === dateObj.date
            );

          return (
            <div
              key={idx}
              className={
                "calendar-date" +
                (isToday(dateObj.date, dateObj.month, dateObj.year)
                  ? " today"
                  : "") +
                (hasEvent ? " has-event" : "") +
                (isSunday ? " sunday" : "") +
                (isHighlighted ? " highlighted" : "")
              }
              onClick={(e) => {
                if (e.shiftKey && hasEvent) {
                  onDateClick(dateObj.date, month);
                } else {
                  onAddEvent(dateObj.date, month);
                }
              }}
              title={
                hasEvent
                  ? `${dayEvents.length} event(s) - Shift+click to view details`
                  : "Click to add event"
              }
            >
              <span className="date-number">{dateObj.date}</span>
              {hasEvent && (
                <div className="event-indicators">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      className={`event-dot event-${event.type}`}
                      title={event.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="event-more">+{dayEvents.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar({ searchQuery }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({});
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarDate, setSidebarDate] = useState(null);
  const [sidebarMonth, setSidebarMonth] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery) {
      const results = handleSearch(searchQuery);
      setHighlightedDates(results);
    } else {
      setHighlightedDates([]);
    }
  }, [searchQuery, currentYear]);

  const handleSearch = (query) => {
    const results = [];

    if (!query) return results;

    const [searchType, searchValue] = query.split(":");

    switch (searchType) {
      case "year":
        const year = parseInt(searchValue);
        setCurrentYear(year);
        break;

      case "month":
        const monthIndex = MONTH_NAMES.findIndex(
          (m) => m === searchValue
        );
        if (monthIndex !== -1) {
          const daysInMonth = getDaysInMonth(currentYear, monthIndex);
          for (let date = 1; date <= daysInMonth; date++) {
            results.push({ year: currentYear, month: monthIndex, date });
          }
        }
        break;

      case "day":
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = dayNames.findIndex((day) => day === searchValue);

        if (dayIndex !== -1) {
          for (let month = 0; month < 12; month++) {
            const daysInMonth = getDaysInMonth(currentYear, month);
            for (let date = 1; date <= daysInMonth; date++) {
              const dayOfWeek = new Date(currentYear, month, date).getDay();
              if (dayOfWeek === dayIndex) {
                results.push({ year: currentYear, month, date });
              }
            }
          }
        }
        break;

      case "date":
        const targetDate = parseInt(searchValue);
        for (let month = 0; month < 12; month++) {
          const daysInMonth = getDaysInMonth(currentYear, month);
          if (targetDate <= daysInMonth) {
            results.push({ year: currentYear, month, date: targetDate });
          }
        }
        break;
    }

    return results;
  };

  const prevYear = () => {
    setCurrentYear((year) => year - 1);
  };

  const nextYear = () => {
    setCurrentYear((year) => year + 1);
  };

  const handleAddEvent = (date, month) => {
    setSelectedDate(date);
    setSelectedMonth(month);
    setEditingEvent(null);
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEditEvent = (date, month, index) => {
    const key = getDateKey(currentYear, month, date);
    setSelectedDate(date);
    setSelectedMonth(month);
    setEditingEvent(events[key][index]);
    setEditingIndex(index);
    setModalOpen(true);
    setSidebarOpen(false);
  };

  const handleDeleteEvent = (date, month, index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const key = getDateKey(currentYear, month, date);
      setEvents((prev) => {
        const newEvents = { ...prev };
        newEvents[key] = newEvents[key].filter((_, i) => i !== index);
        if (newEvents[key].length === 0) {
          delete newEvents[key];
        }
        return newEvents;
      });
    }
  };

  const handleSaveEvent = (eventData) => {
    const key = getDateKey(currentYear, selectedMonth, selectedDate);

    setEvents((prev) => {
      const newEvents = { ...prev };

      if (editingIndex !== null) {
        if (!newEvents[key]) newEvents[key] = [];
        newEvents[key][editingIndex] = eventData;
      } else {
        if (!newEvents[key]) newEvents[key] = [];
        newEvents[key].push(eventData);
      }

      return newEvents;
    });
  };

  const handleDateClick = (date, month) => {
    setSidebarDate(date);
    setSidebarMonth(month);
    setSidebarOpen(true);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="calendar-title-container">
          <span className="calendar-title">✨ {currentYear} ✨</span>
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
        <button
          className="calendar-nav"
          onClick={nextYear}
          aria-label="Next Year"
          title="Next Year"
        >
          →
        </button>
      </div>

      <div className="calendar-help">
        <p>
          💡{" "}
          <strong>Tip:</strong> Click to add events • Shift+click to view event
          details
        </p>
      </div>

      <div className="year-grid">
        {Array.from({ length: 12 }, (_, month) => (
          <MonthCalendar
            key={month}
            year={currentYear}
            month={month}
            events={events}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onDateClick={handleDateClick}
            highlightedDates={highlightedDates}
          />
        ))}
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        date={selectedDate}
        month={selectedMonth}
        year={currentYear}
      />

      <EventDetailsSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedDate={sidebarDate}
        selectedMonth={sidebarMonth}
        events={events}
        currentYear={currentYear}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </>
  );
}
