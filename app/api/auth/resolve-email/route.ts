import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

function getAdminDb() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
  return getFirestore(app);
}

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  const p = typeof phone === "string" ? phone.trim() : "";
  if (!p) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const adminDb = getAdminDb();
  if (!adminDb) return NextResponse.json({ error: "admin_not_configured" }, { status: 501 });

  try {
    const snap = await adminDb.collection("users").where("phone", "==", p).limit(1).get();
    const doc0 = snap.docs[0];
    const email = doc0?.data()?.email;
    if (typeof email !== "string" || !email) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ email });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
