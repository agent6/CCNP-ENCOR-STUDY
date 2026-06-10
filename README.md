# CCNP ENCOR 350-401 Study Kit

Self-built study materials for the **Cisco CCNP/CCIE Enterprise Core (ENCOR 350-401) v1.2** exam, aligned to the *CCNP and CCIE Enterprise Core ENCOR 350-401 Official Cert Guide, 2nd Edition* chapter structure.

## 🚀 Study App (live)

**[Launch the quiz & flashcard app →](https://agent6.github.io/CCNP-ENCOR-STUDY/)**

A single-file web app (no install, runs in any browser) with:

- **218 original practice questions** — concept questions plus "refer to the exhibit" output-interpretation scenarios (stuck OSPF neighbors, EtherChannel flags, BGP states, NAT tables, REST responses, and more)
- **326 flashcards** — term/definition cards with an Again/Got-it repetition loop
- **24 per-chapter cheat sheets** rendered in-app
- **34 hands-on CML labs** ([`labs/`](labs/)) — full graded lab guides plus importable CML topology YAMLs, grouped by exam domain
- All Chapters, Random 50, or per-chapter modes · instant feedback with explanations · per-chapter score breakdown · retry-missed drill mode

## 📚 Contents

| File | What it is |
|---|---|
| [`index.html`](index.html) | The study app (same file as `ENCOR-quiz-app.html`, named for GitHub Pages) |
| [`ENCOR-v1.2-chapter-mapping.md`](ENCOR-v1.2-chapter-mapping.md) | Every v1.2 exam topic mapped to OCG 2nd Ed. chapters — including which chapters to skip |
| [`ENCOR-4-month-study-plan.md`](ENCOR-4-month-study-plan.md) | Week-by-week 4-month plan: reading, CML/EVE-NG labs, review days, practice-exam phase |
| [`ENCOR-chapter-study-guide.md`](ENCOR-chapter-study-guide.md) | Per-chapter "master this" summaries and self-check prompts |
| [`ENCOR-question-bank.md`](ENCOR-question-bank.md) | The full 218-question bank with answers and explanations (readable/printable form) |
| [`ENCOR-flashcards.md`](ENCOR-flashcards.md) | The 326-card deck in markdown (printable / Anki-importable) |

## 🎯 Key v1.2 notes baked into these materials

- **Wireless was removed** from the v1.2 blueprint — OCG chapters 17–21 are skipped
- **MSDP** (topic 3.3.d) and **Catalyst Center AI-powered workflows** (topic 4.5) aren't covered by the 2nd Ed. book — flagged for supplemental Cisco docs
- Naming updates: DNA Center → **Catalyst Center**, vManage → **SD-WAN Manager**

## ⚙️ GitHub Pages setup

Repo → Settings → Pages → Deploy from branch → `main` / root. The included `index.html` is what gets served at the link above.

## 📝 Notes

- All questions, flashcards, and CLI exhibits are **original study material** — nothing reproduced from the Cert Guide. Book PDFs are excluded from the repo via `.gitignore`.
- This is a personal study project, not affiliated with or endorsed by Cisco. CCNP, CCIE, and ENCOR are trademarks of Cisco Systems, Inc.
