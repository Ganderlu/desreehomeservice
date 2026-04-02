# Desree Home Service

A production-ready MVP for a home services marketplace focused on Awka and Onitsha, Anambra State, Nigeria.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn-style UI
- Firebase (Auth, Firestore, Storage, FCM)
- Paystack (payments escrow)
- Google Maps (matching and live tracking)
- Zustand (state)

## Setup
1. Copy `.env.example` to `.env.local` and fill values:
   - Firebase web config (`NEXT_PUBLIC_…`)
   - Firebase Admin (`FIREBASE_ADMIN_…`)
   - Paystack keys
   - Google Maps API key
   - FCM VAPID key
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Firebase
- Firestore collections: users, workers, services, jobs, bookings, payments, ratings, disputes, chats, notifications
- Security rules: see `firebase-rules/`
- Push notifications: configure `public/firebase-messaging-sw.js`

## Payments (Paystack)
- Escrow init: `POST /api/payments/initiate`
- Webhook: `POST /api/payments/webhook` (set URL in Paystack dashboard)

## Deployment (Vercel)
1. Create a new project on Vercel, import this repo.
2. Set environment variables in Vercel dashboard.
3. Deploy.

## Notes
- PWA enabled in production
- Mobile-first with bottom navigation
- Nigerian currency formatting (₦)
