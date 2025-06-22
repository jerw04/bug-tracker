import React, { useState } from "react";
import api from "./api";

function TicketForm({ projectId, onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");
    
    try {
      await api.post("/tickets", { 
        title, 
        description, 
        priority, 
        projectId 
      });
      setMessage("Ticket created successfully!");
      setTitle("");
      setDescription("");
      setPriority("Medium");
      
      // Refresh tickets in parent component
      if (onTicketCreated) onTicketCreated(); 
    } catch (err) {
      setError(err.response?.data?.message || "Error creating ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded max-w-md">
      <h3 className="font-semibold mb-2">Create Ticket</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="block w-full mb-2 p-2 border"
        required
        disabled={isSubmitting}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="block w-full mb-2 p-2 border"
        disabled={isSubmitting}
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="block w-full mb-2 p-2 border"
        disabled={isSubmitting}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>
      <button 
        type="submit" 
        className={`bg-blue-500 text-white py-2 px-4 rounded ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
      </button>
      {message && <div className="mt-2 text-green-600">{message}</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </form>
  );
}

export default TicketForm;
