export type Entry = {
  when: string;
  title: string;
  sub?: string;
  tag?: string;
  bullets: string[];
  tech?: string;
};

export type CVSection =
  | { title: string; kind: "text"; text: string }
  | { title: string; kind: "entries"; entries: Entry[] }
  | { title: string; kind: "skills"; skills: { group: string; items: string }[] }
  | { title: string; kind: "list"; list: string[] };

export type Doc = {
  id: string;
  track: "engineering" | "research";
  kind: "Resume" | "CV";
  file: string;
  pages: string;
  audience: string;
  headline: string;
  summary: string;
  sections: CVSection[];
};

export const identity = {
  name: "Mohammed Mohi Uddin",
  location: "Hyderabad, India",
  email: "t.d.m.mohi@gmail.com",
  phone: "+91 78424 49809",
  linkedin: "linkedin.com/in/mohi-uddin",
  github: "github.com/1shizaan",
  site: "mohiuddin.dev",
};

/* ============================================================
   SHARED BLOCKS
   ============================================================ */

const EDU_WITH_GPA: Entry = {
  when: "Aug 2023 – Aug 2027",
  title: "B.Tech, Computer Science Engineering (Data Science)",
  sub: "Swami Vivekananda Institute of Technology, Hyderabad",
  bullets: [
    "CGPA 7.85 / 10. Class rank in the top 25% of 120 students.",
    "Coursework: machine learning, artificial intelligence, computer vision, natural language processing, data structures and algorithms, database systems, probability and statistics.",
  ],
};

const EDU_NO_GPA: Entry = {
  when: "Aug 2023 – Aug 2027",
  title: "B.Tech, Computer Science Engineering (Data Science)",
  sub: "Swami Vivekananda Institute of Technology, Hyderabad",
  bullets: [
    "Coursework: machine learning, computer vision, natural language processing, data structures and algorithms, database systems, operating systems.",
  ],
};

const INTERNSHIP: Entry = {
  when: "Jun – Jul 2025",
  title: "Summer Training Intern, Generative AI with Machine Learning",
  sub: "RemarkSkill Education with IIT Hyderabad",
  bullets: [
    "Built a retrieval augmented question answering system over a document corpus: embedding based retrieval by cosine similarity, document chunking, context injection, generative response.",
    "Found that chunk boundaries, not prompt wording, decided answer quality. Most of the tuning went into segmentation rather than generation.",
    "Recognised at programme close for technical soundness and collaboration.",
  ],
  tech: "Python, vector databases, embeddings, RAG",
};

const RECOGNITION: string[] = [
  "Second place, research paper competition, Techno Udbhav 2025 inter college technical festival, for OptiXon health sensing eyewear.",
  "Smart India Hackathon 2025, team Glitch Guardians, problem statement PS25018: telemedicine access for rural healthcare in Nabha, Punjab.",
  "OptiXon feasibility documentation reviewed and validated by Prof. Nagender Kumar Suryadevara, University of Hyderabad, following review of the full technical analysis.",
  "Circuit design and architecture reviewed across multiple sessions with M.Tech students at IIT Hyderabad and a working hardware professional.",
  "Certificates: Generative AI with Machine Learning, Ethical Hacking, and Data Science workshops, all IIT Hyderabad.",
];

/* ============================================================
   ENGINEERING RESUME · one page, for startups and product teams
   ============================================================ */

