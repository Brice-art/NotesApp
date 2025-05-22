import axios from "axios";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";

const InputSpace = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(null);

  const textareaRef = useRef(null);

  const titleChange = (e) => {
    setTitle(e.target.value);
  };
  const contentChange = (e) => {
    setContent(e.target.value);

    // expand the text area when content exceeds its height
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

    if (loading) {
      return <div>Loading...</div>;
    }
  };

  // Add event listener to Add button
  const { userId } = useParams();

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Both title and content are required.");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/notes/${userId}`,
        { title, content }
      );
      props.onAdd(response.data);
      setContent("");
      setTitle("");
      
    } catch (error) {
      console.error("Error creating notes:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative md:w-[50%] sm:w-[70%] bg-white rounded-lg overflow-hidden shadow border border-gray-200 flex flex-col">
      {/* card header */}
      <input
        className="px-4 py-3 bg-gray-50 focus:outline-none focus:ring-0 focus:border-transparent resize-none"
        placeholder="Title"
        value={title}
        type="text"
        onChange={titleChange}
      />

      {/* Card content */}
      <textarea
        ref={textareaRef}
        className="p-4 focus:outline-none focus:ring-0 focus:border-transparent resize-none"
        rows={3}
        placeholder="Write here"
        value={content}
        type="text"
        onChange={contentChange}
      />
      <button
        onClick={createNote}
        className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default InputSpace;
