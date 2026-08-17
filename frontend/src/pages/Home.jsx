
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
    <main>

      {/* =====================================================
          HERO
      ===================================================== */}


      <section className="home-hero">


        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>
        <div className="hero-glow hero-glow-three"></div>


        <div className="hero-content">


          <span className="hero-eyebrow">
            ♻️ AI-POWERED WASTE RESPONSE
          </span>


          <h1 className="rainbow-heading">
            Waste Problems.
            <br />
            <span>Intelligent Solutions.</span>
          </h1>


          <p className="hero-description">
            SWACHHLENS transforms a citizen's waste incident
            report into structured, explainable and actionable
            waste-response intelligence.
          </p>


          <p className="odia-explanation">
            (କଚରା ସମ୍ବନ୍ଧୀୟ ଘଟଣାକୁ ରିପୋର୍ଟ କରିବା ପରେ
            SWACHHLENS ତାହାକୁ ବିଶ୍ଳେଷଣ କରି ଉପଯୁକ୍ତ
            ପଦକ୍ଷେପ ପାଇଁ ସୂଚନା ଦେଇଥାଏ।)
          </p>


          <div className="hero-actions">


            {/* START REPORT */}
            <button
              type="button"
              className="primary-btn"
              onClick={startReport}
            >
              ♻️ Report a Waste Incident
            </button>


            {/* TRACK REPORT */}
            <button
              type="button"
              className="secondary-btn"
              onClick={openReportStatus}
            >
              📊 Track Report Status
            </button>


          </div>


          {/* TRUST / CORE PRINCIPLES */}


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


              </div>


            </div>



            <div className="trust-item">


              <span>🧠</span>


              <div>


                <strong>
                  Explainable Intelligence
                </strong>


                <small>
                  Understand how incidents are assessed
                </small>


              </div>


            </div>



            <div className="trust-item">


              <span>📍</span>


              <div>


                <strong>
                  Incident-Based Reporting
                </strong>


                <small>
                  Focused on real waste locations
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


            <span className="small-blue-heading">
              IMPORTANT REPORTING RULE
            </span>


            <h2 className="rainbow-heading small-rainbow-heading">
              ONLY REAL WASTE INCIDENTS
            </h2>


            <p>
              SWACHHLENS should be used only to report a real
              waste incident or waste-related situation at an
              actual location.
            </p>


            <p className="odia-explanation">
              (କେବଳ ପ୍ରକୃତ କଚରା ଘଟଣାସ୍ଥଳ କିମ୍ବା କଚରା
              ସମସ୍ୟା ସମ୍ବନ୍ଧୀୟ ରିପୋର୍ଟ ଦିଅନ୍ତୁ।)
            </p>


          </div>


        </div>


      </section>



      {/* =====================================================
          BEFORE YOU REPORT
      ===================================================== */}


      <section className="process-section">


        <div className="section-heading">


          <span className="small-blue-heading">
            BEFORE YOU REPORT
          </span>


          <h2 className="rainbow-heading">
            Know What You Will Need
          </h2>


          <p>
            SWACHHLENS guides you through every stage of the
            reporting journey. You do not need to understand
            the complete process before starting.
          </p>


          <p className="odia-explanation">
            (ରିପୋର୍ଟିଂ ପ୍ରକ୍ରିୟାର ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପରେ
            SWACHHLENS ଆପଣଙ୍କୁ ନିର୍ଦ୍ଦେଶ ଦେବ।)
          </p>


        </div>



        <div className="process-grid">


          {/* STEP 01 */}
          <article className="process-card">
            <div className="process-number">01</div>
            <div className="process-icon">🛡️</div>
            <span className="small-blue-heading">
              CITIZEN DETAILS
            </span>
            <h3>Verify Yourself</h3>
            <ul>
              <li>Indian citizenship confirmation</li>
              <li>Full name</li>
              <li>Email address</li>
              <li>Email OTP verification</li>
            </ul>
            <p className="odia-explanation">
              (ଭାରତୀୟ ନାଗରିକତା ନିଶ୍ଚିତ କରି
              ଇମେଲ୍ OTP ମାଧ୍ୟମରେ ନାଗରିକଙ୍କ
              ଇମେଲ୍ ଯାଞ୍ଚ କରାଯିବ।)
            </p>
          </article>



          {/* STEP 02 */}
          <article className="process-card">
            <div className="process-number">02</div>
            <div className="process-icon">📋</div>
            <span className="small-blue-heading">
              INCIDENT DETAILS
            </span>
            <h3>Describe the Waste Incident</h3>
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
              (କଚରାର ପ୍ରକାର, ଘଟଣାର ବିବରଣୀ ଏବଂ
              ଘଟଣାସ୍ଥଳ ସମ୍ବନ୍ଧୀୟ ଠିକଣା ଦେବାକୁ ପଡିବ।)
            </p>
          </article>



          {/* STEP 03 */}
          <article className="process-card">
            <div className="process-number">03</div>
            <div className="process-icon">👤</div>
            <span className="small-blue-heading">
              CITIZEN SITUATION
            </span>
            <h3>Tell Us About Your Situation</h3>
            <ul>
              <li>Are you near the incident location?</li>
              <li>Can you help with this incident?</li>
              <li>Since when are you facing this problem?</li>
              <li>Are you new to this area?</li>
              <li>Other useful situation details</li>
            </ul>
            <p className="odia-explanation">
              (ଆପଣ ଘଟଣାସ୍ଥଳ ନିକଟରେ ଅଛନ୍ତି କି,
              କେତେ ଦିନ ହେଲା ସମସ୍ୟା ଦେଖୁଛନ୍ତି
              ଏବଂ ସାହାଯ୍ୟ କରିପାରିବେ କି ସେ
              ବିଷୟରେ ପଚରାଯିବ।)
            </p>
          </article>



          {/* STEP 04 */}
          <article className="process-card">
            <div className="process-number">04</div>
            <div className="process-icon">📍</div>
            <span className="small-blue-heading">
              LOCATION & EVIDENCE
            </span>
            <h3>Support the Report</h3>
            <ul>
              <li>Incident location</li>
              <li>User-controlled GPS / location choice</li>
              <li>Waste image</li>
              <li>Additional evidence</li>
              <li>Additional useful information</li>
            </ul>
            <p className="odia-explanation">
              (ଘଟଣାସ୍ଥଳର ସ୍ଥାନ, GPS ସୂଚନା,
              କଚରାର ଫଟୋ ଏବଂ ଅତିରିକ୍ତ
              ପ୍ରମାଣ ଦିଆଯାଇପାରିବ।)
            </p>
          </article>



          {/* STEP 05 */}
          <article className="process-card">
            <div className="process-number">05</div>
            <div className="process-icon">✅</div>
            <span className="small-blue-heading">
              FINAL VERIFICATION
            </span>
            <h3>Review Before Submission</h3>
            <ul>
              <li>Review citizen information</li>
              <li>Review incident information</li>
              <li>Review location and evidence</li>
              <li>Confirm the incident</li>
              <li>Submit the report</li>
            </ul>
            <p className="odia-explanation">
              (ରିପୋର୍ଟ ପଠାଇବା ପୂର୍ବରୁ ସମସ୍ତ ସୂଚନା
              ଯାଞ୍ଚ କରି ନିଶ୍ଚିତ କରିବାକୁ ପଡିବ।)
            </p>
          </article>



          {/* STEP 06 */}
          <article className="process-card">
            <div className="process-number">06</div>
            <div className="process-icon">📊</div>
            <span className="small-blue-heading">
              REPORT ANALYSIS & STATUS
            </span>
            <h3>Understand What Happens Next</h3>
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
              (ରିପୋର୍ଟ ପଠାଇବା ପରେ ଏହାର ବିଶ୍ଳେଷଣ,
              ପ୍ରାଥମିକତା ଏବଂ ପ୍ରତିକ୍ରିୟାର ସ୍ଥିତି
              ଦେଖାଯାଇପାରିବ।)
            </p>
          </article>


        </div>


      </section>



      {/* =====================================================
          HOW SWACHHLENS WORKS
      ===================================================== */}


      <section className="intelligence-section">


        <div className="section-heading">


          <span className="small-blue-heading">
            HOW SWACHHLENS WORKS
          </span>


          <h2 className="rainbow-heading">
            From Waste Report
            <br />
            To Intelligent Response
          </h2>


          <p>
            SWACHHLENS follows a structured process to transform
            a reported waste incident into useful response
            intelligence.
          </p>


          <p className="odia-explanation">
            (ରିପୋର୍ଟ ହୋଇଥିବା କଚରା ଘଟଣାକୁ ଏକ ନିର୍ଦ୍ଦିଷ୍ଟ
            ପ୍ରକ୍ରିୟାରେ ବିଶ୍ଳେଷଣ କରି ପ୍ରତିକ୍ରିୟା ପାଇଁ
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
              with relevant information and evidence.
            </p>
            <p className="odia-explanation">
              (ଯାଞ୍ଚ ହୋଇଥିବା ନାଗରିକ ପ୍ରକୃତ କଚରା
              ଘଟଣା ରିପୋର୍ଟ କରନ୍ତି।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">02</span>
            <div className="card-icon">🧠</div>
            <h3>Analyze</h3>
            <p>
              Incident characteristics, location context,
              evidence and situation information are assessed.
            </p>
            <p className="odia-explanation">
              (ଘଟଣାର ପ୍ରକାର, ସ୍ଥାନ, ପ୍ରମାଣ ଏବଂ
              ପରିସ୍ଥିତି ସୂଚନାକୁ ବିଶ୍ଳେଷଣ କରାଯାଏ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">03</span>
            <div className="card-icon">⚠️</div>
            <h3>Prioritize</h3>
            <p>
              Risk and urgency signals can help indicate which
              incidents may require greater attention.
            </p>
            <p className="odia-explanation">
              (ବିପଦ ଏବଂ ଜରୁରୀକତା ଆଧାରରେ କେଉଁ ଘଟଣାକୁ
              ଅଧିକ ଗୁରୁତ୍ୱ ଦିଆଯିବ ତାହା ଆକଳନ କରାଯାଏ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">04</span>
            <div className="card-icon">🚛</div>
            <h3>Respond</h3>
            <p>
              The system can provide an actionable response
              recommendation based on the incident assessment.
            </p>
            <p className="odia-explanation">
              (ଘଟଣାର ବିଶ୍ଳେଷଣ ଆଧାରରେ ଉପଯୁକ୍ତ
              ପ୍ରତିକ୍ରିୟା ପାଇଁ ସୁପାରିଶ ଦିଆଯାଇପାରେ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">05</span>
            <div className="card-icon">📸</div>
            <h3>Verify</h3>
            <p>
              Response progress and final resolution can be
              tracked and supported with verification evidence.
            </p>
            <p className="odia-explanation">
              (ପ୍ରତିକ୍ରିୟାର ପ୍ରଗତି ଏବଂ ଶେଷ ଫଳାଫଳକୁ
              ଟ୍ରାକ୍ ଓ ଯାଞ୍ଚ କରାଯାଇପାରେ।)
            </p>
          </article>


          <article className="intelligence-card">
            <span className="step-number">06</span>
            <div className="card-icon">📈</div>
            <h3>Improve</h3>
            <p>
              Verified outcomes can provide useful feedback for
              improving future waste-response decisions.
            </p>
            <p className="odia-explanation">
              (ପୂର୍ବ ଫଳାଫଳରୁ ଭବିଷ୍ୟତରେ ଭଲ ପଦକ୍ଷେପ
              ନେବା ପାଇଁ ଶିଖା ମିଳିପାରେ।)
            </p>
          </article>


        </div>


      </section>



      {/* =====================================================
          PRIVACY
      ===================================================== */}


      <section className="privacy-section">


        <div className="privacy-card">


          <div className="privacy-icon">
            🔐
          </div>


          <div className="privacy-content">


            <span className="small-blue-heading">
              PRIVACY & DATA PROTECTION
            </span>


            <h2 className="rainbow-heading">
              Your Data Deserves Protection
            </h2>


            <p>
              SWACHHLENS is designed to handle citizen
              information responsibly. Personal information
              should not become publicly exposed simply because
              someone submitted a waste incident.
            </p>


            <p className="odia-explanation">
              (ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସୂଚନାକୁ ସୁରକ୍ଷିତ ଏବଂ
              ଦାୟିତ୍ୱର ସହିତ ବ୍ୟବହାର କରିବା SWACHHLENS ର
              ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଦାୟିତ୍ୱ।)
            </p>


            <div className="privacy-points">


              <div>
                <span>✓</span>
                <strong>
                  Verified access
                </strong>
                <p>
                  Email verification helps establish a
                  verified reporting identity.
                </p>
              </div>


              <div>
                <span>✓</span>
                <strong>
                  Protected personal information
                </strong>
                <p>
                  Citizen details should not be publicly
                  displayed.
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
                  Responsible access
                </strong>
                <p>
                  Authority-facing information should be
                  available only to appropriate authorized users.
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


          <span className="small-blue-heading">
            WHAT SWACHHLENS PROVIDES
          </span>


          <h2 className="rainbow-heading">
            More Than Waste Reporting
          </h2>


          <p>
            SWACHHLENS is designed to connect citizen reporting
            with intelligence, response tracking and responsible
            authority interaction.
          </p>


        </div>



        <div className="service-grid">


          <div className="service-card">
            <span>🤖</span>
            <h3>Risk Intelligence</h3>
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
              Follow the progress of your submitted
              waste incident.
            </p>
          </div>


          <div className="service-card">
            <span>🏛️</span>
            <h3>Authority Connection</h3>
            <p>
              Connect relevant incidents with appropriate
              response authorities.
            </p>
          </div>


          <div className="service-card">
            <span>📸</span>
            <h3>Cleanup Verification</h3>
            <p>
              Support verification of the reported
              waste situation and response.
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


            <span className="small-blue-heading">
              CITIZEN RESPONSIBILITY
            </span>


            <h2 className="rainbow-heading">
              Report Responsibly
            </h2>


            <ul>


              <li>
                Report only real waste incidents.
              </li>


              <li>
                Provide truthful information.
              </li>


              <li>
                Upload clear evidence when available.
              </li>


              <li>
                Do not submit false or misleading reports.
              </li>


              <li>
                Respect the privacy of other people.
              </li>


            </ul>


            <p className="odia-explanation">
              (ସଠିକ୍ ଏବଂ ପ୍ରକୃତ ସୂଚନା ଦେଇ ଦାୟିତ୍ୱର
              ସହିତ ରିପୋର୍ଟ କରନ୍ତୁ।)
            </p>


          </article>



          <article className="responsibility-card swachhlens-responsibility">


            <span className="small-blue-heading">
              SWACHHLENS RESPONSIBILITY
            </span>


            <h2 className="rainbow-heading">
              Protect & Assist
            </h2>


            <ul>


              <li>
                Protect citizen-facing information.
              </li>


              <li>
                Provide explainable intelligence.
              </li>


              <li>
                Show report progress clearly.
              </li>


              <li>
                Support responsible authority interaction.
              </li>


              <li>
                Keep the reporting process transparent.
              </li>


            </ul>


            <p className="odia-explanation">
              (ନାଗରିକଙ୍କ ସୂଚନାକୁ ସୁରକ୍ଷା ଦେବା,
              ପ୍ରକ୍ରିୟାକୁ ସ୍ପଷ୍ଟ ରଖିବା ଏବଂ ଉପଯୁକ୍ତ
              ସହାୟତା ଦେବା SWACHHLENS ର ଦାୟିତ୍ୱ।)
            </p>


          </article>


        </div>


      </section>



      {/* =====================================================
          FINAL CTA
      ===================================================== */}


      <section className="cta-section">


        <div className="cta-card">


          <span className="small-blue-heading">
            READY TO REPORT?
          </span>


          <h2 className="rainbow-heading">
            Start With
            <br />
            Citizen Details
          </h2>


          <p>
            Your reporting journey begins with citizen
            details and email verification. SWACHHLENS will
            then guide you step-by-step through the incident,
            citizen situation, location, evidence and final
            verification stages.
          </p>


          <p className="odia-explanation">
            (ଆପଣଙ୍କ ରିପୋର୍ଟିଂ ପ୍ରକ୍ରିୟା ପ୍ରଥମେ ନାଗରିକ
            ବିବରଣୀ ଏବଂ ଇମେଲ୍ ଯାଞ୍ଚରୁ ଆରମ୍ଭ ହେବ।
            ପରେ ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପରେ ଆପଣଙ୍କୁ
            ନିର୍ଦ୍ଦେଶ ମିଳିବ।)
          </p>


          <button
            type="button"
            className="primary-btn cta-button"
            onClick={startReport}
          >
            👤 Begin Citizen Verification
          </button>


          <small className="cta-note">
            🔒 Your reporting journey is step-by-step.
          </small>


        </div>


      </section>


    </main>
  );
}


export default Home;
