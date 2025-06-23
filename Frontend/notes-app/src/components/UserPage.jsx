import React, { useEffect, useState } from "react";
import InputSpace from "./InputSpace";
import Note from "./Note";
import axios from "axios";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const UserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (deletedId) => {
    const API_URL = import.meta.env.VITE_API_URL;
    await axios
      .delete(`${API_URL}/notes/${userId}/${deletedId}`, {
        withCredentials: true,
      })
      .then(() => {
        console.log("Note deleted successfully");
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== deletedId));
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  const handleAdd = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        // Always send credentials for session-based auth!
        const response = await axios.get(`${API_URL}/notes/${userId}`, {
          withCredentials: true,
        });
        setNotes(response.data);
        setLoading(false);
        console.log("Fetched notes:", response.data); // Debug: See what you get
      } catch (error) {
        setLoading(false);
        // Helpful error logging
        if (error.response) {
          console.error("Error fetching notes:", error.response.status, error.response.data);
        } else {
          console.error("Error fetching notes:", error.message);
        }
      }
    };
    fetchNotes();
  }, []); // Dependency array ensures this runs when userId changes

  useEffect(() => {
    const checkSession = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.get(`${API_URL}/auth/session`, { withCredentials: true });
        // If successful, do nothing (user is authenticated)
      } catch (error) {
        // If not authenticated, redirect to login
        navigate("/login");
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return <Outlet />;
  }
  return (
    <div>
      <h1 className="flex justify-center text-center text-4xl bg-gray-800 text-white py-4">
        Notes App
      </h1>
      <div className="flex justify-center mt-4 p-4">
        <InputSpace onAdd={handleAdd} />
      </div>
      <div className="masonry">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              key={note._id}
              id={note._id}
              title={note.title}
              content={note.content}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-gray-500">User ID: {userId}</p>
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-gray-500">Total Notes: {notes.length}</p>
      </div>

      <Footer />
      <Outlet />
    </div>
  );
};

export default UserPage;
