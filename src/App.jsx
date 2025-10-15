import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { builtInMarkers } from './utils/mapHelpers';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import HistoryPanel from './components/HistoryPanel';
import MobileHistory from './components/MobileHistory';
import MarkerPopup from './components/MarkerPopup';

const LS_MARKERS = 'lg6map_markers_v1';
const LS_HISTORY = 'lg6map_history_v1';

function App() {
  const [markers, setMarkers] = useLocalStorage(LS_MARKERS, []);
  const [history, setHistory] = useLocalStorage(LS_HISTORY, []);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [reviewHistory, setReviewHistory] = useState(null);

  // Initialize markers if not present
  useEffect(() => {
    if (markers.length === 0) {
      const initialMarkers = builtInMarkers.map((m, i) => ({
        id: i + 1,
        note: '',
        date: '',
        saved: false,
        image: m.image
      }));
      setMarkers(initialMarkers);
    }
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleMarkerSave = (markerId, note, date) => {
    const updatedMarkers = markers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, note, date, saved: true };
      }
      // Clear other markers' data
      return { ...marker, note: '', date: '', saved: false };
    });

    setMarkers(updatedMarkers);

    // Add to history
    const newHistoryItem = {
      type: 'save',
      markerId,
      note,
      date,
      when: new Date().toLocaleString()
    };
    
    setHistory(prev => [...prev, newHistoryItem]);
    setSelectedMarker(null);
  };

  const handleMarkerDelete = (markerId) => {
    const updatedMarkers = markers.map(marker =>
      marker.id === markerId 
        ? { ...marker, note: '', date: '', saved: false }
        : marker
    );

    setMarkers(updatedMarkers);

    // Add to history
    const newHistoryItem = {
      type: 'delete',
      markerId,
      note: '',
      date: '',
      when: new Date().toLocaleString()
    };
    
    setHistory(prev => [...prev, newHistoryItem]);
    setSelectedMarker(null);
  };

  const handleResetAll = () => {
    if (!window.confirm('Reset all saved marker data and history?')) return;
    
    const resetMarkers = markers.map(marker => ({
      ...marker,
      note: '',
      date: '',
      saved: false
    }));
    
    setMarkers(resetMarkers);
    setHistory([]);
  };

  const handleReviewHistory = (historyItem) => {
    setReviewHistory(historyItem);
  };

  return (
    <div className="app-container">
      <Header onMobileHistoryOpen={() => setShowMobileHistory(true)} />
      
      <main className="main-content">
        <div className="map-card" role="region" aria-label="Map container">
          <MapContainer
            markers={markers}
            onMarkerClick={handleMarkerClick}
            onMarkerUpdate={setMarkers}
            reviewHistory={reviewHistory}
          />
        </div>

        <HistoryPanel
          history={history}
          onReviewHistory={handleReviewHistory}
          onResetAll={handleResetAll}
        />
      </main>

      <MobileHistory
        show={showMobileHistory}
        onClose={() => setShowMobileHistory(false)}
        history={history}
        onReviewHistory={handleReviewHistory}
        onResetAll={handleResetAll}
      />

      {selectedMarker && (
        <MarkerPopup
          marker={selectedMarker}
          onSave={handleMarkerSave}
          onDelete={handleMarkerDelete}
          onClose={() => setSelectedMarker(null)}
        />
      )}
    </div>
  );
}

export default App;
