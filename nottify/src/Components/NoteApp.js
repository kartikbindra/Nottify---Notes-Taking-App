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
    setNotes([...notes, { id: Date.now(), text: '', html: '' }]);
  };

  const updateNote = (id, newNote) => {
    const newNotes = notes.map(note => 
      note.id === id ? { ...note, ...newNote } : note
    );
    setNotes(newNotes);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
  };

  return (
    <div>
      <h2>Nottify - A Note Making App</h2>
      <button className="btn_add" onClick={addNote}>
        <i className="fas fa-pencil"></i> Add Note
      </button>
      <div className="notes-container">
        {notes.map(note => (
          <Note
            key={note.id} 
            note={note}
            onDelete={() => deleteNote(note.id)} 
            onUpdate={(newNote) => updateNote(note.id, newNote)} 
          />
        ))}
      </div>
    </div>
  );
}

export default NoteApp;
