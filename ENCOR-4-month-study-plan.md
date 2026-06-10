# ENCOR 350-401 — 4-Month Study Plan

**Start:** Week of June 8, 2026
**Exam target:** Week of October 5–9, 2026
**Pace:** ~1 hr/day (5–7 hrs/week) · 24 chapters in 15 weeks + 2.5 weeks of final review

**Lab library:** all 36 hands-on labs are loaded in the study app (Hands-On Labs section) — each week names its assigned labs by ID. Import the matching CML YAML, work the graded tasks, check the solutions.

**Lessons:** all 59 pingmynetwork.com lessons are scheduled into the matching weeks below. Work through each one alongside (or before) the chapter reading — they make a great primer before the book's deeper pass.

## Weekly Rhythm

| Day | Activity |
|---|---|
| Mon–Thu | Work through the week's pingmynetwork lessons + read (~30–40 pages/day), make flashcards as you go |
| Fri | Lab day — work that week's assigned labs from the app |
| Sat | Flashcard review (all decks, spaced repetition) + chapter "Do I Know This Already?" quizzes + cheat sheet pass |
| Sun | Rest / catch-up buffer (overflow lab time on heavy lab weeks) |

Rules: never skip Friday labs on config-heavy weeks; review ALL flashcards every Saturday, not just the current week's; weeks with 3+ labs spill into Sunday — that's expected; if you fall behind, use Sundays — don't compress final review weeks.

---

## Phase 1 — Switching & Routing Core (Weeks 1–7)

### ☐ Week 1 (Jun 8–14): Ch 1 Packet Forwarding · Ch 2 Spanning Tree Protocol
- Ch 1 is supporting material — skim, don't grind (CEF/TCAM dropped from v1.2)
- **Labs:**
  - `KWT-CISCO-EXPRESS-FORWARDING` (4 tasks)
  - `KWT-SPANNING-TREE-PROTOCOL` (5 tasks)
- *(No pingmynetwork lessons this week — book + labs only)*

### ☐ Week 2 (Jun 15–21): Ch 3 Advanced STP Tuning · Ch 4 MST
- **Labs:**
  - `KWT-BPDU-GUARD` (6 tasks) — covers the guard features; build a quick MST region yourself in the same topology for extra credit
