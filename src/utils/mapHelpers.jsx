export const KML_RAW_URL = 'https://raw.githubusercontent.com/kervzcalub1/lg6map/refs/heads/main/kml/Untitled%20project.kml';

export const builtInMarkers = [
  { lat: 7.083483615107523, lng: 125.62724728562387, image: 'https://picsum.photos/id/1015/800/560' },
  { lat: 7.0837635750295025, lng: 125.62749048383216, image: 'https://picsum.photos/id/1016/800/560' },
  { lat: 7.083870160887393, lng: 125.62754624549838, image: 'https://picsum.photos/id/1018/800/560' },
  { lat: 7.08391344844686, lng: 125.62758628119416, image: 'https://picsum.photos/id/1020/800/560' },
  { lat: 7.084145057569356, lng: 125.62779091136315, image: 'https://picsum.photos/id/1024/800/560' },
  { lat: 7.084190664953738, lng: 125.62783308144925, image: 'https://picsum.photos/id/1025/800/560' },
  { lat: 7.084248025387979, lng: 125.62787345516176, image: 'https://picsum.photos/id/1027/800/560' },
  { lat: 7.084330032613001, lng: 125.62795374569423, image: 'https://picsum.photos/id/1031/800/560' },
  { lat: 7.084407392795819, lng: 125.62803000646079, image: 'https://picsum.photos/id/1033/800/560' },
  { lat: 7.084504708741913, lng: 125.62811858329982, image: 'https://picsum.photos/id/1035/800/560' },
  { lat: 7.084611963979416, lng: 125.62825136355237, image: 'https://picsum.photos/id/1036/800/560' },
  { lat: 7.084673774348007, lng: 125.62828946432103, image: 'https://picsum.photos/id/1038/800/560' },
  { lat: 7.084852571172857, lng: 125.62841246788105, image: 'https://picsum.photos/id/1040/800/560' },
];

export const makePinSVG = (color = '#007bff', size = 36) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'><path fill='${color}' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/><circle cx='12' cy='9' r='2.5' fill='#fff'/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

export const fallbackKmlLoad = (url, map) => {
  fetch(url).then(r => {
    if (!r.ok) throw new Error('KML fetch failed: ' + r.status);
    return r.text();
  }).then(kmlText => {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
    
    // Check if toGeoJSON is available
    if (window.toGeoJSON && window.toGeoJSON.kml) {
      const geojson = window.toGeoJSON.kml(kmlDoc);
      map.data.addGeoJson(geojson);
      map.data.setStyle({ strokeColor:'#ff0000', strokeWeight:2, fillOpacity:0.05 });
      console.info('KML fallback rendered via toGeoJSON');
    } else {
      console.warn('toGeoJSON library not available for fallback KML loading');
    }
  }).catch(err => {
    console.warn('KML fallback error:', err.message);
  });
};
