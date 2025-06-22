import KanbanBoard from "./KanbanBoard";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import Sidebar from "./Sidebar";
import Register from "./Register";
import Login from "./Login";
import NewProjectForm from "./NewProjectForm";
import ProjectList from "./ProjectList";
import TicketList from "./TicketList";
import TicketForm from "./TicketForm";
import axios from "axios";

// ProtectedRoute component to guard private routes
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Dashboard component (moved from App)
function Dashboard() {
  const [page, setPage] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: { 
            "Authorization": `Bearer ${token}`  // Updated header
          }
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
  };

  return (
    <DashboardLayout sidebar={<Sidebar onSelect={setPage} />}>
      {/* Dashboard Page */}
      {page === "dashboard" && (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-lg mb-4">Welcome to your bug tracking dashboard!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-lg">Projects</h3>
                <p className="text-3xl mt-2">{projects.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold text-lg">Active Tickets</h3>
                <p className="text-3xl mt-2">0</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold text-lg">Team Members</h3>
                <p className="text-3xl mt-2">0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Page */}
      {page === "projects" && (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Project Management</h1>
          <div className="bg-white p-6 rounded shadow mb-6">
            <NewProjectForm onProjectCreated={handleProjectCreated} />
          </div>
          <div className="bg-white p-6 rounded shadow">
            <ProjectList projects={projects} />
          </div>
        </div>
      )}

      {/* Tickets Page */}
      {page === "tickets" && (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Ticket Management</h1>
          <div className="bg-white p-6 rounded shadow mb-6">
            <div className="mb-6">
              <label className="block font-semibold mb-2">Select Project:</label>
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="border p-2 rounded w-full md:w-1/2"
              >
                <option value="">-- Select a Project --</option>
                {projects.map(proj => (
                  <option key={proj._id} value={proj._id}>{proj.title}</option>
                ))}
              </select>
            </div>

            {selectedProject && (
              <div className="space-y-6">
                <TicketForm projectId={selectedProject} />
                <div className="mt-6">
                  <KanbanBoard projectId={selectedProject} />
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={
          <Navigate to={
            localStorage.getItem("token") 
              ? "/dashboard" 
              : "/login"
          } replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
