import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  await adminDb.collection('payments').doc(jobId).set({ status: 'released', releasedAt: new Date() }, { merge: true });
  return NextResponse.json({ ok: true });
}
