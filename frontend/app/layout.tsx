import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";

import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Phoneme Learning Activity Builder",
  description:
    "Create phoneme-based Wordle and Word Search learning activities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("theme")?.value;

  const initialTheme =
    savedTheme === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={initialTheme}>
      <body>
        <ThemeProvider initialTheme={initialTheme}>
          <Header />
          <Navbar />

          <main>{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}