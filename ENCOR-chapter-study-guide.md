# ENCOR 350-401 v1.2 — Per-Chapter Study Guide

Companion to `ENCOR-question-bank.md` and the 4-month plan. For every chapter: what to master (keyed to v1.2 topics), self-check prompts, and where to test yourself.

**Testing yourself:** each book chapter opens with a "Do I Know This Already?" (DIKTA) quiz with answers printed at the end of that chapter's first section and in Appendix A — take it before AND after reading. The book also includes Pearson Test Prep practice exams (activation code inside the book) — bank those for Weeks 16–18.

---

## Ch 1 — Packet Forwarding *(supporting)*
**Master:** L2 forwarding on destination MAC, unknown-unicast flooding, VLANs/access vs trunk ports, native VLAN behavior. Skim CEF/TCAM (dropped from v1.2).
**Self-check:** What does a switch do with an unknown unicast? Where does the 802.1Q tag sit? Why is a native-VLAN mismatch dangerous?

## Ch 2 — Spanning Tree Protocol (3.1.c)
**Master:** Root election (priority+MAC), root/designated port selection order (cost → BID → port priority → port number), 802.1D states/timers, RSTP roles (alternate/backup) and rapid transitions.
**Self-check:** Walk the tiebreaker order for a root port. Why does RSTP converge faster than 802.1D? Which ports stay discarding and why?

## Ch 3 — Advanced STP Tuning (3.1.c)
**Master:** Root guard (root-inconsistent, self-recovering) vs BPDU guard (err-disable) vs BPDU filter (dangerous), PortFast, errdisable recovery, deterministic root placement.
**Self-check:** Where do you put root guard vs BPDU guard? What happens when each receives a BPDU? How does a port recover from err-disable?

## Ch 4 — MST (3.1.c)
**Master:** Region matching trio (name/revision/VLAN map), IST instance 0, how a region appears as one bridge to outsiders, why moving a VLAN between instances is a region-wide change.
**Self-check:** Name the three region parameters. What is the IST? How does MST interoperate with Rapid PVST+?

## Ch 5 — VLAN Trunks & EtherChannel (3.1.a, 3.1.b)
**Master:** DTP mode combinations (auto+auto fails), nonegotiate, allowed-VLAN list editing (`add` keyword!), LACP active/passive vs PAgP desirable/auto vs static on, member-port consistency requirements, `show etherchannel summary` flags.
**Self-check:** Which DTP combos trunk? Which LACP combos bundle? Name four settings that must match for a port to join a bundle.

## Ch 6 — IP Routing Essentials (3.2.a, 3.2.d, 2.2.a)
**Master:** AD table cold (connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, IS-IS 115, RIP 120, iBGP 200), distance vector vs link state, static route types (recursive/directly attached/fully specified/floating), PBR (ingress, route-map, set ip next-hop, local policy), VRF basics (`vrf forwarding`, per-VRF tables).
**Self-check:** OSPF 50 vs EIGRP 30000 — which installs and why? What makes a static route float? Where is PBR applied?

## Ch 7 — EIGRP (3.2.a)
**Master:** Metric (BW+delay), successor/FS, feasibility condition (RD < FD), variance for unequal-cost, neighbor requirements (AS + K values; timers need NOT match), DUAL/Stuck-in-Active.
**Self-check:** State the feasibility condition. Why does a feasible successor converge instantly? What must match for adjacency?

## Ch 8 — OSPF (3.2.a, 3.2.b)
**Master:** Adjacency requirements (area, subnet, timers, auth, MTU), neighbor states (2WAY between DROTHERs is normal; ExStart stuck = MTU), DR/BDR election (no preemption), network types (broadcast vs point-to-point), RID selection, passive-interface, interface-mode `ip ospf X area Y`.
**Self-check:** List what must match for adjacency. Why change Ethernet links to point-to-point? What does passive-interface keep vs stop?

## Ch 9 — Advanced OSPF (3.2.a, 3.2.b)
**Master:** LSA types 1/2/3/4/5/7, area types (stub/totally stubby/NSSA and what each blocks), summarization (`area range` ABR vs `summary-address` ASBR), filtering tools and their scope, E1 vs E2, virtual links.
**Self-check:** Which LSAs enter a stub vs NSSA? Where do you summarize internal vs external routes? E1 vs E2 metric behavior?

