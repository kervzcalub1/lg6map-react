import React, { useState, useEffect } from 'react';

const MarkerPopup = ({ marker, onSave, onDelete, onClose }) => {
  const [note, setNote] = useState(marker.note || '');
  const [date, setDate] = useState(marker.date || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasNoteChanged = note !== (marker.note || '');
    const hasDateChanged = date !== (marker.date || '');
    setHasChanges(hasNoteChanged || hasDateChanged);
  }, [note, date, marker.note, marker.date]);

  const handleSave = () => {
    if (!note.trim() || !date) return;
    onSave(marker.id, note.trim(), date);
  };

  const handleDelete = () => {
    if (window.confirm('Clear saved data for this marker?')) {
      onDelete(marker.id);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const wantSave = window.confirm('You have unsaved changes. Press OK to save, Cancel to discard.');
      if (wantSave) {
        handleSave();
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="popup-content">
      <div className="close-x" onClick={handleClose}>×</div>
      
      <img 
        src={marker.image} 
        alt="Marker location" 
        className="popup-img"
        onError={(e) => {
          e.target.src = 'https://picsum.photos/800/560';
        }}
      />
      
      <textarea
        className="popup-note"
        placeholder="Enter note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="4"
      />
      
      <input
        type="date"
        className="form-control"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginTop: '8px' }}
      />
      
      <div className="popup-row">
        <button
          className="popup-btn btn-save"
          onClick={handleSave}
          disabled={!note.trim() || !date}
        >
          Save
        </button>
        
        {(marker.note && marker.date) && (
          <button
            className="popup-btn btn-delete"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkerPopup;
