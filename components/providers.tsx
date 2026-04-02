"use client";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "../store/store";
import FcmInit from "./fcm-init";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <StoreProvider>
        <FcmInit />
        {children}
      </StoreProvider>
    </ThemeProvider>
  );
}
