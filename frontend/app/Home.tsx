import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>PHONEME ACTIVITY BUILDER</span>

          <h1>Build phoneme activities for the classroom</h1>

          <p className={styles.intro}>
            Create interactive phoneme-based Wordle and Word Search activities
            using stored word lists and saved activity configurations.
          </p>

          <div className={styles.actions}>
            <Link href="/wordle" className={styles.primaryButton}>
              Open Wordle
            </Link>

            <Link href="/word-search" className={styles.secondaryButton}>
              Open Word Search
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>TEACHER TOOLS</span>
          <h2>Manage your learning content</h2>
          <p>
            Add phoneme words, organise them into reusable word lists, and
            create saved activity configurations through the database-backed
            administration tools.
          </p>
        </div>

        <div className={styles.cardGrid}>
          <Link href="/words" className={styles.card}>
            <div className={styles.cardIcon}>Aa</div>
            <h3>Manage Words</h3>
            <p>
              Add, edit and remove English words, phoneme sequences and
              optional hints.
            </p>
            <span className={styles.cardLink}>Open Words →</span>
          </Link>

          <Link href="/word-lists" className={styles.card}>
            <div className={styles.cardIcon}>☷</div>
            <h3>Manage Word Lists</h3>
            <p>
              Group stored phoneme words into reusable collections for
              classroom activities.
            </p>
            <span className={styles.cardLink}>Open Word Lists →</span>
          </Link>

          <Link href="/activities" className={styles.card}>
            <div className={styles.cardIcon}>⚙</div>
            <h3>Manage Activities</h3>
            <p>
              Configure Wordle and Word Search activities with difficulty,
              hints and activity settings.
            </p>
            <span className={styles.cardLink}>Open Activities →</span>
          </Link>
        </div>
      </section>

      <section className={styles.activitySection}>
        <div className={styles.activityContent}>
          <div>
            <span className={styles.eyebrow}>ACTIVITY GENERATION</span>
            <h2>Database-driven classroom activities</h2>

            <p>
              Wordle and Word Search activities use word lists stored in the
              database rather than fixed example data. Saved configurations can
              be loaded into the activity builders and exported as standalone
              HTML files for classroom use.
            </p>
          </div>

          <div className={styles.featureList}>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Stored phoneme words</strong>
                <p>Activity content comes from the backend database.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Reusable activity settings</strong>
                <p>
                  Save multiple Wordle and Word Search configurations.
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Standalone HTML export</strong>
                <p>
                  Generate playable classroom activities that run in a normal
                  browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}