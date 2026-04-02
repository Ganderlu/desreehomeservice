'use client';
import React from 'react';
import { create } from 'zustand';

type Role = 'customer' | 'worker' | 'admin' | null;

type UserState = {
  uid: string | null;
  role: Role;
  displayName: string | null;
  photoURL: string | null;
  setUser: (data: Partial<Omit<UserState, 'setUser'>>) => void;
  signOut: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  uid: null,
  role: null,
  displayName: null,
  photoURL: null,
  setUser: (data) => set(data),
  signOut: () => set({ uid: null, role: null, displayName: null, photoURL: null })
}));

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
