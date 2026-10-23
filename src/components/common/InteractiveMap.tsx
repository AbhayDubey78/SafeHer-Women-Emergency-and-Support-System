import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink, Radio, Compass } from 'lucide-react';
import { GeofenceZone } from '../../types';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  address?: string;
  accuracyMeters?: number;
  isEmergency?: boolean;
  isSharing?: boolean;
  geofences?: GeofenceZone[];
  height?: string;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lat,
  lng,
  address,
  accuracyMeters = 5,
  isEmergency = false,
  isSharing = false,
  geofences = [],
  height = '340px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L && mapContainerRef.current) {
      const L = (window as any).L;

      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 16,
          zoomControl: false,
        });

        // CartoDB Voyager Tile layer for modern high resolution map view
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap & Google Maps Coordinates',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);
        leafletMapRef.current = map;

        const iconHtml = `
          <div class="relative flex items-center justify-center w-9 h-9">
            <div class="absolute w-9 h-9 rounded-full ${isEmergency ? 'bg-rose-500/40 animate-ping' : 'bg-teal-500/40 animate-ping'}"></div>
            <div class="relative w-6 h-6 rounded-full ${isEmergency ? 'bg-rose-600 border-2 border-white' : 'bg-teal-500 border-2 border-white'} shadow-xl flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-map-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        circleRef.current = L.circle([lat, lng], {
          radius: accuracyMeters,
          color: isEmergency ? '#f43f5e' : '#14b8a6',
          fillColor: isEmergency ? '#f43f5e' : '#14b8a6',
          fillOpacity: 0.18,
          weight: 2,
        }).addTo(map);
      } else {
        leafletMapRef.current.setView([lat, lng], leafletMapRef.current.getZoom());
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        if (circleRef.current) {
          circleRef.current.setLatLng([lat, lng]);
          circleRef.current.setRadius(accuracyMeters);
        }
      }
    }
  }, [lat, lng, accuracyMeters, isEmergency]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`} style={{ height }}>
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-900 z-0" />

      {/* Floating Controls Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3.5">
        
        {/* Top Info Bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-slate-200 shadow">
            <Radio className={`w-3.5 h-3.5 ${isSharing ? 'text-teal-400 animate-pulse' : 'text-slate-400'}`} />
            <span>REAL GPS LOCK</span>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg transition-all transform active:scale-95"
            title="Open in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Address Badge */}
        {address && (
          <div className="pointer-events-auto max-w-md glass-panel p-3 rounded-xl border border-slate-700/70 shadow-2xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`p-2 rounded-lg ${isEmergency ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Device Current GPS Address</p>
                <p className="text-xs font-medium text-slate-100 line-clamp-2">{address}</p>
                <p className="text-[10px] text-teal-400 mt-0.5 font-mono">
                  Coordinates: {lat}° N, {lng}° E (±{accuracyMeters}m)
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
