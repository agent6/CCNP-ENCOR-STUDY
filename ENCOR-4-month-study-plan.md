# ENCOR 350-401 — 4-Month Study Plan

**Start:** Week of June 8, 2026
**Exam target:** Week of October 5–9, 2026
**Pace:** ~1 hr/day (5–7 hrs/week) · 24 chapters in 15 weeks + 2.5 weeks of final review

**Lab library:** all 34 hands-on labs are loaded in the study app (Hands-On Labs section) — each week below names its assigned labs by ID. Import the matching CML YAML, work the graded tasks, check the solutions. Re-run any lab you can't finish cleanly.

## Weekly Rhythm

| Day | Activity |
|---|---|
| Mon–Thu | Read (~30–40 pages/day), make flashcards as you go |
| Fri | Lab day — work that week's assigned labs from the app |
| Sat | Flashcard review (all decks, spaced repetition) + chapter "Do I Know This Already?" quizzes + cheat sheet pass |
| Sun | Rest / catch-up buffer (overflow lab time on heavy lab weeks) |

Rules: never skip Friday labs on config-heavy weeks; review ALL flashcards every Saturday, not just the current week's; weeks with 3+ labs spill into Sunday — that's expected; if you fall behind, use Sundays — don't compress final review weeks.

---

## Phase 1 — Switching & Routing Core (Weeks 1–7)

### ☐ Week 1 (Jun 8–14): Ch 1 Packet Forwarding · Ch 2 Spanning Tree Protocol
- Ch 1 is supporting material — skim, don't grind (CEF/TCAM dropped from v1.2)
- **Labs:** `KWT-CISCO-EXPRESS-FORWARDING` (4 tasks) · `KWT-SPANNING-TREE-PROTOCOL` (5 tasks)

### ☐ Week 2 (Jun 15–21): Ch 3 Advanced STP Tuning · Ch 4 MST
- **Labs:** `KWT-BPDU-GUARD` (6 tasks) — covers the guard features; build a quick MST region yourself in the same topology for extra credit

### ☐ Week 3 (Jun 22–28): Ch 5 VLAN Trunks & EtherChannel · Ch 6 IP Routing Essentials
- Key v1.2 items in Ch 6: VRF and PBR
- **Labs:** `ENCOR-8021Q` (5 tasks — trunks, pruning, DTP troubleshooting) · `ENCOR-VRF` (5 tasks — VRF-lite segmentation and route leaking)
- No dedicated EtherChannel lab — add LACP/PAgP bundles to the 8021Q topology and break them on purpose

### ☐ Week 4 (Jun 29–Jul 5): Ch 7 EIGRP · Ch 8 OSPF
- Focus on the EIGRP-vs-OSPF comparison (topic 3.2.a) — metrics, path selection, area types
- **Labs:** `ENCOR-OSPF-FOUNDATION` (5 tasks) · `KWT-OSPFV2-BASIC` (5 tasks) · `ENCOR-OSPF-NETWORK-TYPES` (5 tasks — network types + passive-interface troubleshooting)

### ☐ Week 5 (Jul 6–12): Ch 9 Advanced OSPF · Ch 10 OSPFv3
- **Labs:** `ENCOR-OSPF-MULTIAREA` (5 tasks — summarization and filtering) · `KWT-OSPFV3-TRADITIONAL` (6 tasks)

### ☐ Week 6 (Jul 13–19): Ch 11 BGP
- **Lab:** `ENCOR-EBGP` (6 tasks — eBGP between directly connected neighbors, neighbor states, verification)

### ☐ Week 7 (Jul 20–26): Ch 12 Advanced BGP + **Checkpoint Review #1**
- Only need best-path selection from Ch 12 — memorize the best-path order
- **Reinforcement labs:** `KWT-BGP-IPV4` (5 tasks) · `KWT-OSPF-ROUTE-SUMMARIZATION` (5 tasks) · `KWT-OSPF-ROUTE-FILTERING` (6 tasks) — second pass at the Phase 1 weak spots
- **Sat/Sun:** Re-quiz Chapters 1–11 (DIKTA quizzes), full flashcard pass

## Phase 2 — Services & Overlay (Weeks 8–11)

### ☐ Week 8 (Jul 27–Aug 2): Ch 13 Multicast
- ⚠️ **Supplement MSDP from Cisco docs** — not in the book (new v1.2 topic)
- Know: RPF check, PIM SM, IGMPv2/v3, SSM, bidir, MSDP
- No multicast lab in the library — build a 4-router PIM-SM topology with a static RP in CML and watch `show ip mroute` through a join/register/SPT switchover

### ☐ Week 9 (Aug 3–9): Ch 14 QoS
- v1.2 only asks you to *interpret* QoS configs — focus on reading MQC policies
- **Lab:** `ENCOR-QOS-INTERPRET` (5 tasks — interpreting configurations and counters)

### ☐ Week 10 (Aug 10–16): Ch 15 IP Services
- **Labs:** `ENCOR-NETWORK-TIME` (5 tasks) · `KWT-NTP-SECURITY` (6 tasks) · `ENCOR-NAT-PAT` (6 tasks) · `ENCOR-FHRP` (6 tasks)
- Heaviest lab week of Phase 2 — start Friday, finish over the weekend

### ☐ Week 11 (Aug 17–23): Ch 16 Overlay Tunnels · Ch 22 Enterprise Network Architecture
- **Labs:** `ENCOR-GRE` (5 tasks) · `ENCOR-IPSEC` (5 tasks) · `ENCOR-GRE-IPSEC` (5 tasks — IPsec profile style) · `KWT-GRE-OVER-IPSEC` (5 tasks — crypto map style)
- Doing both GRE-over-IPsec labs shows you both config styles the exam can show you
- Whiteboard LISP & VXLAN packet flow (describe-level — no lab needed)