const ENG_RESUME: Doc = {
  id: "eng-resume",
  track: "engineering",
  kind: "Resume",
  file: "Mohi-Uddin-Resume-Engineering",
  pages: "One page",
  audience: "AI engineering, backend and full stack roles at startups and product companies.",
  headline: "AI systems and backend engineer",
  summary:
    "Final year computer science student who ships. Launched a VS Code debugging product with 4,600+ downloads across three registries, on live payment infrastructure. Strongest at making expensive systems cheap: a reconciliation engine that replaced per row API calls with a blocked three pass matcher and does 100,000 rows against 98,000 in 4.25 seconds with zero API calls.",
  sections: [
    {
      title: "Experience",
      kind: "entries",
      entries: [
        {
          when: "Feb 2026 – now",
          title: "Founder and sole engineer",
          sub: "DebugAI · an AI debugger for VS Code, debugai.io",
          tag: "Launched",
          bullets: [
            "Built and launched every layer of a five service monorepo: VS Code extension, Express gateway, FastAPI inference engine, Next.js dashboard, PostgreSQL with pgvector, Redis. 412 Marketplace installs, 4,600+ downloads across three registries, 815 commits, 329 engine tests passing.",
            "Assembles context from a runtime stack trace: forced inclusion of traced files, then pgvector retrieval of related code the trace never names, inside a managed token budget. A SHA-256 Redis cache ahead of every model call, difficulty based routing, and a cross provider fallback that keeps the response shape identical during an outage.",
            "Live billing on production keys: HMAC verified webhooks, idempotency on the provider event id, and a tier guard in the request path so an expired trial is enforced even when the cron that should have done it fails.",
          ],
          tech: "TypeScript, Python, Next.js, Express, FastAPI, PostgreSQL, pgvector, Redis, Docker, Railway, Vercel",
        },
        {
          when: "Jun – Jul 2025",
          title: "Summer Training Intern, Generative AI with ML",
          sub: "RemarkSkill Education with IIT Hyderabad",
          bullets: [
            "Built a retrieval augmented question answering system and found that chunk boundaries, not prompt wording, decided answer quality. Recognised at close for technical soundness and collaboration.",
          ],
        },
      ],
    },
    {
      title: "Selected projects",
      kind: "entries",
      entries: [
        {
          when: "May 2025 – now",
          title: "MatchLedger AI · bank reconciliation engine",
          bullets: [
            "Three passes ordered by cost: a vectorised hash join, a date tolerance pass, then fuzzy narration similarity on the remainder, blocked by amount bucket and date window. 100,000 against 98,000 rows in 4.25 seconds, 95% match rate, zero API calls, zero mismatches against ground truth. Unblocked the same job is a 9.8 billion comparison cross product. FastAPI, Celery, Redis, PostgreSQL, React, Docker.",
          ],
        },
        {
          when: "2024, rebuilt 2026",
          title: "SS Categorise · multimodal classifier",
          bullets: [
            "Fused an EfficientNet-B3 embedding with a 500 term TF-IDF vector over OCR text: 96.92% on a 260 image held-out set across 20 classes. The gain over the single model version came from the confusion matrix showing a missing input channel, not an underfitted model. PyTorch, scikit-learn.",
          ],
        },
        {
          when: "Aug 2026",
          title: "Inkline · handwriting to installable font, fully client side",
          bullets: [
            "Homography un-warp of a photographed sheet, then a Moore boundary tracer and Schneider cubic fitter written from scratch because Potrace is GPL and would attach itself to every font made with the tool. Proven by a headless browser test that downloads the generated OTF and parses it back. TypeScript, Next.js, Canvas, Playwright.",
          ],
        },
        {
          when: "Mar 2026",
          title: "SecAudit · static security scanner, zero dependencies",
          bullets: [
            "One standard library Python file, 60+ rules mapped to the OWASP Top 10 across six languages, 12,000 lines scanned in under two seconds with no network and no upload.",
          ],
        },
      ],
    },
    {
      title: "Skills",
      kind: "skills",
      skills: [
        { group: "Languages", items: "Python, TypeScript, JavaScript, C, SQL" },
        { group: "Backend, ML", items: "FastAPI, Express, Node.js, Celery, Redis, PostgreSQL, pgvector · PyTorch, TensorFlow, scikit-learn, OpenCV, embeddings and retrieval" },
        { group: "Frontend, infra", items: "React, Next.js App Router, Canvas · Docker, AWS EC2, Railway, Vercel, nginx, GitHub Actions, Sentry, OWASP Top 10" },
      ],
    },
    {
      title: "Education and recognition",
      kind: "entries",
      entries: [
        {
          when: "Aug 2023 – Aug 2027",
          title: "B.Tech, Computer Science Engineering (Data Science)",
          sub: "Swami Vivekananda Institute of Technology, Hyderabad",
          bullets: [
            "Second place, research paper competition, Techno Udbhav 2025, for OptiXon health sensing eyewear. Smart India Hackathon 2025, rural telemedicine. Certificates in Generative AI with ML, Ethical Hacking and Data Science, IIT Hyderabad.",
          ],
        },
      ],
    },
  ],
};

/* ============================================================
   ENGINEERING CV · two pages, deeper
   ============================================================ */

