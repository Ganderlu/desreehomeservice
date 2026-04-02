import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase/admin";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const raw = await req.text();
  const sig = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  const header = req.headers.get("x-paystack-signature") || "";
  if (sig !== header) return NextResponse.json({ ok: false }, { status: 401 });
  const event = JSON.parse(raw);
  if (event?.event === "charge.success") {
    const bookingId = event?.data?.metadata?.bookingId;
    if (bookingId) {
      await adminDb
        .collection("bookings")
        .doc(bookingId)
        .set({ paymentStatus: "paid", status: "Assigned" }, { merge: true });
    }
  }
  return NextResponse.json({ ok: true });
}
