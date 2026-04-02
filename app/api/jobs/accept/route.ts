import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { jobId, workerId } = await req.json();
  if (!jobId || !workerId) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  await adminDb.collection('jobs').doc(jobId).set({ workerId, status: 'On the way' }, { merge: true });
  return NextResponse.json({ ok: true });
}
