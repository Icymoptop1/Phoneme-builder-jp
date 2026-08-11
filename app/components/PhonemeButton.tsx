"use client";

interface PhonemeButtonProps {
  symbol: string;
  label: string;
  example: string;
  selected?: boolean;
  onClick: () => void;
}

export default function PhonemeButton({
  symbol,
  label,
  example,
  selected = false,
  onClick,
}: PhonemeButtonProps) {

  return (
    <button
      type="button"
      className={
        `phoneme-button ${
          selected
            ? "selected"
            : ""
        }`
      }
      onClick={onClick}
      title={`${symbol} — ${example}`}
      aria-label={
        `${symbol}. ${example}`
      }
    >

      <span className="phoneme-symbol">
        /{symbol}/
      </span>

      <span className="phoneme-label">
        {label}
      </span>

    </button>
  );
}