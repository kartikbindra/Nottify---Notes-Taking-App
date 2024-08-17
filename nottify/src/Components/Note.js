import React, { useState, useRef, useEffect } from 'react';

function Note({ note, onDelete, onUpdate }) {
  const [html, setHtml] = useState(note.html);
  const [activeButtons, setActiveButtons] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const mainEl = useRef(null);
  const lastHtml = useRef(note.html);

  useEffect(() => {
    if (mainEl.current && html !== mainEl.current.innerHTML) {
      const selection = window.getSelection();
      const range = document.createRange();
      
      
      const startOffset = selection.rangeCount > 0 ? selection.getRangeAt(0).startOffset : 0;
      mainEl.current.innerHTML = html;

      
      range.setStart(mainEl.current.firstChild, Math.min(startOffset, mainEl.current.firstChild.length));
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [html]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    updateActiveButtons(); 
  };

  const handleInput = () => {
    const newHtml = mainEl.current.innerHTML;
    if (newHtml !== lastHtml.current) {
      setHtml(newHtml);
      lastHtml.current = newHtml;
      onUpdate({ text: mainEl.current.innerText, html: newHtml });
    }
    updateActiveButtons();
  };

  const updateActiveButtons = () => {
    setActiveButtons({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  return (
    <div className="note-wrapper">
      <div className="operations">
        <button
          className={`boldBtn formatBtn ${activeButtons.bold ? 'active' : ''}`}
          onClick={() => execCommand('bold')}
        >
          <i className="fa-solid fa-bold"></i>
        </button>
        <button
          className={`italicBtn formatBtn ${activeButtons.italic ? 'active' : ''}`}
          onClick={() => execCommand('italic')}
        >
          <i className="fa-solid fa-italic"></i>
        </button>
        <button
          className={`underlineBtn formatBtn ${activeButtons.underline ? 'active' : ''}`}
          onClick={() => execCommand('underline')}
        >
          <i className="fa-solid fa-underline"></i>
        </button>
        <input
          type="color"
          className="textColorPicker formatBtn"
          onInput={(e) => {
            execCommand('foreColor', e.target.value);
            setActiveButtons({ ...activeButtons, foreColor: true });
          }}
        />
        <button
          className={`edit fas fa-edit`}
          onClick={() => mainEl.current.focus()}
        ></button>
        <button className="delete fas fa-trash-alt" onClick={onDelete}></button>
      </div>
      <div
        className="main"
        contentEditable="true"
        ref={mainEl}
        onInput={handleInput}
        onKeyUp={updateActiveButtons} 
        onMouseUp={updateActiveButtons} 
        dir="ltr"
        style={{ whiteSpace: 'pre-wrap' }}
      ></div>
    </div>
  );
}

export default Note;
