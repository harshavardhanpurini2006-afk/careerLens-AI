import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CareerLensProvider } from "../context/CareerLensContext";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerLens AI — AI Career Intelligence & Recruiter Platform",
  description:
    "Professional AI career intelligence platform providing recruiter-style candidate evaluation, role matching, ATS diagnostics, project analysis, and interview simulations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#f0f7ff] text-slate-900 font-sans antialiased">
        <CareerLensProvider>{children}</CareerLensProvider>
      </body>
    </html>
  );
}