const ENG_CV: Doc = {
  id: "eng-cv",
  track: "engineering",
  kind: "CV",
  file: "Mohi-Uddin-CV-Engineering",
  pages: "Three pages",
  audience: "Senior engineering interviews, technical founders, and anyone who wants the architecture rather than the summary.",
  headline: "AI systems and backend engineer",
  summary:
    "I build systems that have to survive a real constraint, and I write down which numbers were measured and which were assumed. Fourteen projects across AI systems, computer vision, embedded hardware and developer tooling. One launched product on live payment infrastructure, and four projects paused or retired with the reason recorded.",
  sections: [
    {
      title: "Experience",
      kind: "entries",
      entries: [
        {
          when: "Feb 2026 – present",
          title: "Founder and sole engineer",
          sub: "DebugAI · an AI debugger for VS Code, debugai.io",
          tag: "Launched Jun 2026",
          bullets: [
            "Designed and shipped every layer: a VS Code extension, an Express API gateway, a FastAPI inference engine, a Next.js dashboard and marketing site, PostgreSQL with pgvector, Redis, and the deployment pipeline across Vercel and Railway.",
            "412 VS Code Marketplace installs and 4,600+ combined downloads across VS Code, Open VSX and npm, verified against the live registry APIs. Installs and downloads are separate metrics and only one of them sums.",
            "Context assembly: parse the stack trace, force inclusion of the files it names, then retrieve related code the trace never mentions using pgvector embeddings over the repository, inside a managed token budget. A second retrieval pass runs when the model reports missing context, under a 40 second deadline with a fallback to the first pass result.",
            "Cost control: a SHA-256 cache key over error text, project and framework hint checked in Redis before any model call, plus difficulty based routing between a small and a large model and a cross provider fallback that preserves the response shape on an upstream 429 or 503.",
            "Error memory: a SHA-256 signature per error, recurrence tracked per project, and a fix confirmed by a human promoted to lead the next answer for that signature. Project scoped only, so a fix never leaks across users.",
            "Billing on production payment keys: raw body HMAC verification before the JSON parser, two phase idempotency keyed on the provider event id, and an effective tier guard evaluated in the request path so an expired trial is enforced even when the hourly cron fails. That cron did fail once, pointed at the wrong host, and returned 404 for days.",
            "Security posture: session identifiers in Redis rather than the secret in a cookie, constant time secret comparison, a CSRF gate bound to the same middleware that grants admin authority, and a fail closed policy when the session store is unavailable.",
            "815 commits between February and August 2026. 329 engine tests, 32 API test suites, 43 written session logs, and continuous integration on every push.",
          ],
          tech: "TypeScript, Python, Next.js 15, Express, FastAPI, PostgreSQL, pgvector, Redis, Docker, nginx, Railway, Vercel, Paddle",
        },
        INTERNSHIP,
      ],
    },
    {
      title: "Engineering projects",
      kind: "entries",
      entries: [
        {
          when: "May 2025 – present",
          title: "MatchLedger AI · reconciliation at 100,000 rows a side",
          sub: "Founder, sole engineer. Paused pending company registration.",
          bullets: [
            "Three passes ordered cheapest first. A vectorised hash join on amount, date and reference. A tolerance pass on exact amount with a configurable date window and greedy closest date assignment. A fuzzy narration pass run only on the remainder, blocked by amount bucket and date window so it never becomes an O(n×m) scan.",
            "Benchmarked at 100,000 against 98,000 rows in 4.25 seconds, 95% match rate, zero API calls, zero mismatches against synthetic ground truth with a known answer key.",
            "Replaced an earlier embedding based engine that called an API per unresolved row. Both engines remain in the repository, which makes the comparison reproducible.",
            "Every match records the pass and the basis that produced it, because a match without an audit trail is useless to whoever signs off on it. Results stored encrypted at rest.",
            "Celery and Redis for background jobs, four service Docker Compose, JWT and Google OAuth, React 19 frontend.",
          ],
          tech: "Python, FastAPI, pandas, PostgreSQL, Celery, Redis, React, Docker, AWS EC2",
        },
        {
          when: "Aug 2026",
          title: "Inkline · handwriting to font, no server involved",
          bullets: [
            "Template geometry, scan, trace and build as four independently testable pure modules. Corner markers plus a rotation pip define a reference frame, so after homography every cell is at a known position and no letter level alignment guessing is needed.",
            "Tracer written from scratch: Moore neighbour boundary following with hole detection, staircase smoothing, corner detection over an angular window, Schneider least squares cubic fitting with Newton-Raphson reparameterisation, winding normalised so counters render as holes.",
            "opentype.js cannot write kerning, so the kern table is assembled by hand and spliced into the binary with the table directory rebuilt, offsets re-paged and the head checksum recomputed.",
            "End to end proof: a synthetic tilted, shadowed, noisy photograph drives a headless Chromium through the studio, the produced OTF is downloaded and parsed back.",
          ],
          tech: "TypeScript, Next.js, Canvas, opentype.js, pako, IndexedDB, Playwright",
        },
        {
          when: "2024, rebuilt Feb – Apr 2026",
          title: "SS Categorise · multimodal classification",
          bullets: [
            "Version one: a fine tuned ResNet on roughly 12,000 scraped images with K-means proposing groupings before labelling. It plateaued and adding data did not help.",
            "Version two: EfficientNet-B3 image embedding concatenated with a 500 term TF-IDF vector over OCR text, classified by logistic regression. 96.92% on a 260 image held-out test set across 20 classes.",
            "Kept the classification head linear on purpose so the contribution of each half of the fused vector stayed inspectable. The two worst classes both fail for the same reason: no readable text, so the fusion degrades to vision alone.",
          ],
          tech: "PyTorch, EfficientNet-B3, OCR, TF-IDF, scikit-learn, Streamlit",
        },
        {
          when: "Jul 2026",
          title: "Deconstruct · video breakdown studio",
          bullets: [
            "Separates audio stems with Demucs, detects every cut, extracts per shot camera motion with optical flow and matches it to a named CSS cubic-bezier, reads caption timing with OCR, and reports the colour grade.",
            "Marks each cut green or red depending on whether it lands on a musical beat, which is the single comparison that teaches edit rhythm.",
            "Analysis streams progress over server sent events per stage, queues concurrent requests rather than running them in parallel, and skips stem separation above twelve minutes of runtime so the rest still completes.",
          ],
          tech: "FastAPI, ffmpeg, PySceneDetect, librosa, Demucs, OpenCV, RapidOCR, React, Vite",
        },
        {
          when: "Mar 2026",
          title: "SecAudit · static security scanner, zero dependencies",
          bullets: [
            "One Python file, standard library only. 60+ rules across the OWASP Top 10 covering secrets, injection, authentication flaws, deserialisation, missing rate limits and misconfiguration, for Python, JavaScript, TypeScript, React, FastAPI, Node, Go, Ruby and PHP.",
            "Text, HTML or JSON output with a severity filter so it can gate a CI pipeline. Written after doing a full manual remediation pass on my own codebase, so most rules are mistakes I had made.",
          ],
          tech: "Python standard library",
        },
        {
          when: "2025",
          title: "Telecare Nabha · rural telemedicine, Smart India Hackathon 2025",
          bullets: [
            "Built for a district where 31% of households have internet access and the civil hospital runs 11 doctors against 23 sanctioned posts for 173 villages.",
            "Dual channel by design: a smartphone app and an IVR path over a button phone, offline first health records that reconcile when a connection appears, and live pharmacy stock so a patient does not lose a day of wages travelling to an empty shelf.",
          ],
          tech: "Flask, React, Vite, SQLite, IVR",
        },
      ],
    },
    {
      title: "Hardware and research work",
      kind: "entries",
      entries: [
        {
          when: "2024 – Jul 2026",
          title: "OptiXon · health sensing eyewear, full hardware and firmware design",
          sub: "Founder and technical lead. Paper phase complete, no prototype built.",
          bullets: [
            "PPG, six axis IMU and skin temperature sensing on a 138 × 10.5mm four layer flex-rigid board inside an eyeglass temple, with BLE and hardware battery protection.",
            "Board, enclosure and routing generated by Python against KiCad and FreeCAD rather than drawn, so a change is re-run and re-verified rather than redrawn. Electrical rule check clean, netlist machine verified, fabrication pack exported, firmware builds against the nRF5 SDK.",
            "51 findings logged as symptom, root cause and fix. Two are field failure class safety bugs found before fabrication, including a battery protection pin mapping error that would have left a lithium cell unprotected while behaving normally in every functional test.",
            "Projected 18 to 24 hour battery life and sub 28°C skin contact temperature. Both are design calculations and are labelled as such, because nothing has been built.",
          ],
          tech: "nRF52832, MAX30102, LSM6DSOX, KiCad, FreeCAD, ngspice, nRF5 SDK, C",
        },
        {
          when: "2026",
          title: "BeyondVision · spectral imaging specification",
          bullets: [
            "A ten document design set for spectral capture on phones and cheap add on hardware, built around a provenance rule: every pixel is tagged MEASURED, RECONSTRUCTED or SIMULATED and nothing exports without the tag.",
            "Establishes what is physically impossible before designing anything. Silicon stops at 1107nm because its bandgap is 1.12 electronvolts, so thermal imaging from a phone camera cannot exist, and five hardware tiers from zero to roughly 250 dollars are specified against that boundary.",
          ],
          tech: "Optics, RAW capture, spectral reconstruction, calibration procedure",
        },
      ],
    },
    {
      title: "Skills",
      kind: "skills",
      skills: [
        { group: "Languages", items: "Python, TypeScript, JavaScript, C, SQL" },
        { group: "Backend and data", items: "FastAPI, Express, Node.js, Celery, Redis, PostgreSQL, pgvector, SQLAlchemy, pandas, REST and webhook design" },
        { group: "Frontend", items: "React, Next.js App Router, Vite, Canvas, server sent events, design systems" },
        { group: "Machine learning", items: "PyTorch, TensorFlow, scikit-learn, OpenCV, EfficientNet and ResNet fine tuning, embeddings and retrieval, model routing, evaluation and error analysis" },
        { group: "Infrastructure", items: "Docker and Compose, AWS EC2, Railway, Vercel, nginx, GitHub Actions, Sentry, migration discipline" },
        { group: "Hardware", items: "KiCad, FreeCAD, ngspice, nRF52 and ESP32, MEMS sensors, PPG and IMU signal handling, power budgeting" },
        { group: "Security", items: "OWASP Top 10, HMAC webhook verification, constant time comparison, CSRF and session design, threat modelling" },
      ],
    },
    { title: "Education", kind: "entries", entries: [EDU_NO_GPA] },
    { title: "Recognition and validation", kind: "list", list: RECOGNITION },
  ],
};

