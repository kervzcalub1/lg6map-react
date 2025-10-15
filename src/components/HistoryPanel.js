import React from 'react';

const HistoryPanel = ({ history, onReviewHistory, onResetAll }) => {
  return (
    <aside className="history-panel d-none d-md-block" aria-label="History Panel">
      <h4 style={{ marginTop: '4px' }}>History & Logs</h4>
      <p className="muted" style={{ marginBottom: '10px' }}>
        Saved marker changes are shown here (click to review).
      </p>
      
      <div className="history-list">
        {history.length === 0 ? (
          <div className="muted">No history yet.</div>
        ) : (
          [...history].reverse().map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => onReviewHistory(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{item.type.toUpperCase()}</strong> — Marker {item.markerId}
                </div>
                <div className="muted">{item.when}</div>
              </div>
              <div style={{ marginTop: '6px' }}>
                <small>{item.note || ''}</small>
                <br />
                <small className="muted">{item.date || ''}</small>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: '12px' }}>
        <button
          id="resetAll"
          className="btn btn-outline-secondary w-100"
          onClick={onResetAll}
        >
          Reset All Saved
        </button>
      </div>
    </aside>
  );
};

export default HistoryPanel;
