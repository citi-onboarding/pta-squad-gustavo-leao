import type { Metadata } from "next";

import { Header } from "@/components/Header";

import "styles/globals.css";

export const metadata: Metadata = {
  title: "Biblioteca Escolar",
  description: "Sistema de gestão da biblioteca escolar - CITi",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <Header />
        {children}
      </body>
    </html>
  );
}