/* ============================================================
   RESEARCH RESUME · one page
   ============================================================ */

const RES_RESUME: Doc = {
  id: "res-resume",
  track: "research",
  kind: "Resume",
  file: "Mohi-Uddin-Resume-Research",
  pages: "One page",
  audience: "Summer research programmes, lab internships, and research group applications.",
  headline: "Signal processing and efficient ML under constraint",
  summary:
    "Final year computer science student working on systems where the failure mode matters more than the headline metric. Interested in deterministic baselines with learned augmentation, uncertainty and provenance in model outputs, and hardware software co-design for embedded sensing. Available full time for twelve or more weeks in summer 2027, willing to relocate.",
  sections: [
    {
      title: "Research interests",
      kind: "text",
      text: "Signal recovery under motion and noise, and trust gates that discard corrupted measurements rather than smoothing over them. Cost efficient inference: when a learned component earns its compute against a deterministic baseline. Uncertainty and provenance in generated or reconstructed outputs. Hardware software co-design under power and thermal constraint.",
    },
    {
      title: "Education",
      kind: "entries",
      entries: [
        {
          when: "Aug 2023 – Aug 2027",
          title: "B.Tech, Computer Science Engineering (Data Science)",
          sub: "Swami Vivekananda Institute of Technology, Hyderabad · CGPA 7.85 / 10 · top 25% of 120 students",
          bullets: [
            "Machine learning, artificial intelligence, computer vision, natural language processing, algorithms, database systems, probability and statistics.",
          ],
        },
      ],
    },
    {
      title: "Research projects",
      kind: "entries",
      entries: [
        {
          when: "2024 – Jul 2026",
          title: "OptiXon · photoplethysmography in prescription eyewear",
          sub: "Founder and technical lead · Second place, Techno Udbhav 2025 research competition",
          bullets: [
            "Continuous heart rate sensing from the superficial temporal artery through a sensor in an eyeglass temple, where the dominant problem is motion artifact rather than sensor selection. The inertial unit acts as a trust gate: the gyroscope flags the corrupted window before processing, so bad samples are discarded rather than averaged into a confident wrong reading.",
            "Verified the lithium protection circuit at three independent levels after finding a pin mapping error that would have defeated all protection while passing every functional test. Validated by Prof. Nagender Kumar Suryadevara, University of Hyderabad. Battery and thermal figures are design estimates, labelled as such, since no prototype exists.",
          ],
          tech: "nRF52832, MAX30102 PPG, LSM6DSOX IMU, KiCad, ngspice, C",
        },
        {
          when: "2024, rebuilt 2026",
          title: "Multimodal classification under a small label budget",
          bullets: [
            "Fused a convolutional image embedding with a sparse TF-IDF representation of OCR text, classified by logistic regression: 96.92% across 20 classes on a 260 image held-out set, from 1,297 labelled examples. The improvement over a single vision model came from error analysis rather than capacity, and the head was kept linear so each modality's contribution stayed inspectable. PyTorch, EfficientNet-B3, scikit-learn.",
          ],
        },
        {
          when: "May 2025 – now",
          title: "Deterministic matching with selective learned fallback",
          bullets: [
            "Where a learned matcher earns its cost against a rule based one, tested on transaction reconciliation because ground truth is constructible and unexplainable matches are unusable. Blocking reduced a 9.8 billion pair comparison to a tractable candidate set: 95% match rate, zero mismatches against a synthetic answer key, 4.25 seconds at 100,000 records, zero inference calls.",
          ],
        },
        {
          when: "Jun – Jul 2025",
          title: "Retrieval augmented generation · IIT Hyderabad summer programme",
          bullets: [
            "Found chunk boundary selection, not prompt design, dominated answer quality, and that retrieval failure produced fluent confident wrong answers with no distinguishing signal. That observation drove later work on explicit verification state in a deployed system.",
          ],
        },
      ],
    },
    {
      title: "Technical skills",
      kind: "skills",
      skills: [
        { group: "Programming", items: "Python (primary), TypeScript, C, SQL" },
        { group: "ML, signals", items: "PyTorch, TensorFlow, scikit-learn, OpenCV, embeddings and retrieval, evaluation design · PPG and IMU processing, motion artifact rejection, ngspice, KiCad, nRF52, power budgeting" },
        { group: "Mathematics", items: "Linear algebra, probability and statistics, optimisation, numerical methods. Learning: uncertainty quantification, probabilistic machine learning" },
      ],
    },
    {
      title: "Recognition",
      kind: "list",
      list: [
        "OptiXon feasibility documentation reviewed and validated by Prof. Nagender Kumar Suryadevara, University of Hyderabad, and by M.Tech students at IIT Hyderabad across multiple sessions.",
        "Smart India Hackathon 2025, rural telemedicine PS25018. Certificates in Generative AI with ML, Ethical Hacking and Data Science, IIT Hyderabad. English fluent, Hindi native.",
      ],
    },
  ],
};

