import React, { useState, useRef, useEffect } from 'react';

function Note({ note, onDelete, onUpdate }) {
  const [html, setHtml] = useState(note.html);
  const mainEl = useRef(null);
  const lastHtml = useRef(note.html);

  useEffect(() => {
    mainEl.current.innerHTML = html;
  }, [html]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInput = () => {
    const newHtml = mainEl.current.innerHTML;
    if (newHtml !== lastHtml.current) {
      setHtml(newHtml);
      lastHtml.current = newHtml;
      onUpdate({ text: mainEl.current.innerText, html: newHtml });
    }
  };

  return (
    <div className="note-wrapper">
      <div className="operations">
        <button className="boldBtn formatBtn" onClick={() => execCommand('bold')}>
          <i className="fa-solid fa-bold"></i>
        </button>
        <button className="italicBtn formatBtn" onClick={() => execCommand('italic')}>
          <i className="fa-solid fa-italic"></i>
        </button>
        <button className="underlineBtn formatBtn" onClick={() => execCommand('underline')}>
          <i className="fa-solid fa-underline"></i>
        </button>
        <input
          type="color"
          className="textColorPicker formatBtn"
          onInput={(e) => execCommand('foreColor', e.target.value)}
        />
        <button className="edit fas fa-edit" onClick={() => mainEl.current.focus()}></button>
        <button className="delete fas fa-trash-alt" onClick={onDelete}></button>
      </div>
      <div
        className="main"
        contentEditable="true"
        ref={mainEl}
        onInput={handleInput}
      ></div>
    </div>
  );
}

export default Note;
