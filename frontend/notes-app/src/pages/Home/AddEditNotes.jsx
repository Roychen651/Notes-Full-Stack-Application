import React from "react";
import TagInput from "../../components/Input/TagInput";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ noteData, type, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async () => {};

  // Edit Note
  const editNote = async () => {};

  const handleAddNote = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }
    if (tags.length === 0) {
      setError("Tags are required");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative ">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          placeholder="Go to GYM at 5 PM"
          className="text-2xl text-slate-950 outline-none"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col mt-4 gap-2">
        <label className="input-label">Content</label>
        <textarea
          placeholder="Content"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded-md"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 py-3"
        onClick={handleAddNote}
      >
        Add
      </button>
    </div>
  );
};

export default AddEditNotes;
