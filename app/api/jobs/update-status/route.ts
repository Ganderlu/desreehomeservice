import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { jobId, status, lat, lng } = await req.json();
  if (!jobId || !status) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  await adminDb.collection('jobs').doc(jobId).set({ status, ...(lat && lng ? { lat, lng } : {}) }, { merge: true });
  return NextResponse.json({ ok: true });
}
