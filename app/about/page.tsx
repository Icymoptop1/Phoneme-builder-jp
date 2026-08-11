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
          An interactive frontend prototype designed
          around phoneme-based learning activities.
        </p>

      </div>

      <div className="content-card">

        <h3>
          Coming soon
        </h3>

        <p>
          
        </p>

        <p>
          
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
            Students select phonemes to construct the
            target word.
          </p>

          <div className="example-box">
            <span>/θ/ /ɪ/ /n/</span>
            <strong>THIN</strong>
          </div>

        </div>

        <div className="content-card">

          <h3>
            Word Search
          </h3>

          <p>
            The Word Search activity contains a small
            fixed list of approximately five
            phoneme-based words.
          </p>

          <p>
            Students identify phonemes within a
            generated grid and associate them with
            their English equivalents.
          </p>

        </div>

      </div>

      <div className="content-card">

        <h3>
          Creator Information
        </h3>

        <p>
          <strong>Name:</strong>{" "}
          Jessuah Pender
        </p>

        <p>
          <strong>Student Number:</strong>{" "}
          22442827
        </p>

      </div>

      <div className="content-card video-card">

        <h3>
          Assessment Video
        </h3>

        <p>
          This video demonstrates how to use the
          website and generate the classroom activities.
        </p>

        <div className="video-placeholder">

          <p>
            VIDEO PLACEHOLDER
          </p>

          <small>
            Replace this section with your assessment
            video.
          </small>

        </div>

      </div>

    </section>
  );
}