## Ch 10 — OSPFv3 (3.2.b)
**Master:** Link-local adjacencies, interface-based enablement, 32-bit RID (set manually if IPv6-only), FF02::5/::6, address families, LSA restructuring (prefixes split out of topology LSAs).
**Self-check:** What sources OSPFv3 hellos? How is it enabled per interface? What breaks on an IPv6-only router if you forget the RID?

## Ch 11 — BGP (3.2.c)
**Master:** TCP 179, eBGP vs iBGP (AD 20/200), session states (Idle→Connect→OpenSent→OpenConfirm→Established; Active = TCP retry), eBGP TTL 1 (directly connected), network statement exact-match rule, what eBGP changes on advertisement (next-hop, AS_Path), `show ip bgp summary`.
**Self-check:** Why does the exam say "directly connected neighbors"? What must exist for a network statement to fire? Diagnose Idle/Active flapping.

## Ch 12 — Advanced BGP (3.2.c)
**Master:** Best-path order cold: Weight → LocalPref → locally originated → AS_Path → Origin (IGP<EGP<incomplete) → MED → eBGP>iBGP → IGP cost to next hop → oldest → lowest RID. Know which attributes influence inbound vs outbound traffic.
**Self-check:** Recite the list from memory. Which knobs shape outbound (weight/LP) vs inbound (MED/prepending)?

## Ch 13 — Multicast (3.3.d)
**Master:** Address ranges (224/4, 224.0.0.0/24 link-local, 232/8 SSM, 239/8 scoped), RPF check, IGMPv2 (leave/querier) vs v3 (source filtering → SSM), PIM SM mechanics (RP, (*,G) vs (S,G), register, SPT switchover), bidir (shared tree only), MSDP (RP-to-RP SA messages).
**⚠ Gap:** MSDP is not in the book — read Cisco's MSDP overview docs.
**Self-check:** Why does multicast need RPF? Walk a receiver join + source register in PIM SM. Why does SSM require IGMPv3 and no RP?

## Ch 14 — QoS (1.4)
**Master:** Reading MQC configs fluently (class-map match → policy-map actions → service-policy direction), DSCP markings (EF 46, AFxy meaning, CS values), policing vs shaping, `priority` (LLQ) vs `bandwidth` (CBWFQ), WRED. v1.2 says *interpret* — practice reading configs, not just writing.
**Self-check:** Given a policy-map, narrate exactly what happens to each class. AF31 decodes to what? When would you shape instead of police?

## Ch 15 — IP Services (3.3.a–c, 1.1.b)
**Master:** NTP stratum/server/peer config interpretation, PTP roles (grandmaster, boundary vs transparent clock) and why it beats NTP, HSRP (no preempt default, vMAC 0000.0c07.acXX, active/standby) vs VRRP (standard, preempts, 0000.5e00.01XX, master/backup), object tracking, NAT terminology (inside local/global), static vs pool vs PAT overload config.
**Self-check:** Interpret an `ntp server`/`ntp peer` pair. Which FHRP preempts by default? Label all four NAT address terms on a diagram.

## Ch 16 — Overlay Tunnels (2.2.b, 2.3.a, 2.3.b)
**Master:** GRE (proto 47, multicast/IGP capable, recursive-routing failure, MTU overhead), IPsec (ESP 50 vs AH 51, IKE phases, transform sets, GRE-over-IPsec vs VTI), LISP (EID vs RLOC, ITR/ETR, MS/MR), VXLAN (UDP 4789, 24-bit VNI, VTEP).
**Self-check:** Why GRE over IPsec for an IGP? What causes recursive routing? Map every LISP role. VXLAN vs 802.1Q scale numbers?

## Ch 22 — Enterprise Network Architecture (1.1.a, 1.1.b)
**Master:** 2-tier vs 3-tier and when each fits, layer roles, routed access tradeoffs, SSO (stateful supervisor failover), NSF/GR (keep forwarding while control plane recovers), redundancy + FHRP as HA building blocks, fabric/cloud design at a high level.
**Self-check:** When do you justify a dedicated core? Explain SSO+NSF together. Which HA technique covers gateway failure vs box failure?

