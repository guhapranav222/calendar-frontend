import React from "react";
import Calendar from "./Calendar"; // Adjust the path if needed
import "./App.css"; // Optional, if you have extra styles

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-4">Calendar App</h1>
      <div className="calendar-container">
        <Calendar />
      </div>
    </div>
  );
}

export default App;