- **Lessons:** [Multiple Spanning Tree (MST)](https://pingmynetwork.com/network/ccnp-encor-350-401/multiple-spanning-tree-mst)

### ☐ Week 3 (Jun 22–28): Ch 5 VLAN Trunks & EtherChannel · Ch 6 IP Routing Essentials
- Key v1.2 items in Ch 6: VRF and PBR
- **Labs:**
  - `ENCOR-8021Q` (5 tasks — trunks, pruning, DTP troubleshooting)
  - `ENCOR-ETHERCHANNEL` (5 tasks — LACP/PAgP bundles, mode-matrix defects, suspended members, load balancing)
  - `ENCOR-VRF` (5 tasks — VRF-lite segmentation and route leaking)
- **Lessons:**
  - [Policy Based Routing (PBR)](https://pingmynetwork.com/network/ccnp-encor-350-401/policy-based-routing-pbr)
  - [VRF Lite](https://pingmynetwork.com/network/ccnp-encor-350-401/vrf-lite-configuration)

### ☐ Week 4 (Jun 29–Jul 5): Ch 7 EIGRP · Ch 8 OSPF
- Focus on the EIGRP-vs-OSPF comparison (topic 3.2.a) — metrics, path selection, area types
- **Labs:**
  - `ENCOR-OSPF-FOUNDATION` (5 tasks)
  - `KWT-OSPFV2-BASIC` (5 tasks)
  - `ENCOR-OSPF-NETWORK-TYPES` (5 tasks)
- **Lessons:**
  - [What is EIGRP?](https://pingmynetwork.com/network/ccnp-encor-350-401/what-is-eigrp)
  - [EIGRP Metric](https://pingmynetwork.com/network/ccnp-encor-350-401/eigrp-metric)
  - [EIGRP Path Selection](https://pingmynetwork.com/network/ccnp-encor-350-401/eigrp-path-selection)
  - [EIGRP Convergence](https://pingmynetwork.com/network/ccnp-encor-350-401/eigrp-convergence)
  - [OSPF Critical Routing Issue](https://pingmynetwork.com/network/ccnp-encor-350-401/ospf-critical-routing-issue)

### ☐ Week 5 (Jul 6–12): Ch 9 Advanced OSPF · Ch 10 OSPFv3
- **Labs:**
  - `ENCOR-OSPF-MULTIAREA` (5 tasks — summarization and filtering)
  - `KWT-OSPFV3-TRADITIONAL` (6 tasks)
- **Lessons:**
  - [OSPF Multi-Area](https://pingmynetwork.com/network/ccnp-encor-350-401/ospf-multi-area)
  - [OSPF LSA Types](https://pingmynetwork.com/network/ccnp-encor-350-401/ospf-lsa-types)
  - [OSPF Summarization](https://pingmynetwork.com/network/ccnp-encor-350-401/ospf-summarization)
  - [OSPF Filtering](https://pingmynetwork.com/network/ccnp-encor-350-401/ospf-filtering)
  - [OSPF Best-Path Selection](https://pingmynetwork.com/network/ccnp-encor-350-401/ospf-best-path-selection)
  - [OSPFv3 Fundamentals](https://pingmynetwork.com/network/ccnp-encor-350-401/ospfv3-fundamentals)
  - [OSPFv3 Configuration](https://pingmynetwork.com/network/ccnp-encor-350-401/ospfv3-configuration)
- Heaviest lesson week — pair each one with its matching book section

### ☐ Week 6 (Jul 13–19): Ch 11 BGP
- **Lab:**
  - `ENCOR-EBGP` (6 tasks — eBGP between directly connected neighbors, neighbor states, verification)
- **Lessons:**
  - [Introduction to BGP](https://pingmynetwork.com/network/ccnp-encor-350-401/introduction-to-bgp)
  - [Basic BGP Configuration](https://pingmynetwork.com/network/ccnp-encor-350-401/basic-bgp-configuration)
  - [How BGP Works](https://pingmynetwork.com/network/ccnp-encor-350-401/how-bgp-works)

### ☐ Week 7 (Jul 20–26): Ch 12 Advanced BGP + **Checkpoint Review #1**
- Only need best-path selection from Ch 12 — memorize the best-path order
- **Reinforcement labs:**
  - `KWT-BGP-IPV4` (5 tasks)
  - `KWT-OSPF-ROUTE-SUMMARIZATION` (5 tasks)
  - `KWT-OSPF-ROUTE-FILTERING` (6 tasks)
- **Lessons:** [BGP Best-Path Selection](https://pingmynetwork.com/network/ccnp-encor-350-401/bgp-best-path-selection)
- **Sat/Sun:** Re-quiz Chapters 1–11 (DIKTA quizzes), full flashcard pass

## Phase 2 — Services & Overlay (Weeks 8–11)

### ☐ Week 8 (Jul 27–Aug 2): Ch 13 Multicast
- **Lab:**
  - `ENCOR-PIM-SPARSE-MODE` (5 tasks — 4-router square with static RP; watch `show ip mroute` through the (*,G) join, source register, and SPT switchover, then fix the broken SPT path)
- **Lessons:**
  - [Introduction to Multicast](https://pingmynetwork.com/network/ccnp-encor-350-401/introduction-to-multicast)
  - [IGMP](https://pingmynetwork.com/network/ccnp-encor-350-401/igmp-internet-group-management-protocol)
  - [PIM Sparse Mode](https://pingmynetwork.com/network/ccnp-encor-350-401/pim-sparse-mode)
  - [PIM Variants: SSM and Bidir](https://pingmynetwork.com/network/ccnp-encor-350-401/pim-variants-ssm-and-bidirectional-pim)
  - [MSDP Multicast](https://pingmynetwork.com/network/ccnp-encor-350-401/multicast-msdp)
- ✅ The **MSDP, SSM, and bidir lessons close the book's biggest v1.2 gap** — these were previously "go read Cisco docs" items

### ☐ Week 9 (Aug 3–9): Ch 14 QoS
- v1.2 only asks you to *interpret* QoS configs — focus on reading MQC policies
- **Lab:**
  - `ENCOR-QOS-INTERPRET` (5 tasks)
- **Lessons:** [Interpret QoS Configurations](https://pingmynetwork.com/network/ccnp-encor-350-401/interpret-qos-configurations)

### ☐ Week 10 (Aug 10–16): Ch 15 IP Services
- **Labs:**
  - `ENCOR-NETWORK-TIME` (5 tasks)
  - `KWT-NTP-SECURITY` (6 tasks)
  - `ENCOR-NAT-PAT` (6 tasks)
  - `ENCOR-FHRP` (6 tasks)
- **Lessons:** [Precision Time Protocol (PTP)](https://pingmynetwork.com/network/ccnp-encor-350-401/precision-time-protocol-ptp)
- Heaviest lab week of Phase 2 — start Friday, finish over the weekend

### ☐ Week 11 (Aug 17–23): Ch 16 Overlay Tunnels · Ch 22 Enterprise Network Architecture
- **Labs:**
  - `ENCOR-GRE` (5 tasks)
  - `ENCOR-IPSEC` (5 tasks)
  - `ENCOR-GRE-IPSEC` (5 tasks — IPsec profile style)
  - `KWT-GRE-OVER-IPSEC` (5 tasks — crypto map style)
- **Lessons:**
  - [Generic Routing Encapsulation (GRE)](https://pingmynetwork.com/network/ccnp-encor-350-401/generic-routing-encapsulation-gre)
  - [IPsec Fundamentals](https://pingmynetwork.com/network/ccnp-encor-350-401/ipsec-fundamentals)
  - [GRE over IPsec](https://pingmynetwork.com/network/ccnp-encor-350-401/gre-over-ipsec)
  - [VXLAN](https://pingmynetwork.com/network/ccnp-encor-350-401/vxlan-fundamentals)
  - [LISP Fundamentals](https://pingmynetwork.com/network/ccnp-encor-350-401/lisp-fundamentals)
  - [Stateful Switchover (SSO)](https://pingmynetwork.com/network/ccnp-encor-350-401/stateful-switchover-sso)
- VXLAN + LISP lessons here also pre-load Week 12's SD-Access material

## Phase 3 — Architecture, Assurance, Security, Automation (Weeks 12–15)

### ☐ Week 12 (Aug 24–30): Ch 23 Fabric Technologies · Ch 27 Virtualization
- SD-Access + Catalyst SD-WAN: control vs data plane elements, benefits/limitations
- Names changed: DNA Center → Catalyst Center, vManage → SD-WAN Manager
- **Capstone lab:**
  - `ENCOR-VRF-GRE-IPSEC` (5 tasks — integrated VRF + GRE + IPsec data path)
- **Lessons:**
  - [SD-Access Architecture](https://pingmynetwork.com/network/ccnp-encor-350-401/sd-access-architecture)
  - [How SD-Access Works](https://pingmynetwork.com/network/ccnp-encor-350-401/how-sd-access-works)
  - [SD-WAN Architecture](https://pingmynetwork.com/network/ccnp-encor-350-401/sd-wan-architecture)
  - [How SD-WAN Works](https://pingmynetwork.com/network/ccnp-encor-350-401/how-sd-wan-works)
  - [Cisco Catalyst Center](https://pingmynetwork.com/network/ccnp-encor-350-401/cisco-catalyst-center)
  - [Hypervisor Type 1 & Type 2](https://pingmynetwork.com/network/ccnp-encor-350-401/hypervisor-type-1-and-type-2)
  - [Virtual Machine](https://pingmynetwork.com/network/ccnp-encor-350-401/virtual-machine)
  - [Virtual Switching](https://pingmynetwork.com/network/ccnp-encor-350-401/virtual-switching)
- Heaviest lesson week of Phase 3 — but the virtualization three are short describe-level topics

### ☐ Week 13 (Aug 31–Sep 6): Ch 24 Network Assurance
- ⚠️ **Supplement "AI-powered workflows" in Catalyst Center from Cisco docs** (new v1.2; the Week 12 Catalyst Center lesson helps too)
- **Labs:**
  - `ENCOR-FLEXIBLE-NETFLOW` (6 tasks)
  - `ENCOR-SPAN-RSPAN-ERSPAN` (6 tasks)
  - `ENCOR-IPSLA` (7 tasks)
  - `KWT-IP-SLA-RTR` (6 tasks)
  - `KWT-IP-SLA-PATH-SELECTION` (6 tasks)
- **Lessons:**
  - [Diagnose Network Problems](https://pingmynetwork.com/network/ccnp-encor-350-401/diagnose-network-problems)
  - [IP SLA](https://pingmynetwork.com/network/ccnp-encor-350-401/ip-sla)
  - [Flexible NetFlow](https://pingmynetwork.com/network/ccnp-encor-350-401/flexible-netflow)
  - [Local SPAN](https://pingmynetwork.com/network/ccnp-encor-350-401/local-span)
  - [Remote SPAN (RSPAN)](https://pingmynetwork.com/network/ccnp-encor-350-401/remote-span-rspan)
  - [Encapsulated Remote SPAN (ERSPAN)](https://pingmynetwork.com/network/ccnp-encor-350-401/encapsulated-remote-span-erspan)
- Biggest combined week of the plan — three core labs Friday/Saturday, the two KWT IP SLA labs Sunday

### ☐ Week 14 (Sep 7–13): Ch 25 Secure Network Access · Ch 26 Device Access & Infra Security
- **Labs:**
  - `ENCOR-DEVICE-ACCESS` (7 tasks)
  - `ENCOR-AAA` (7 tasks)
  - `ENCOR-ACL` (7 tasks)
  - `ENCOR-COPP` (6 tasks)
- **Lessons:**
  - [Lines and Password Protection](https://pingmynetwork.com/network/ccnp-encor-350-401/lines-and-password-protection)
  - [Control Plane Policing (CoPP)](https://pingmynetwork.com/network/ccnp-encor-350-401/control-plane-policing-copp)
  - [Next-Generation Firewall (NGFW)](https://pingmynetwork.com/network/ccnp-encor-350-401/next-generation-firewall)
  - [Threat Defense](https://pingmynetwork.com/network/ccnp-encor-350-401/threat-defense)
  - [Endpoint Security](https://pingmynetwork.com/network/ccnp-encor-350-401/endpoint-security)
- The four labs map one-to-one onto exam topics 5.1.a, 5.1.b, 5.2.a, 5.2.b

### ☐ Week 15 (Sep 14–20): Ch 28 Network Programmability · Ch 29 Automation Tools
- **Lab:**
  - `ENCOR-NETCONF-RESTCONF` (7 tasks)
- **Lessons:**
  - [EEM](https://pingmynetwork.com/network/ccnp-encor-350-401/embedded-event-manager-eem)
  - [Python Basics](https://pingmynetwork.com/network/ccnp-encor-350-401/python-basics)
  - [YANG](https://pingmynetwork.com/network/ccnp-encor-350-401/yang-data-modeling)
  - [NETCONF](https://pingmynetwork.com/network/ccnp-encor-350-401/netconf)
  - [RESTCONF](https://pingmynetwork.com/network/ccnp-encor-350-401/restconf)
  - [REST API Security](https://pingmynetwork.com/network/ccnp-encor-350-401/rest-api-security)
  - [Agent vs Agentless](https://pingmynetwork.com/network/ccnp-encor-350-401/agent-vs-agentless)
  - [APIs for Catalyst Center and vManage](https://pingmynetwork.com/network/ccnp-encor-350-401/apis-catalyst-center-sdwan-manager)
- Also: write a simple EEM applet on any lab router after the EEM lesson — five lines of config, from memory
- Know: REST response codes, YANG purpose, Catalyst Center & SD-WAN Manager APIs, agent vs agentless (Ansible vs Puppet/Chef)

## Phase 4 — Final Review & Practice Exams (Weeks 16–18)

### ☐ Week 16 (Sep 21–27): Practice Exam #1 + targeted review
- Full timed practice exam (book's companion Pearson Test Prep)
- Score by domain; re-read Key Topics tables + cheat sheets for every weak domain; revisit the matching pingmynetwork lessons for anything under 70%
- **Re-run the two labs that gave you the most trouble** — from scratch, no peeking at solutions

### ☐ Week 17 (Sep 28–Oct 4): Practice Exam #2 + drill
- Second full timed exam — target 85%+
- Daily: Key Topics tables + command reference review, one domain per day
- Recheck the remaining book gap: Catalyst Center AI workflows (MSDP/SSM/bidir now covered by the Week 8 lessons)
- One more lab re-run: pick your weakest domain and redo its hardest lab cold

### ☐ Week 18 (Oct 5–9): **EXAM WEEK**
- Mon: Practice Exam #3 (confidence check)
- Tue–Wed: Light review only — flashcards, best-path order, admin distances, FHRP/STP timers
- **Sit the exam Thu/Fri**

---

## Lab coverage map (all 36, by domain)

| Domain | Labs | Week |
|---|---|---|
| Architecture | KWT-CISCO-EXPRESS-FORWARDING · ENCOR-QOS-INTERPRET | 1, 9 |
| Layer 2 | KWT-SPANNING-TREE-PROTOCOL · KWT-BPDU-GUARD · ENCOR-8021Q · ENCOR-ETHERCHANNEL | 1, 2, 3 |
| Layer 3 | ENCOR-OSPF-FOUNDATION · KWT-OSPFV2-BASIC · ENCOR-OSPF-NETWORK-TYPES · ENCOR-OSPF-MULTIAREA · KWT-OSPFV3-TRADITIONAL · ENCOR-EBGP · KWT-BGP-IPV4 · KWT-OSPF-ROUTE-SUMMARIZATION · KWT-OSPF-ROUTE-FILTERING | 4, 5, 6, 7 |
| Virtualization | ENCOR-VRF · ENCOR-GRE · ENCOR-IPSEC · ENCOR-GRE-IPSEC · KWT-GRE-OVER-IPSEC · ENCOR-VRF-GRE-IPSEC | 3, 11, 12 |
| IP Services | ENCOR-PIM-SPARSE-MODE · ENCOR-NETWORK-TIME · KWT-NTP-SECURITY · ENCOR-NAT-PAT · ENCOR-FHRP | 8, 10 |
| Network Assurance | ENCOR-FLEXIBLE-NETFLOW · ENCOR-SPAN-RSPAN-ERSPAN · ENCOR-IPSLA · KWT-IP-SLA-RTR · KWT-IP-SLA-PATH-SELECTION · ENCOR-NETCONF-RESTCONF | 13, 15 |
| Security | ENCOR-DEVICE-ACCESS · ENCOR-AAA · ENCOR-ACL · ENCOR-COPP | 14 |

DIY (no lab in library): MST region (Week 2) · EEM applet (Week 15)

## pingmynetwork lesson map (all 59, by module → week)

| Module | Week(s) |
|---|---|
| 1 OSPF Advanced | 4 (Critical Routing Issue) · 5 (rest) |
| 2 OSPFv3 | 5 |
| 3 EIGRP | 4 |
| 4 BGP | 6 · 7 (Best-Path Selection) |
| 5 Network Traffic Control | 3 (PBR) · 9 (QoS) · 14 (CoPP) |
| 6 Monitoring | 10 (PTP) · 13 (rest) |
| 7 Traffic Analysis | 13 |
| 8 High Availability | 11 |
| 9 Virtualization Fundamentals | 3 (VRF Lite) · 12 (rest) |
| 10 Tunneling Technologies | 11 |
| 11 Overlay Networking | 11 |
| 12 Multicast | 8 |
| 13 STP Advanced | 2 |
| 14 SDN | 12 · 15 (APIs lesson) |
| 15 Device Access Control | 14 |
| 17 Network Security Services | 14 |
| 18 Automation | 15 |

## Tracking

- Schedule the exam NOW for the week of Oct 5 — a booked date keeps you honest
- If a practice exam domain scores under 70%, swap a rest day for review of that domain (cheat sheet + lessons + lab re-run)
- Skipped entirely: Ch 17–21 (wireless, removed in v1.2), Ch 30–31 (skim Ch 31 once for blueprint updates)
