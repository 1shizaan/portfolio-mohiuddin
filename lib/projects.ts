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
      body: "A face 30cm from the lens and a face twice that size at 60cm land on the sensor identically. There is no way to tell them apart, which means every millimetre figure the thing printed was invented. The fix was to stop measuring absolutes altogether and work in ratios anchored to interpupillary distance, which is about the most stable proportion a human face has.",
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
      "The first version reported millimetres, confidently, to one decimal place. From a single uncalibrated phone photo. Those numbers looked more authoritative than anything else on the screen and they meant nothing at all.",
      "Landmark detection fell apart on faces at an angle and had no way of telling you so. It answered every single time, including the times it should have said it could not see well enough.",
    ],
    learned:
      "Fifteen points reads very differently once you know the baseline was 70 and not zero. I had been quoting 85 for weeks before I bothered to build the arithmetic version, and now I build that one first every time, mostly so I can find out early whether the model is earning anything.",
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
      "Food and Dining still trades errors with Recipes, and Social Media Screens still trades with anything else that has a header bar. Both happen when OCR comes back with almost nothing, at which point the fusion quietly degrades into v1 and inherits v1's blind spot.",
      "I reported the 2024 version as 90 percent, which was training accuracy. That is the flattering number, not the useful one. The v2 figure is a held out test set and the two should never have been put in the same sentence, including by me.",
    ],
    learned:
      "I spent a while in 2024 trying to get past the high 80s by feeding the vision model more images, and it did not move. What eventually moved it was reading the confusion matrix properly and noticing the errors were all in the text heavy classes. The model was not weak. It could not read. Most of the accuracy I have gained since has come from that same move, which is looking at what the input is missing rather than what the model is missing.",
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
      "A cold email campaign agent, a LinkedIn posting agent, and the scrapers feeding both. All of it worked, all of it deployed. I shut it down anyway, in the third month, after reading twenty of its emails in a row.",
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
      body: "Every metric was green. Emails going out, deliverability fine, clean logs, healthy dashboard. None of it measured whether the output was worth sending, because I had assumed output quality instead of testing it. I found the problem by opening the sent folder one afternoon and reading twenty emails back to back, which is a thing no part of the system was ever going to do for me.",
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
      "Nothing in the system tested output quality. Every check I had written was operational. That is the real bug and it took me three months and twenty emails to see it.",
      "I picked the problem because it was a fun build. Nobody had asked me for it and nobody was suffering without it. I chose the next one the other way round on purpose.",
    ],
    learned:
      "Killing it was easy once I had read the outbox. The part worth keeping is what I wrote down that week, which was that I had spent three months instrumenting whether the system ran and zero minutes instrumenting whether it was any good. Then I went looking for a problem that was boring and that somebody actually had. That search produced MatchLedger.",
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
      "I treated embeddings as a black box the whole four weeks. I could use them fine. I could not have told you why one model beat another on my corpus, and I still find that gap annoying enough that it is most of why I am reading toward research now.",
    ],
    learned:
      "I got a mention for technical soundness and collaboration at the end of it. The thing I actually took away was smaller than the certificate. When retrieval missed, the system produced a fluent, confident, nicely formatted answer that was simply wrong, and there was nothing on screen to distinguish it from a correct one. I have been building against that ever since.",
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
      "I was short on API credits. That is the whole reason this architecture exists, because at a fraction of a cent per embedding call, comparing 100,000 rows naively is expensive enough and slow enough that you can never ship it to anybody.",
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
      body: "Naive matching compares every ledger row against every bank row. At 100,000 against 98,000 that is 9.8 billion comparisons and it simply does not finish. Bucketing by amount and date window first means only plausible pairs ever meet, which is the entire difference between intractable and 4.25 seconds. I left the old embedding engine in the repository rather than deleting it, because having both side by side is more instructive than either one alone.",
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
      "The first engine ran embeddings on everything. It cost money per row, it was slower, and it matched worse. Replacing it was a rewrite from scratch, not a round of tuning.",
      "I lost the original custom narration matching module before I ever committed it. Genuinely gone. The zero cost engine partly exists because I had to rebuild that capability from nothing and picked a different approach the second time round, which is a stupid way to arrive at a better design.",
      "If the local env file was missing, the frontend quietly fell back to the production API URL. So a dev session on my own laptop could be talking to production without a single warning anywhere. That one is written at the top of the project notes now, in capitals.",
    ],
    learned:
      "Paused on purpose, and not because of anything in the code. People do not hand confidential financial records to an individual with a GitHub account. They hand them to a registered company. I cannot engineer my way past that, so the engine is finished and sitting there waiting on a legal entity, and I would rather say so than let the repository look like it was abandoned.",
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
      "Continuous health monitoring normally means wearing one more thing. A billion people already wear glasses all day, and the arm of a pair of glasses already rests on the superficial temporal artery, which happens to be somewhere you can read a pulse.",
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
      body: "The DW01A and FS8205A pairing had a mapping error, and it passed visual review without any trouble. The circuit would have powered up, charged, discharged and behaved perfectly normally in every test I could have run, while providing no overcurrent or overdischarge protection whatsoever. On a lithium cell pressed against somebody's head all day. It sits at entries 37 and 38 in the bug log, and it is the only reason the validation guide will not let you skip the current limited smoke test.",
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
      "The v3.0 feasibility documents this project audited had errors in them serious enough that fixing them became phase one of the work. I had written those documents.",
      "No prototype exists. Every performance number on this page is a calculation and says so. Nothing here has met a soldering iron yet, and finishing the paper phase is not the same as having a product.",
    ],
    learned:
      "Second place at Techno Udbhav 2025, an inter college research competition. Before that I took the idea and the workflow to M.Tech students at IIT Hyderabad and to a working circuit design professional, and sat there while they went through it. Both said it could be built. Both had changes. I also wrote to a professor at the University of Hyderabad and never heard back, which is the ordinary outcome and not a reason to skip the step. Nobody supervised any of this. Every decision in it is mine, including the wrong ones, and going and asking has consistently been cheaper than being wrong for six months.",
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
      "There are three frontends in that repository because we restarted the interface twice under deadline. You can see all three sitting in the tree. That is what a hackathon does to a codebase and I would rather leave it visible.",
      "We tested offline reconciliation against being fully offline. We never tested it against a connection that keeps coming back for four seconds at a time, which is the actual failure mode in rural Punjab and much harder than the one we covered.",
    ],
    learned:
      "I went into this expecting the hard part to be medical, or at least to be the symptom checker. It was neither. The hard part is that roughly a third of the people this is for cannot receive a web page at all, and once you design for the phone that cannot browse, every decision after it changes.",
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
      "One person, and every model call costs money. Ten free debugs a day is the promise on the pricing page, which means every architectural decision after that has to answer to how cheap a single request can be made.",
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
      body: "There are three states a proposed fix can be in. Mechanically checked and passed. Checked and failed. Never checked at all. That third one shows up in the interface as never checked, in plain words, which is the least flattering thing on the screen and the only reason anybody should believe the first two. It would sell better to collapse them. The same argument runs through the rest of the product, including the numbers I publish about it, which is a lesson I earned by getting it wrong in public.",
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
      "Published copy claimed 750 installs when the real number was 193, because I had summed two different metrics without noticing they were different kinds of number. The rule that separates them is now written into the repository instructions, and a live check against the registries verifies it, because I do not trust myself to remember.",
      "An hourly cron was pointed at the marketing domain instead of the API host. It returned 404 for days without anybody noticing, so trials just never expired and people kept getting paid features for free. There is now a tier guard sitting in the hot path that enforces the expiry independently, on the assumption that the cron is dead.",
      "The first version of the in-app announcement panel broke my own design rules three separate ways inside one component. Soft shadow, wrong radii, icons where the gutter rail should have been. I rewrote it against the document instead of arguing with the document.",
    ],
    learned:
      "Launched June 1 2026 on the Marketplace and Product Hunt. The engineering was the part I was ready for. What I was not ready for is that announcing to everybody who already knows you converts at approximately zero, and that strangers who happen to have the exact problem convert immediately. I spent a while assuming that was a copy problem. It was not. There is no version of the landing page that makes your friends need a debugger.",
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
      body: "Static pattern matching throws false positives, and a scanner with a bad signal to noise ratio is worse than having none, because it teaches you to skim the output. So the rules are deliberately tuned to miss a real issue rather than flag a safe line, and severity is assigned by what an attacker actually gains, not by how alarming the pattern looks at a glance.",
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
      "Pattern matching cannot follow data flow, so it has no way of telling a sanitised input from an unsanitised one. It matches shapes. The README says that in plain words rather than letting the rule count imply something stronger.",
      "The rule set reflects the stacks I actually work in. Go, Ruby and PHP coverage is real but noticeably thinner than Python and TypeScript, and I would not want somebody relying on it as their only check.",
    ],
    learned:
      "I wrote this straight after doing a full security remediation pass on DebugAI by hand, while the findings were still fresh and slightly embarrassing. A good number of the rules in it are mistakes I had personally shipped. That is why each finding explains what an attacker gets rather than just naming the pattern, because naming the pattern would not have helped me.",
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
      body: "A full breakdown takes minutes and moves through about a dozen stages, and a silent progress bar for four minutes reads as a hang. So progress streams over server sent events per stage, extra videos queue instead of competing for the same CPU, and anything over twelve minutes of runtime skips stem separation so the rest of the analysis still lands. Most of the work here went into deciding what to give up rather than what to add.",
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
      "A rendered video is flat pixels. The original layers are gone and nothing gets them back, so this reverse engineers the technique instead. That is in the second paragraph of the README rather than buried under the feature table, because the feature table reads like it can do more than it can.",
      "Text inpainting is good on flat and graphic backgrounds and visibly bad on textured ones. I could have picked a demo clip that avoids the failure case. It is written down as a limit instead.",
    ],
    learned:
      "The heavy data path now lives outside OneDrive, deliberately and with a comment explaining why. The first version wrote extracted frames straight into a synced folder and pushed several gigabytes to the cloud before I worked out what was eating the connection.",
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
      body: "Every stage can look right on its own and still hand you a font the operating system refuses to install. So the end to end test builds a synthetic photograph of a filled sheet, tilted and shadowed and noisy the way a real phone photo would be, drives a headless browser all the way through the studio, downloads whatever OTF comes out, and parses it back. If the round trip fails, something in the chain is lying, and it runs on every change.",
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
      "Non photo blue guides vanish in the red channel, which is elegant right up until somebody prints the sheet in greyscale and the rules come back. I found that by printing on the wrong printer. There is a separate de-ruling step now for sheets that were not printed in colour.",
      "Bitmaps are the source of truth and outlines get re-derived every time. That is the right call and it also means touching a single trace setting invalidates every cached outline you have at once.",
    ],
    learned:
      "The licence question is what decided the algorithm. Wrapping Potrace would have been about a day. It would also have quietly attached GPL to every font anyone made with the tool, which is a nasty thing to find out later if you tried to sell one, so I wrote the boundary follower and the cubic fitter myself and it took considerably longer than a day.",
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
      body: "Shipping a colour filter and calling it thermal vision takes an afternoon and screenshots beautifully. Building the calibration path, quantifying the reconstruction error, then printing the word RECONSTRUCTED across your own gorgeous false colour image is weeks of work and a worse demo in every way. That second one is the only version I am interested in building, which is most of why this is still on paper.",
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
      "No code exists. This is ten specification documents and nothing else, and listing it as a project without saying that plainly would be the exact dishonesty the whole thing was written against.",
      "The reconstruction path fails on metamers, by construction, and always will. Two materials that look identical across three broadband channels reconstruct identically and are genuinely different in the real world. That is written into the spec as a known failure mode rather than left for somebody to discover.",
    ],
    learned:
      "Writing the physics document before anything else killed four features outright, including the one that made the idea sound exciting in the first place. Silicon has a bandgap of 1.12 electronvolts and no amount of firmware argues with it. Cheapest four features I have ever removed.",
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
      "It is opinionated enough to be wrong for some registers. Legal writing and reference documentation want the flat probable sentence, and the system has no way of knowing when it is in one of those.",
      "You can follow it into a new monotone. Enforce enough sentence variation and the variation itself becomes a signature, which I have now watched happen to my own writing twice.",
    ],
    learned:
      "The DebugAI site runs on these rules and so does this one. There is not a single em dash anywhere on either, which is a rule out of that document rather than an accident. Worth saying that the first draft of this portfolio failed its own test, and I only saw it once somebody read it back to me and said it did not sound like me.",
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
      body: "yt-dlp is chasing platforms that are actively trying to break extraction, so this tool is only ever as current as its dependency is. Pinning the version would make it stop working on a predictable schedule, which is worse than the alternative, so the extractor is imported dynamically and reloaded instead.",
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
      "Cookie handling for authenticated sources is the fragile part, and when it fails the error message is too vague to tell you which of three different things went wrong. I know that and have not fixed it.",
    ],
    learned:
      "I built this to archive X Spaces and nothing else. The second platform request turned up the same week, which was the point I stopped writing conditionals and put the platforms in a table. Fifteen of them now, and adding one is a row.",
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const chronological = [...projects].sort((a, b) => a.sortKey - b.sortKey);

export const featured = projects.filter((p) => p.featured);