## Ch 23 — Fabric Technologies (1.2, 1.3, part of 4.5)
**Master:** SD-Access: LISP control plane, VXLAN data plane, SGT policy plane; roles (control plane node, border, edge); legacy interop via border/fusion. Catalyst SD-WAN: vSmart (control/OMP), vBond (onboarding/NAT traversal), SD-WAN Manager (management), WAN Edge (data); OMP; benefits/limitations. Catalyst Center Design/Policy/Provision/Assurance.
**Note:** Book uses old names — DNA Center = Catalyst Center, vManage = SD-WAN Manager.
**Self-check:** Which node answers "where is this host?" in SD-Access? Map each SD-WAN component to its plane. Name two SD-WAN benefits and two limitations.

## Ch 24 — Network Assurance (4.1–4.5)
**Master:** Syslog severities 0–7 and trap-level logic, conditional debugs, traceroute TTL mechanics, SNMPv2c vs v3 (authPriv), Flexible NetFlow trio (record/exporter/monitor; match vs collect), SPAN vs RSPAN (VLAN) vs ERSPAN (GRE/routable), IP SLA (udp-jitter + responder), Catalyst Center Assurance (health scores, AI-driven issue detection/baselines).
**⚠ Gap:** "AI-powered workflows" is new in v1.2 — review Catalyst Center AI Network Analytics docs.
**Self-check:** Recite syslog 0–7. Build a NetFlow config from memory. Pick the right SPAN variant for three scenarios. What does the IP SLA responder add?

## Ch 25 — Secure Network Access (5.4.a–d)
**Master:** Threat defense components (Secure Network Analytics/NetFlow anomaly detection, Talos, Umbrella), endpoint security (Secure Endpoint/AMP retrospection), NGFW vs stateful (AVC + NGIPS), TrustSec (SGT classify/propagate/enforce, SGACL, SXP), MACsec 802.1AE (hop-by-hop L2, MKA), ISE's role.
**Self-check:** TrustSec's three phases? MACsec vs IPsec scope? What makes a firewall "next-gen"?

## Ch 26 — Device Access & Infrastructure Security (5.1, 5.2)
**Master:** vty hardening (access-class, transport input ssh, exec-timeout), `username secret`, AAA model and method lists with local fallback, TACACS+ (TCP 49, full encryption, command authorization, device admin) vs RADIUS (UDP 1812/13, 802.1X), ACL types/placement/wildcards, CoPP construction and its failure modes.
**Self-check:** Configure secure vty access from memory. TACACS+ vs RADIUS — four differences. Why baseline before applying CoPP?

## Ch 27 — Virtualization (2.1.a–c)
**Master:** Type 1 vs Type 2 hypervisors with examples, VM anatomy, vSwitch behavior, containers vs VMs, VNF/NFV/ENFV (NFVIS branch consolidation).
**Self-check:** Classify ESXi, KVM, VirtualBox. Why don't vSwitches usually run STP? What is a VNF?

## Ch 28 — Network Programmability (4.6, 5.3, 6.1–6.5)
**Master:** REST verbs + status codes (200/201/204/400/401/403/404/500), JSON syntax rules and Python dict/list navigation, YANG's role, NETCONF (SSH 830, XML, datastores, candidate/commit) vs RESTCONF (HTTPS, /restconf/data, JSON), Catalyst Center token auth (X-Auth-Token) and Intent API, SD-WAN Manager API, REST security (TLS, tokens/OAuth, least privilege, rate limiting).
**Self-check:** Hand-write valid JSON for a device with a list of interfaces. NETCONF vs RESTCONF table from memory. What's wrong with a 401 vs 403 response?

## Ch 29 — Automation Tools (6.6, 6.7)
**Master:** EEM applet anatomy (event syslog/cli/timer → ordered actions), where EEM runs (on-box), agent (Puppet/Chef, pull) vs agentless (Ansible, SSH push, YAML, idempotent), SaltStack's hybrid model.
**Self-check:** Write an EEM applet that logs and runs a command on a syslog match. Sort Ansible/Puppet/Chef/SaltStack into agent vs agentless and pull vs push.

---

## How to use this with the plan
1. Before reading a chapter: take its DIKTA quiz in the book (cold score).
2. Read, making flashcards from each "Master" line above.
3. After reading: my question bank section for that chapter + retake DIKTA.
4. Anything missed twice → lab it or add to your weak-areas list for Weeks 16–18.
5. Weeks 16–18: Pearson Test Prep full exams in exam mode.
