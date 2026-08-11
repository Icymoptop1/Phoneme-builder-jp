import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Phoneme Learning Activity Builder",
  description:
    "A phoneme-based Wordle and Word Search activity builder for Speech Pathology education.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const savedTheme =
    cookieStore.get("theme")?.value;

  const initialTheme =
    savedTheme === "dark"
      ? "dark"
      : "light";

  return (
    <html
      lang="en"
      data-theme={initialTheme}
    >
      <body>
        <ThemeProvider
          initialTheme={initialTheme}
        >
          <Navbar />

          <Header />

          <main className="main-content">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}