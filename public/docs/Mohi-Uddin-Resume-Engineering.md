# Mohammed Mohi Uddin

Hyderabad, India · t.d.m.mohi@gmail.com · +91 78424 49809 · linkedin.com/in/mohammed-mohi-uddin-13b818333 · github.com/1shizaan

**AI systems and backend engineer**

Final year computer science student who ships. Launched **DebugAI**, a VS Code debugger with **5,800+ downloads** across three registries. Strongest at making expensive systems cheap: a reconciliation engine that replaced per row API calls with a blocked matcher and does **100,000 rows in 4.25 seconds** with zero API calls.

## Experience

### Founder and sole engineer (Launched)

*Feb 2026 – now · DebugAI · an AI debugger for VS Code, debugai.io*

- Built and shipped every layer of a **five service monorepo**: VS Code extension, Express gateway, FastAPI inference engine, Next.js dashboard, PostgreSQL with pgvector, Redis.
- **512 Marketplace installs, 5,800+ downloads** across three registries, 879 commits, 519 engine tests passing.
- **Context assembly** from a stack trace: traced files forced in, then pgvector retrieval of code the trace never names, inside a token budget. SHA-256 cache, difficulty based routing, and a cross provider fallback that holds the response shape during an outage.
- **Live billing** on production keys: HMAC verified webhooks, idempotency on the provider event id, and a tier guard that enforces an expired trial even when the cron fails.

### Summer Training Intern, Generative AI with ML

*Jun – Jul 2025 · RemarkSkill Education with IIT Hyderabad*

- Built a **retrieval augmented QA system** and found that chunk boundaries, not prompt wording, decided answer quality. Recognised at close for technical soundness.

## Selected projects

### MatchLedger AI · bank reconciliation engine

*May 2025 – now*

- **Three passes ordered by cost**: a vectorised hash join, a date tolerance pass, then fuzzy narration similarity on the remainder, blocked by amount bucket and date window.
- **100,000 against 98,000 rows in 4.25 seconds**, 95% matched, zero mismatches against ground truth. Unblocked the same job is a 9.8 billion comparison. FastAPI, Celery, Redis, PostgreSQL.

### SS Categorise · multimodal classifier

*2024, rebuilt 2026*

- Fused an **EfficientNet-B3** embedding with a 500 term TF-IDF vector over OCR text: **96.92%** on a 260 image held-out set across 20 classes. The gain came from a confusion matrix showing a missing input channel, not from more capacity.

### Inkline · handwriting to installable font

*Aug 2026*

- Homography un-warp of a photographed sheet, then a **Moore boundary tracer and Schneider cubic fitter written from scratch** because Potrace is GPL and would attach itself to every font the tool makes. A headless browser test downloads the OTF and parses it back.

## Skills

- **Languages** · Python, TypeScript, JavaScript, C, SQL
- **Backend and ML** · FastAPI, Express, Node.js, Celery, Redis, PostgreSQL, pgvector, PyTorch, scikit-learn, OpenCV
- **Infrastructure** · React, Next.js, Docker, AWS EC2, Railway, Vercel, nginx, GitHub Actions, Sentry, OWASP Top 10

## Education and recognition

### B.Tech, Computer Science Engineering (Data Science)

*Aug 2023 – Aug 2027 · Swami Vivekananda Institute of Technology, Hyderabad*

- **Second place, Techno Udbhav 2025** research paper competition, for OptiXon health sensing eyewear. Smart India Hackathon 2025. IIT Hyderabad certificates in Generative AI with ML and Data Science.

---

Resume, engineering track. Sources and code at github.com/1shizaan.