/* ============================================================
   RESEARCH CV · three pages
   ============================================================ */

const RES_CV: Doc = {
  id: "res-cv",
  track: "research",
  kind: "CV",
  file: "Mohi-Uddin-CV-Research",
  pages: "Three pages",
  audience: "Full research applications: AScI, CERN, DAAD, lab summer programmes, and PhD enquiry.",
  headline: "Signal processing and efficient ML under constraint",
  summary:
    "I work on systems where being confidently wrong is the expensive failure. That has taken me through motion artifact rejection in wearable photoplethysmography, multimodal classification under a small label budget, deterministic matching with selective learned fallback, and a specification for spectral imaging built around refusing to render what the sensor did not measure. Fourteen projects, four of them paused or retired with the reason recorded.",
  sections: [
    {
      title: "Research interests",
      kind: "text",
      text: "Signal recovery under motion and noise, and the design of trust gates that discard corrupted measurements rather than smoothing over them. Cost efficient inference: when a learned component earns its compute against a deterministic baseline, and how to measure that honestly. Uncertainty quantification and provenance in generated and reconstructed outputs, including spectral reconstruction where the failure mode on metamers is known and must be stated. Hardware software co-design for embedded sensing under power, thermal and dimensional constraint.",
    },
    { title: "Education", kind: "entries", entries: [EDU_WITH_GPA] },
    {
      title: "Research projects",
      kind: "entries",
      entries: [
        {
          when: "2024 – Jul 2026",
          title: "OptiXon: continuous physiological sensing in prescription eyewear",
          sub: "Founder and technical lead. Second place, Techno Udbhav 2025 inter college research competition.",
          bullets: [
            "Research question: can a prescription eyeglass frame carry photoplethysmography and inertial sensing for all day physiological monitoring, inside a 138 × 10.5mm temple arm, without a camera, a display, or a battery that needs charging at midday.",
            "Signal approach: the sensor sits at the temple tip over the superficial temporal artery. The dominant problem is not sensor selection but motion artifact, since walking and head rotation corrupt the waveform while leaving it smooth and plottable. The gyroscope is used as a trust gate that flags corrupted windows before processing, so the system discards rather than averages.",
            "Power: a written power budget preceded component selection. Moving from ESP32 to the nRF52 family cut projected draw by roughly 82%, which is the difference between charging at lunch and charging overnight. Duty cycled sampling yields a projected 18 to 24 hours on a 200mAh curved cell.",
            "Verification: board, enclosure and routing are generated by Python against KiCad and FreeCAD, so every change is re-run and re-verified rather than redrawn. Electrical rule check clean, netlist machine verified, protection circuit confirmed in ngspice, firmware compiles and links against the nRF5 SDK.",
            "Safety finding: the battery protection pairing carried a pin mapping error that passed visual review. The circuit would have charged, discharged and behaved normally in every functional test while providing no overcurrent or overdischarge protection on a lithium cell worn against the head. Found by verifying the same mapping three independent ways and logged as findings 37 and 38 of 51.",
            "Status and honesty: the paper phase is complete and no physical prototype exists. Battery life, thermal margin and ingress protection are design estimates and are labelled as estimates wherever they appear.",
            "External validation: reviewed by M.Tech students at IIT Hyderabad across multiple sessions, by a working hardware professional on microcontroller architecture and sensor selection, and by Prof. Nagender Kumar Suryadevara at the University of Hyderabad after reading the full feasibility documentation.",
          ],
          tech: "nRF52832, MAX30102, LSM6DSOX, KiCad, FreeCAD, ngspice, nRF5 SDK, C, Python",
        },
        {
          when: "2024, rebuilt Feb – Apr 2026",
          title: "Multimodal fusion for classification under a small label budget",
          bullets: [
            "Problem: twenty visually overlapping classes from 1,297 labelled images, where receipts, plain quote cards and bank statements are all dark text on a light rectangle and are separable only by what the text says.",
            "Version one, a fine tuned convolutional network on roughly 12,000 scraped images with K-means proposing groupings before labelling, plateaued. Additional data did not move it.",
            "Diagnosis came from the confusion matrix rather than from the loss curve: errors concentrated in text bearing classes, which indicates a missing input channel rather than insufficient capacity.",
            "Version two concatenates an EfficientNet-B3 embedding with a 500 term TF-IDF vector over extracted text and classifies with logistic regression. 96.92% accuracy on a 260 image held-out set, nine classes at perfect precision and recall.",
            "Methodological note: joining a dense embedding to a sparse lexical vector lets the dense half dominate on scale alone, so the fusion was treated as a modelling decision. The head was kept linear so each modality's contribution stayed inspectable, and the two weakest classes were traced to the same cause, images carrying no readable text.",
            "The version one figure was training accuracy and the version two figure is a held-out test set. They are not comparable and are not presented as if they were.",
          ],
          tech: "PyTorch, EfficientNet-B3, OCR, TF-IDF, scikit-learn",
        },
        {
          when: "2026",
          title: "BeyondVision: provenance constrained spectral imaging",
          bullets: [
            "A specification for spectral capture on consumer hardware, organised around a single rule: every pixel is tagged MEASURED, RECONSTRUCTED or SIMULATED, and nothing exports without its tag.",
            "The physics document was written first and establishes hard limits before any design. Silicon's 1.12 electronvolt bandgap places an absolute wall at 1107nm, which makes thermal imaging from a phone camera physically impossible rather than merely difficult. Writing this document eliminated four proposed features before any implementation.",
            "Five hardware tiers are specified from zero cost to roughly 250 dollars, each with its honest provenance: an infrared pass path giving measured 700 to 1000nm, a filter removed sensor giving measured 350 to 1000nm, a narrowband LED array producing a genuine 24 band measured spectral cube for around 150 dollars, and a microbolometer for measured 8 to 14 micrometres.",
            "Reconstruction from three broadband channels is treated as inference with a quantified error and a known failure mode on metamers, and the specification states that failure rather than concealing it.",
            "Radiometric integrity requires beginning at RAW, since a consumer image pipeline applies six or more undocumented non-linear scene dependent transforms before a JPEG exists.",
            "Status: specification only. No implementation code exists, and the document set says so.",
          ],
          tech: "Optics, spectral reconstruction, radiometric calibration, sensor characterisation",
        },
        {
          when: "May 2025 – present",
          title: "Deterministic matching with selective learned fallback",
          bullets: [
            "Studies where a learned matcher earns its cost against a rule based one, using transaction reconciliation as the test bed because ground truth can be constructed and the audit requirement forbids unexplainable matches.",
            "Three passes ordered by cost: a vectorised hash join, a tolerance pass over a date window with greedy closest assignment, and a lexical similarity pass on the remainder. Blocking by amount bucket and date window reduces a 9.8 billion pair comparison to a tractable candidate set.",
            "Result: 95% match rate, zero mismatches against a synthetic ground truth with a known answer key, 4.25 seconds at 100,000 against 98,000 records, and zero inference calls. It replaced an embedding based engine that was slower, more expensive and less accurate, and both remain in the repository so the comparison is reproducible.",
            "Every match records the pass and basis that produced it, since an unexplainable match is unusable in an audited setting.",
          ],
          tech: "Python, pandas, FastAPI, PostgreSQL, Celery",
        },
        {
          when: "Feb 2026 – present",
          title: "Verification state as a first class output in an applied LLM system",
          sub: "DebugAI, a launched product used as an experimental surface.",
          bullets: [
            "Production system that assembles context for a language model from a runtime stack trace: forced inclusion of traced files, then embedding retrieval over the repository for code the trace never names, under a managed token budget, with a bounded second retrieval pass when the model reports insufficient context.",
            "Each proposed fix carries an explicit verification state: mechanically checked and passed, checked and failed, or never checked. Unchecked is displayed as unchecked rather than being presented alongside verified results.",
            "Error recurrence is tracked by SHA-256 signature per project, and a human confirmed fix is promoted to lead subsequent answers for that signature. Memory is project scoped so a fix never crosses users.",
            "Model routing by estimated difficulty with a cross provider fallback that preserves the response shape, and a cache keyed on error text, project and framework checked before any inference call.",
            "This is where the retrieval failure observed during the 2025 RAG work was addressed directly: a system that cannot report its own uncertainty produces confident wrong answers at a steady rate.",
          ],
          tech: "Python, FastAPI, TypeScript, PostgreSQL, pgvector, Redis, Anthropic and OpenAI APIs",
        },
        {
          when: "Jun – Jul 2025",
          title: "Retrieval augmented generation",
          sub: "Summer training programme, RemarkSkill Education with IIT Hyderabad.",
          bullets: [
            "Built embedding retrieval by cosine similarity with document chunking and context injection over a document corpus.",
            "Found chunk boundary selection, not prompt design, dominated answer quality: a passage split mid argument answers half a question regardless of how the query is phrased.",
            "Observed that retrieval failure produced fluent, confident, entirely wrong answers with no distinguishing signal, which became the design driver for later work on verification state.",
          ],
          tech: "Python, vector databases, embeddings, NLP",
        },
      ],
    },
    {
      title: "Applied and engineering work",
      kind: "entries",
      entries: [
        {
          when: "2025",
          title: "Telecare Nabha, Smart India Hackathon 2025",
          bullets: [
            "Telemedicine platform for a district where 31% of households have internet access and the civil hospital operates 11 doctors against 23 sanctioned posts for 173 villages. Dual channel by design, with an IVR path over a button phone alongside the app, offline first records, and live pharmacy stock.",
          ],
        },
        {
          when: "Aug 2026",
          title: "Inkline: photographed handwriting to font outlines",
          bullets: [
            "Homography based un-warp from printed fiducials, Moore neighbour boundary extraction, corner detection over an angular window, and Schneider least squares cubic fitting with Newton-Raphson reparameterisation, implemented from scratch rather than wrapped, with binary font table assembly.",
          ],
        },
        {
          when: "Mar 2026",
          title: "SecAudit: dependency free static analysis",
          bullets: [
            "60+ rules across the OWASP Top 10 in a single standard library Python file, with the false positive tradeoff chosen explicitly toward missing a real issue over flagging a safe line.",
          ],
        },
      ],
    },
    {
      title: "Technical skills",
      kind: "skills",
      skills: [
        { group: "Programming", items: "Python (primary), TypeScript, JavaScript, C, SQL" },
        { group: "Machine learning", items: "PyTorch, TensorFlow, scikit-learn, OpenCV, convolutional fine tuning, embeddings and retrieval, multimodal fusion, error analysis, evaluation design" },
        { group: "Signals and hardware", items: "PPG and IMU processing, motion artifact rejection, power budgeting, ngspice, KiCad, FreeCAD, nRF52, ESP32, MEMS sensors" },
        { group: "Systems", items: "FastAPI, PostgreSQL, Redis, Celery, Docker, pgvector, distributed job design" },
        { group: "Mathematics", items: "Linear algebra, probability and statistics, optimisation, numerical methods, geometric algorithms" },
        { group: "Currently learning", items: "Uncertainty quantification, probabilistic machine learning, diffusion models, radiometric calibration" },
      ],
    },
    { title: "Recognition and external validation", kind: "list", list: RECOGNITION },
    {
      title: "How I work",
      kind: "list",
      list: [
        "I build the deterministic baseline before the learned model, so the model's contribution is a measurable number rather than an assumption.",
        "I label every figure by how it was obtained: measured, derived, estimated, or paper only. Estimates stay labelled as estimates even when it makes the work sound smaller.",
        "I seek review early and in person. The OptiXon design went through students, a working professional and a faculty researcher before the fabrication pack was exported.",
        "I record failures with their causes. Four of fourteen projects are paused or retired, and each carries a written reason.",
      ],
    },
    {
      title: "Availability and goals",
      kind: "text",
      text: "Available for twelve or more weeks full time in summer 2027, willing to relocate. Near term goal is a research placement where I can work on signal recovery, efficient inference, or uncertainty in generated outputs under supervision. Longer term I am deciding between a PhD and industry research, and I would like to make that decision from inside a lab rather than from outside one. English fluent, Hindi native. References available on request.",
    },
  ],
};

export const DOCS: Doc[] = [ENG_RESUME, ENG_CV, RES_RESUME, RES_CV];
export const docById = (id: string) => DOCS.find((d) => d.id === id);
