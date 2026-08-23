# Mohammed Mohi Uddin

Hyderabad, India · t.d.m.mohi@gmail.com · +91 78424 49809 · linkedin.com/in/mohammed-mohi-uddin-13b818333 · github.com/1shizaan

**AI systems and backend engineer**

Final year computer science student who ships. Launched a VS Code debugging product with 5,800+ downloads across three registries, on live payment infrastructure. Strongest at making expensive systems cheap: a reconciliation engine that replaced per row API calls with a blocked three pass matcher and does 100,000 rows against 98,000 in 4.25 seconds with zero API calls.

## Experience

### Founder and sole engineer (Launched)

*Feb 2026 – now · DebugAI · an AI debugger for VS Code, debugai.io*

- Built and launched every layer of a five service monorepo: VS Code extension, Express gateway, FastAPI inference engine, Next.js dashboard, PostgreSQL with pgvector, Redis. 512 Marketplace installs, 5,800+ downloads across three registries, 879 commits, 519 engine tests passing.
- Assembles context from a runtime stack trace: forced inclusion of traced files, then pgvector retrieval of related code the trace never names, inside a managed token budget. A SHA-256 Redis cache ahead of every model call, difficulty based routing, and a cross provider fallback that keeps the response shape identical during an outage.
- Live billing on production keys: HMAC verified webhooks, idempotency on the provider event id, and a tier guard in the request path so an expired trial is enforced even when the cron that should have done it fails.

`TypeScript, Python, Next.js, Express, FastAPI, PostgreSQL, pgvector, Redis, Docker, Railway, Vercel`

### Summer Training Intern, Generative AI with ML

*Jun – Jul 2025 · RemarkSkill Education with IIT Hyderabad*

- Built a retrieval augmented question answering system and found that chunk boundaries, not prompt wording, decided answer quality. Recognised at close for technical soundness and collaboration.

## Selected projects

### MatchLedger AI · bank reconciliation engine

*May 2025 – now*

- Three passes ordered by cost: a vectorised hash join, a date tolerance pass, then fuzzy narration similarity on the remainder, blocked by amount bucket and date window. 100,000 against 98,000 rows in 4.25 seconds, 95% match rate, zero API calls, zero mismatches against ground truth. Unblocked the same job is a 9.8 billion comparison cross product. FastAPI, Celery, Redis, PostgreSQL, React, Docker.

### SS Categorise · multimodal classifier

*2024, rebuilt 2026*

- Fused an EfficientNet-B3 embedding with a 500 term TF-IDF vector over OCR text: 96.92% on a 260 image held-out set across 20 classes. The gain over the single model version came from the confusion matrix showing a missing input channel, not an underfitted model. PyTorch, scikit-learn.

### Inkline · handwriting to installable font, fully client side

*Aug 2026*

- Homography un-warp of a photographed sheet, then a Moore boundary tracer and Schneider cubic fitter written from scratch because Potrace is GPL and would attach itself to every font made with the tool. Proven by a headless browser test that downloads the generated OTF and parses it back. TypeScript, Next.js, Canvas, Playwright.

### SecAudit · static security scanner, zero dependencies

*Mar 2026*

- One standard library Python file, 60+ rules mapped to the OWASP Top 10 across six languages, 12,000 lines scanned in under two seconds with no network and no upload.

## Skills

- **Languages** · Python, TypeScript, JavaScript, C, SQL
- **Backend, ML** · FastAPI, Express, Node.js, Celery, Redis, PostgreSQL, pgvector · PyTorch, TensorFlow, scikit-learn, OpenCV, embeddings and retrieval
- **Frontend, infra** · React, Next.js App Router, Canvas · Docker, AWS EC2, Railway, Vercel, nginx, GitHub Actions, Sentry, OWASP Top 10

## Education and recognition

### B.Tech, Computer Science Engineering (Data Science)

*Aug 2023 – Aug 2027 · Swami Vivekananda Institute of Technology, Hyderabad*

- Second place, research paper competition, Techno Udbhav 2025, for OptiXon health sensing eyewear. Smart India Hackathon 2025, rural telemedicine. Certificates in Generative AI with ML, Ethical Hacking and Data Science, IIT Hyderabad.

---

Resume, engineering track. Sources and code at github.com/1shizaan.
