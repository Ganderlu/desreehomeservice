import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { token, uid } = await req.json();
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });
  if (uid) {
    await adminDb.collection('users').doc(uid).set({ fcm: token }, { merge: true });
  }
  return NextResponse.json({ ok: true });
}
