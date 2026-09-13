export default function AboutPage() {
  return (
    <section className="page">
      <div className="page-heading">
        <span className="badge">
          ABOUT
        </span>

        <h2>
          About the Project
        </h2>

        <p>
          The Phoneme Learning Activity Builder is a
          full-stack educational application designed
          to help teachers create phoneme-based Wordle
          and Word Search activities.
        </p>
      </div>

      <div className="content-card">
        <h3>
          Project Overview
        </h3>

        <p>
          The application combines a Next.js frontend
          with server-side API routes and a database.
          Teachers can create words, organise them into
          reusable word lists, and build saved activity
          configurations for Wordle and Word Search.
        </p>

        <p>
          Activity content is loaded from stored data
          rather than being limited to a single fixed
          example. This allows different word lists,
          difficulty levels, hints, themes and activity
          settings to be reused across multiple
          activities.
        </p>
      </div>

      <div className="two-column">
        <div className="content-card">
          <h3>
            Wordle
          </h3>

          <p>
            The Wordle activity uses phoneme symbols
            rather than standard alphabetic word entry.
            Students construct the target word by
            selecting phonemes from the available
            phoneme keyboard.
          </p>

          <p>
            The target word is selected from the word
            list linked to the saved Wordle activity.
            Difficulty changes the number of distractor
            phonemes available, while the configured
            maximum attempt limit controls how many
            guesses the student receives.
          </p>

          <p>
            Feedback identifies correct phonemes,
            misplaced phonemes and incorrect phonemes,
            helping students recognise both phoneme
            identity and position.
          </p>

          <div className="example-box">
            <span>
              /θ/ /ɪ/ /n/
            </span>
            <strong>
              THIN
            </strong>
          </div>
        </div>

        <div className="content-card">
          <h3>
            Word Search
          </h3>

          <p>
            The Word Search activity generates a
            phoneme grid using words stored in the
            selected database word list.
          </p>

          <p>
            Difficulty affects how many words are used
            and the directions in which words may be
            placed. Saved activity settings can also
            control the grid size, theme and whether
            phoneme hints are displayed.
          </p>

          <p>
            Students select phonemes within the grid
            and receive feedback for correct and
            incorrect selections. Keyboard controls
            are also supported to improve
            accessibility.
          </p>
        </div>
      </div>

      <div className="content-card">
        <h3>
          Teacher Management
        </h3>

        <p>
          The application includes management pages
          for Words, Word Lists and Activities.
          Teachers can create, view, update and delete
          stored content through the application's
          backend API.
        </p>

        <p>
          Words store both their English form and
          phoneme sequence. Phonemes may contain
          multiple characters where required. Word
          lists group stored words together so they can
          be reused by different activities.
        </p>

        <p>
          Each activity stores its activity type,
          linked word list, difficulty and relevant
          configuration options. The backend validates
          submitted data before it is stored.
        </p>
      </div>

      <div className="content-card">
        <h3>
          Standalone Activities
        </h3>

        <p>
          Wordle and Word Search activities can be
          exported as standalone HTML files. The
          generated file contains the required data,
          styling and JavaScript so the activity can be
          opened and played directly in a normal web
          browser.
        </p>

        <p>
          Generated activities preserve relevant saved
          settings such as difficulty, theme, phoneme
          content and activity-specific options.
        </p>
      </div>

      <div className="content-card">
        <h3>
          Accessibility and Interface
        </h3>

        <p>
          The interface supports light and dark themes,
          responsive layouts and keyboard-accessible
          controls. Phoneme hints and descriptive
          labels are provided where appropriate to
          support usability and accessibility.
        </p>
      </div>

      <div className="content-card">
        <h3>
          Creator Information
        </h3>

        <p>
          <strong>
            Name:
          </strong>{" "}
          Jessuah Pender
        </p>

        <p>
          <strong>
            Student Number:
          </strong>{" "}
          22442827
        </p>
      </div>
    </section>
  );
}