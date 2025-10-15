import React, { useEffect, useRef, useState } from 'react';
import { builtInMarkers, makePinSVG, KML_RAW_URL, fallbackKmlLoad } from '../utils/mapHelpers';

const MapContainer = ({ 
  markers, 
  onMarkerClick, 
  onMarkerUpdate,
  reviewHistory 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markerObjects, setMarkerObjects] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      const center = { lat: 7.0840, lng: 125.6277 };
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 20,
        mapTypeId: 'hybrid',
        streetViewControl: false,
        gestureHandling: 'greedy',
        rotateControl: true,
        tilt: 25,
      });

      setMap(mapInstance);

      // Create markers
      const newMarkerObjects = builtInMarkers.map((m, i) => {
        const id = i + 1;
        const savedMarker = markers.find(marker => marker.id === id);
        
        const color = savedMarker?.saved ? '#ff0000' : '#007bff';
        const googleMarker = new window.google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: mapInstance,
          title: `Marker ${id}`,
          icon: { url: makePinSVG(color), scaledSize: new window.google.maps.Size(36, 36) },
        });

        const markerObj = {
          id,
          marker: googleMarker,
          note: savedMarker?.note || '',
          date: savedMarker?.date || '',
          saved: savedMarker?.saved || false,
          image: savedMarker?.image || m.image,
          labelWindow: null
        };

        googleMarker.addListener('click', () => {
          onMarkerClick(markerObj);
        });

        return markerObj;
      });

      setMarkerObjects(newMarkerObjects);

      // Load KML
      try {
        const kml = new window.google.maps.KmlLayer({
          url: KML_RAW_URL,
          map: mapInstance,
          preserveViewport: true,
          suppressInfoWindows: true
        });
        kml.addListener('status_changed', () => {
          console.info('KmlLayer status:', kml.getStatus && kml.getStatus());
        });
      } catch (e) {
        console.warn('KmlLayer init failed:', e);
      }

      // Fallback KML load
      fallbackKmlLoad(KML_RAW_URL, mapInstance);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map) return;

    markerObjects.forEach(mObj => {
      const savedMarker = markers.find(m => m.id === mObj.id);
      const color = savedMarker?.saved ? '#ff0000' : '#007bff';
      mObj.marker.setIcon({ 
        url: makePinSVG(color), 
        scaledSize: new window.google.maps.Size(36, 36) 
      });

      // Show/hide label window
      if (savedMarker?.saved && (savedMarker.note || savedMarker.date)) {
        showSavedLabel(mObj, savedMarker);
      } else if (mObj.labelWindow) {
        mObj.labelWindow.close();
        mObj.labelWindow = null;
      }
    });
  }, [markers, map]);

  // Handle history review
  useEffect(() => {
    if (!map || !reviewHistory) return;

    const found = markerObjects.find(m => m.id === reviewHistory.markerId);
    let position;
    
    if (found) {
      position = found.marker.getPosition();
    } else {
      const idx = reviewHistory.markerId - 1;
      if (builtInMarkers[idx]) {
        position = { 
          lat: builtInMarkers[idx].lat, 
          lng: builtInMarkers[idx].lng 
        };
      }
    }

    if (!position) {
      alert('Cannot locate marker for this history entry');
      return;
    }

    const el = document.createElement('div');
    el.className = 'popup-content';
    el.innerHTML = `
      <div style="font-weight:700">History — Marker ${reviewHistory.markerId}</div>
      <div style="margin-top:8px"><b>Note</b>: ${reviewHistory.note || '<i>(none)</i>'}</div>
      <div style="margin-top:6px"><b>Date</b>: ${reviewHistory.date || '<i>(none)</i>'}</div>
      <div class="muted" style="margin-top:8px">${reviewHistory.when}</div>
    `;

    const reviewWindow = new window.google.maps.InfoWindow({
      content: el,
      maxWidth: 320
    });
    
    reviewWindow.setPosition(position);
    reviewWindow.open(map);
    map.panTo(position);
  }, [reviewHistory, map, markerObjects]);

  const showSavedLabel = (mObj, savedMarker) => {
    if (mObj.labelWindow) {
      mObj.labelWindow.close();
      mObj.labelWindow = null;
    }

    const el = document.createElement('div');
    el.style.padding = '8px';
    el.style.background = '#fff';
    el.style.borderRadius = '8px';
    el.style.boxShadow = '0 6px 18px rgba(3, 10, 46, 0.08)';
    el.innerHTML = `
      <strong>${savedMarker.date || ''}</strong>
      <div style="font-size:13px;margin-top:6px">${(savedMarker.note || '').replace(/\n/g, '<br/>')}</div>
    `;

    const iw = new window.google.maps.InfoWindow({
      content: el,
      pixelOffset: new window.google.maps.Size(0, -30)
    });
    
    iw.open(map, mObj.marker);
    mObj.labelWindow = iw;
  };

  return <div ref={mapRef} className="map-container" />;
};

export default MapContainer;
