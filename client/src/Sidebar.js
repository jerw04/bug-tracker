import React from "react";

function Sidebar({ onSelect }) {
  return (
    <nav className="h-full flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Bug Tracker</h2>
      <ul className="space-y-2">
        <li>
          <button 
            onClick={() => onSelect("dashboard")}
            className="w-full text-left p-2 rounded hover:bg-blue-100 flex items-center"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button 
            onClick={() => onSelect("projects")}
            className="w-full text-left p-2 rounded hover:bg-blue-100 flex items-center"
          >
            Projects
          </button>
        </li>
        <li>
          <button 
            onClick={() => onSelect("tickets")}
            className="w-full text-left p-2 rounded hover:bg-blue-100 flex items-center"
          >
            Tickets
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
