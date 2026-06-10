# ENCOR 350-401 — 4-Month Study Plan

**Start:** Week of June 8, 2026
**Exam target:** Week of October 5–9, 2026
**Pace:** ~1 hr/day (5–7 hrs/week) · 24 chapters in 15 weeks + 2.5 weeks of final review

## Weekly Rhythm

| Day | Activity |
|---|---|
| Mon–Thu | Read (~30–40 pages/day), make flashcards as you go |
| Fri | Lab day (CML/EVE-NG) |
| Sat | Flashcard review (all decks, spaced repetition) + chapter "Do I Know This Already?" quizzes |
| Sun | Rest / catch-up buffer |

Rules: never skip Friday labs on config-heavy weeks; review ALL flashcards every Saturday, not just the current week's; if you fall behind, use Sundays — don't compress final review weeks.

---

## Phase 1 — Switching & Routing Core (Weeks 1–7)

### ☐ Week 1 (Jun 8–14): Ch 1 Packet Forwarding · Ch 2 Spanning Tree Protocol
- Ch 1 is supporting material — skim, don't grind (CEF/TCAM dropped from v1.2)
- **Lab:** Build base topology in CML/EVE-NG. VLANs, access/trunk ports, verify STP roots/roles

### ☐ Week 2 (Jun 15–21): Ch 3 Advanced STP Tuning · Ch 4 MST
- **Lab:** Root bridge manipulation, root guard, BPDU guard, MST regions

### ☐ Week 3 (Jun 22–28): Ch 5 VLAN Trunks & EtherChannel · Ch 6 IP Routing Essentials
- Key v1.2 items in Ch 6: VRF and PBR
- **Lab:** Static + LACP/PAgP EtherChannels (break them, troubleshoot), VRF-lite, PBR

### ☐ Week 4 (Jun 29–Jul 5): Ch 7 EIGRP · Ch 8 OSPF
- Focus on the EIGRP-vs-OSPF comparison (topic 3.2.a) — metrics, path selection, area types
- **Lab:** Single-area OSPF: network types, neighbor adjacency, passive-interface

### ☐ Week 5 (Jul 6–12): Ch 9 Advanced OSPF · Ch 10 OSPFv3
- **Lab:** Multi-area OSPF, summarization, filtering, then overlay OSPFv3 dual-stack

### ☐ Week 6 (Jul 13–19): Ch 11 BGP
- **Lab:** eBGP between directly connected neighbors, neighbor states, verification

### ☐ Week 7 (Jul 20–26): Ch 12 Advanced BGP + **Checkpoint Review #1**
- Only need best-path selection from Ch 12 — memorize the best-path order
- **Sat/Sun:** Re-quiz Chapters 1–11 (DIKTA quizzes), full flashcard pass, re-lab anything shaky

## Phase 2 — Services & Overlay (Weeks 8–11)

### ☐ Week 8 (Jul 27–Aug 2): Ch 13 Multicast
- ⚠️ **Supplement MSDP from Cisco docs** — not in the book (new v1.2 topic)
- Know: RPF check, PIM SM, IGMPv2/v3, SSM, bidir, MSDP

### ☐ Week 9 (Aug 3–9): Ch 14 QoS
- v1.2 only asks you to *interpret* QoS configs — focus on reading MQC policies (class-maps, policy-maps, marking, queuing, policing vs shaping)

### ☐ Week 10 (Aug 10–16): Ch 15 IP Services
- **Lab:** NTP client/server, HSRP + VRRP with object tracking, static NAT, pooled NAT, PAT

### ☐ Week 11 (Aug 17–23): Ch 16 Overlay Tunnels · Ch 22 Enterprise Network Architecture
- **Lab:** GRE tunnel, GRE over IPsec site-to-site. Whiteboard LISP & VXLAN packet flow (describe-level)

## Phase 3 — Architecture, Assurance, Security, Automation (Weeks 12–15)

### ☐ Week 12 (Aug 24–30): Ch 23 Fabric Technologies · Ch 27 Virtualization
- SD-Access + Catalyst SD-WAN: control vs data plane elements, benefits/limitations
- Names changed: DNA Center → Catalyst Center, vManage → SD-WAN Manager

### ☐ Week 13 (Aug 31–Sep 6): Ch 24 Network Assurance
- ⚠️ **Supplement "AI-powered workflows" in Catalyst Center from Cisco docs** (new v1.2)
- **Lab:** Conditional debugs, syslog levels, SNMP, Flexible NetFlow, SPAN/RSPAN/ERSPAN, IP SLA

### ☐ Week 14 (Sep 7–13): Ch 25 Secure Network Access · Ch 26 Device Access & Infra Security
- **Lab:** vty/line security, local users, AAA, standard/extended ACLs, CoPP policy

### ☐ Week 15 (Sep 14–20): Ch 28 Network Programmability · Ch 29 Automation Tools
- **Lab:** RESTCONF calls with Postman/curl, read JSON payloads, write a simple EEM applet
- Know: REST response codes, YANG purpose, Catalyst Center & SD-WAN Manager APIs, agent vs agentless (Ansible vs Puppet/Chef)

## Phase 4 — Final Review & Practice Exams (Weeks 16–18)

### ☐ Week 16 (Sep 21–27): Practice Exam #1 + targeted review
- Full timed practice exam (book's companion Pearson Test Prep)
- Score by domain; re-read Key Topics tables for every weak domain
- Re-lab your two weakest config topics

### ☐ Week 17 (Sep 28–Oct 4): Practice Exam #2 + drill
- Second full timed exam — target 85%+
- Daily: Key Topics tables + command reference review, one domain per day
- Recheck the two book gaps: MSDP, Catalyst Center AI workflows

### ☐ Week 18 (Oct 5–9): **EXAM WEEK**
- Mon: Practice Exam #3 (confidence check)
- Tue–Wed: Light review only — flashcards, best-path order, admin distances, FHRP/STP timers
- **Sit the exam Thu/Fri**

---

## Tracking

- Schedule the exam NOW for the week of Oct 5 — a booked date keeps you honest
- If a practice exam domain scores under 70%, swap a rest day for review of that domain
- Skipped entirely: Ch 17–21 (wireless, removed in v1.2), Ch 30–31 (skim Ch 31 once for blueprint updates)
