"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { auth, db, firebaseEnabled, googleProvider, storage } from "../../lib/firebase/client";
import { useUserStore } from "../../store/store";
import { cn } from "../../lib/utils";

type Role = "customer" | "worker";

function GetStartedPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const roleFromQuery = params.get("role");
  const [role, setRole] = useState<Role>("customer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>("");
  const [areas, setAreas] = useState<string[]>([]);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (roleFromQuery === "worker") setRole("worker");
  }, [roleFromQuery]);
  useEffect(() => {
    setMounted(true);
  }, []);

  async function persistUserDoc(uid: string, portfolioUrls: string[]) {
    await setDoc(
      doc(db, "users", uid),
      {
        role,
        phone: phone.trim(),
        email: email.trim(),
        displayName: fullName.trim(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
        ...(role === "worker"
          ? {
              workerProfile: {
                skills,
                yearsExperience: experience,
                serviceAreas: areas,
                portfolio: portfolioUrls,
              },
            }
          : {}),
      },
      { merge: true },
    );
  }

  async function handleGoogleRegisterCustomer() {
    if (!mounted) return;
    if (role !== "customer") return;
    if (!firebaseEnabled || !auth) {
      setError("Firebase is not configured. Add .env.local keys and restart the dev server.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const withTimeout = async <T,>(p: Promise<T>, ms: number, label: string): Promise<T> => {
        return (await Promise.race([
          p,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out. Please try again.`)), ms),
          ),
        ])) as T;
      };

      const res = await withTimeout(signInWithPopup(auth, googleProvider), 20000, "Google sign up");
      const uid = res.user.uid;
      const idToken = await withTimeout(res.user.getIdToken(), 12000, "Authentication");
      const dn = (res.user.displayName || fullName.trim() || "Customer").trim();
      const em = (res.user.email || email.trim() || "").trim();
      const ph = phone.trim();

      if (!res.user.displayName && dn) {
        await withTimeout(updateProfile(res.user, { displayName: dn }), 12000, "Profile update");
      }

      useUserStore.getState().setUser({
        uid,
        role: "customer",
        displayName: dn,
        photoURL: res.user.photoURL || null,
      });

      try {
        await withTimeout(
          setDoc(
            doc(db, "users", uid),
            {
              role: "customer",
              phone: ph || null,
              email: em || null,
              displayName: dn,
              photoURL: res.user.photoURL || null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
            },
            { merge: true },
          ),
          25000,
          "Saving profile",
        );
      } catch {
        const apiRes = await withTimeout(
          fetch("/api/users/upsert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken,
              data: {
                role: "customer",
                phone: ph || null,
                email: em || null,
                displayName: dn,
                photoURL: res.user.photoURL || null,
                city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
              },
            }),
          }),
          20000,
          "Saving profile",
        );
        if (!apiRes.ok) {
          if (apiRes.status === 501) {
            throw new Error(
              "Firestore is not responding from your browser, and server fallback is not configured. Add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY to .env.local and restart.",
            );
          }
          throw new Error("Could not save your profile to Firestore. Please try again.");
        }
      }

      router.replace("/customer");
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "Google sign up failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!mounted) return;
    if (!firebaseEnabled) return;
    if (!auth?.currentUser?.uid) return;
    const uid = auth.currentUser.uid;
    const key = `desree:pending-profile:${uid}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    setPendingSave(true);
    (async () => {
      try {
        const parsed = JSON.parse(raw) as any;
        await setDoc(doc(db, "users", uid), parsed, { merge: true });
        localStorage.removeItem(key);
        setPendingSave(false);
        const userDoc = await getDoc(doc(db, "users", uid));
        const data = userDoc.exists() ? (userDoc.data() as any) : null;
        useUserStore.getState().setUser({
          uid,
          role: (data?.role ?? role) as any,
          displayName: (data?.displayName ?? null) as any,
          photoURL: null,
        });
        const finalRole = (data?.role as Role | undefined) ?? role;
        router.replace(finalRole === "customer" ? "/customer" : "/worker");
      } catch {
        setPendingSave(false);
      }
    })();
  }, [mounted, router, role]);

  const skillOptions = [
    "Plumbing",
    "Electrical Repairs",
    "Deep Cleaning",
    "Painting",
    "AC Repair",
    "Generator Servicing",
    "Handyman",
  ];

  const areaOptions = [
    "Awka GRA",
    "Onitsha North",
    "Nnewi",
    "Nnewi South",
    "Owerri",
    "Aba",
  ];

  const canSubmit = useMemo(() => {
    if (!firebaseEnabled) return false;
    if (!fullName.trim() || !phone.trim() || !email.trim()) return false;
    if (password.length < 6) return false;
    if (password !== confirmPassword) return false;
    if (role === "worker") {
      if (skills.length === 0) return false;
      if (!experience) return false;
      if (areas.length === 0) return false;
    }
    return true;
  }, [
    areas.length,
    confirmPassword,
    email,
    experience,
    fullName,
    password,
    phone,
    role,
    skills.length,
  ]);

  function toggleSkill(s: string) {
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function toggleArea(a: string) {
    setAreas((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  async function handleCreateAccount() {
    if (!mounted) return;
    if (!firebaseEnabled || !auth) {
      setError("Firebase is not configured. Add .env.local keys and restart the dev server.");
      return;
    }
    setError(null);
    if (!canSubmit) return;
    setLoading(true);
    try {
      const withTimeout = async <T,>(p: Promise<T>, ms: number, label: string): Promise<T> => {
        return (await Promise.race([
          p,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out. Please try again.`)), ms),
          ),
        ])) as T;
      };

      const res = await withTimeout(
        createUserWithEmailAndPassword(auth, email.trim(), password),
        20000,
        "Account creation",
      );
      await withTimeout(
        updateProfile(res.user, { displayName: fullName.trim() }),
        12000,
        "Profile update",
      );
      const idToken = await withTimeout(res.user.getIdToken(), 12000, "Authentication");

      let portfolioUrls: string[] = [];
      if (role === "worker" && portfolioFiles.length > 0) {
        try {
          const uploads = await withTimeout(
            Promise.all(
              portfolioFiles.map(async (file) => {
                const safeName = file.name.replace(/[^\w.\-]+/g, "_");
                const path = `user-content/${res.user.uid}/portfolio/${Date.now()}_${safeName}`;
                const r = ref(storage, path);
                await uploadBytes(r, file);
                return getDownloadURL(r);
              }),
            ),
            25000,
            "Portfolio upload",
          );
          portfolioUrls = uploads.filter(Boolean);
        } catch {
          portfolioUrls = [];
        }
      }

      useUserStore.getState().setUser({
        uid: res.user.uid,
        role,
        displayName: fullName.trim(),
        photoURL: res.user.photoURL || null,
      });

      let saved = false;
      try {
        await withTimeout(
          persistUserDoc(res.user.uid, portfolioUrls),
          25000,
          "Saving profile",
        );
        saved = true;
      } catch (e: any) {
        try {
          const apiRes = await withTimeout(
            fetch("/api/users/upsert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idToken,
                data: {
                  role,
                  phone: phone.trim(),
                  email: email.trim(),
                  displayName: fullName.trim(),
                  city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
                  ...(role === "worker"
                    ? {
                        workerProfile: {
                          skills,
                          yearsExperience: experience,
                          serviceAreas: areas,
                          portfolio: portfolioUrls,
                        },
                      }
                    : {}),
                },
              }),
            }),
            20000,
            "Saving profile",
          );
          if (apiRes.ok) {
            saved = true;
          } else if (apiRes.status === 501) {
            setError(
              "Firestore is not responding from your browser, and server fallback is not configured. Add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY to .env.local and restart.",
            );
          }
        } catch {}

        const uid = res.user.uid;
        const key = `desree:pending-profile:${uid}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            role,
            phone: phone.trim(),
            email: email.trim(),
            displayName: fullName.trim(),
            updatedAt: new Date().toISOString(),
            city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Awka",
            ...(role === "worker"
              ? {
                  workerProfile: {
                    skills,
                    yearsExperience: experience,
                    serviceAreas: areas,
                    portfolio: portfolioUrls,
                  },
                }
              : {}),
          }),
        );
        const msg = typeof e?.message === "string" ? e.message : "";
        if (msg.toLowerCase().includes("offline") || msg.toLowerCase().includes("timed out")) {
          throw new Error(
            "Saving profile timed out. This usually means your network/firewall is blocking Firestore. Try a different network, allow firestore.googleapis.com, or configure FIREBASE_ADMIN_* env vars for server fallback.",
          );
        }
        throw e;
      }

      if (!saved) {
        setError(
          "Account created in Firebase Auth, but profile could not be saved to Firestore yet. Please refresh this page to retry.",
        );
        return;
      }

      router.replace(role === "customer" ? "/customer" : "/worker");
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "Could not create account. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-soft">
      <div className="container-padded py-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border bg-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-[620px]">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80"
                alt="Family in a beautiful home"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/70 via-primary/20 to-accent/30" />
            </div>

            <div className="p-6 sm:p-10 bg-gradient-to-b from-[#0B6F76] to-[#075D63] text-white">
              <div className="flex items-center justify-center gap-2">
                <span className="text-accent text-3xl font-extrabold leading-none">
                  ‹
                </span>
                <div className="text-2xl font-bold tracking-tight">Desree</div>
              </div>
              <div className="text-center text-xs tracking-[0.2em] mt-1 text-white/80">
                HOME SERVICE
              </div>

              <h1 className="mt-6 text-center text-2xl sm:text-3xl font-bold">
                Create Your Account
              </h1>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={cn(
                    "h-11 px-5 rounded-xl border text-sm font-semibold transition",
                    role === "customer"
                      ? "bg-primary/80 border-white/15 text-white"
                      : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15",
                  )}
                >
                  I&apos;m a Homeowner
                </button>
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={cn(
                    "h-11 px-5 rounded-xl border text-sm font-semibold transition",
                    role === "worker"
                      ? "bg-primary border-white/15 text-white"
                      : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15",
                  )}
                >
                  I&apos;m a Worker
                </button>
              </div>

              {mounted && !firebaseEnabled && (
                <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/90">
                  Firebase is not configured. Add your keys in{" "}
                  <span className="font-semibold">.env.local</span> and restart
                  the dev server.
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {pendingSave && (
                <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90">
                  Finishing account setup…
                </div>
              )}

              {!mounted ? (
                <div className="mt-6 grid gap-4" />
              ) : role === "customer" ? (
                <div className="mt-6 grid gap-4">
                  <Input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white text-secondary"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white text-secondary"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white text-secondary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white text-secondary"
                    />
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white text-secondary"
                    />
                  </div>

                  <Button
                    onClick={handleCreateAccount}
                    disabled={loading || !canSubmit}
                    className="h-12 rounded-xl bg-accent text-white hover:opacity-90 text-base"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>

                  <div className="relative py-1">
                    <div className="h-px bg-white/20" />
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 bg-[#0B6F76] px-3 text-xs text-white/80">
                      OR
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleGoogleRegisterCustomer}
                    disabled={loading || !firebaseEnabled}
                    className="h-12 rounded-xl bg-white text-secondary hover:bg-gray-50 border-white/70 text-base"
                  >
                    Continue with Google
                  </Button>

                  <div className="text-center text-sm text-white/85">
                    Already have an account?{" "}
                    <Link
                      href="/auth"
                      className="font-semibold underline underline-offset-2"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5 sm:p-6 shadow-sm">
                  <div className="rounded-3xl bg-primary p-4 sm:p-5 text-white border border-white/15">
                    <Input
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white text-secondary"
                    />

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white text-secondary"
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white text-secondary"
                      />
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-semibold text-white">
                        Skills
                      </div>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {skillOptions.map((s) => {
                          const active = skills.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSkill(s)}
                              className={cn(
                                "h-10 rounded-xl border px-3 text-sm font-medium transition text-left",
                                active
                                  ? "bg-accent text-white border-accent"
                                  : "bg-white/10 text-white border-white/20 hover:bg-white/15",
                              )}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <div className="text-sm font-semibold text-white">
                          Years of Experience
                        </div>
                        <select
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className="h-11 rounded-lg border bg-white px-3 text-sm text-secondary"
                        >
                          <option value="">Select</option>
                          <option value="0-1">0–1 years</option>
                          <option value="1-2">1–2 years</option>
                          <option value="3-5">3–5 years</option>
                          <option value="6-10">6–10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm font-semibold text-white">
                          Service Areas
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {areaOptions.map((a) => {
                            const active = areas.includes(a);
                            return (
                              <button
                                key={a}
                                type="button"
                                onClick={() => toggleArea(a)}
                                className={cn(
                                  "h-9 rounded-xl border px-3 text-sm font-medium transition",
                                  active
                                    ? "bg-secondary text-white border-secondary"
                                    : "bg-white/10 text-white border-white/20 hover:bg-white/15",
                                )}
                              >
                                {a}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2">
                      <div className="text-sm font-semibold text-white">
                        Upload ID / Portfolio Photos
                      </div>
                      <label className="h-11 rounded-xl border bg-white px-3 flex items-center justify-between text-sm text-secondary cursor-pointer hover:bg-gray-50 transition">
                        <span>
                          {portfolioFiles.length
                            ? `${portfolioFiles.length} file(s) selected`
                            : "Choose files"}
                        </span>
                        <span className="text-gray-500">📎</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) =>
                            setPortfolioFiles(Array.from(e.target.files || []))
                          }
                        />
                      </label>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white text-secondary"
                      />
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white text-secondary"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateAccount}
                    disabled={loading || !canSubmit}
                    className="mt-4 h-12 w-full rounded-xl bg-accent text-white hover:opacity-90 text-base"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>

                  <div className="mt-3 text-center text-sm text-white/85">
                    Already have an account?{" "}
                    <Link
                      href="/auth"
                      className="font-semibold underline underline-offset-2"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-56px)] bg-gradient-soft">
          <div className="container-padded py-10">Loading…</div>
        </div>
      }
    >
      <GetStartedPageContent />
    </Suspense>
  );
}
