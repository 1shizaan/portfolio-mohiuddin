import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "fit-percentage",
    n: "01",
    name: "Fit Percentage",
    kicker: "Geometry first, model second",
    years: "2024",
    sortKey: 20240600,
    status: "RETIRED",
    domain: "vision",
    role: "Solo",
    stack: ["Python", "OpenCV", "TensorFlow", "YOLOv8", "dlib landmarks"],
    summary:
      "Scores how well a given eyeglass frame fits a given face, from a single photo, as a percentage rather than a yes or no.",
    problem:
      "Buying glasses online is a guess. The listing gives you a frame width in millimetres and no way to compare it to your own face. Returns are the cost of that gap.",
    constraint:
      "One photo. No depth sensor, no calibration card, no second angle. Whatever the phone camera gave us was the whole input.",
    approach: [
      {
        head: "Measure the face before modelling it",
        body: "Facial landmark detection gives interpupillary distance, face width at the temples, and temple length. Those three numbers are the same ones an optician measures by hand, so the feature set was decided by the domain and not by a search over features.",
      },
      {
        head: "Ship the ruler before the classifier",
        body: "The first working version had no learned component at all. It compared frame dimensions to face dimensions with plain arithmetic and a tolerance band. That version already scored around 70 percent agreement with human judgement.",
      },
      {
        head: "Add the model only where geometry ran out",
        body: "The learned layer was added for the cases geometry could not describe: bridge fit against nose shape, and how a frame sits on faces where the landmark ratios are unusual. Accuracy went to roughly 85 percent.",
      },
    ],
    hardPart: {
      head: "Scale is unknowable from one photo",
      body: "A face 30cm from the lens and a face 60cm from the lens produce the same pixel geometry if the second face is twice as large. Every absolute measurement in millimetres was therefore a lie. The fix was to stop measuring absolutes and work entirely in ratios anchored to interpupillary distance, which is the most stable proportion on a human face.",
    },
    metrics: [
      {
        value: "85",
        unit: "%",
        label: "Agreement with human fit judgement",
        provenance: "MEASURED",
        source: "Held-out photo set, 2024. Author benchmark, not an external study.",
      },
      {
        value: "70",
        unit: "%",
        label: "Same task, geometry only, no learned model",
        provenance: "MEASURED",
        source: "Same set. This is the number that decided the architecture.",
      },
    ],
    wrong: [
      "The first version reported millimetres. It should never have reported an absolute unit from a single uncalibrated photo, and the numbers looked authoritative while being meaningless.",
      "Landmark detection degraded badly on faces at an angle, and there was no confidence output to say so. It answered every time, including when it should have declined.",
    ],
    learned:
      "A 15 point gain from a learned model reads very differently once you know the baseline was 70 and not zero. I now build the deterministic version first specifically so I can see what the model is actually worth.",
  },

  {
    slug: "ss-categorise",
    n: "02",
    name: "SS Categorise",
    kicker: "The same problem, two years apart",
    years: "2024, rebuilt 2026",
    sortKey: 20240900,
    status: "SHIPPED",
    domain: "ml",
    role: "Solo on v1, architecture and fusion on v2",
    stack: ["PyTorch", "EfficientNet-B3", "OCR", "TF-IDF", "scikit-learn", "Streamlit"],
    demo: "fusion",
    summary:
      "Sorts a phone screenshot roll into 20 categories. Version one looked at pixels. Version two reads the words in the image too, and that is where the accuracy came from.",
    problem:
      "A screenshot folder is a landfill. Receipts, recipes, bank transfers, half-read articles and memes go in, nothing comes out, and search does not work because the content is pixels and not text.",
    constraint:
      "1,297 labelled images across 20 classes. That is a small dataset by any standard, and several classes are visually identical to each other. A receipt, a plain quote card and a bank statement are all dark text on a white rectangle.",
    approach: [
      {
        head: "v1: a single vision model, 2024",
        body: "A ResNet fine-tuned on roughly 12,000 scraped images with K-means used to propose groupings before labelling. It reached the high 80s and then stopped improving, and adding data did not move it.",
      },
      {
        head: "Diagnose before rebuilding",
        body: "The confusion matrix showed the errors were concentrated in the text-heavy classes. The model was not weak, it was blind to the one signal that separated those classes, which was the text itself.",
      },
      {
        head: "v2: fuse two views of the same image",
        body: "An EfficientNet-B3 embedding for what the image looks like, concatenated with a 500 term TF-IDF vector over OCR text for what the image says. A logistic regression on the joined vector does the classification. The final classifier is deliberately the simplest part of the system.",
      },
    ],
    hardPart: {
      head: "Fusion is where accuracy is won or quietly lost",
      body: "Concatenating a 1,500 dimensional dense embedding with a 500 dimensional sparse TF-IDF vector lets the dense half dominate on scale alone. Getting 96.92 percent meant treating the join as a real modelling decision rather than a numpy call, and keeping the head linear so the contribution of each half stayed inspectable.",
    },
    plates: [
      {
        src: "/plates/sscategorise-training.png",
        alt: "Training and validation loss, and validation accuracy per epoch, for the vision only model",
        title: "Vision only, twenty epochs",
        caption:
          "EfficientNet-B3 on images alone. Training loss keeps falling, validation loss flattens around 1.14 after epoch 7, and validation accuracy stops at 80.8 percent. That gap is the whole argument for adding the OCR channel, which is what moved the held-out figure to 96.92 percent.",
        provenance: "MEASURED",
        source: "training_curves.png from the v2 run. Best epoch marked at 80.8 percent.",
        tone: "paper",
        wide: true,
      },
    ],
    metrics: [
      {
        value: "96.92",
        unit: "%",
        label: "Fusion accuracy across 20 classes",
        provenance: "MEASURED",
        source: "260 image held-out test set. Full per-class report in fusion_classification_report.txt.",
      },
      {
        value: "8",
        label: "Classes at perfect precision and recall",
        provenance: "MEASURED",
        source: "Same report. Automotive, Books, Entertainment, Government, Nature, Productivity, Receipts, Sports.",
      },
      {
        value: "0.900",
        label: "Worst class F1, Food and Dining",
        provenance: "MEASURED",
        source: "Recall 0.818. Food photos with no text land in Recipes, which is the honest failure of the design.",
      },
      {
        value: "1,297",
        label: "Labelled images, 20 classes",
        provenance: "DERIVED",
        source: "File count under data/categorized_images.",
      },
    ],
    wrong: [
      "Two classes still trade errors: Food and Dining against Recipes, and Social Media Screens against everything else with a header bar. Both are cases where OCR returns almost nothing and the fusion degrades to v1.",
      "The 2024 version was reported as 90 percent training accuracy, which is the number that flatters you, not the one that predicts behaviour. The v2 number is a held-out test set and the two are not comparable.",
    ],
    learned:
      "The gap between 90 and 97 was not a better model. It was noticing that the input was missing a channel. Most of my accuracy gains since have come from the same move.",
    scale: [
      { label: "Classes", value: "20" },
      { label: "Test set", value: "260 images" },
      { label: "Head", value: "Logistic regression" },
    ],
  },

  {
    slug: "agent-era",
    n: "03",
    name: "The agent detour",
    kicker: "Three months, killed on purpose",
    years: "Mar to May 2025",
    sortKey: 20250300,
    status: "RETIRED",
    domain: "product",
    role: "Solo",
    stack: ["FastAPI", "React", "OpenAI API", "Mailgun", "Postmark", "Docker", "SQLite"],
    summary:
      "A cold email campaign agent, a LinkedIn posting agent, and the scrapers that fed them. All of it worked. I shut it down anyway.",
    problem:
      "Outreach is repetitive, so it looks like the obvious thing to automate. Write once, personalise per recipient, schedule, track replies.",
    constraint:
      "Free tier API limits capped the system at roughly 20 sends a day, which forced a queue, batching and retry logic earlier than a funded version would have needed them. That constraint turned out to be the only good thing about the project.",
    approach: [
      {
        head: "Built the whole pipeline",
        body: "Recipient scraping, per recipient content generation, scheduling, delivery through Mailgun and Postmark, bounce handling, reply logging, and a React dashboard over the top. Containerised, deployed, functional.",
      },
      {
        head: "Then read the outbox",
        body: "The personalisation was collapsing. Given a hundred different recipients the model produced a hundred near identical emails, because the underlying instruction dominated the per recipient signal. Every message was individually plausible and collectively a form letter.",
      },
      {
        head: "Called it what it was",
        body: "It was a bulk sender with a language model attached, not an agent. I stopped rather than adding another layer of prompt engineering on top of a thing whose premise was wrong.",
      },
    ],
    hardPart: {
      head: "The failure was invisible from inside the system",
      body: "Every metric was green. Emails sent, deliverability fine, no errors in the logs, dashboard healthy. Nothing in the instrumentation measured whether the output was any good, because output quality was assumed rather than tested. I only found it by opening the sent folder and reading twenty emails in a row.",
    },
    metrics: [
      {
        value: "3",
        label: "Months invested before stopping",
        provenance: "MEASURED",
        source: "March to May 2025.",
      },
      {
        value: "20",
        label: "Sends per day the free tier allowed",
        provenance: "MEASURED",
        source: "Provider limit. Drove the queue and batching design.",
      },
    ],
    wrong: [
      "Nothing in the system tested output quality. Every check was operational. That is the actual bug and it took three months to see.",
      "I picked the problem because it was a fun build, not because anyone was suffering from it. The next project I picked was chosen the other way round.",
    ],
    learned:
      "A pause is not a failure and it is also not a defeat you dress up afterwards. I stopped, wrote down why, and went looking for a problem that was boring and real. That search produced MatchLedger.",
  },

  {
    slug: "rag-qa",
    n: "04",
    name: "RAG Q&A system",
    kicker: "Retrieval, done properly, once",
    years: "Jun to Jul 2025",
    sortKey: 20250600,
    status: "SHIPPED",
    domain: "ml",
    role: "Trainee, summer programme",
    stack: ["Python", "Vector DB", "Embeddings", "Chunking", "Generative models"],
    summary:
      "A document question answering system built during a four week Generative AI programme run by RemarkSkill Education with IIT Hyderabad.",
    problem:
      "A model answering questions about a document set it was never trained on has to be handed the right passages first. Everything interesting happens before generation.",
    constraint:
      "Four weeks, and a context window small enough that retrieval quality decided answer quality.",
    approach: [
      {
        head: "Chunking is the real hyperparameter",
        body: "Chunk boundaries decide what can be retrieved at all. Split mid argument and the retrieved passage answers half a question. Most of the tuning went here rather than into the prompt.",
      },
      {
        head: "Cosine retrieval, then injection",
        body: "Embed the corpus, embed the query, rank by cosine similarity, inject the top passages as context. Standard and worth building by hand once, because it removes the mystery from every retrieval system you touch afterwards.",
      },
    ],
    hardPart: {
      head: "Confident answers over passages that never contained the answer",
      body: "When retrieval missed, the system still produced a fluent, well formatted, entirely wrong response. There was no visible difference between a good answer and a hallucinated one. That is the observation that later became the whole design of DebugAI, where every claim ships with a verification state.",
    },
    metrics: [
      {
        value: "4",
        label: "Week programme, completed",
        provenance: "MEASURED",
        source: "RemarkSkill Education with IIT Hyderabad, June to July 2025.",
      },
    ],
    wrong: [
      "I treated embeddings as a black box. I could use them and could not explain why one model beat another on my corpus, which is exactly the gap that pushed me toward research applications.",
    ],
    learned:
      "Recognised for technical soundness and collaboration at the end of the programme. The lasting piece was smaller than the certificate: a retrieval system that cannot say I do not know is a system that lies at a steady rate.",
  },

  {
    slug: "matchledger",
    n: "05",
    name: "MatchLedger AI",
    kicker: "The engine that stopped calling the API",
    years: "May 2025 to now",
    sortKey: 20250500,
    status: "PAUSED",
    domain: "systems",
    role: "Solo, founder",
    stack: ["FastAPI", "PostgreSQL", "Celery", "Redis", "pandas", "React 19", "Docker", "AWS EC2"],
    demo: "matchledger",
    featured: true,
    summary:
      "Bank reconciliation at 100,000 rows a side. Three passes, cheapest first, and by the third pass there is almost nothing left to be expensive about.",
    problem:
      "Reconciliation is matching one list of transactions against another and explaining every row that does not line up. It is done by hand, monthly, by people whose time is expensive, and getting it wrong is an audit problem rather than an inconvenience.",
    constraint:
      "I had limited API credits. That single constraint produced the architecture, because at a fraction of a cent per embedding call, 100,000 rows compared naively is both slow and expensive enough to be unshippable.",
    approach: [
      {
        head: "Pass one: exact, vectorised",
        body: "A hash join on amount, date and reference number. A pandas merge, no Python loop, no API call. The majority of real transactions resolve here because most transactions are not ambiguous.",
      },
      {
        head: "Pass two: tolerance",
        body: "Exact amount, date inside a configurable window, three days by default, because banks clear on their own schedule. Also vectorised, with greedy assignment to the closest date so a single ledger row cannot claim two bank rows.",
      },
      {
        head: "Pass three: fuzzy, blocked",
        body: "Narration similarity, run only on what survived the first two passes. Candidates are blocked by amount bucket and date window before any comparison happens, so the pass never degenerates into a full cross product. rapidfuzz when present, stdlib difflib when not.",
      },
      {
        head: "Every match carries its reason",
        body: "A match without an audit trail is useless to the person who has to sign off on it, so each result records which pass produced it and on what basis. Stored encrypted at rest with AES.",
      },
    ],
    hardPart: {
      head: "Blocking is the difference between four seconds and never finishing",
      body: "Naive matching compares every ledger row to every bank row. At 100,000 against 98,000 that is 9.8 billion comparisons. Blocking on amount bucket and date window first means only plausible pairs are ever compared, which is what turns an intractable problem into a four second one. The embedding engine that came first is still in the repository, and the comparison between the two is the most useful thing in it.",
    },
    metrics: [
      {
        value: "4.25",
        unit: "s",
        label: "100,000 ledger rows against 98,000 bank rows",
        provenance: "MEASURED",
        source: "Benchmark run 2026-07-19 on a local machine, synthetic data with known ground truth.",
      },
      {
        value: "95",
        unit: "%",
        label: "Match rate on that run",
        provenance: "MEASURED",
        source: "Same run. Ground truth was 70% exact, 15% date shifted, 10% fuzzy narration, 5% genuinely unmatched.",
      },
      {
        value: "0",
        label: "API calls in the matching path",
        provenance: "MEASURED",
        source: "The rule engine needs no key at all. Previous engine called an embedding API per unresolved row.",
      },
      {
        value: "0",
        label: "Mismatches against ground truth",
        provenance: "MEASURED",
        source: "Same run. Precision on the synthetic set, not a claim about real bank data.",
      },
    ],
    wrong: [
      "The first engine used embeddings for everything, which cost money per row and was worse. Replacing it was a rewrite, not a tune.",
      "The original custom narration matching module was lost before it was committed. The zero cost engine exists partly because I had to rebuild that capability from scratch and chose a different approach the second time.",
      "The frontend fell back to the production API URL when a local env file was missing, so a local dev session could silently talk to production. That is written at the top of the project notes now.",
    ],
    learned:
      "Paused deliberately. People do not hand confidential financial data to an individual, they hand it to a registered company, and no amount of engineering fixes that. The engine is finished and waiting on a legal entity, which is the correct order.",
    scale: [
      { label: "Tracked files", value: "126" },
      { label: "Lines, backend", value: "14,354" },
      { label: "Services", value: "api, worker, postgres, redis" },
    ],
  },

  {
    slug: "optixon",
    n: "06",
    name: "OptiXon",
    kicker: "Health sensing inside a pair of glasses",
    years: "2024 to Jul 2026",
    sortKey: 20241100,
    status: "PAPER",
    domain: "hardware",
    role: "Founder and technical lead",
    stack: ["nRF52832", "MAX30102 PPG", "LSM6DSOX IMU", "KiCad", "FreeCAD", "ngspice", "nRF5 SDK", "C"],
    featured: true,
    summary:
      "A full hardware and firmware design for a health sensing eyeglass temple arm. Fabrication pack exported, firmware compiles, and no physical unit exists yet. That distinction is stated on every claim.",
    problem:
      "Continuous health monitoring means wearing something extra. Glasses are already worn all day by a billion people and already touch the superficial temporal artery, which is where a pulse can be read.",
    constraint:
      "A temple arm is 138mm long and about 10.5mm wide, tapering to a few millimetres. Everything has to fit inside that: the sensor, the microcontroller, the radio, the battery, and the battery protection circuit. It also has to run all day and never get hot against skin.",
    approach: [
      {
        head: "Power decided the parts list",
        body: "A power budget was written before parts were chosen. Moving from ESP32 to the nRF52 family cut the power draw by roughly 82 percent on that budget, which is the difference between a device you charge at lunch and one you charge overnight.",
      },
      {
        head: "The IMU is a noise gate, not a feature",
        body: "PPG is destroyed by motion. Every step, every head turn, corrupts the waveform. The gyroscope is there to detect motion and mark those samples as untrusted before signal processing, so the system discards bad data rather than averaging it into a plausible wrong answer.",
      },
      {
        head: "Scripted, not drawn",
        body: "The board, the enclosure and the routing are generated by Python against KiCad and FreeCAD rather than drawn by hand, so any change can be re-run and re-verified instead of re-drawn.",
      },
      {
        head: "Three independent checks on the safety circuit",
        body: "The lithium battery protection circuit pin mapping was verified against the primary datasheet, against the reference application topology, and in ngspice simulation.",
      },
    ],
    hardPart: {
      head: "A wrong pin map that would have silently removed all battery protection",
      body: "The DW01A and FS8205A protection pairing had a mapping error that passed visual review. The circuit would have powered up, charged, discharged and behaved normally in every test, while providing no overcurrent or overdischarge protection at all. On a lithium cell against a person's head. It is entries 37 and 38 in the bug log, and it is the reason the validation guide refuses to let you skip the current limited smoke test.",
    },
    plates: [
      {
        src: "/plates/optixon-pcb-top.png",
        alt: "KiCad 3D render, component side of the OptiXon v1 flex rigid board",
        title: "Component side, as the board file draws it",
        caption:
          "The 138 by 10.5mm four layer flex rigid outline. Battery tab at the hinge end on the left, the rigid island carrying the nRF52832 and the power path in the middle, the sensor tip on the right, two flex necks joining them. This is the fabrication geometry rendered, not a photograph of a board, because no board has been made.",
        provenance: "DERIVED",
        source: "kicad-cli 3D render of hardware/kicad/optixon-v1/optixon-v1.kicad_pcb.",
        wide: true,
      },
      {
        src: "/plates/optixon-pcb-bottom.png",
        alt: "KiCad 3D render, sensor side of the OptiXon v1 board",
        title: "Sensor side",
        caption:
          "The B face. It carries the MAX30102 optical window at the tip and the pads the antenna keepout is measured from. This is the face that sits against the head, which is why the thermal figure on this page is a projection and stays tagged as one.",
        provenance: "DERIVED",
        source: "Same board file, bottom view.",
        wide: true,
      },
      {
        src: "/plates/optixon-protection.png",
        alt: "ngspice sweep comparing the original and corrected battery protection topology",
        title: "Bug log 37, the sweep that caught it",
        caption:
          "Cell voltage swept from 2.0 to 4.5V through both topologies. Red is the original pin mapping: load current rises straight through both trip points, so protection never engages. Green is the corrected one, cutting off at 2.40V and clamping at 4.30V. The circuit that would have shipped looked healthy in every way except this one.",
        provenance: "DERIVED",
        source: "ngspice, design/05-simulation. A simulator agreeing is not a bench measurement.",
        tone: "paper",
      },
      {
        src: "/plates/optixon-enclosure.png",
        alt: "Hidden line projection of the OptiXon temple enclosure, side profile and plan view",
        title: "Enclosure fit check, side profile and plan",
        caption:
          "Hidden line projection out of the scripted FreeCAD model. Grey is the shell, green is the real PCB outline and thickness, red is each component clearance box at its real height. The drawing calls itself a concept and a first pass fit check, and it stays that way until something has been printed and test fitted.",
        provenance: "DERIVED",
        source:
          "TechDraw projection of design/04-mechanical/optixon-v1-enclosure.step. Envelope 144.1 by 12.5 by 7.2mm, shell mass 2.55g per temple.",
        tone: "paper",
      },
    ],
    metrics: [
      {
        value: "51",
        label: "Logged findings, symptom to root cause to fix",
        provenance: "DERIVED",
        source: "design/BUG-LOG.md. Two are field failure class safety bugs found before fabrication.",
      },
      {
        value: "0 / 0",
        label: "Electrical rule check errors and warnings",
        provenance: "MEASURED",
        source: "KiCad ERC on the exported schematic. Netlist machine verified.",
      },
      {
        value: "18 to 24",
        unit: "h",
        label: "Projected battery life on a 200mAh cell",
        provenance: "ESTIMATED",
        source: "Power budget plus duty cycled sampling. No hardware has confirmed this.",
      },
      {
        value: "<28",
        unit: "°C",
        label: "Projected component temperature against skin",
        provenance: "ESTIMATED",
        source: "Thermal analysis on paper. Not measured on a built unit.",
      },
      {
        value: "138 × 10.5",
        unit: "mm",
        label: "Four layer flex-rigid board, IP54 target",
        provenance: "PAPER",
        source: "Board outline in the exported fabrication pack.",
      },
    ],
    wrong: [
      "The version 3.0 feasibility documents this project audited contained errors serious enough that correcting them became the first phase of work. I had written those documents.",
      "No prototype exists. Every performance number here is a calculation and is tagged as one. A design that has never met a soldering iron has not been validated, and calling the paper phase complete is not the same as calling the product real.",
    ],
    learned:
      "Second place at Techno Udbhav 2025, an inter college research competition. I showed the idea and the workflow to M.Tech students at IIT Hyderabad and to a working circuit design professional. Both said it was feasible and both suggested changes. A professor I wrote to never replied, which is the ordinary outcome and not a reason to stop. Going and asking is cheaper than being wrong for six months, and nobody supervised this: every decision in it is mine.",
    scale: [
      { label: "Generator and design code", value: "17,805 lines" },
      { label: "Documented findings", value: "51" },
      { label: "Firmware", value: "Builds against nRF5 SDK" },
    ],
  },

  {
    slug: "telecare",
    n: "07",
    name: "Telecare Nabha",
    kicker: "Built for the network that is not there",
    years: "2025",
    sortKey: 20250900,
    status: "SHIPPED",
    domain: "product",
    role: "Team Glitch Guardians, Smart India Hackathon 2025",
    stack: ["Flask", "React", "Vite", "SQLite", "IVR", "Offline-first storage"],
    summary:
      "A telemedicine platform for 173 villages around Nabha, Punjab, built for a place where 31 percent of households have internet and the hospital runs at half staff.",
    problem:
      "Nabha Civil Hospital has 11 doctors against 23 sanctioned posts and serves 173 villages. Patients lose a day of wages travelling in, and then find the specialist is not there or the medicine is out of stock.",
    constraint:
      "Only 31 percent of rural Punjab households have internet access. An app that assumes connectivity solves the problem for the people who already had options.",
    approach: [
      {
        head: "Two channels, not one",
        body: "A smartphone app for those who have one, and an IVR path over a button phone for those who do not. The second channel is the one that decides whether the project means anything.",
      },
      {
        head: "Records that work offline",
        body: "Health records stored locally and reconciled when a connection appears, so a consultation is not blocked by signal.",
      },
      {
        head: "Live pharmacy stock",
        body: "The specific failure described in the problem statement is travelling in and finding the medicine gone. Stock visibility before travel is a small feature that removes a wasted day.",
      },
    ],
    hardPart: {
      head: "Low bandwidth is a design constraint, not a performance target",
      body: "Every feature had to survive being on the far side of a bad connection, which rules out video first flows, large payloads, and anything that fails closed when the network drops. The symptom checker had to be usable in that environment too, which pushes it toward something small and local rather than a call out to a hosted model.",
    },
    metrics: [
      {
        value: "173",
        label: "Villages served by the target hospital",
        provenance: "REPORTED",
        source: "SIH 2025 problem statement PS25018.",
      },
      {
        value: "11 / 23",
        label: "Doctors in post against sanctioned posts",
        provenance: "REPORTED",
        source: "Same problem statement.",
      },
      {
        value: "31",
        unit: "%",
        label: "Rural Punjab households with internet access",
        provenance: "REPORTED",
        source: "Same problem statement. This is the number the whole design answers to.",
      },
      {
        value: "10,757",
        label: "Lines of application code",
        provenance: "DERIVED",
        source: "Line count across backend and both frontends.",
      },
    ],
    wrong: [
      "Three frontends exist in the repository because the interface was restarted twice under time pressure. That is what a hackathon deadline does to a codebase and it is visible in the tree.",
      "The offline reconciliation was never tested against a genuinely intermittent connection, only against being fully offline. Those are different failure modes and the harder one went untested.",
    ],
    learned:
      "The interesting constraint was not medical and it was not AI. It was that a third of the users cannot receive a web page. Designing for the phone that cannot browse changed every decision after it.",
  },

  {
    slug: "debugai",
    n: "08",
    name: "DebugAI",
    kicker: "The bug stops here",
    years: "Feb 2026 to now",
    sortKey: 20260217,
    status: "LIVE",
    domain: "product",
    role: "Solo founder, every layer",
    stack: [
      "Next.js 15",
      "Express",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "pgvector",
      "Claude",
      "VS Code API",
      "MCP",
      "Paddle",
      "Railway",
      "Vercel",
    ],
    featured: true,
    summary:
      "A debugging system that reads the stack trace and the files around it and hands back a fix you apply in one click. It ships three ways: an editor extension on the VS Code Marketplace, the same extension on Open VSX for Cursor and Windsurf, and a standalone MCP server on npm that coding agents call with no editor involved. Launched on real payment keys, with paying infrastructure behind it.",
    problem:
      "A copilot writes code. When that code throws at runtime, the useful context is spread across a stack trace, the files it names, the files it does not name, the branch you are on, and whether anyone on your team hit this exact error last week. Pasting an error into a chat box discards all of it.",
    constraint:
      "One person, and inference costs money per call. Every architectural decision is downstream of the fact that a debug request has to be cheap enough to give away ten a day for free.",
    approach: [
      {
        head: "The extension already has the context",
        body: "The exception fires and the extension already holds the trace, the branch, the changed files and the diff summary from the VS Code git API. Nothing is pasted.",
      },
      {
        head: "Retrieve the files the trace does not mention",
        body: "Stack trace paths force inclusion of the files actually involved, then pgvector embeddings over the repository pull in related code the trace never names, inside a managed context budget.",
      },
      {
        head: "Route by difficulty, not by tier",
        body: "Simple and moderate errors go to a small fast model, cross file and complex errors on paid tiers go to a larger one, and an outage falls back to a different provider entirely. Same response shape either way, so nothing downstream knows or cares.",
      },
      {
        head: "Remember what worked",
        body: "Every error gets a SHA-256 signature. When the same signature reappears in the same project, the fix a human confirmed last time leads the answer. Seen before and fixed before are different badges because they are different claims.",
      },
      {
        head: "Cache before you spend",
        body: "A SHA-256 key over error text, project and framework hint, checked in Redis before any model call. One hour for project aware answers, 24 for generic ones.",
      },
    ],
    hardPart: {
      head: "Saying not verified when saying verified would sell better",
      body: "The system distinguishes a fix that was mechanically checked and passed, a fix that was checked and failed, and a fix that was never checked at all. Never checked is displayed as never checked. It is the least flattering thing on the screen and it is the only reason the confirmed fixes mean anything. The same instinct runs through the whole product: installs and downloads are different numbers, only one of them sums, and published copy once said 750 installs when the true count was 193. That mistake is written into the repository instructions so it cannot happen twice.",
    },
    metrics: [
      {
        value: "512",
        label: "VS Code Marketplace installs",
        provenance: "MEASURED",
        source: "Live Marketplace API, verified 2026-08-23. The only true install count.",
      },
      {
        value: "5,800+",
        label: "Combined downloads, Marketplace, Open VSX and npm",
        provenance: "MEASURED",
        source: "Three public registry APIs, same date. Downloads sum. Installs do not.",
      },
      {
        value: "879",
        label: "Commits between 2026-02-17 and 2026-08-22",
        provenance: "DERIVED",
        source: "git log on the monorepo.",
      },
      {
        value: "519",
        label: "Engine tests passing",
        provenance: "MEASURED",
        source: "pytest on apps/engine. 32 more test files on the API.",
      },
      {
        value: "184,224",
        label: "Lines across 891 tracked files",
        provenance: "DERIVED",
        source: "git ls-files on the monorepo, including migrations and documentation.",
      },
    ],
    wrong: [
      "Published copy claimed 750 installs while the real number was 193, because two different metrics were summed. The rule that separates them is now written into the repository instructions and a live check verifies it.",
      "An hourly cron pointed at the marketing domain instead of the API host, returned 404 for days, and trials silently never expired. The tier guard in the hot path exists because the cron cannot be trusted to be alive.",
      "The first version of the in-app announcement system broke the design system three ways in one component. It got rewritten against the rules rather than argued with.",
    ],
    learned:
      "Launched June 1 2026 on the Marketplace and Product Hunt. The distribution lesson cost more than the engineering one: announcing to people who know you converts at zero, and strangers who have the specific problem convert. Nothing about that is fixable with better code.",
    scale: [
      { label: "Apps in the monorepo", value: "5" },
      { label: "Commits", value: "879" },
      { label: "Session logs kept", value: "44" },
    ],
    links: [{ label: "debugai.io", href: "https://debugai.io" }],
  },

  {
    slug: "secaudit",
    n: "09",
    name: "SecAudit",
    kicker: "One file, no dependencies, no upload",
    years: "Mar 2026",
    sortKey: 20260315,
    status: "SHIPPED",
    domain: "security",
    role: "Solo, open source",
    stack: ["Python standard library only"],
    demo: "secaudit",
    summary:
      "A static security scanner in a single Python file with zero dependencies. Point it at a directory, get findings mapped to the OWASP Top 10, and nothing leaves the machine.",
    problem:
      "Running a security scan usually means signing up, uploading your source to someone else's infrastructure, and installing a dependency tree larger than the project being scanned. For a solo developer that friction means the scan does not happen.",
    constraint:
      "The Python standard library and nothing else. No pip install, no virtualenv, no API key, no network. A file you can curl and run.",
    approach: [
      {
        head: "60 plus rules across the OWASP Top 10",
        body: "Hardcoded credentials, SQL and command injection, JWT algorithm none, verification disabled, secrets in frontend environment variables, tokens in localStorage, CORS wildcards, missing rate limits on auth and inference endpoints, pickle and yaml deserialisation, path traversal, XXE, shell=True, catastrophic regex.",
      },
      {
        head: "Language agnostic by pattern",
        body: "Python, JavaScript, TypeScript, React, FastAPI, Flask, Node, Go, Ruby and PHP, because the vulnerable patterns are more portable than the syntax around them.",
      },
      {
        head: "Output that fits a pipeline",
        body: "Text, HTML or JSON, with a severity filter, so it can be read by a person or gated on in CI.",
      },
    ],
    hardPart: {
      head: "A scanner that cries wolf gets uninstalled",
      body: "Static pattern matching produces false positives, and a tool with a bad signal to noise ratio is worse than no tool because it trains you to ignore it. The rules are written to prefer missing a real issue over flagging a safe line, and severity is assigned by what an attacker gains rather than by how alarming the pattern looks.",
    },
    metrics: [
      {
        value: "60+",
        label: "Rules across the OWASP Top 10",
        provenance: "MEASURED",
        source: "Rule table in secaudit.py.",
      },
      {
        value: "0",
        label: "Third party dependencies",
        provenance: "DERIVED",
        source: "No requirements file. Standard library imports only.",
      },
      {
        value: "<2",
        unit: "s",
        label: "Scanning a 12,000 line codebase",
        provenance: "MEASURED",
        source: "Author benchmark, recorded in the README. Not an independent test.",
      },
      {
        value: "1,035",
        label: "Lines in the single file",
        provenance: "DERIVED",
        source: "wc -l on secaudit.py.",
      },
    ],
    wrong: [
      "Pattern matching cannot follow data flow, so it cannot tell a sanitised input from an unsanitised one. It finds shapes, not proofs, and the README says so rather than implying otherwise.",
      "The rule set reflects the stacks I work in. Coverage for Go, Ruby and PHP is real but thinner than for Python and TypeScript.",
    ],
    learned:
      "Written after doing a full security remediation pass on DebugAI by hand. Most of the rules are mistakes I had made myself, which is why the wording of each finding explains the attack rather than naming the pattern.",
  },

  {
    slug: "deconstruct",
    n: "10",
    name: "Deconstruct",
    kicker: "Reverse engineer any edit",
    years: "Jul 2026",
    sortKey: 20260714,
    status: "SHIPPED",
    domain: "media",
    role: "Solo",
    stack: ["FastAPI", "ffmpeg", "PySceneDetect", "librosa", "Demucs", "OpenCV", "RapidOCR", "React", "Vite", "SSE"],
    summary:
      "Drop in a video and get back how it was made. Separated audio stems, every cut, the easing curve on each camera move, the colour grade, and when every caption appeared.",
    problem:
      "Studying motion design from a finished video means scrubbing a timeline and guessing. The project file is gone, the layers are flattened, and the technique is buried in the pixels.",
    constraint:
      "Runs entirely on a local machine with no cloud, no upload and no GPU assumed. Stem separation on CPU takes one to three minutes per minute of video, and the design has to stay usable at that speed.",
    approach: [
      {
        head: "Separate the audio, then the picture",
        body: "Demucs splits music, voice, drums, bass and everything else into downloadable stems, so the sound design can be heard in isolation rather than described.",
      },
      {
        head: "Match cuts against the beat grid",
        body: "Scene detection finds every cut, librosa finds the BPM and beat positions, and the timeline colours each cut green when it lands on a beat and red when it does not. That single comparison is what teaches edit rhythm.",
      },
      {
        head: "Name the easing curve",
        body: "Optical flow measures the camera move per shot, and the motion profile is matched to a named CSS cubic-bezier you can copy straight into code. An abstract observation becomes a usable value.",
      },
      {
        head: "Edit what you found",
        body: "Detected text can be retyped, recoloured or removed with the original pixels inpainted, and any palette colour can be swapped across the whole video with live preview.",
      },
    ],
    hardPart: {
      head: "Long analyses that must not look frozen",
      body: "A full breakdown runs for minutes across a dozen stages. The pipeline streams progress over server sent events per stage, queues additional videos rather than running them in parallel, and skips stems above twelve minutes of runtime so the rest of the analysis still finishes. Choosing what to degrade is the design.",
    },
    metrics: [
      {
        value: "1 to 3",
        unit: "min",
        label: "Stem separation per minute of video, CPU only",
        provenance: "MEASURED",
        source: "Recorded in the README from local runs.",
      },
      {
        value: "12",
        unit: "min",
        label: "Runtime above which stems are skipped",
        provenance: "MEASURED",
        source: "Hard limit in the pipeline. Every other stage still runs.",
      },
      {
        value: "10,658",
        label: "Lines across 68 tracked files",
        provenance: "DERIVED",
        source: "git ls-files.",
      },
    ],
    wrong: [
      "A rendered video is flat pixels and the original layers cannot be recovered. The README says this in the second paragraph rather than letting the feature list imply otherwise.",
      "Text inpainting works on flat and graphic backgrounds and degrades visibly on textured ones. Stated as a limit rather than hidden behind a demo clip that avoids the failure case.",
    ],
    learned:
      "The heavy data path deliberately lives outside OneDrive, because the first version synced several gigabytes of extracted frames to the cloud before anyone noticed.",
  },

  {
    slug: "inkline",
    n: "11",
    name: "Inkline",
    kicker: "Your handwriting, as a real font",
    years: "Aug 2026",
    sortKey: 20260812,
    status: "SHIPPED",
    domain: "graphics",
    role: "Solo",
    stack: ["Next.js", "TypeScript", "Canvas", "opentype.js", "pako", "IndexedDB", "Playwright"],
    demo: "tracer",
    featured: true,
    summary:
      "Print a sheet, write one character per box, photograph it. Get back an installable OTF and WOFF with real Bézier outlines and hand built kerning. Nothing leaves the browser.",
    problem:
      "Turning handwriting into a font is a specialist job or a subscription service that uploads your writing to a server and gives you back something you do not own.",
    constraint:
      "Everything runs client side. No server, no account, no upload. And the tracer could not wrap Potrace, because Potrace is GPL and would attach itself to any font somebody sold.",
    approach: [
      {
        head: "The sheet is generated by the same geometry that reads it",
        body: "Four corner squares define the reference frame, a pip beside one of them removes rotation ambiguity, and four dots encode the sheet number in binary. Guides print in non photo blue, which sits near white in the red channel the extractor thresholds on, so they vanish without any cleanup step.",
      },
      {
        head: "Un-warp before you look at letters",
        body: "Red channel, adaptive threshold, connected components to locate the corners, homography, bilinear un-warp onto the frame rectangle. Once the frame is a known rectangle every cell is at a known position, so there is no letter level alignment guesswork anywhere in the pipeline.",
      },
      {
        head: "A tracer written from scratch",
        body: "Moore neighbour boundary following with hole detection, staircase smoothing, corner detection over an angular window, then Schneider least squares cubic fitting with Newton-Raphson reparameterisation. Winding is normalised so the counter inside an o renders as a hole under the non-zero fill rule.",
      },
      {
        head: "Splice the kern table by hand",
        body: "opentype.js cannot write kerning, so the kern table is assembled manually and spliced into the finished binary. Table directory rebuilt, offsets re-paged, head checksum recomputed.",
      },
    ],
    hardPart: {
      head: "Proving the whole chain actually works",
      body: "Every stage can look correct and still produce a font that will not install. The end to end test generates a synthetic photograph of a filled sheet, tilted, shadowed and noisy, drives a headless browser through the studio, downloads the OTF the app produced, and parses it back. That round trip is the only real proof, and it runs on every change.",
    },
    plates: [
      {
        src: "/plates/inkline-sheet.jpg",
        alt: "Synthetic photograph of a filled handwriting sheet, tilted, with four corner fiducials",
        title: "What the scanner is handed",
        caption:
          "The synthetic sheet the end to end test photographs. Four corner fiducials, a perspective tilt, an uneven lighting gradient across the page. Find the markers, unwarp, segment the cells, then trace. Any stage getting it wrong fails the round trip and turns the test red.",
        provenance: "DERIVED",
        source: "test/fixtures/sheet-1.png, the fixture the Playwright round trip runs against.",
        tone: "paper",
      },
    ],
    metrics: [
      {
        value: "4",
        label: "Independent pipeline stages, each testable alone",
        provenance: "DERIVED",
        source: "template, scan, trace, build. Pure modules with no shared state.",
      },
      {
        value: "0",
        label: "Bytes uploaded anywhere",
        provenance: "DERIVED",
        source: "Static build. No network calls in the pipeline.",
      },
      {
        value: "5",
        label: "Test suites including a real browser round trip",
        provenance: "MEASURED",
        source: "tracer, glyph derivation, font binary, scan pipeline, and the Playwright end to end.",
      },
      {
        value: "6,928",
        label: "Lines of source",
        provenance: "DERIVED",
        source: "Line count under src.",
      },
    ],
    wrong: [
      "Greyscale printing leaves the guide rules visible in the red channel, so a separate de-ruling step had to be added for sheets that were not printed in colour. It was found by printing on the wrong printer.",
      "Bitmaps are the source of truth and outlines are always re-derived, which is correct and also means a trace settings change invalidates every cached outline at once.",
    ],
    learned:
      "The licence question decided the algorithm. Wrapping the obvious library would have been a day of work and would have made every font produced by the tool a legal problem for whoever tried to sell it.",
  },

  {
    slug: "beyondvision",
    n: "12",
    name: "BeyondVision",
    kicker: "Refusing to fake the spectrum",
    years: "2026",
    sortKey: 20260601,
    status: "PAPER",
    domain: "research",
    role: "Solo, design and specification",
    stack: ["Spectral reconstruction", "RAW capture", "Optical filters", "Microbolometer", "Narrowband LED arrays"],
    demo: "spectrum",
    featured: true,
    summary:
      "A spectral imaging system for phones and cheap add on hardware. Pick a wavelength, capture, render. Every pixel carries a tag saying whether it was measured, reconstructed or simulated.",
    problem:
      "The eye sees 400 to 700 nanometres. Every app that claims to show you outside that range is applying a colour filter and calling it thermal vision. The interesting engineering problem is not the interface, it is telling the truth about what the sensor actually saw.",
    constraint:
      "Silicon has a bandgap of 1.12 electronvolts, so photons longer than about 1107 nanometres cannot create an electron-hole pair. No firmware, no model and no clever exposure trick defeats that. Thermal imaging from a phone camera is not hard, it is impossible.",
    approach: [
      {
        head: "Three tags, and nothing exports without one",
        body: "MEASURED means photons at that wavelength hit a sensor through a characterised optical path. RECONSTRUCTED means it was inferred from three broadband channels by a learned prior, with a quantified error and a known failure mode on metamers. SIMULATED means it is a rendering and makes no physical claim. The wavelength scrubber shows the tag live.",
      },
      {
        head: "Five hardware tiers behind one slider",
        body: "From zero cost, using an infrared pass filter and a front facing depth camera for measured 700 to 1000 nanometres, up to a roughly 250 dollar USB-C microbolometer for measured 8 to 14 micrometres. Same interface, honestly different provenance.",
      },
      {
        head: "The cheapest honest hyperspectral camera",
        body: "Sixteen to twenty four narrowband LEDs strobed in sync with a locked exposure mono sensor produces a genuine 24 band measured spectral cube for around 150 dollars. It is the least glamorous tier and the only one that gets you real measured bands on a student budget.",
      },
      {
        head: "Radiometry starts at RAW",
        body: "A phone JPEG has already had six or more undocumented non-linear scene dependent transforms applied. Auto white balance, tone curve, denoise, sharpening. Radiometry is dead by then, so every honest capture path begins before the image signal processor.",
      },
    ],
    hardPart: {
      head: "The honest version is the harder product",
      body: "A colour filter shipped as thermal vision takes an afternoon and looks better in a screenshot. Building the calibration path, quantifying the reconstruction error, and printing RECONSTRUCTED across a beautiful false colour image is more work and a worse demo. The whole project only exists because the second one is the only version worth building.",
    },
    metrics: [
      {
        value: "1107",
        unit: "nm",
        label: "Hard silicon wall. A materials limit, not an engineering one",
        provenance: "PAPER",
        source: "Silicon bandgap 1.12 eV. Physics, cited in the reality check document.",
      },
      {
        value: "18 to 25",
        unit: "%",
        label: "Typical consumer CMOS quantum efficiency at 850 nm",
        provenance: "REPORTED",
        source: "Published sensor characterisation, cited in the spec. Around 7% at 940 nm.",
      },
      {
        value: "10",
        label: "Specification documents, read in order",
        provenance: "DERIVED",
        source: "Physics reality, architecture, hardware tiers, spectral engine, roadmap, research prompt, shopping list, wavelength atlas, calibration cookbook, glossary.",
      },
      {
        value: "0",
        label: "Lines of implementation code so far",
        provenance: "PAPER",
        source: "This is a specification. Nothing has been built and the status says so.",
      },
    ],
    wrong: [
      "No code exists. This is a design document set, and calling it a project without that caveat would be exactly the dishonesty it was written against.",
      "The reconstruction path fails on metamers by construction. Two materials that look identical to three broadband channels will reconstruct identically and be different in reality. The spec states the failure mode instead of hiding it.",
    ],
    learned:
      "Writing the physics document first killed four features before a line of code was written. That is the cheapest any feature has ever been to kill.",
  },

  {
    slug: "human-writing",
    n: "13",
    name: "Human Writing",
    kicker: "Why model prose reads dead, mechanically",
    years: "2026",
    sortKey: 20260700,
    status: "SHIPPED",
    domain: "tooling",
    role: "Solo",
    stack: ["Prompt architecture", "Editorial systems"],
    summary:
      "A working theory of why generated writing reads as generated, and the repair procedure. Not a banned word list, which is the version that does not work.",
    problem:
      "Ban delve and tapestry and you get the same flat prose without those words. The vocabulary is a symptom. Diagnosing the cause takes a different model of the failure.",
    constraint:
      "It had to be mechanical. A rule you can check on a page beats an instruction to write with more personality, which is unfalsifiable and therefore useless.",
    approach: [
      {
        head: "The premise",
        body: "A language model writes the most probable next sentence. Interesting writing is made of improbable ones. Not random, but improbable because a specific person made a specific choice that could have been wrong.",
      },
      {
        head: "Five generators",
        body: "Stance, a claim someone could argue with. Cohesion, each sentence growing out of the last. Specificity, names and numbers and textures. Rhythm, sentence length varying violently. Friction, cost and doubt and failure admitted. Every rule in the system serves exactly one of those.",
      },
      {
        head: "Cohesion is the one nobody can name",
        body: "When a reader says the sentences do not feel connected, that is cohesion, and it has a mechanical fix. End a sentence on the new idea, start the next one from it. Chain, do not spoke.",
      },
      {
        head: "Machine specificity is not human specificity",
        body: "You ran 8 debugs this week is specific and reads as automation, because a table could have produced it. Did that ImportError ever get sorted is specific and could only come from someone paying attention. Both are particulars. Only one survives contact with a reader.",
      },
    ],
    hardPart: {
      head: "Making the diagnosis checkable",
      body: "Vague advice about voice cannot be applied or verified. So each failure got a test. The shuffle test, whether paragraphs can be reordered without damage, which detects missing cohesion. The automation test, whether a script could have produced your first line from a database row. Read aloud for rhythm. Tests, not taste.",
    },
    metrics: [
      {
        value: "5",
        label: "Generators, each with its own reference file",
        provenance: "DERIVED",
        source: "cohesion, rhythm and sound, slop taxonomy, voice capture, revision pass.",
      },
      {
        value: "1,067",
        label: "Lines across eight documents",
        provenance: "DERIVED",
        source: "wc -l across the skill and its references.",
      },
    ],
    wrong: [
      "It is opinionated to the point of being wrong for some registers. Legal and reference writing want the flat probable sentence, and the system does not distinguish those cases.",
      "It can be followed into a different monotone. Enough enforced sentence variation starts to have its own detectable signature.",
    ],
    learned:
      "Every page of the DebugAI website, and this one, is written under these rules. Zero em dashes on this site is a rule from that document, not a stylistic accident.",
  },

  {
    slug: "mediagrab",
    n: "14",
    name: "Universal media grabber",
    kicker: "One tool, fifteen platforms",
    years: "2026",
    sortKey: 20260500,
    status: "SHIPPED",
    domain: "tooling",
    role: "Solo",
    stack: ["Flask", "yt-dlp", "ffmpeg", "SSE"],
    summary:
      "Paste a URL from X Spaces, YouTube, Instagram, Twitch, SoundCloud or ten other places, pick a format, get a file. Runs locally with a three gigabyte upload ceiling.",
    problem:
      "An X Space is live audio that disappears. Archiving one meant a different command line incantation from every other platform, and the incantations change when the platforms change.",
    constraint:
      "Local only, and platform differences had to be absorbed rather than exposed. Some sources need cookies, some do not, and the user should not have to know which.",
    approach: [
      {
        head: "A platform registry, not a chain of conditionals",
        body: "Fifteen hosts declared in one table with the name, the icon and whether the source needs authentication cookies. Adding a platform is a row.",
      },
      {
        head: "Format intent, not format strings",
        body: "The user picks best audio or best video. The mapping to yt-dlp selectors, post processors and merge containers lives in one place, so a codec preference change is one edit rather than fifteen.",
      },
      {
        head: "Progress that streams",
        body: "Downloads are long and silent by default. Progress streams to the browser so a running job is visibly running rather than apparently hung.",
      },
    ],
    hardPart: {
      head: "The dependency changes underneath you",
      body: "yt-dlp tracks platforms that actively break extraction, so the tool is only ever as current as its dependency. The design imports the extractor dynamically and reloads it rather than pinning, because a pinned version of this particular library is a tool that stops working on a schedule.",
    },
    metrics: [
      {
        value: "15",
        label: "Platforms in the registry",
        provenance: "DERIVED",
        source: "PLATFORMS table in web_app.py.",
      },
      {
        value: "3",
        unit: "GB",
        label: "Upload ceiling",
        provenance: "DERIVED",
        source: "MAX_CONTENT_LENGTH in the Flask config.",
      },
      {
        value: "2,150",
        label: "Lines of Python",
        provenance: "DERIVED",
        source: "wc -l across the module.",
      },
    ],
    wrong: [
      "Cookie handling for authenticated sources is the fragile part and the error message when it fails is not specific enough to tell you which of three things went wrong.",
    ],
    learned:
      "Built for one thing, archiving X Spaces, and grew a registry because the second platform request arrived the same week. The registry is the only reason the fifteenth was cheap.",
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const chronological = [...projects].sort((a, b) => a.sortKey - b.sortKey);

export const featured = projects.filter((p) => p.featured);
