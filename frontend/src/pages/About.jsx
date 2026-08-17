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
          SWACHHLENS is an AI-powered Waste Response Decision
          Support System designed to transform citizen waste
          complaints into structured, verified and actionable
          waste-response information.
        </p>

        <p className="about-intro secondary">
          From citizen verification and evidence collection to
          AI analysis, organization recommendation, appointment
          support and administrative monitoring, SWACHHLENS creates
          a complete digital waste-response journey.
        </p>

        <div className="about-hero-flow">
          <span>Report</span>
          <b>→</b>
          <span>Understand</span>
          <b>→</b>
          <span>Analyze</span>
          <b>→</b>
          <span>Respond</span>
        </div>

        <p className="about-odia-hero">
          ରିପୋର୍ଟ କରନ୍ତୁ → ବୁଝନ୍ତୁ → ବିଶ୍ଳେଷଣ କରନ୍ତୁ → ପ୍ରତିକ୍ରିୟା କରନ୍ତୁ
        </p>

      </section>


      {/* =====================================================
          WHAT SWACHHLENS PROVIDES
      ===================================================== */}
      <section className="about-section">

        <div className="section-heading-block">

          <span className="section-kicker">
            PLATFORM CAPABILITIES
          </span>

          <h2 className="about-section-title">
            What SWACHHLENS Provides
          </h2>

          <p className="about-section-description">
            SWACHHLENS combines citizen reporting, verification,
            location intelligence, evidence, AI analysis and
            response coordination into one structured platform.
          </p>

          <p className="about-odia-description">
            SWACHHLENS ନାଗରିକ ରିପୋର୍ଟ, ପରିଚୟ ଯାଞ୍ଚ, ସ୍ଥାନ ସୂଚନା,
            ପ୍ରମାଣ, AI ବିଶ୍ଳେଷଣ ଏବଂ ପ୍ରତିକ୍ରିୟା ପରିଚାଳନାକୁ
            ଏକ ସଂଗଠିତ ପ୍ଲାଟଫର୍ମରେ ଏକତ୍ର କରେ।
          </p>

        </div>


        <div className="features-grid">

          <article className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Citizen Registration</h3>
            <p>
              Citizens begin the reporting journey by providing
              their basic details before submitting a waste report.
            </p>
            <span className="feature-odia">
              ନାଗରିକ ନିଜର ମୌଳିକ ସୂଚନା ଦେଇ ରିପୋର୍ଟିଂ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତି।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Email OTP Verification</h3>
            <p>
              Email OTP verification helps ensure that reports
              are connected with a verified citizen identity.
            </p>
            <span className="feature-odia">
              Email OTP ଦ୍ୱାରା ନାଗରିକଙ୍କ ପରିଚୟ ଯାଞ୍ଚ କରାଯାଏ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Incident Details</h3>
            <p>
              Citizens provide structured information about the
              reported waste incident and its surrounding situation.
            </p>
            <span className="feature-odia">
              ନାଗରିକ ରିପୋର୍ଟ କରୁଥିବା ଅବସ୍ଥା ବିଷୟରେ ସଂଗଠିତ ସୂଚନା ଦିଅନ୍ତି।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🏘️</div>
            <h3>Citizen Situation</h3>
            <p>
              Situation-based questions help understand the
              impact of waste on citizens, public spaces and safety.
            </p>
            <span className="feature-odia">
              ଆବର୍ଜନା ନାଗରିକ ଏବଂ ସାଧାରଣ ସ୍ଥାନକୁ କିପରି ପ୍ରଭାବିତ କରୁଛି
              ତାହା ବୁଝିବାରେ ଏହା ସାହାଯ୍ୟ କରେ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location Intelligence</h3>
            <p>
              Reports can use structured state, district, block,
              village and GPS-based location information.
            </p>
            <span className="feature-odia">
              State, District, Block, Village ଏବଂ GPS ଆଧାରିତ ସ୍ଥାନ ସୂଚନା
              ବ୍ୟବହାର କରାଯାଇପାରେ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Evidence Collection</h3>
            <p>
              Citizens can upload photographic evidence of the
              reported waste situation.
            </p>
            <span className="feature-odia">
              ନାଗରିକ ରିପୋର୍ଟ ହୋଇଥିବା ଆବର୍ଜନାର ଫଟୋ ପ୍ରମାଣ ଦେଇପାରନ୍ତି।
            </span>
          </article>


          <article className="feature-card ai-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Waste Analysis</h3>
            <p>
              AI-powered analysis helps determine whether the
              uploaded evidence represents a waste-related issue
              and analyzes important risk characteristics.
            </p>
            <span className="feature-odia">
              AI ଅପଲୋଡ୍ ହୋଇଥିବା ପ୍ରମାଣକୁ ବିଶ୍ଳେଷଣ କରି ଆବର୍ଜନା ସମ୍ବନ୍ଧୀୟ
              ସମସ୍ୟା ଏବଂ ଏହାର ଗୁରୁତ୍ୱ ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>Risk & Priority Assessment</h3>
            <p>
              AI analysis can support severity, risk and priority
              assessment so important cases can receive attention.
            </p>
            <span className="feature-odia">
              ଗୁରୁତ୍ୱ, ଝୁମ୍ପ ଏବଂ ପ୍ରାଥମିକତା ଆଧାରରେ ମାମଲାକୁ ବୁଝିବାରେ
              ସିଷ୍ଟମ୍ ସାହାଯ୍ୟ କରେ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🆔</div>
            <h3>Unique Report ID</h3>
            <p>
              Every successfully created waste report receives
              a structured Report ID for future tracking.
            </p>
            <span className="feature-odia">
              ପ୍ରତ୍ୟେକ ସଫଳ ରିପୋର୍ଟକୁ ଏକ ବିଶିଷ୍ଟ Report ID ଦିଆଯାଏ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Report Status</h3>
            <p>
              Citizens can use their report information to
              understand the progress and response status.
            </p>
            <span className="feature-odia">
              ନାଗରିକ ନିଜ ରିପୋର୍ଟର ସ୍ଥିତି ଏବଂ ପ୍ରଗତି ବୁଝିପାରନ୍ତି।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🏛️</div>
            <h3>Organization Recommendation</h3>
            <p>
              The Response Center can use report and location
              information to suggest suitable response organizations.
            </p>
            <span className="feature-odia">
              ରିପୋର୍ଟ ଏବଂ ସ୍ଥାନ ଆଧାରରେ ଉପଯୁକ୍ତ ସଂଗଠନ ସୁପାରିଶ କରାଯାଏ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">☑️</div>
            <h3>Organization Selection</h3>
            <p>
              The citizen or authorized user selects exactly one
              organization for the next response step.
            </p>
            <span className="feature-odia">
              ପରବର୍ତ୍ତୀ ପ୍ରତିକ୍ରିୟା ପାଇଁ ଠିକ୍ ଗୋଟିଏ ସଂଗଠନ ଚୟନ କରାଯାଏ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Feedback & Reason</h3>
            <p>
              Users can provide feedback or explain why the
              selected organization was chosen.
            </p>
            <span className="feature-odia">
              ଚୟନ କରାଯାଇଥିବା ସଂଗଠନ ବିଷୟରେ କାରଣ ଏବଂ Feedback ଦିଆଯାଇପାରେ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Appointment Support</h3>
            <p>
              Users can optionally request an appointment with
              the same selected organization.
            </p>
            <span className="feature-odia">
              ସେହି ଚୟନ କରାଯାଇଥିବା ସଂଗଠନ ସହିତ Appointment ଅନୁରୋଧ କରାଯାଇପାରେ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📨</div>
            <h3>Final Submission</h3>
            <p>
              After selecting the organization and providing
              optional feedback or appointment information,
              the final response request is submitted.
            </p>
            <span className="feature-odia">
              ସଂଗଠନ ଚୟନ ଏବଂ ଆବଶ୍ୟକ ସୂଚନା ପରେ Final Submit କରାଯାଏ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Organization Communication</h3>
            <p>
              The submitted response request can be processed
              for communication with the selected organization.
            </p>
            <span className="feature-odia">
              ଚୟନ କରାଯାଇଥିବା ସଂଗଠନ ସହିତ ଯୋଗାଯୋଗ ପାଇଁ
              Response Request ପ୍ରକ୍ରିୟା କରାଯାଏ।
            </span>
          </article>


          <article className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Admin Response Center</h3>
            <p>
              Authorized administrators can monitor submitted
              response requests, organizations, appointments,
              feedback and communication status.
            </p>
            <span className="feature-odia">
              Authorized Admin Response Request, Organization,
              Appointment, Feedback ଏବଂ Communication Status ଦେଖିପାରନ୍ତି।
            </span>
          </article>

        </div>

      </section>


      {/* =====================================================
          COMPLETE ROADMAP
      ===================================================== */}
      <section className="about-section roadmap-section">

        <div className="section-heading-block">

          <span className="section-kicker">
            COMPLETE PLATFORM JOURNEY
          </span>

          <h2 className="about-section-title">
            SWACHHLENS Roadmap
          </h2>

          <p className="about-section-description">
            The complete SWACHHLENS journey is designed as a
            controlled sequence where every important stage builds
            on the information collected in the previous stage.
          </p>

          <p className="about-odia-description">
            SWACHHLENS ର ସମ୍ପୂର୍ଣ୍ଣ ଯାତ୍ରା ଏକ କ୍ରମବଦ୍ଧ ପ୍ରକ୍ରିୟା,
            ଯେଉଁଠାରେ ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପ ପୂର୍ବ ପଦକ୍ଷେପର ସୂଚନା ଉପରେ
            ନିର୍ଭର କରେ।
          </p>

        </div>


        <div className="roadmap">

          <div className="roadmap-line"></div>


          <article className="roadmap-step">

            <div className="roadmap-number">01</div>

            <div className="roadmap-card">

              <span>START</span>

              <h3>🏠 Home</h3>

              <p>
                Citizens enter SWACHHLENS and begin the
                structured waste-reporting journey.
              </p>

              <p className="roadmap-odia">
                ନାଗରିକ SWACHHLENS ରେ ପ୍ରବେଶ କରି ରିପୋର୍ଟିଂ ଯାତ୍ରା
                ଆରମ୍ଭ କରନ୍ତି।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">02</div>

            <div className="roadmap-card">

              <span>IDENTITY</span>

              <h3>👤 Citizen Details</h3>

              <p>
                Citizen information is collected before the
                reporting process continues.
              </p>

              <p className="roadmap-odia">
                ରିପୋର୍ଟିଂ ପୂର୍ବରୁ ନାଗରିକଙ୍କ ଆବଶ୍ୟକ ସୂଚନା ସଂଗ୍ରହ କରାଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">03</div>

            <div className="roadmap-card">

              <span>VERIFICATION</span>

              <h3>📧 Email OTP Verification</h3>

              <p>
                The citizen verifies their email using an OTP
                before continuing.
              </p>

              <p className="roadmap-odia">
                ନାଗରିକ OTP ଦ୍ୱାରା ନିଜ Email ଯାଞ୍ଚ କରନ୍ତି।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">04</div>

            <div className="roadmap-card">

              <span>INCIDENT</span>

              <h3>📝 Incident Details</h3>

              <p>
                The citizen provides information about the
                waste incident and its situation.
              </p>

              <p className="roadmap-odia">
                ଆବର୍ଜନା ଘଟଣା ଏବଂ ପରିସ୍ଥିତି ବିଷୟରେ ସୂଚନା ଦିଆଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">05</div>

            <div className="roadmap-card">

              <span>COMMUNITY IMPACT</span>

              <h3>🏘️ Citizen Situation</h3>

              <p>
                Situation questions capture the impact of the
                waste problem on citizens and public spaces.
              </p>

              <p className="roadmap-odia">
                ଆବର୍ଜନା ସମସ୍ୟାର ନାଗରିକ ଏବଂ ସାଧାରଣ ସ୍ଥାନ ଉପରେ
                ପ୍ରଭାବ ବୁଝାଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">06</div>

            <div className="roadmap-card">

              <span>LOCATION & EVIDENCE</span>

              <h3>📍 Location + 📸 Evidence</h3>

              <p>
                The citizen provides location information and
                uploads photographic evidence of the waste.
              </p>

              <p className="roadmap-odia">
                ସ୍ଥାନ ସୂଚନା ଏବଂ ଆବର୍ଜନାର ଫଟୋ ପ୍ରମାଣ ସଂଗ୍ରହ କରାଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step ai-roadmap-step">

            <div className="roadmap-number">07</div>

            <div className="roadmap-card">

              <span>INTELLIGENCE</span>

              <h3>🤖 AI Waste Analysis</h3>

              <p>
                AI analyzes the submitted evidence and supporting
                information to understand the reported waste case.
              </p>

              <p className="roadmap-odia">
                AI ଦିଆଯାଇଥିବା ପ୍ରମାଣ ଏବଂ ସୂଚନାକୁ ବିଶ୍ଳେଷଣ କରି
                ରିପୋର୍ଟର ସ୍ଥିତି ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">08</div>

            <div className="roadmap-card">

              <span>REPORT CREATION</span>

              <h3>🆔 Report ID Generation</h3>

              <p>
                A structured and unique Report ID is generated
                after successful report creation.
              </p>

              <p className="roadmap-odia">
                ରିପୋର୍ଟ ସଫଳ ଭାବରେ ସୃଷ୍ଟି ହେଲେ ଏକ Unique Report ID
                ଦିଆଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">09</div>

            <div className="roadmap-card">

              <span>TRACKING</span>

              <h3>📊 Report Status</h3>

              <p>
                The created report becomes available for status
                and response tracking.
              </p>

              <p className="roadmap-odia">
                ସୃଷ୍ଟି ହୋଇଥିବା ରିପୋର୍ଟର Status ଏବଂ Response Tracking
                କରାଯାଇପାରେ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">10</div>

            <div className="roadmap-card">

              <span>RESPONSE CENTER</span>

              <h3>🧠 Organization Suggestions</h3>

              <p>
                Report and location information can be used to
                present suitable organization suggestions.
              </p>

              <p className="roadmap-odia">
                ରିପୋର୍ଟ ଏବଂ ସ୍ଥାନ ଆଧାରରେ ଉପଯୁକ୍ତ ସଂଗଠନ ସୁପାରିଶ
                କରାଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">11</div>

            <div className="roadmap-card">

              <span>MANDATORY SELECTION</span>

              <h3>☑️ Select One Organization</h3>

              <p>
                Exactly one organization must be selected before
                moving to the final response request.
              </p>

              <p className="roadmap-odia">
                Final response ପୂର୍ବରୁ ଠିକ୍ ଗୋଟିଏ ସଂଗଠନ ଚୟନ କରିବା ଆବଶ୍ୟକ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">12</div>

            <div className="roadmap-card">

              <span>USER INPUT</span>

              <h3>💬 Feedback / Reason</h3>

              <p>
                The user can provide feedback or explain the
                reason for selecting the organization.
              </p>

              <p className="roadmap-odia">
                ସଂଗଠନ ଚୟନ କରିବାର କାରଣ କିମ୍ବା Feedback ଦିଆଯାଇପାରେ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">13</div>

            <div className="roadmap-card">

              <span>OPTIONAL SUPPORT</span>

              <h3>📅 Appointment Request</h3>

              <p>
                The user can optionally request an appointment
                with the same selected organization.
              </p>

              <p className="roadmap-odia">
                ସେହି ସଂଗଠନ ସହିତ ଆବଶ୍ୟକ ହେଲେ Appointment ଅନୁରୋଧ କରାଯାଇପାରେ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">14</div>

            <div className="roadmap-card">

              <span>FINAL ACTION</span>

              <h3>📨 Final Submit</h3>

              <p>
                The response request is finally submitted with
                the selected organization and available information.
              </p>

              <p className="roadmap-odia">
                ଚୟନ କରାଯାଇଥିବା ସଂଗଠନ ଏବଂ ସୂଚନା ସହିତ Final Submit କରାଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">15</div>

            <div className="roadmap-card">

              <span>COMMUNICATION</span>

              <h3>📧 Organization Communication</h3>

              <p>
                The final response request can move into
                organization communication and processing.
              </p>

              <p className="roadmap-odia">
                Final response request ସଂଗଠନ ସହିତ ଯୋଗାଯୋଗ ଏବଂ
                processing ପାଇଁ ଯାଏ।
              </p>

            </div>

          </article>


          <article className="roadmap-step">

            <div className="roadmap-number">16</div>

            <div className="roadmap-card">

              <span>ADMIN CONTROL</span>

              <h3>🛡️ Admin Monitoring</h3>

              <p>
                Authorized administrators can monitor response
                requests, organizations, appointments, feedback
                and communication status.
              </p>

              <p className="roadmap-odia">
                Authorized Admin Response Request, Organization,
                Appointment, Feedback ଏବଂ Communication Status ମନିଟର୍ କରନ୍ତି।
              </p>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          WHY VERIFICATION
      ===================================================== */}
      <section className="about-section verification-section">

        <div className="section-heading-block">

          <span className="section-kicker">
            TRUST & ACCOUNTABILITY
          </span>

          <h2 className="about-section-title">
            Why Citizen Verification?
          </h2>

        </div>


        <div className="verification-card">

          <div className="verification-icon">
            🛡️
          </div>

          <div className="verification-content">

            <p>
              Citizen details and Email OTP verification help
              connect waste reports with verified users.
            </p>

            <p>
              This structured verification approach is intended
              to reduce false, duplicate or unnecessary reports
              and help response authorities focus on genuine cases.
            </p>

            <p className="verification-highlight">
              The goal is simple:
              <strong>
                real citizens, real information and real
                waste problems.
              </strong>
            </p>

            <p className="verification-odia">
              ଲକ୍ଷ୍ୟ ହେଉଛି —
              <strong>
                ପ୍ରକୃତ ନାଗରିକ, ପ୍ରକୃତ ସୂଚନା ଏବଂ ପ୍ରକୃତ ଆବର୍ଜନା ସମସ୍ୟା।
              </strong>
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="about-section">

        <div className="section-heading-block">

          <span className="section-kicker">
            SIMPLE MODEL
          </span>

          <h2 className="about-section-title">
            How SWACHHLENS Helps
          </h2>

        </div>


        <div className="help-grid">

          <div className="help-item">
            <span>1</span>
            <div>
              <h3>Report</h3>
              <p>
                Citizens submit verified information,
                evidence and location.
              </p>
              <small>
                ନାଗରିକ ଯାଞ୍ଚିତ ସୂଚନା, ପ୍ରମାଣ ଏବଂ ସ୍ଥାନ ଦିଅନ୍ତି।
              </small>
            </div>
          </div>


          <div className="help-item">
            <span>2</span>
            <div>
              <h3>Understand</h3>
              <p>
                The system organizes the incident and
                citizen situation information.
              </p>
              <small>
                ସିଷ୍ଟମ୍ ଘଟଣା ଏବଂ ନାଗରିକ ପରିସ୍ଥିତିକୁ ବୁଝେ।
              </small>
            </div>
          </div>


          <div className="help-item">
            <span>3</span>
            <div>
              <h3>Analyze</h3>
              <p>
                AI supports waste identification, severity,
                risk and priority understanding.
              </p>
              <small>
                AI ଆବର୍ଜନା, ଗୁରୁତ୍ୱ ଏବଂ ଝୁମ୍ପ ବିଶ୍ଳେଷଣରେ ସାହାଯ୍ୟ କରେ।
              </small>
            </div>
          </div>


          <div className="help-item">
            <span>4</span>
            <div>
              <h3>Respond</h3>
              <p>
                Organizations and administrators receive
                structured information for response coordination.
              </p>
              <small>
                ସଂଗଠନ ଏବଂ Admin ପାଇଁ ସଂଗଠିତ ସୂଚନା ଉପଲବ୍ଧ ହୁଏ।
              </small>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          VISION
      ===================================================== */}
      <section className="about-vision">

        <span className="section-kicker">
          OUR VISION
        </span>

        <h2 className="about-section-title">
          From Complaint to Intelligent Response
        </h2>

        <p>
          SWACHHLENS aims to move waste reporting beyond simple
          complaint submission toward an intelligent, evidence-based,
          location-aware and structured waste-response ecosystem.
        </p>

        <p className="vision-odia">
          SWACHHLENS ସାଧାରଣ ଅଭିଯୋଗ ଦାଖଲରୁ ଆଗକୁ ବଢ଼ି ଏକ ବୁଦ୍ଧିମାନ,
          ପ୍ରମାଣ-ଆଧାରିତ, ସ୍ଥାନ-ସଚେତନ ଏବଂ ସଂଗଠିତ ଆବର୍ଜନା
          ପ୍ରତିକ୍ରିୟା ପ୍ରଣାଳୀ ଗଠନ କରିବାକୁ ଲକ୍ଷ୍ୟ ରଖେ।
        </p>

        <div className="vision-flow">

          <span>🏠 Report</span>
          <b>→</b>
          <span>🧠 Understand</span>
          <b>→</b>
          <span>🤖 Analyze</span>
          <b>→</b>
          <span>🏛️ Respond</span>

        </div>

        <div className="vision-final-message">
          ♻️ Cleaner Communities • Smarter Decisions • Faster Response
        </div>

        <div className="vision-final-odia">
          ସ୍ୱଚ୍ଛ ସମୁଦାୟ • ସ୍ମାର୍ଟ ନିଷ୍ପତ୍ତି • ଶୀଘ୍ର ପ୍ରତିକ୍ରିୟା
        </div>

      </section>

    </main>
  );
}

export default About;