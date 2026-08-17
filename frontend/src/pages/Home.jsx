import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // =====================================================
  // START OFFICIAL SWACHHLENS REPORTING JOURNEY
  // =====================================================
  const startReport = () => {
    sessionStorage.setItem(
      "swachhlensHomeStarted",
      "true"
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    navigate("/citizen-id");
  };

  // =====================================================
  // TRACK REPORT STATUS
  // =====================================================
  const openReportStatus = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    navigate("/report-analysis-status");
  };

  return (
    <main className="swachhlens-home">

      {/* =====================================================
          INDIA + SWACHH BHARAT HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-glow home-glow-green"></div>
        <div className="home-hero-glow home-glow-saffron"></div>
        <div className="home-hero-glow home-glow-blue"></div>

        <div className="india-collaboration-strip">

          <div className="india-brand-block">
            <span className="india-flag">🇮🇳</span>

            <div>
              <strong>INDIA</strong>
              <small>स्वच्छ भारत • Clean India</small>
            </div>
          </div>

          <div className="collaboration-symbol">
            ×
          </div>

          <div className="swachhlens-brand-block">
            <span>♻️</span>

            <div>
              <strong>SWACHHLENS</strong>
              <small>AI Waste Intelligence</small>
            </div>
          </div>

        </div>


        <div className="hero-content">

          <span className="hero-eyebrow">
            🇮🇳 SWACHH BHARAT × AI-POWERED WASTE RESPONSE
          </span>

          <h1 className="rainbow-heading home-main-heading">
            Clean India.
            <br />
            <span>Intelligent Waste Response.</span>
          </h1>

          <p className="hero-description">
            SWACHHLENS is an India-focused AI-powered waste
            response decision support system designed to help
            citizens report real waste incidents and support
            structured, evidence-based and intelligent response.
          </p>

          <p className="odia-explanation">
            (ସ୍ୱଚ୍ଛ ଭାରତ ପାଇଁ SWACHHLENS ନାଗରିକଙ୍କୁ
            ପ୍ରକୃତ କଚରା ସମସ୍ୟା ରିପୋର୍ଟ କରିବାରେ ଏବଂ
            ଉପଯୁକ୍ତ ପ୍ରତିକ୍ରିୟା ପାଇଁ ସୂଚନା ଦେବାରେ
            ସାହାଯ୍ୟ କରେ।)
          </p>


          <div className="hero-india-message">

            <span>🇮🇳</span>

            <div>
              <strong>
                One Nation. Cleaner Communities.
              </strong>

              <small>
                ଗୋଟିଏ ଭାରତ • ସ୍ୱଚ୍ଛ ସମୁଦାୟ • ସୁନ୍ଦର ଭବିଷ୍ୟତ
              </small>
            </div>

          </div>


          <div className="hero-actions">

            <button
              type="button"
              className="primary-btn"
              onClick={startReport}
            >
              ♻️ Report a Waste Incident
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={openReportStatus}
            >
              📊 Track Report Status
            </button>

          </div>


          {/* =====================================================
              CORE PRINCIPLES
          ===================================================== */}

          <div className="hero-trust-row">

            <div className="trust-item">

              <span>🔐</span>

              <div>
                <strong>
                  Verified Citizens
                </strong>

                <small>
                  Email-based OTP verification
                </small>

                <em>
                  ଯାଞ୍ଚ ହୋଇଥିବା ନାଗରିକ
                </em>
              </div>

            </div>


            <div className="trust-item">

              <span>🧠</span>

              <div>
                <strong>
                  AI-Assisted Intelligence
                </strong>

                <small>
                  Structured waste assessment
                </small>

                <em>
                  AI ଆଧାରିତ ବିଶ୍ଳେଷଣ
                </em>
              </div>

            </div>


            <div className="trust-item">

              <span>📍</span>

              <div>
                <strong>
                  Real Indian Locations
                </strong>

                <small>
                  State, district, block & locality
                </small>

                <em>
                  ପ୍ରକୃତ ଘଟଣାସ୍ଥଳ
                </em>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INDIA WASTE INCIDENTS
      ===================================================== */}

      <section className="india-incidents-section">

        <div className="section-heading">

          <span className="small-green-heading">
            🇮🇳 INDIAN WASTE INCIDENTS
          </span>

          <h2 className="rainbow-heading">
            Report Real Problems
            <br />
            From Real Locations
          </h2>

          <p>
            SWACHHLENS focuses on real waste-related problems
            experienced across Indian communities, public
            spaces, roads, drains and residential areas.
          </p>

          <p className="odia-explanation">
            (ଭାରତର ବିଭିନ୍ନ ଅଞ୍ଚଳରେ ଦେଖାଯାଉଥିବା
            ପ୍ରକୃତ କଚରା ସମସ୍ୟାକୁ ଦାୟିତ୍ୱର ସହିତ
            ରିପୋର୍ଟ କରନ୍ତୁ।)
          </p>

        </div>


        <div className="india-waste-grid">

          <article className="india-waste-card">

            <span className="waste-card-icon">
              🗑️
            </span>

            <div className="waste-card-flag">
              🇮🇳
            </div>

            <h3>
              Roadside Garbage
            </h3>

            <p>
              Uncollected household or municipal waste
              accumulating beside roads and public areas.
            </p>

            <small>
              ରାସ୍ତା ପାଖରେ ଜମା ହୋଇଥିବା କଚରା
            </small>

          </article>


          <article className="india-waste-card">

            <span className="waste-card-icon">
              🧴
            </span>

            <div className="waste-card-flag">
              🇮🇳
            </div>

            <h3>
              Plastic Waste
            </h3>

            <p>
              Plastic bottles, bags, wrappers and other
              discarded plastic materials in public places.
            </p>

            <small>
              ପ୍ଲାଷ୍ଟିକ୍ ବୋତଲ, ବ୍ୟାଗ୍ ଓ ଅନ୍ୟାନ୍ୟ କଚରା
            </small>

          </article>


          <article className="india-waste-card">

            <span className="waste-card-icon">
              🚰
            </span>

            <div className="waste-card-flag">
              🇮🇳
            </div>

            <h3>
              Drain & Waterway Waste
            </h3>

            <p>
              Waste dumped near drains, canals, ponds and
              other water-connected public areas.
            </p>

            <small>
              ନାଳ, ପୋଖରୀ ଓ ଜଳପଥ ନିକଟରେ କଚରା
            </small>

          </article>


          <article className="india-waste-card">

            <span className="waste-card-icon">
              🏘️
            </span>

            <div className="waste-card-flag">
              🇮🇳
            </div>

            <h3>
              Community Waste
            </h3>

            <p>
              Waste accumulation affecting residential
              neighbourhoods and community spaces.
            </p>

            <small>
              ଆବାସିକ ଅଞ୍ଚଳ ଓ ସାଧାରଣ ସ୍ଥାନରେ କଚରା
            </small>

          </article>


          <article className="india-waste-card">

            <span className="waste-card-icon">
              🏪
            </span>

            <div className="waste-card-flag">
              🇮🇳
            </div>

            <h3>
              Market Area Waste
            </h3>

            <p>
              Waste generated around markets, shops,
              roadside vendors and busy public areas.
            </p>

            <small>
              ବଜାର ଓ ବ୍ୟବସାୟିକ ଅଞ୍ଚଳର କଚରା
            </small>

          </article>


          <article className="india-waste-card">

            <span className="waste-card-icon">
              ♻️
            </span>

            <div className="waste-card-flag">
              🇮🇳
            </div>

            <h3>
              Open Waste Dumping
            </h3>

            <p>
              Uncontrolled dumping of mixed waste in open
              spaces, vacant land or community areas.
            </p>

            <small>
              ଖୋଲା ସ୍ଥାନରେ ଅନିୟନ୍ତ୍ରିତ କଚରା ଫିଙ୍ଗିବା
            </small>

          </article>

        </div>

      </section>


      {/* =====================================================
          SWACHH BHARAT COLLABORATION
      ===================================================== */}

      <section className="swachh-bharat-section">

        <div className="swachh-bharat-card">

          <div className="swachh-bharat-visual">

            <div className="tricolor-wheel">
              <span>🇮🇳</span>
            </div>

            <div className="ashoka-ring">
              ♻️
            </div>

          </div>


          <div className="swachh-bharat-content">

            <span className="small-green-heading">
              🇮🇳 CLEAN INDIA COLLABORATION
            </span>

            <h2 className="rainbow-heading">
              SWACHHLENS
              <br />
              For a Cleaner Bharat
            </h2>

            <p>
              SWACHHLENS is designed around the idea of
              strengthening citizen participation in India's
              cleanliness and waste-response ecosystem through
              structured digital reporting and AI-assisted
              decision support.
            </p>

            <p className="odia-explanation">
              (ସ୍ୱଚ୍ଛ ଭାରତର ଲକ୍ଷ୍ୟକୁ ସମର୍ଥନ କରି
              ନାଗରିକଙ୍କ ଅଂଶଗ୍ରହଣ, ସଠିକ୍ ରିପୋର୍ଟିଂ
              ଏବଂ ବୁଦ୍ଧିମାନ ପ୍ରତିକ୍ରିୟାକୁ
              SWACHHLENS ଗୁରୁତ୍ୱ ଦିଏ।)
            </p>


            <div className="collaboration-points">

              <div>
                <span>🇮🇳</span>
                <strong>
                  Citizen Participation
                </strong>
                <small>
                  ନାଗରିକଙ୍କ ସକ୍ରିୟ ଅଂଶଗ୍ରହଣ
                </small>
              </div>


              <div>
                <span>♻️</span>
                <strong>
                  Responsible Reporting
                </strong>
                <small>
                  ଦାୟିତ୍ୱପୂର୍ଣ୍ଣ ରିପୋର୍ଟିଂ
                </small>
              </div>


              <div>
                <span>🤖</span>
                <strong>
                  Intelligent Response
                </strong>
                <small>
                  ବୁଦ୍ଧିମାନ ପ୍ରତିକ୍ରିୟା
                </small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          IMPORTANT REPORTING RULE
      ===================================================== */}

      <section className="home-warning-section">

        <div className="warning-card">

          <div className="warning-icon">
            ⚠️
          </div>

          <div className="warning-content">

            <span className="small-green-heading">
              IMPORTANT REPORTING RULE
            </span>

            <h2 className="rainbow-heading small-rainbow-heading">
              ONLY REAL WASTE INCIDENTS
            </h2>

            <p>
              SWACHHLENS should be used only to report a real
              waste incident or waste-related situation at an
              actual Indian location.
            </p>

            <p className="odia-explanation">
              (କେବଳ ପ୍ରକୃତ ଭାରତୀୟ ଘଟଣାସ୍ଥଳର
              କଚରା ସମସ୍ୟା ସମ୍ବନ୍ଧୀୟ ରିପୋର୍ଟ ଦିଅନ୍ତୁ।)
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          BEFORE YOU REPORT
      ===================================================== */}

      <section className="process-section">

        <div className="section-heading">

          <span className="small-green-heading">
            BEFORE YOU REPORT
          </span>

          <h2 className="rainbow-heading">
            Your Clean India
            <br />
            Reporting Journey
          </h2>

          <p>
            SWACHHLENS guides citizens step-by-step from
            identity verification to waste reporting,
            intelligent analysis and response tracking.
          </p>

          <p className="odia-explanation">
            (ନାଗରିକ ଯାଞ୍ଚରୁ ଆରମ୍ଭ କରି ରିପୋର୍ଟ,
            ବିଶ୍ଳେଷଣ ଏବଂ ପ୍ରତିକ୍ରିୟା ଟ୍ରାକିଂ
            ପର୍ଯ୍ୟନ୍ତ SWACHHLENS ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପରେ
            ନିର୍ଦ୍ଦେଶ ଦିଏ।)
          </p>

        </div>


        <div className="process-grid">

          {/* STEP 01 */}
          <article className="process-card india-step-card">

            <div className="process-number">
              01
            </div>

            <div className="process-icon">
              🛡️
            </div>

            <span className="small-green-heading">
              CITIZEN DETAILS
            </span>

            <h3>
              Verify Yourself
            </h3>

            <ul>
              <li>Indian citizenship confirmation</li>
              <li>Full name</li>
              <li>Email address</li>
              <li>Email OTP verification</li>
            </ul>

            <p className="odia-explanation">
              (ଭାରତୀୟ ନାଗରିକତା ନିଶ୍ଚିତ କରି
              ଇମେଲ୍ OTP ମାଧ୍ୟମରେ ଯାଞ୍ଚ କରାଯିବ।)
            </p>

          </article>


          {/* STEP 02 */}
          <article className="process-card india-step-card">

            <div className="process-number">
              02
            </div>

            <div className="process-icon">
              📋
            </div>

            <span className="small-green-heading">
              INCIDENT DETAILS
            </span>

            <h3>
              Describe the Waste Incident
            </h3>

            <ul>
              <li>Waste / incident type</li>
              <li>Incident description</li>
              <li>Address</li>
              <li>State and district</li>
              <li>Block</li>
              <li>Locality / village</li>
              <li>Incident location</li>
            </ul>

            <p className="odia-explanation">
              (କଚରାର ପ୍ରକାର, ଘଟଣାର ବିବରଣୀ
              ଏବଂ ଘଟଣାସ୍ଥଳର ଠିକଣା ଦିଅନ୍ତୁ।)
            </p>

          </article>


          {/* STEP 03 */}
          <article className="process-card india-step-card">

            <div className="process-number">
              03
            </div>

            <div className="process-icon">
              👤
            </div>

            <span className="small-green-heading">
              CITIZEN SITUATION
            </span>

            <h3>
              Tell Us About Your Situation
            </h3>

            <ul>
              <li>Are you near the incident location?</li>
              <li>Can you help with this incident?</li>
              <li>Since when are you facing this problem?</li>
              <li>Are you new to this area?</li>
              <li>Other useful situation details</li>
            </ul>

            <p className="odia-explanation">
              (ଆପଣଙ୍କ ପରିସ୍ଥିତି ଏବଂ ଘଟଣାର
              ପ୍ରଭାବ ସମ୍ବନ୍ଧରେ ଆବଶ୍ୟକ ସୂଚନା ଦିଅନ୍ତୁ।)
            </p>

          </article>


          {/* STEP 04 */}
          <article className="process-card india-step-card">

            <div className="process-number">
              04
            </div>

            <div className="process-icon">
              📍
            </div>

            <span className="small-green-heading">
              LOCATION & EVIDENCE
            </span>

            <h3>
              Support the Report
            </h3>

            <ul>
              <li>Incident location</li>
              <li>User-controlled GPS / location choice</li>
              <li>Waste image</li>
              <li>Additional evidence</li>
              <li>Additional useful information</li>
            </ul>

            <p className="odia-explanation">
              (ସ୍ଥାନ, GPS ସୂଚନା, କଚରାର ଫଟୋ
              ଏବଂ ଅନ୍ୟାନ୍ୟ ପ୍ରମାଣ ଦିଆଯାଇପାରିବ।)
            </p>

          </article>


          {/* STEP 05 */}
          <article className="process-card india-step-card">

            <div className="process-number">
              05
            </div>

            <div className="process-icon">
              ✅
            </div>

            <span className="small-green-heading">
              FINAL VERIFICATION
            </span>

            <h3>
              Review Before Submission
            </h3>

            <ul>
              <li>Review citizen information</li>
              <li>Review incident information</li>
              <li>Review location and evidence</li>
              <li>Confirm the incident</li>
              <li>Submit the report</li>
            </ul>

            <p className="odia-explanation">
              (ରିପୋର୍ଟ ପଠାଇବା ପୂର୍ବରୁ ସମସ୍ତ
              ସୂଚନା ଯାଞ୍ଚ କରି ନିଶ୍ଚିତ କରନ୍ତୁ।)
            </p>

          </article>


          {/* STEP 06 */}
          <article className="process-card india-step-card">

            <div className="process-number">
              06
            </div>

            <div className="process-icon">
              📊
            </div>

            <span className="small-green-heading">
              REPORT ANALYSIS & STATUS
            </span>

            <h3>
              Understand What Happens Next
            </h3>

            <ul>
              <li>Report submitted</li>
              <li>Report received</li>
              <li>AI-assisted assessment</li>
              <li>Risk / priority indication</li>
              <li>Response planning</li>
              <li>Cleanup progress</li>
              <li>Resolution / verification</li>
            </ul>

            <p className="odia-explanation">
              (ରିପୋର୍ଟ ପରେ ବିଶ୍ଳେଷଣ, ପ୍ରାଥମିକତା
              ଏବଂ ପ୍ରତିକ୍ରିୟାର ସ୍ଥିତି ଦେଖିପାରିବେ।)
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          HOW SWACHHLENS WORKS
      ===================================================== */}

      <section className="intelligence-section">

        <div className="section-heading">

          <span className="small-green-heading">
            HOW SWACHHLENS WORKS
          </span>

          <h2 className="rainbow-heading">
            From Indian Waste Report
            <br />
            To Intelligent Response
          </h2>

          <p>
            SWACHHLENS transforms citizen-reported waste
            information into structured intelligence that can
            support responsible response planning.
          </p>

          <p className="odia-explanation">
            (ନାଗରିକଙ୍କ ରିପୋର୍ଟକୁ ବିଶ୍ଳେଷଣ କରି
            ଉପଯୁକ୍ତ ପ୍ରତିକ୍ରିୟା ପାଇଁ ସୂଚନା
            ପ୍ରସ୍ତୁତ କରାଯାଏ।)
          </p>

        </div>


        <div className="intelligence-grid">

          <article className="intelligence-card">
            <span className="step-number">01</span>
            <div className="card-icon">📝</div>
            <h3>Report</h3>
            <p>
              A verified citizen submits a real waste incident
              from an actual location.
            </p>
            <p className="odia-explanation">
              (ପ୍ରକୃତ କଚରା ଘଟଣା ରିପୋର୍ଟ କରାଯାଏ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">02</span>
            <div className="card-icon">🧠</div>
            <h3>Analyze</h3>
            <p>
              Incident characteristics, evidence, location
              context and situation information are assessed.
            </p>
            <p className="odia-explanation">
              (ଘଟଣା, ପ୍ରମାଣ ଏବଂ ସ୍ଥାନକୁ ବିଶ୍ଳେଷଣ କରାଯାଏ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">03</span>
            <div className="card-icon">⚠️</div>
            <h3>Prioritize</h3>
            <p>
              Risk and urgency signals help identify incidents
              that may require greater attention.
            </p>
            <p className="odia-explanation">
              (ବିପଦ ଓ ଜରୁରୀକତା ଆଧାରରେ ପ୍ରାଥମିକତା ଆକଳନ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">04</span>
            <div className="card-icon">🚛</div>
            <h3>Respond</h3>
            <p>
              Actionable response recommendations can support
              appropriate waste-response planning.
            </p>
            <p className="odia-explanation">
              (ଉପଯୁକ୍ତ ପ୍ରତିକ୍ରିୟା ପାଇଁ ସୁପାରିଶ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">05</span>
            <div className="card-icon">📸</div>
            <h3>Verify</h3>
            <p>
              Response progress and resolution can be tracked
              with supporting verification information.
            </p>
            <p className="odia-explanation">
              (ପ୍ରତିକ୍ରିୟା ଓ ସମାଧାନକୁ ଟ୍ରାକ୍ ଏବଂ ଯାଞ୍ଚ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">06</span>
            <div className="card-icon">📈</div>
            <h3>Improve</h3>
            <p>
              Verified outcomes can provide useful feedback
              for better future waste-response decisions.
            </p>
            <p className="odia-explanation">
              (ପୂର୍ବ ଫଳାଫଳରୁ ଭବିଷ୍ୟତ ପାଇଁ ଶିଖା।)
            </p>
          </article>

        </div>

      </section>


      {/* =====================================================
          INDIA PRIVACY
      ===================================================== */}

      <section className="privacy-section">

        <div className="privacy-card">

          <div className="privacy-icon">
            🔐
          </div>

          <div className="privacy-content">

            <span className="small-green-heading">
              PRIVACY & DATA PROTECTION
            </span>

            <h2 className="rainbow-heading">
              Responsible Citizen Data
            </h2>

            <p>
              Citizen information should be handled responsibly.
              Personal details should not become publicly exposed
              simply because a citizen reported a waste incident.
            </p>

            <p className="odia-explanation">
              (କଚରା ରିପୋର୍ଟ କରିବା ପାଇଁ ଦିଆଯାଇଥିବା
              ନାଗରିକଙ୍କ ବ୍ୟକ୍ତିଗତ ସୂଚନାକୁ ଦାୟିତ୍ୱର
              ସହିତ ସୁରକ୍ଷିତ ରଖିବା ଆବଶ୍ୟକ।)
            </p>


            <div className="privacy-points">

              <div>
                <span>✓</span>
                <strong>
                  Verified access
                </strong>
                <p>
                  Email verification helps establish
                  a verified reporting identity.
                </p>
              </div>


              <div>
                <span>✓</span>
                <strong>
                  Protected personal information
                </strong>
                <p>
                  Citizen details should not be publicly displayed.
                </p>
              </div>


              <div>
                <span>✓</span>
                <strong>
                  Incident-focused information
                </strong>
                <p>
                  Information is collected around the
                  reported waste incident.
                </p>
              </div>


              <div>
                <span>✓</span>
                <strong>
                  Responsible authority access
                </strong>
                <p>
                  Authority-facing information should be
                  available only to appropriate users.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT SWACHHLENS PROVIDES
      ===================================================== */}

      <section className="services-section">

        <div className="section-heading">

          <span className="small-green-heading">
            ♻️ WHAT SWACHHLENS PROVIDES
          </span>

          <h2 className="rainbow-heading">
            More Than Waste Reporting
          </h2>

          <p>
            SWACHHLENS connects citizen reporting with
            intelligence, response tracking and responsible
            authority interaction.
          </p>

          <p className="odia-explanation">
            (ରିପୋର୍ଟିଂ ସହିତ ବିଶ୍ଳେଷଣ, ପ୍ରତିକ୍ରିୟା
            ଏବଂ ଟ୍ରାକିଂକୁ ଏକାଠି କରିବା SWACHHLENS ର ଲକ୍ଷ୍ୟ।)
          </p>

        </div>


        <div className="service-grid">

          <div className="service-card">
            <span>🤖</span>
            <h3>AI Risk Intelligence</h3>
            <p>
              Understand the potential seriousness of a
              reported waste incident.
            </p>
          </div>


          <div className="service-card">
            <span>🎯</span>
            <h3>Priority Decision</h3>
            <p>
              Help identify incidents that may require
              faster attention.
            </p>
          </div>


          <div className="service-card">
            <span>📊</span>
            <h3>Report Tracking</h3>
            <p>
              Follow the progress of a submitted waste incident.
            </p>
          </div>


          <div className="service-card">
            <span>🏛️</span>
            <h3>Authority Connection</h3>
            <p>
              Connect relevant incidents with appropriate
              response organizations.
            </p>
          </div>


          <div className="service-card">
            <span>📸</span>
            <h3>Cleanup Verification</h3>
            <p>
              Support verification of the reported waste
              situation and response.
            </p>
          </div>


          <div className="service-card">
            <span>📅</span>
            <h3>Authority Appointment</h3>
            <p>
              Request an appointment when direct authority
              interaction is needed.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          RESPONSIBILITY
      ===================================================== */}

      <section className="responsibility-section">

        <div className="responsibility-grid">

          <article className="responsibility-card citizen-responsibility">

            <span className="small-green-heading">
              🇮🇳 CITIZEN RESPONSIBILITY
            </span>

            <h2 className="rainbow-heading">
              Report Responsibly
            </h2>

            <ul>
              <li>Report only real waste incidents.</li>
              <li>Provide truthful information.</li>
              <li>Upload clear evidence when available.</li>
              <li>Do not submit false or misleading reports.</li>
              <li>Respect the privacy of other people.</li>
            </ul>

            <p className="odia-explanation">
              (ସଠିକ୍ ଏବଂ ପ୍ରକୃତ ସୂଚନା ଦେଇ
              ଦାୟିତ୍ୱର ସହିତ ରିପୋର୍ଟ କରନ୍ତୁ।)
            </p>

          </article>


          <article className="responsibility-card swachhlens-responsibility">

            <span className="small-green-heading">
              ♻️ SWACHHLENS RESPONSIBILITY
            </span>

            <h2 className="rainbow-heading">
              Protect & Assist
            </h2>

            <ul>
              <li>Protect citizen-facing information.</li>
              <li>Provide explainable intelligence.</li>
              <li>Show report progress clearly.</li>
              <li>Support responsible authority interaction.</li>
              <li>Keep the reporting process transparent.</li>
            </ul>

            <p className="odia-explanation">
              (ନାଗରିକଙ୍କ ସୂଚନାକୁ ସୁରକ୍ଷା ଦେବା,
              ପ୍ରକ୍ରିୟାକୁ ସ୍ପଷ୍ଟ ରଖିବା ଏବଂ
              ଉପଯୁକ୍ତ ସହାୟତା ଦେବା SWACHHLENS ର ଦାୟିତ୍ୱ।)
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          INDIA CLEAN FUTURE
      ===================================================== */}

      <section className="india-future-section">

        <div className="india-future-card">

          <div className="future-emblem">
            🇮🇳
          </div>

          <div>

            <span className="small-green-heading">
              OUR CLEAN INDIA VISION
            </span>

            <h2 className="rainbow-heading">
              Technology For
              <br />
              Cleaner Communities
            </h2>

            <p>
              Every genuine report can become useful information.
              Every useful piece of information can support better
              decisions. And better decisions can contribute to
              cleaner communities across India.
            </p>

            <p className="odia-explanation">
              (ପ୍ରତ୍ୟେକ ପ୍ରକୃତ ରିପୋର୍ଟ ଉପଯୋଗୀ ସୂଚନାରେ,
              ଉପଯୋଗୀ ସୂଚନା ଭଲ ନିଷ୍ପତ୍ତିରେ ଏବଂ ଭଲ
              ନିଷ୍ପତ୍ତି ସ୍ୱଚ୍ଛ ସମୁଦାୟ ଗଠନରେ ସାହାଯ୍ୟ
              କରିପାରେ।)
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="cta-section">

        <div className="cta-card">

          <div className="cta-india-mark">
            🇮🇳
          </div>

          <span className="small-green-heading">
            READY TO REPORT?
          </span>

          <h2 className="rainbow-heading">
            Help Make
            <br />
            Your Community Cleaner
          </h2>

          <p>
            Your reporting journey begins with citizen details
            and email verification. SWACHHLENS will then guide
            you step-by-step through the waste incident,
            situation, location, evidence and final verification.
          </p>

          <p className="odia-explanation">
            (ଆପଣଙ୍କ ରିପୋର୍ଟିଂ ପ୍ରକ୍ରିୟା ନାଗରିକ ବିବରଣୀ
            ଏବଂ ଇମେଲ୍ ଯାଞ୍ଚରୁ ଆରମ୍ଭ ହେବ। ପରେ ପ୍ରତ୍ୟେକ
            ପଦକ୍ଷେପରେ SWACHHLENS ଆପଣଙ୍କୁ ନିର୍ଦ୍ଦେଶ ଦେବ।)
          </p>


          <button
            type="button"
            className="primary-btn cta-button"
            onClick={startReport}
          >
            👤 Begin Citizen Verification
          </button>


          <small className="cta-note">
            🔒 Step-by-step reporting • 🇮🇳 Clean India • ♻️ SWACHHLENS
          </small>

        </div>

      </section>


    </main>
  );
}

export default Home;