"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  auth,
  db,
  firebaseEnabled,
  googleProvider,
} from "../../lib/firebase/client";
import { useUserStore } from "../../store/store";

type Role = "customer" | "worker" | "admin";

export default function AuthPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const canSubmit = useMemo(() => {
    if (!firebaseEnabled) return false;
    if (!identifier.trim()) return false;
    if (!password.trim()) return false;
    return true;
  }, [identifier, password]);

  async function resolveEmailFromIdentifier(): Promise<string> {
    const raw = identifier.trim();
    if (raw.includes("@")) return raw.toLowerCase();
    const res = await fetch("/api/auth/resolve-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: raw }),
    });
    if (!res.ok) {
      if (res.status === 501) {
        throw new Error(
          "Phone login is not available yet. Please use email to sign in.",
        );
      }
      throw new Error("Phone number not found. Please use email or register.");
    }
    const data = (await res.json()) as any;
    const email = typeof data?.email === "string" ? data.email : "";
    if (!email)
      throw new Error("Phone number not found. Please use email or register.");
    return email.toLowerCase();
  }

  async function routeByRole(uid: string, idToken?: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      const data = userDoc.exists() ? (userDoc.data() as any) : null;
      const role = data?.role as Role | undefined;
      const displayName = (data?.displayName as string | undefined) ?? null;
      const photoURL = (data?.photoURL as string | undefined) ?? null;

      setUser({ uid, role: (role ?? null) as any, displayName, photoURL });

      if (role === "customer") router.replace("/customer");
      else if (role === "worker") router.replace("/worker");
      else if (role === "admin") router.replace("/admin");
      else router.replace("/onboarding");
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "";
      if (msg.toLowerCase().includes("offline") && idToken) {
        const res = await fetch("/api/users/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (res.ok) {
          const json = (await res.json()) as any;
          const data = json?.user || null;
          const role = data?.role as Role | undefined;
          const displayName = (data?.displayName as string | undefined) ?? null;
          const photoURL = (data?.photoURL as string | undefined) ?? null;
          setUser({ uid, role: (role ?? null) as any, displayName, photoURL });
          if (role === "customer") router.replace("/customer");
          else if (role === "worker") router.replace("/worker");
          else if (role === "admin") router.replace("/admin");
          else router.replace("/onboarding");
          return;
        }
        throw new Error(
          "Could not reach Firestore from your browser. If you are on a restricted network, allow firestore.googleapis.com. Also ensure Firestore Database is created in Firebase Console.",
        );
      }
      throw e;
    }
  }

  async function handleGoogle() {
    if (!auth) return;
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const idToken = await res.user.getIdToken();
      try {
        const userRef = doc(db, "users", res.user.uid);
        const existing = await getDoc(userRef);
        if (!existing.exists()) {
          await setDoc(
            userRef,
            {
              role: null,
              email: res.user.email || null,
              displayName: res.user.displayName || null,
              photoURL: res.user.photoURL || null,
              createdAt: serverTimestamp(),
              city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
            },
            { merge: true },
          );
        }
      } catch {
        await fetch("/api/users/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            data: {
              role: null,
              email: res.user.email || null,
              displayName: res.user.displayName || null,
              photoURL: res.user.photoURL || null,
              createdAt: new Date().toISOString(),
              city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
            },
          }),
        });
      }
      await routeByRole(res.user.uid, idToken);
    } catch (e: any) {
      setError(
        typeof e?.message === "string" ? e.message : "Google sign-in failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    if (!auth) return;
    setError(null);
    setLoading(true);
    try {
      const email = await resolveEmailFromIdentifier();
      const res = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await res.user.getIdToken();
      await routeByRole(res.user.uid, idToken);
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "Sign in failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleWhatsAppSim() {
    router.push("/auth/whatsapp");
  }

  async function handleForgotPassword() {
    if (!auth) return;
    setError(null);
    try {
      const email = await resolveEmailFromIdentifier();
      await sendPasswordResetEmail(auth, email);
      setError("Password reset link sent. Check your email.");
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "Could not send password reset email.";
      setError(msg);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-soft">
      <div className="container-padded py-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border bg-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-[620px]">
              <Image
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=80"
                alt="Modern home"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/60 via-transparent to-accent/25" />
              <div className="absolute top-8 left-8 flex items-center gap-3 text-white">
                <div className="h-9 w-9 rounded-2xl bg-white/10 border border-white/20" />
                <div className="text-xl font-bold">Desree</div>
              </div>
            </div>

            <div className="p-6 sm:p-10 bg-white">
              <div className="flex items-center justify-center gap-2 text-secondary">
                <span className="text-accent text-3xl font-extrabold leading-none">
                  ‹
                </span>
                <div className="text-2xl font-bold tracking-tight">Desree</div>
              </div>

              <h1 className="mt-6 text-center text-3xl font-bold text-primary">
                Welcome Back
              </h1>

              {mounted && !firebaseEnabled && (
                <div className="mt-5 rounded-2xl border bg-white p-4 text-sm text-gray-700">
                  Firebase is not configured. Copy{" "}
                  <span className="font-semibold">.env.example</span> to{" "}
                  <span className="font-semibold">.env.local</span> and add your
                  Firebase keys.
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!mounted ? (
                <div className="mt-6 h-[260px]" />
              ) : (
                <div className="mt-6 grid gap-3">
                  <Input
                    placeholder="Phone Number or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="bg-white text-secondary"
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-secondary"
                  />
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-left text-sm text-primary hover:underline underline-offset-4"
                    disabled={!firebaseEnabled || loading}
                  >
                    Forgot Password?
                  </button>

                  <Button
                    onClick={handleSignIn}
                    disabled={loading || !canSubmit}
                    className="h-12 rounded-xl bg-accent text-white hover:opacity-90 text-base"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="grid gap-3 mt-2">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl"
                      onClick={handleGoogle}
                      disabled={loading || !firebaseEnabled}
                    >
                      Continue with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl"
                      onClick={handleWhatsAppSim}
                    >
                      Login with WhatsApp
                    </Button>
                  </div>

                  <div className="mt-2 text-center text-sm text-gray-700">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/get-started"
                      className="font-semibold text-primary hover:underline underline-offset-4"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}

              <div id="recaptcha-container" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
