# Mohammed Mohi Uddin

Hyderabad, India · t.d.m.mohi@gmail.com · +91 78424 49809 · linkedin.com/in/mohammed-mohi-uddin-13b818333 · github.com/1shizaan

**Signal processing and efficient ML under constraint**

Final year computer science student working on systems where the failure mode matters more than the headline metric. Interested in deterministic baselines with learned augmentation, uncertainty and provenance in model outputs, and hardware software co-design for embedded sensing. Available full time for twelve or more weeks in summer 2027, willing to relocate.

## Research interests

Signal recovery under motion and noise, and trust gates that discard corrupted measurements rather than smoothing over them. Cost efficient inference: when a learned component earns its compute against a deterministic baseline. Uncertainty and provenance in generated or reconstructed outputs. Hardware software co-design under power and thermal constraint.

## Education

### B.Tech, Computer Science Engineering (Data Science)

*Aug 2023 – Aug 2027 · Swami Vivekananda Institute of Technology, Hyderabad · CGPA 7.85 / 10 · top 25% of 120 students*

- Machine learning, artificial intelligence, computer vision, natural language processing, algorithms, database systems, probability and statistics.

## Research projects

### OptiXon · photoplethysmography in prescription eyewear

*2024 – Jul 2026 · Founder and technical lead · Second place, Techno Udbhav 2025 research competition*

- Continuous heart rate sensing from the superficial temporal artery through a sensor in an eyeglass temple, where the dominant problem is motion artifact rather than sensor selection. The inertial unit acts as a trust gate: the gyroscope flags the corrupted window before processing, so bad samples are discarded rather than averaged into a confident wrong reading.
- Verified the lithium protection circuit at three independent levels after finding a pin mapping error that would have defeated all protection while passing every functional test. Validated by Prof. Nagender Kumar Suryadevara, University of Hyderabad. Battery and thermal figures are design estimates, labelled as such, since no prototype exists.

`nRF52832, MAX30102 PPG, LSM6DSOX IMU, KiCad, ngspice, C`

### Multimodal classification under a small label budget

*2024, rebuilt 2026*

- Fused a convolutional image embedding with a sparse TF-IDF representation of OCR text, classified by logistic regression: 96.92% across 20 classes on a 260 image held-out set, from 1,297 labelled examples. The improvement over a single vision model came from error analysis rather than capacity, and the head was kept linear so each modality's contribution stayed inspectable. PyTorch, EfficientNet-B3, scikit-learn.

### Deterministic matching with selective learned fallback

*May 2025 – now*

- Where a learned matcher earns its cost against a rule based one, tested on transaction reconciliation because ground truth is constructible and unexplainable matches are unusable. Blocking reduced a 9.8 billion pair comparison to a tractable candidate set: 95% match rate, zero mismatches against a synthetic answer key, 4.25 seconds at 100,000 records, zero inference calls.

### Retrieval augmented generation · IIT Hyderabad summer programme

*Jun – Jul 2025*

- Found chunk boundary selection, not prompt design, dominated answer quality, and that retrieval failure produced fluent confident wrong answers with no distinguishing signal. That observation drove later work on explicit verification state in a deployed system.

## Technical skills

- **Programming** · Python (primary), TypeScript, C, SQL
- **ML, signals** · PyTorch, TensorFlow, scikit-learn, OpenCV, embeddings and retrieval, evaluation design · PPG and IMU processing, motion artifact rejection, ngspice, KiCad, nRF52, power budgeting
- **Mathematics** · Linear algebra, probability and statistics, optimisation, numerical methods. Learning: uncertainty quantification, probabilistic machine learning

## Recognition

- OptiXon feasibility documentation reviewed and validated by Prof. Nagender Kumar Suryadevara, University of Hyderabad, and by M.Tech students at IIT Hyderabad across multiple sessions.
- Smart India Hackathon 2025, rural telemedicine PS25018. Certificates in Generative AI with ML, Ethical Hacking and Data Science, IIT Hyderabad. English fluent, Hindi native.

---

Resume, research track. Full case studies with sources at mohiuddin.dev.
