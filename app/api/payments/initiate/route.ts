import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { bookingId } = await req.json();
  const doc = await adminDb.collection("bookings").doc(bookingId).get();
  if (!doc.exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const booking = doc.data() as any;
  const amountKobo = Math.round((booking.price || 0) * 100);
  const body = {
    amount: amountKobo,
    email: "customer@example.com",
    metadata: { bookingId },
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/customer`,
  };
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data?.data || data);
}
