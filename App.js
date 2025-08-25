import React, { useState, useRef } from "react";

function withLogger(WrappedComponent) {
  return function EnhancedComponent(props) {
    const logAction = (message) => {
      console.log(`[LOG]: ${message}`);
    };
    return <WrappedComponent {...props} logAction={logAction} />;
  };
}

function NotesApp({ logAction }) {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [disabledNotes, setDisabledNotes] = useState([]); 
  const noteInputRef = useRef();

  const handleAddNote = () => {
    const newNote = noteInputRef.current.value.trim();
    if (!newNote) return;

    if (editIndex !== null) {
      const oldNote = notes[editIndex];
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      logAction(`Note Edited: "${oldNote}" -> "${newNote}"`);
      setEditIndex(null);
    } else {
      setNotes([...notes, newNote]);
      logAction(`Note Added: "${newNote}"`);
    }

    noteInputRef.current.value = "";
    noteInputRef.current.focus();
  };

  const handleEditNote = (index) => {
    if (disabledNotes.includes(index)) return;
    noteInputRef.current.value = notes[index];
    noteInputRef.current.focus();
    setEditIndex(index);
  };

  const handleDisableNote = (index) => {
    setDisabledNotes([...disabledNotes, index]);
    logAction(`Note Disabled: "${notes[index]}"`);
    if (editIndex === index) {
      setEditIndex(null);
      noteInputRef.current.value = "";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Note Taking App</h2>

      <input
        type="text"
        ref={noteInputRef}
        placeholder="Enter note..."
        style={{ padding: "8px", width: "70%" }}
      />
      <button onClick={handleAddNote} style={{ marginLeft: "10px", padding: "8px" }}>
        {editIndex !== null ? "Update Note" : "Add Note"}
      </button>

      <ul style={{ marginTop: "20px" }}>
        {notes.map((note, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            {note}{" "}
            <button
              onClick={() => handleEditNote(idx)}
              style={{ marginLeft: "10px" }}
              disabled={disabledNotes.includes(idx)}
            >
              Edit
            </button>
            <button
              onClick={() => handleDisableNote(idx)}
              disabled={disabledNotes.includes(idx)}
            >
              Disable
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withLogger(NotesApp);