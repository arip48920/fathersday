import type { Metadata } from "next";
import "./globals.css";
import { FamilyProvider } from "@/context/FamilyContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FamilyHub - Pictures & Shared Calendar Dashboard",
  description: "A private, premium glassmorphism portal for sharing family pictures, coordinating a shared monthly calendar, and managing to-do lists for each family member.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FamilyProvider>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: 1, padding: "20px" }}>
              {children}
            </main>
          </div>
        </FamilyProvider>
      </body>
    </html>
  );
}
