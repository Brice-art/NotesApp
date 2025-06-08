import React, { useEffect, useState } from "react";
import InputSpace from "./InputSpace";
import Note from "./Note";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import Footer from "./Footer";


const UserPage = () => {
  const { userId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = (deletedId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== deletedId));
  };

  const handleAdd = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/notes/${userId}`
        );
        setNotes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setLoading(false);
      }
    };
    fetchNotes();
  }, [userId]); // Dependency array ensures this runs when userId changes
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
