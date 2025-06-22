import React from "react";

function ProjectList({ projects }) {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <ul>
        {projects.map(proj => (
          <li key={proj._id} className="mb-2 p-2 border rounded">
            <div className="font-semibold">{proj.title}</div>
            <div className="text-gray-600">{proj.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
