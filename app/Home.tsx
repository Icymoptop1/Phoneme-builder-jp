import Link from "next/link";

export default function Home() {
  return (
    <section className="page home-page">
      <div className="hero">
        <div className="hero-content">

          <h2>
            Phoneme Learning Activity Builder
          </h2>

          <p>
            Create interactive Wordle-style and Word
            Search classroom activities using phoneme
            symbols rather than standard word entry.
          </p>

          <div className="hero-buttons">
            <Link
              href="/wordle"
              className="primary-button"
            >
              Create Wordle
            </Link>

            <Link
              href="/word-search"
              className="secondary-button"
            >
              Create Word Search
            </Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-title">
            PHONEME PREVIEW
          </div>

          <div className="preview-phonemes">
            <span>/θ/</span>
            <span>/ɪ/</span>
            <span>/n/</span>
          </div>

          <div className="preview-arrow">
            ↓
          </div>

          <div className="preview-answer">
            THIN
          </div>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-number">
            01
          </div>

          <h3>
            Phoneme Wordle
          </h3>

          <p>
            Create a Wordle-style activity using
            phoneme symbols and English sound
            equivalences.
          </p>

          <Link href="/wordle">
            Open Wordle →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-number">
            02
          </div>

          <h3>
            Phoneme Word Search
          </h3>

          <p>
            Create a word search using a fixed list
            of approximately five phoneme-based words.
          </p>

          <Link href="/word-search">
            Open Word Search →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-number">
            03
          </div>

          <h3>
            Accessible Learning
          </h3>

          <p>
            Hover or focus on phonemes to see their
            English letter equivalence and example word.
          </p>

          <Link href="/about">
            Learn More →
          </Link>
        </div>
      </div>
    </section>
  );
}