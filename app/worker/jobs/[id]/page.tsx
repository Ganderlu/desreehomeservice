"use client";
import { useParams } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import { storage, db } from "../../../../lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "../../../../store/store";

export default function JobDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [proof, setProof] = useState<File | null>(null);
  const { uid } = useUserStore();

  async function upload() {
    if (!proof || !uid) return;
    const path = `user-content/${uid}/jobs/${id}/${proof.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, proof);
    const url = await getDownloadURL(r);
    await setDoc(
      doc(db, "jobs", id),
      { proof: url, status: "Completed" },
      { merge: true },
    );
    await fetch("/api/payments/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });
    alert("Proof uploaded. Payment will be released.");
  }

  return (
    <div className="container-padded py-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-secondary">Job {id}</h1>
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <div>Customer: John</div>
        <div>Address: Awka GRA</div>
        <div>Pay: ₦5,000</div>
      </div>
      <div className="mt-6 grid gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setProof(e.target.files?.[0] || null)}
        />
        <Button onClick={upload} disabled={!proof}>
          Upload proof to release payment
        </Button>
      </div>
    </div>
  );
}
