import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="about-hero">

        <div className="about-badge">
          ♻️ ABOUT SWACHHLENS
        </div>

        <h1 className="about-heading">
          About SWACHHLENS
        </h1>

        <p className="about-intro">
          SWACHHLENS is an AI-powered waste-response decision
          support system designed to help citizens report waste
          problems and support faster, smarter response.
        </p>

        <p className="about-intro secondary">
          The platform connects citizen-reported information,
          location details, evidence and intelligent analysis
          to create a structured waste-response process.
        </p>

      </section>


      {/* =====================================================
          WHAT SWACHHLENS PROVIDES
      ===================================================== */}
      <section className="about-section">

        <h2 className="about-section-title">
          What SWACHHLENS Provides
        </h2>

        <p className="about-section-description">
          SWACHHLENS provides a structured digital platform that
          helps transform a citizen's waste complaint into useful,
          verified and actionable information.
        </p>


        <div className="features-grid">

          <article className="feature-card">
            <div className="feature-icon">👤</div>

            <h3>Verified Citizen Reporting</h3>

            <p>
              Citizens can report waste problems through a
              verified identity and structured reporting process.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📸</div>

            <h3>Waste Evidence</h3>

            <p>
              Citizens can provide real photographs and
              information about the reported waste situation.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📍</div>

            <h3>Accurate Location Information</h3>

            <p>
              Waste reports can include state, district, block,
              village and GPS-based location information.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🤖</div>

            <h3>AI-Powered Analysis</h3>

            <p>
              SWACHHLENS can analyze reported information to
              understand the waste situation and assess its risk.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">⚠️</div>

            <h3>Priority Assessment</h3>

            <p>
              The system can help identify situations that may
              require faster or higher-priority attention.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🧠</div>

            <h3>Decision Support</h3>

            <p>
              Structured information and intelligent analysis can
              support better waste-response decisions.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🏘️</div>

            <h3>Community Impact Information</h3>

            <p>
              Citizen situation questions help understand how
              waste problems affect people and public spaces.
            </p>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📊</div>

            <h3>Structured Waste Reports</h3>

            <p>
              Every submission is organized into structured
              information that can support further processing
              and response.
            </p>
          </article>

        </div>

      </section>


      {/* =====================================================
          WHY CITIZEN VERIFICATION
      ===================================================== */}
      <section className="about-section verification-section">

        <h2 className="about-section-title">
          Why Citizen Verification?
        </h2>

        <div className="verification-card">

          <div className="verification-icon">
            🛡️
          </div>

          <div className="verification-content">

            <p>
              Citizen details and email verification are included
              to help ensure that waste reports come from genuine
              and properly verified users.
            </p>

            <p>
              This helps reduce false, anonymous or unnecessary
              complaints and allows government or response
              authorities to focus on genuine waste-related issues.
            </p>

            <p className="verification-highlight">
              The goal is simple: <strong>real citizens, real
              information and real waste problems</strong> — so
              authorities can work on genuine cases without being
              unnecessarily disturbed by unverified reports.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT HELPS
      ===================================================== */}
      <section className="about-section">

        <h2 className="about-section-title">
          How SWACHHLENS Helps
        </h2>

        <div className="help-grid">

          <div className="help-item">
            <span>1</span>
            <div>
              <h3>Report</h3>
              <p>
                Citizens submit a verified waste report with
                evidence and location information.
              </p>
            </div>
          </div>


          <div className="help-item">
            <span>2</span>
            <div>
              <h3>Understand</h3>
              <p>
                The system organizes the reported information
                to understand the waste situation.
              </p>
            </div>
          </div>


          <div className="help-item">
            <span>3</span>
            <div>
              <h3>Analyze</h3>
              <p>
                Intelligent analysis can help assess severity,
                risk and potential priority.
              </p>
            </div>
          </div>


          <div className="help-item">
            <span>4</span>
            <div>
              <h3>Respond</h3>
              <p>
                Structured information can support faster and
                smarter waste-response decisions.
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          VISION
      ===================================================== */}
      <section className="about-vision">

        <h2 className="about-section-title">
          Our Vision
        </h2>

        <p>
          SWACHHLENS aims to move waste reporting beyond simple
          complaint submission toward an intelligent,
          evidence-based and structured waste-response system.
        </p>

        <p className="vision-highlight">
          From <strong>Report</strong> → <strong>Understand</strong>
          → <strong>Analyze</strong> → <strong>Respond</strong>.
        </p>

      </section>

    </main>
  );
}

export default About;