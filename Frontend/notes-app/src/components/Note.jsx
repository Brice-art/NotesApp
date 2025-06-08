import axios from "axios";
import React, { useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";

const Note = (props) => {
  const { userId } = useParams();
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [loading, setLoading] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef(null);

  const editNote = () => {
    setIsEditing(true);
  };

  const deleteNote = async () => {
    const noteId = props.id;

    try {
      await axios.delete(`http://localhost:3000/notes/${userId}/${noteId}`);
      props.onDelete(noteId); // Inform parent to update UI
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleSave = async () => {
    const noteId = props.id;
    try {
      const response = await axios.put(
        `http://localhost:3000/notes/${userId}/${noteId}`,
        { title, content }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="relative max-w-[100%] masonry-item">
      <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
        {/* card header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <CiTrash
            className="absolute top-2 right-2 text-red-500 hover:text-red-300 w-6 h-6 cursor-pointer"
            onClick={deleteNote}
          />
          <FaRegEdit
            className="absolute top-2 right-10 text-blue-400 hover:text-green-500 w-6 h-6 cursor-pointer"
            onClick={editNote}
          />
          <h2 className="font-semibold text-blue-700">
            {isEditing ? (
              <input
                className="px-4 py-3 bg-gray-50 focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            ) : (
              title
            )}
          </h2>
        </div>

        {/* Card content */}
        <div className="p-4">
          {isEditing ? (
            <>
              <textarea
                ref={textareaRef}
                className="p-4 focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                rows={5}
                value={content}
                type="text"
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
