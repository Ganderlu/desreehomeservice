"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Map from "../../../../components/map";
import { db } from "../../../../lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

type Track = { lat: number; lng: number; status: string };

export default function TrackPage() {
  const params = useParams();
  const id = params?.id as string;
  const [track, setTrack] = useState<Track | null>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "jobs", id), (snap: any) =>
      setTrack((snap.data() as any) || null),
    );
    return () => unsub();
  }, [id]);
  const center = track
    ? { lat: track.lat, lng: track.lng }
    : { lat: 6.21, lng: 7.073 }; // Awka center fallback
  return (
    <div className="container-padded py-6">
      <h1 className="text-2xl font-bold text-secondary">Live Tracking</h1>
      <div className="mt-4">
        <Map center={center} />
      </div>
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <div className="font-semibold text-secondary">Status</div>
        <div className="text-gray-700">{track?.status || "On the way"}</div>
      </div>
    </div>
  );
}
