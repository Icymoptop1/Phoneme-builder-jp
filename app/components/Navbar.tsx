"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const active = (path: string) =>
    pathname === path
      ? "nav-link active"
      : "nav-link";

  return (
    <nav className="navbar">

      <Link
        href="/"
        className="nav-brand"
        onClick={closeMenu}
      >
        <span className="brand-icon">P</span>
        <span>Phoneme Builder</span>
      </Link>

      <div className="desktop-nav">

        <Link
          href="/"
          className={active("/")}
        >
          Home
        </Link>

        <Link
          href="/wordle"
          className={active("/wordle")}
        >
          Wordle
        </Link>

        <Link
          href="/word-search"
          className={active("/word-search")}
        >
          Word Search
        </Link>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="menu-wrapper">

          <button
            type="button"
            className="hamburger-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          {menuOpen && (
            <div className="hamburger-menu">

              <Link
                href="/about"
                onClick={closeMenu}
              >
                About
              </Link>

              <Link
                href="/settings"
                onClick={closeMenu}
              >
                Settings
              </Link>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}