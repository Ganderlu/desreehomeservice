"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../../lib/firebase/client";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useUserStore } from "../../../store/store";

type Booking = { id: string; service: string; status: string; price: number };

export default function BookingsPage() {
  const { uid } = useUserStore();
  const [items, setItems] = useState<Booking[]>([]);
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "bookings"),
      where("customerId", "==", uid),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap: any) =>
      setItems(snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }))),
    );
    return () => unsub();
  }, [uid]);
  return (
    <div className="container-padded py-6">
      <h1 className="text-2xl font-bold text-secondary">My Bookings</h1>
      <div className="mt-6 grid gap-3">
        {items.map((b) => (
          <Link
            key={b.id}
            href={`/customer/track/${b.id}`}
            className="rounded-2xl border bg-white p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-secondary">{b.service}</div>
              <div className="text-sm text-gray-500">{b.status}</div>
            </div>
            <div className="font-semibold">
              ₦{(b.price || 0).toLocaleString()}
            </div>
          </Link>
        ))}
        {items.length === 0 && (
          <div className="text-gray-600">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
