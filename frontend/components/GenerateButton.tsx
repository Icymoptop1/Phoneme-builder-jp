"use client";

interface GenerateButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export default function GenerateButton({
  onClick,
  children = "Generate HTML",
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      className="generate-button"
      onClick={onClick}
    >
      ↓ {children}
    </button>
  );
}