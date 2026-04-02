import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

function getAdmin() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  if (!projectId || !clientEmail || !privateKey) return null;

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
  return { adminAuth: getAuth(app), adminDb: getFirestore(app) };
}

export async function POST(req: NextRequest) {
  const { idToken, data } = await req.json();
  if (
    typeof idToken !== "string" ||
    !idToken ||
    typeof data !== "object" ||
    !data
  ) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const admin = getAdmin();
  if (!admin)
    return NextResponse.json(
      { error: "admin_not_configured" },
      { status: 501 },
    );

  try {
    const decoded = await admin.adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    await admin.adminDb.collection("users").doc(uid).set(data, { merge: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}
