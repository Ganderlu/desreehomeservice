'use client';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const containerStyle: React.CSSProperties = { width: '100%', height: '360px', borderRadius: 16 };

export default function Map({ center }: { center: { lat: number; lng: number } }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });
  if (!isLoaded) return <div className="h-[360px] rounded-2xl border bg-white flex items-center justify-center">Loading map…</div>;
  return (
    <div className="rounded-2xl overflow-hidden border">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
}
