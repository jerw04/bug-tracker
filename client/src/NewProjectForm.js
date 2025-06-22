import React, { useState } from "react";
import axios from "axios";

function NewProjectForm({ onProjectCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/projects", { title, description });
      onProjectCreated(res.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full mb-2 p-2 border"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full mb-2 p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Create Project
      </button>
    </form>
  );
}

export default NewProjectForm;
