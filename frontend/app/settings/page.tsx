"use client";

import { useTheme } from "../components/ThemeProvider";

export default function SettingsPage() {
  const {
    theme,
    setTheme,
  } = useTheme();

  return (
    <section className="page">

      <div className="page-heading">

        <span className="badge">
          SETTINGS
        </span>

        <h2>
          Application Settings
        </h2>

        <p>
          Configure the appearance and layout
          of the activity builder.
        </p>

      </div>

      <div className="settings-card">

        <h3>
          Appearance
        </h3>

        <p>
          Select your preferred interface theme.
          Your selection will be remembered
          when you return to the application.
        </p>

        <div className="settings-options">

          <label className="setting-option">

            <input
              type="radio"
              name="theme"
              value="light"
              checked={
                theme === "light"
              }
              onChange={() =>
                setTheme("light")
              }
            />

            <span>
              ☀️ Light Mode
            </span>

          </label>

          <label className="setting-option">

            <input
              type="radio"
              name="theme"
              value="dark"
              checked={
                theme === "dark"
              }
              onChange={() =>
                setTheme("dark")
              }
            />

            <span>
              🌙 Dark Mode
            </span>

          </label>

        </div>

        <div className="theme-status">

          Current theme:

          <strong>
            {theme === "dark"
              ? " Dark Mode"
              : " Light Mode"}
          </strong>

        </div>

      </div>

      <div className="settings-card">

        <h3>
          Responsive Layout
        </h3>

        <p>
          The interface automatically adjusts
          for desktop, tablet and mobile
          screen sizes.
        </p>

        <div className="layout-preview">

          <span>
            Responsive Layout
          </span>

          <span>
            ✓ Enabled
          </span>

        </div>

      </div>

    </section>
  );
}