# Mohammed Mohi Uddin

Hyderabad, India · t.d.m.mohi@gmail.com · +91 78424 49809 · linkedin.com/in/mohammed-mohi-uddin-13b818333 · github.com/1shizaan

**Signal processing and efficient ML under constraint**

Final year computer science student working on systems where **the failure mode matters more than the headline metric**. Available full time for twelve or more weeks in **summer 2027**, willing to relocate.

## Research interests

**Signal recovery under motion and noise**, and trust gates that discard corrupted measurements rather than smoothing over them. **Cost efficient inference**: when a learned component earns its compute against a deterministic baseline. **Uncertainty and provenance** in generated or reconstructed outputs.

## Education and recognition

### B.Tech, Computer Science Engineering (Data Science)

*Aug 2023 – Aug 2027 · Swami Vivekananda Institute of Technology, Hyderabad · CGPA 7.85 / 10 · top 25% of 120 students*

- OptiXon feasibility work validated by **Prof. Nagender Kumar Suryadevara**, University of Hyderabad, and by M.Tech students at IIT Hyderabad.
- Smart India Hackathon 2025, rural telemedicine PS25018. IIT Hyderabad certificates in Generative AI with ML and Data Science.

## Research projects

### OptiXon · photoplethysmography in prescription eyewear

*2024 – Jul 2026 · Founder and technical lead · Second place, Techno Udbhav 2025 research competition*

- Continuous heart rate from the superficial temporal artery through a sensor in an eyeglass temple, where **motion artifact, not sensor selection, is the dominant problem**. The IMU acts as a trust gate: the gyroscope flags a corrupted window before processing, so bad samples are discarded rather than averaged into a confident wrong reading.
- Verified the lithium protection circuit at **three independent levels** after finding a pin mapping error that would have defeated all protection while passing every functional test. Battery and thermal figures are design estimates and labelled as such, since no prototype exists.

`nRF52832, MAX30102 PPG, LSM6DSOX IMU, KiCad, ngspice, C`

### Multimodal classification under a small label budget

*2024, rebuilt 2026*

- Fused a convolutional image embedding with a sparse TF-IDF representation of OCR text under a linear head: **96.92% across 20 classes** on a 260 image held-out set, from 1,297 labelled examples. The gain came from **error analysis rather than capacity**, and the linear head kept each modality inspectable.

### Deterministic matching with selective learned fallback

*May 2025 – now*

- Where a learned matcher earns its cost against a rule based one, tested on transaction reconciliation because ground truth is constructible. **Blocking reduced a 9.8 billion pair comparison** to a tractable candidate set: 95% matched, zero mismatches against a synthetic answer key, 4.25 seconds at 100,000 records, zero inference calls.

### Retrieval augmented generation · IIT Hyderabad summer programme

*Jun – Jul 2025*

- Found **chunk boundary selection, not prompt design, dominated answer quality**, and that retrieval failure produced fluent confident wrong answers with no distinguishing signal. That observation drove later work on explicit verification state in a deployed system.

## Technical skills

- **Programming** · Python (primary), TypeScript, C, SQL
- **ML and signals** · PyTorch, TensorFlow, scikit-learn, OpenCV, embeddings and retrieval, evaluation design, PPG and IMU processing, motion artifact rejection, ngspice, KiCad, nRF52
- **Mathematics** · Linear algebra, probability and statistics, optimisation, numerical methods.

---

Resume, research track. Sources and code at github.com/1shizaan.
