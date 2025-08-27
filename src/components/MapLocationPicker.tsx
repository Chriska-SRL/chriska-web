'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PMTiles, Protocol } from 'pmtiles';

type MapLocationPickerProps = {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
};

export default function MapLocationPicker({
  onLocationSelect,
  initialLat = -34.9011,
  initialLng = -56.1645,
}: MapLocationPickerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const initializeMap = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // === Registrar protocolo pmtiles:// ===
        const protocol = new Protocol();
        maplibregl.addProtocol('pmtiles', protocol.tile);
        const pmURL = `${window.location.origin}/uruguay.pmtiles`;
        const pm = new PMTiles(pmURL);

        // Verificar que el archivo existe y obtener metadata
        await pm.getHeader();
        const metadata = await pm.getMetadata();

        protocol.add(pm);

        // Detectar las capas disponibles
        let sourceLayer = 'default';
        if (metadata && (metadata as any).vector_layers) {
          let layers;
          const vectorLayers = (metadata as any).vector_layers;

          // Manejar si vector_layers es string o ya es objeto
          if (typeof vectorLayers === 'string') {
            try {
              layers = JSON.parse(vectorLayers);
            } catch {
              layers = null;
            }
          } else if (Array.isArray(vectorLayers)) {
            layers = vectorLayers;
          }

          if (layers && layers.length > 0) {
            sourceLayer = layers[0].id;
          }
        }

        // === Crear mapa ===
        const map = new maplibregl.Map({
          container: ref.current!,
          style: {
            version: 8,
            sources: {
              // Basemap raster OSM
              basemap: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              },
              // Tu PMTiles como vector overlay
              uy: { type: 'vector', url: `pmtiles://${pmURL}` },
            },
            layers: [
              { id: 'bg', type: 'background', paint: { 'background-color': '#f8f9fa' } },
              { id: 'basemap', type: 'raster', source: 'basemap' },
              // Layer de polígonos con source-layer detectado
              {
                id: 'uy-fill',
                type: 'fill',
                source: 'uy',
                'source-layer': sourceLayer,
                paint: { 'fill-color': '#2d7', 'fill-opacity': 0.2 },
              },
              {
                id: 'uy-outline',
                type: 'line',
                source: 'uy',
                'source-layer': sourceLayer,
                paint: { 'line-color': '#1a5', 'line-width': 1 },
              },
            ],
            glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
          },
          center: [initialLng, initialLat],
          zoom: 10,
        });

        mapRef.current = map;

        // Manejar errores de carga del mapa
        map.on('error', (e) => {
          setError(`Error al cargar el mapa: ${e.error?.message || 'Error desconocido'}`);
        });

        map.on('load', () => {
          setIsLoading(false);
        });

        // Crear marcador inicial
        const marker = new maplibregl.Marker({
          color: 'red',
          draggable: true,
        })
          .setLngLat([initialLng, initialLat])
          .addTo(map);

        markerRef.current = marker;

        // Evento cuando se arrastra el marcador
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          onLocationSelect(lngLat.lat, lngLat.lng);
        });

        // Evento de click en el mapa para mover el marcador
        map.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          marker.setLngLat([lng, lat]);
          onLocationSelect(lat, lng);
        });

        // === Cleanup ===
        return () => {
          maplibregl.removeProtocol?.('pmtiles');
          map.remove();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al inicializar el mapa');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [initialLat, initialLng, onLocationSelect]);

  if (error) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Error al cargar el mapa</h3>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>Cargando mapa...</div>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
              }}
            />
          </div>
        </div>
      )}
      <div ref={ref} style={{ width: '100%', height: '100%' }} />

      {/* Instrucciones */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1000,
          color: '#2d3748',
          fontWeight: '500',
        }}
      >
        Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
