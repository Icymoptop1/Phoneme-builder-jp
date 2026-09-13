import Link from "next/link";

export default function Home() {
  return (
    <section className="page-shell">
      <div className="page-card">
        <h1>Phoneme Learning Activity Builder</h1>

        <p>
          Create phoneme-based learning activities using stored word lists and
          activity configurations.
        </p>

        <div className="home-actions">
          <Link href="/wordle" className="button-link">
            Open Wordle
          </Link>

          <Link href="/word-search" className="button-link">
            Open Word Search
          </Link>
        </div>

        <section>
          <h2>Teacher Tools</h2>

          <p>
            Manage words, word lists and saved activity configurations through
            the database-backed administration pages.
          </p>

          <div className="home-actions">
            <Link href="/words" className="button-link">
              Manage Words
            </Link>

            <Link href="/word-lists" className="button-link">
              Manage Word Lists
            </Link>

            <Link href="/activities" className="button-link">
              Manage Activities
            </Link>
          </div>
        </section>

        <section>
          <h2>Activity Generation</h2>

          <p>
            Wordle and Word Search activities use word lists stored in the
            database and can be exported as standalone HTML activities for
            classroom use.
          </p>
        </section>
      </div>
    </section>
  );
}