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

  const menuActive = (path: string) =>
    pathname === path
      ? "menu-link active"
      : "menu-link";

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
          onClick={closeMenu}
        >
          Home
        </Link>

        <Link
          href="/wordle"
          className={active("/wordle")}
          onClick={closeMenu}
        >
          Wordle
        </Link>

        <Link
          href="/word-search"
          className={active("/word-search")}
          onClick={closeMenu}
        >
          Word Search
        </Link>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle light and dark theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="menu-wrapper">
          <button
            type="button"
            className="hamburger-button"
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="navigation-menu"
          >
            ☰
          </button>

          {menuOpen && (
            <div
              id="navigation-menu"
              className="hamburger-menu"
            >
              <Link
                href="/words"
                className={menuActive("/words")}
                onClick={closeMenu}
              >
                Manage Words
              </Link>

              <Link
                href="/word-lists"
                className={menuActive("/word-lists")}
                onClick={closeMenu}
              >
                Manage Word Lists
              </Link>

              <Link
                href="/activities"
                className={menuActive("/activities")}
                onClick={closeMenu}
              >
                Manage Activities
              </Link>

              <Link
                href="/about"
                className={menuActive("/about")}
                onClick={closeMenu}
              >
                About
              </Link>

              <Link
                href="/settings"
                className={menuActive("/settings")}
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