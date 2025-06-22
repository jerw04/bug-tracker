import React, { useEffect, useState } from "react";
import axios from "axios";

function TicketList({ projectId }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (projectId) {
      axios.get(`http://localhost:5000/api/tickets/project/${projectId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      })
      .then(res => setTickets(res.data))
      .catch(err => console.error(err));
    }
  }, [projectId]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id} className="mb-2 p-2 border rounded">
            <div className="font-semibold">{ticket.title}</div>
            <div className="text-gray-600">{ticket.description}</div>
            <div className="text-xs text-gray-400">
              Priority: {ticket.priority} | Status: {ticket.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
