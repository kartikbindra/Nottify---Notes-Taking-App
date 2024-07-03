import React, { useState, useEffect } from 'react';
import Note from './Note';

function NoteApp() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    setNotes([...notes, { text: '', html: '' }]);
  };

  const updateNote = (index, newNote) => {
    const newNotes = notes.slice();
    newNotes[index] = newNote;
    setNotes(newNotes);
  };

  const deleteNote = (index) => {
    const newNotes = notes.slice();
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };

  return (
    <div>
      <h2>Nottify-A Note Making App</h2>
      <button className="btn_add" onClick={addNote}>
        <i className="fas fa-pencil"></i> Add Note
      </button>
      <div className="notes-container">
        {notes.map((note, index) => (
          <Note
            key={index}
            note={note}
            onDelete={() => deleteNote(index)}
            onUpdate={(newNote) => updateNote(index, newNote)}
          />
        ))}
      </div>
    </div>
  );
}

export default NoteApp;
