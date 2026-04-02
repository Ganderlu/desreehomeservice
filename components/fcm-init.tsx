"use client";
import { useEffect } from "react";
import { firebaseEnabled, getMessagingIfSupported } from "../lib/firebase/client";
import { getToken } from "firebase/messaging";

export default function FcmInit() {
  useEffect(() => {
    (async () => {
      if (!firebaseEnabled) return;
      const m = await getMessagingIfSupported();
      if (!m) return;
      try {
        if (typeof Notification === "undefined") return;
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
        const token = await getToken(m, {
          vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
        });
        if (token) {
          await fetch("/api/notifications/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        }
      } catch {}
    })();
  }, []);
  return null;
}
