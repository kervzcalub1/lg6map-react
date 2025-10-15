import React from 'react';

const MobileHistory = ({ show, onClose, history, onReviewHistory, onResetAll }) => {
  if (!show) return null;

  return (
    <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{ visibility: 'visible' }}>
      <div className="offcanvas-backdrop show" onClick={onClose}></div>
      <div className="offcanvas-content" style={{ transform: 'translateX(0)' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">History</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="history-list-mobile">
            {history.length === 0 ? (
              <div className="muted">No history yet.</div>
            ) : (
              [...history].reverse().map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => {
                    onReviewHistory(item);
                    onClose();
                  }}
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
          <div className="mt-3">
            <button
              id="resetAllMobile"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                onResetAll();
                onClose();
              }}
            >
              Reset All Saved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHistory;
