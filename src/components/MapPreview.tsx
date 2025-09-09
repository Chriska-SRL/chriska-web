'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PMTiles, Protocol } from 'pmtiles';

type MapPreviewProps = {
  lat: number;
  lng: number;
  height?: string;
  onClick?: () => void;
};

export default function MapPreview({ lat, lng, height = '150px', onClick }: MapPreviewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
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
          center: [lng, lat],
          zoom: 15,
          interactive: false, // Deshabilitar interacción en el preview
        });

        mapRef.current = map;

        // Manejar errores de carga del mapa
        map.on('error', (e) => {
          setError(`Error al cargar el mapa: ${e.error?.message || 'Error desconocido'}`);
        });

        map.on('load', () => {
          setIsLoading(false);

          // Crear marcador en la ubicación
          new maplibregl.Marker({ color: 'red' }).setLngLat([lng, lat]).addTo(map);
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
  }, [lat, lng]);

  if (error) {
    return (
      <div
        style={{
          width: '100%',
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          cursor: onClick ? 'pointer' : 'default',
          borderRadius: '8px',
        }}
        onClick={onClick}
      >
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>Error al cargar mapa</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
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
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      <div ref={ref} style={{ width: '100%', height: '100%' }} />

      {onClick && !isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#2d3748',
            fontWeight: '500',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          Clic para ver más grande
        </div>
      )}

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