## Phase 3 — Architecture, Assurance, Security, Automation (Weeks 12–15)

### ☐ Week 12 (Aug 24–30): Ch 23 Fabric Technologies · Ch 27 Virtualization
- SD-Access + Catalyst SD-WAN: control vs data plane elements, benefits/limitations
- Names changed: DNA Center → Catalyst Center, vManage → SD-WAN Manager
- **Capstone lab:** `ENCOR-VRF-GRE-IPSEC` (5 tasks — integrated VRF + GRE + IPsec data path; ties Phase 2 together and mirrors how a fabric overlays segmentation on tunnels)

### ☐ Week 13 (Aug 31–Sep 6): Ch 24 Network Assurance
- ⚠️ **Supplement "AI-powered workflows" in Catalyst Center from Cisco docs** (new v1.2)
- **Labs:** `ENCOR-FLEXIBLE-NETFLOW` (6 tasks) · `ENCOR-SPAN-RSPAN-ERSPAN` (6 tasks) · `ENCOR-IPSLA` (7 tasks) · `KWT-IP-SLA-RTR` (6 tasks) · `KWT-IP-SLA-PATH-SELECTION` (6 tasks)
- Biggest lab week of the plan — the three core labs Friday/Saturday, the two KWT IP SLA labs Sunday (path selection shows IP SLA + tracking driving failover, a favorite exam scenario)

### ☐ Week 14 (Sep 7–13): Ch 25 Secure Network Access · Ch 26 Device Access & Infra Security
- **Labs:** `ENCOR-DEVICE-ACCESS` (7 tasks) · `ENCOR-AAA` (7 tasks) · `ENCOR-ACL` (7 tasks) · `ENCOR-COPP` (6 tasks)
- These four map one-to-one onto exam topics 5.1.a, 5.1.b, 5.2.a, 5.2.b — the full configure/verify security set

### ☐ Week 15 (Sep 14–20): Ch 28 Network Programmability · Ch 29 Automation Tools
- **Lab:** `ENCOR-NETCONF-RESTCONF` (7 tasks)
- Also: write a simple EEM applet on any lab router (no dedicated lab — five lines of config, do it from memory)
- Know: REST response codes, YANG purpose, Catalyst Center & SD-WAN Manager APIs, agent vs agentless (Ansible vs Puppet/Chef)

## Phase 4 — Final Review & Practice Exams (Weeks 16–18)

### ☐ Week 16 (Sep 21–27): Practice Exam #1 + targeted review
- Full timed practice exam (book's companion Pearson Test Prep)
- Score by domain; re-read Key Topics tables + cheat sheets for every weak domain
- **Re-run the two labs that gave you the most trouble** — from scratch, no peeking at solutions

### ☐ Week 17 (Sep 28–Oct 4): Practice Exam #2 + drill
- Second full timed exam — target 85%+
- Daily: Key Topics tables + command reference review, one domain per day
- Recheck the two book gaps: MSDP, Catalyst Center AI workflows
- One more lab re-run: pick your weakest domain and redo its hardest lab cold

### ☐ Week 18 (Oct 5–9): **EXAM WEEK**
- Mon: Practice Exam #3 (confidence check)
- Tue–Wed: Light review only — flashcards, best-path order, admin distances, FHRP/STP timers
- **Sit the exam Thu/Fri**

---

## Lab coverage map (all 34, by domain)

| Domain | Labs | Week |
|---|---|---|
| Architecture | KWT-CISCO-EXPRESS-FORWARDING · ENCOR-QOS-INTERPRET | 1, 9 |
| Layer 2 | KWT-SPANNING-TREE-PROTOCOL · KWT-BPDU-GUARD · ENCOR-8021Q | 1, 2, 3 |
| Layer 3 | ENCOR-OSPF-FOUNDATION · KWT-OSPFV2-BASIC · ENCOR-OSPF-NETWORK-TYPES · ENCOR-OSPF-MULTIAREA · KWT-OSPFV3-TRADITIONAL · ENCOR-EBGP · KWT-BGP-IPV4 · KWT-OSPF-ROUTE-SUMMARIZATION · KWT-OSPF-ROUTE-FILTERING | 4, 5, 6, 7 |
| Virtualization | ENCOR-VRF · ENCOR-GRE · ENCOR-IPSEC · ENCOR-GRE-IPSEC · KWT-GRE-OVER-IPSEC · ENCOR-VRF-GRE-IPSEC | 3, 11, 12 |
| IP Services | ENCOR-NETWORK-TIME · KWT-NTP-SECURITY · ENCOR-NAT-PAT · ENCOR-FHRP | 10 |
| Network Assurance | ENCOR-FLEXIBLE-NETFLOW · ENCOR-SPAN-RSPAN-ERSPAN · ENCOR-IPSLA · KWT-IP-SLA-RTR · KWT-IP-SLA-PATH-SELECTION · ENCOR-NETCONF-RESTCONF | 13, 15 |
| Security | ENCOR-DEVICE-ACCESS · ENCOR-AAA · ENCOR-ACL · ENCOR-COPP | 14 |

DIY (no lab in library): MST region (Week 2) · EtherChannel (Week 3) · multicast/PIM-SM (Week 8) · EEM applet (Week 15)

## Tracking

- Schedule the exam NOW for the week of Oct 5 — a booked date keeps you honest
- If a practice exam domain scores under 70%, swap a rest day for review of that domain
- Skipped entirely: Ch 17–21 (wireless, removed in v1.2), Ch 30–31 (skim Ch 31 once for blueprint updates)
