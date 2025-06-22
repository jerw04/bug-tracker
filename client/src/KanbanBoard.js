import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "./api";
import { useNavigate } from "react-router-dom";

const columnsFromStatus = ["To Do", "In Progress", "Done"];

function KanbanBoard({ projectId }) {
  const [tickets, setTickets] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const abortControllerRef = useRef(new AbortController());

  const fetchTickets = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();
    
    try {
      const res = await api.get(`/tickets?projectId=${projectId}`, {
        signal: abortControllerRef.current.signal
      });
      setTickets(res.data);
    } catch (err) {
      if (err.isCanceled) {
        console.log('Request was canceled');
        return;
      }
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTickets();
    
    return () => {
      abortControllerRef.current.abort();
    };
  }, [fetchTickets]);

  const columns = columnsFromStatus.reduce((acc, status) => {
    acc[status] = tickets.filter(ticket => ticket.status === status);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const movedTicket = columns[source.droppableId][source.index];
    const originalTickets = [...tickets];
    
    // Optimistic UI update
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket._id === movedTicket._id
          ? { ...ticket, status: destination.droppableId }
          : ticket
      )
    );

    setIsUpdating(true);
    setUpdatingTicketId(movedTicket._id);

    try {
      const res = await api.put(
        `/tickets/${movedTicket._id}`,
        { status: destination.droppableId }
      );

      // Update with server response
      setTickets(prevTickets => 
        prevTickets.map(t => t._id === res.data._id ? res.data : t)
      );
    } catch (err) {
      console.error("Error updating ticket status:", err);
      // Revert optimistic update on error
      setTickets(originalTickets);
      setError("Failed to update ticket status");
    } finally {
      setIsUpdating(false);
      setUpdatingTicketId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          className="mt-2 text-blue-600 hover:underline"
          onClick={fetchTickets}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tickets found for this project</p>
        <button 
          className="mt-4 text-blue-600 hover:underline"
          onClick={fetchTickets}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 mt-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {columnsFromStatus.map(status => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-lg shadow-md p-4 w-80 min-h-[400px] max-h-[80vh] overflow-y-auto ${
                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{status}</h3>
                    <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm">
                      {columns[status].length}
                    </span>
                  </div>
                  
                  {columns[status].map((ticket, idx) => (
                    <Draggable key={ticket._id} draggableId={ticket._id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative mb-4 p-4 rounded shadow transition-all duration-200 bg-gradient-to-r from-purple-50 to-blue-50 ${
                            snapshot.isDragging ? "ring-2 ring-blue-400 shadow-lg transform scale-105" : ""
                          }`}
                        >
                          {isUpdating && updatingTicketId === ticket._id && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded">
                              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                            </div>
                          )}
                          
                          <div className="font-semibold truncate">{ticket.title}</div>
                          <div className="flex items-center mt-2">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              ticket.priority === 'High' || ticket.priority === 'Critical' 
                                ? 'bg-red-500' 
                                : ticket.priority === 'Medium' 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                            }`}></span>
                            <span className="text-xs text-gray-500 capitalize">{ticket.priority}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 line-clamp-2">{ticket.description}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default KanbanBoard;
