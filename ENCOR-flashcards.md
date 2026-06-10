# ENCOR 350-401 Flashcards

Original term/definition cards for the 24 applicable OCG chapters. Also built into ENCOR-quiz-app.html (Flashcards mode).

## Ch 1 — Packet Forwarding (13 cards)

- **MAC address table (CAM)** — Switch table mapping MAC addresses to ports/VLANs; drives Layer 2 forwarding decisions.
- **TCAM** — Specialized memory allowing single-cycle lookups against masks (ACLs, QoS, routing) in hardware.
- **CEF** — Cisco Express Forwarding — hardware/software forwarding using the FIB and adjacency table, no per-packet CPU process.
- **FIB** — Forwarding Information Base — CEF's optimized copy of the routing table used for actual packet forwarding.
- **Adjacency table** — CEF structure holding pre-built Layer 2 next-hop headers, populated from ARP.
- **Process switching** — CPU-driven, per-packet forwarding path — slowest method, used for punted/exception traffic.
- **Collision domain** — Segment where frames can collide; each switch port is its own collision domain.
- **Broadcast domain** — Extent of a Layer 2 broadcast; bounded by routers/L3 boundaries, one per VLAN.
- **VLAN** — Logical Layer 2 segmentation creating separate broadcast domains on one switch.
- **Access port** — Switch port carrying a single VLAN, untagged, for end devices.
- **Trunk port** — Port carrying multiple VLANs using 802.1Q tags between switches.
- **Native VLAN** — The VLAN sent untagged on an 802.1Q trunk; must match on both ends.
- **SDM template** — Switch setting that repartitions TCAM resources (e.g., more routes vs. more ACLs).

## Ch 2 — Spanning Tree Protocol (13 cards)

- **Root bridge** — Switch elected as the STP topology's reference point — lowest bridge ID (priority, then MAC).
- **BPDU** — Bridge Protocol Data Unit — STP hello carrying root/cost/bridge/port IDs every 2 seconds.
- **Bridge ID** — Priority + system ID extension (VLAN) + MAC; lowest wins root election.
- **Root port** — A non-root switch's best port toward the root — lowest path cost, one per switch.
- **Designated port** — The forwarding port on each segment with the best path to the root.
- **Root path cost** — Cumulative interface costs along the path to the root bridge.
- **802.1D port states** — Blocking → listening → learning → forwarding (~30 s with default timers).
- **Hello / Max age / Forward delay** — STP timers: 2 s BPDU interval, 20 s info expiry, 15 s per listening/learning phase.
- **RSTP alternate port** — Discarding port providing a backup path to the root (backs up the root port).
- **RSTP backup port** — Discarding port backing up a designated port on the same shared segment.
- **Edge port** — RSTP/PortFast port to an end host — forwards immediately, no proposal/agreement.
- **TCN** — Topology Change Notification — triggers faster MAC table aging after a topology change.
- **PVST+ / Rapid PVST+** — Cisco's per-VLAN spanning tree instances (802.1D / 802.1w based).

## Ch 3 — Advanced STP Tuning (7 cards)

- **PortFast** — Skips listening/learning on edge ports; port forwards immediately and suppresses TCNs on flap.
- **BPDU guard** — Err-disables a port if any BPDU is received — protects PortFast edge ports.
- **BPDU filter** — Stops sending/processing BPDUs on a port — removes loop protection; use with extreme care.
- **Root guard** — Blocks a port (root-inconsistent) when superior BPDUs arrive — prevents unauthorized root takeover; self-recovers.
- **Loop guard** — Prevents a blocked port from becoming forwarding when BPDUs suddenly stop (unidirectional failure).
- **UDLD** — Cisco protocol detecting unidirectional links on fiber; err-disables the port in aggressive mode.
- **Err-disabled** — Port shutdown by a protection feature; recover via shutdown/no shutdown or errdisable recovery.

## Ch 4 — Multiple Spanning Tree Protocol (7 cards)

- **MST** — Multiple Spanning Tree (802.1s) — maps many VLANs to a few spanning-tree instances.
- **MST region** — Switches sharing identical name, revision number, and VLAN-to-instance mapping.
- **IST** — Internal Spanning Tree, instance 0 — runs on all links and represents the region externally.
- **MSTI** — An MST instance carrying a configured set of VLANs with its own topology.
- **CIST** — Common and Internal Spanning Tree — the single tree connecting MST regions and non-MST switches.
- **MST boundary port** — Port connecting the region to switches outside it (other regions or PVST+/RSTP).
- **PVST simulation** — Mechanism letting an MST region interoperate with PVST+ neighbors (region appears as one bridge).

## Ch 5 — VLAN Trunks and EtherChannel Bundles (10 cards)

- **802.1Q** — Trunking standard inserting a 4-byte VLAN tag between source MAC and Type/Length.
- **DTP** — Dynamic Trunking Protocol — Cisco negotiation of trunk formation (desirable initiates, auto responds).
- **switchport nonegotiate** — Disables DTP on a statically configured port — best practice on hardcoded trunks.
- **Allowed VLAN list** — VLANs permitted on a trunk; edit with the add/remove keywords to avoid overwriting.
- **EtherChannel** — Bundling of multiple physical links into one logical interface — more bandwidth, no STP blocking between members.
- **LACP** — IEEE 802.3ad bundling protocol; modes active (initiates) and passive (responds).
- **PAgP** — Cisco bundling protocol; modes desirable (initiates) and auto (responds).
- **Mode on** — Static bundling, no protocol — must be configured on both sides or the channel fails.
- **EtherChannel load balancing** — Hash (src/dst MAC, IP, or port) deciding which member link each flow uses.
- **Member compatibility** — Bundle members must match speed, duplex, switchport mode, and VLAN configuration.

## Ch 6 — IP Routing Essentials (13 cards)

- **Administrative distance** — Trustworthiness rank of a route source; lower wins between protocols for the same prefix.
- **AD values** — Connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, IS-IS 115, RIP 120, iBGP 200.
- **Longest prefix match** — Most specific prefix wins forwarding, evaluated before AD or metric.
- **Distance vector** — Protocol learning routes from neighbors' advertisements ("routing by rumor"), e.g., RIP.
- **Link-state** — Protocol flooding topology info so each router computes its own SPF tree (OSPF, IS-IS).
- **ECMP** — Equal-cost multipath — installing and load-sharing across multiple equal-metric routes.
- **Unequal-cost load balancing** — Sharing traffic across paths with different metrics — EIGRP via variance.
- **Floating static route** — Static route with raised AD, installed only when the primary route disappears.
- **Recursive static route** — Static route specifying only a next hop; requires another lookup for the exit interface.
- **Fully specified static route** — Static route with both exit interface and next hop — no recursion.
- **Null0 route** — Route discarding traffic; used for summarization loop prevention.
- **PBR** — Policy-based routing — route-map overriding destination-based forwarding, applied ingress.
- **VRF** — Virtual Routing and Forwarding — separate routing table instances on one router; interfaces are assigned per VRF.

## Ch 7 — EIGRP (11 cards)

- **DUAL** — EIGRP's Diffusing Update Algorithm — guarantees loop-free paths and coordinates queries on failure.
- **Successor** — EIGRP's best (installed) path to a prefix.
- **Feasible distance (FD)** — The metric of the best path, as computed locally.
- **Reported distance (RD)** — The neighbor's own metric to the destination (also called advertised distance).
- **Feasible successor** — Backup path whose RD < FD — loop-free, used instantly on failure.
- **Feasibility condition** — RD must be less than FD for a path to qualify as a backup.
- **Variance** — Multiplier enabling unequal-cost load balancing over feasible successors within variance × FD.
- **EIGRP K values** — Metric weights (bandwidth K1 and delay K3 on by default); must match between neighbors.
- **Hello/hold timers** — EIGRP keepalives (5 s/15 s on LAN); do NOT need to match between neighbors.
- **Stuck in Active (SIA)** — Route stuck waiting on unanswered DUAL queries; eventually resets the neighbor.
- **EIGRP multicast** — Hellos sent to 224.0.0.10.

## Ch 8 — OSPF (13 cards)

- **LSA** — Link-State Advertisement — OSPF's unit of topology/routing information.
- **LSDB** — Link-State Database — identical topology copy held by all routers in an area.
- **Area** — OSPF flooding boundary; area 0 is the backbone all areas must touch.
- **ABR** — Area Border Router — connects areas, generates Type 3 summaries.
- **SPF (Dijkstra)** — Algorithm each router runs on the LSDB to compute shortest paths.
- **OSPF neighbor states** — Down, Init, 2-Way, ExStart, Exchange, Loading, Full.
- **2WAY/DROTHER** — Normal state between two non-DR/BDR routers on a broadcast segment.
- **DR/BDR** — Designated/Backup Designated Router — reduce flooding on multiaccess segments; highest priority then highest RID; no preemption.
- **OSPF router ID** — 32-bit identifier: manual > highest loopback > highest interface IP.
- **OSPF network types** — Broadcast (DR, 10/40 timers), point-to-point (no DR), NBMA (30/120), point-to-multipoint.
- **Adjacency requirements** — Matching area, subnet, timers, authentication, stub flags; unique RIDs; compatible MTU.
- **Passive interface** — Advertises the subnet but sends no hellos — no adjacencies on that interface.
- **ExStart/Exchange stuck** — Classic MTU mismatch symptom during database description exchange.

## Ch 9 — Advanced OSPF (14 cards)

- **Type 1 LSA** — Router LSA — each router's links, flooded within its area.
- **Type 2 LSA** — Network LSA — generated by the DR for a multiaccess segment.
- **Type 3 LSA** — Summary LSA — inter-area prefixes, generated by ABRs.
- **Type 4 LSA** — ASBR summary — tells other areas how to reach the ASBR.
- **Type 5 LSA** — External LSA — redistributed prefixes, flooded domain-wide (except stub areas).
- **Type 7 LSA** — NSSA external — redistribution inside an NSSA; converted to Type 5 at the ABR.
- **Stub area** — Blocks Type 5 LSAs; ABR injects a default route instead.
- **Totally stubby area** — Blocks Types 3, 4, and 5; only a default route enters (Cisco extension).
- **NSSA** — Stub-like area that still allows local redistribution via Type 7.
- **ASBR** — Autonomous System Boundary Router — redistributes external routes into OSPF.
- **area range** — ABR command summarizing an area's prefixes into one Type 3 advertisement.
- **summary-address** — ASBR command summarizing external (redistributed) routes.
- **E1 vs E2** — E1 adds internal cost to the external metric; E2 (default) keeps a fixed metric.
- **Virtual link** — Logical extension of area 0 across a transit area for backbone connectivity.

## Ch 10 — OSPFv3 (7 cards)

- **OSPFv3** — OSPF for IPv6 (RFC 5340) — same mechanics, interface-based config, link-local adjacencies.
- **OSPFv3 enablement** — Configured per interface (e.g., ospfv3 1 ipv6 area 0); no network statements.
- **OSPFv3 router ID** — Still 32 bits; must be set manually on IPv6-only routers.
- **Link LSA** — OSPFv3 LSA sharing link-local addresses/prefixes with neighbors on a link.
- **Intra-Area Prefix LSA** — OSPFv3 LSA carrying prefixes, decoupled from topology LSAs — prefix changes avoid full SPF.
- **OSPFv3 address families** — Single OSPFv3 process routing both IPv4 and IPv6 via AF configuration.
- **OSPFv3 multicast** — FF02::5 all OSPF routers, FF02::6 DR routers.

## Ch 11 — BGP (12 cards)

- **BGP** — Path-vector EGP exchanging reachability (NLRI) between autonomous systems over TCP 179.
- **Autonomous system** — Network domain under one administrative routing policy, identified by ASN.
- **eBGP vs iBGP** — Peering between different ASNs (AD 20) vs. within one ASN (AD 200).
- **BGP session states** — Idle → Connect → OpenSent → OpenConfirm → Established (Active = retrying TCP).
- **Active state** — Misleading name: BGP is actively failing to build the TCP session — check reachability/config.
- **NLRI** — Network Layer Reachability Information — the prefixes BGP advertises.
- **BGP network statement** — Advertises a prefix only if an exact match (prefix + mask) exists in the RIB.
- **eBGP TTL** — Defaults to 1, requiring directly connected peers; ebgp-multihop/ttl-security changes this.
- **update-source** — Sets the source interface (commonly a loopback) for BGP session packets.
- **next-hop-self** — iBGP technique rewriting next hop so internal peers can reach eBGP-learned routes.
- **eBGP advertisement behavior** — Sender prepends its ASN to AS_Path and sets itself as next hop.
- **Address family** — BGP configuration container per protocol (IPv4/IPv6 unicast, VPN, EVPN).

## Ch 12 — Advanced BGP: Best Path (9 cards)

- **Weight** — Cisco-only, local-to-router attribute; highest wins, checked first.
- **Local preference** — AS-wide outbound path preference shared via iBGP; default 100, highest wins.
- **AS_Path** — List of ASNs the route traversed; shortest wins, also BGP's loop prevention.
- **AS-path prepending** — Artificially lengthening AS_Path to deter inbound traffic on a link.
- **Origin** — How the route entered BGP: IGP (i) < EGP (e) < incomplete (?) — lower preferred.
- **MED** — Metric advertised to a neighboring AS suggesting an entry point; lowest wins, compared from the same AS by default.
- **Best-path order** — Weight, LocalPref, locally originated, AS_Path, Origin, MED, eBGP>iBGP, IGP cost, oldest, lowest RID.
- **eBGP over iBGP** — All else equal, externally learned paths beat internal ones.
- **BGP communities** — Tags attached to routes to signal/trigger policy across ASes.

## Ch 13 — Multicast (21 cards)

- **224.0.0.0/4** — The full IPv4 multicast range (Class D).
- **224.0.0.0/24** — Link-local multicast — never forwarded by routers (OSPF .5/.6, EIGRP .10, PIM .13, VRRP .18).
- **232.0.0.0/8** — Source-Specific Multicast range.
- **239.0.0.0/8** — Administratively scoped (private) multicast range.
- **IGMP** — Protocol receivers use to join/leave groups on their LAN.
- **IGMPv2** — Adds Leave messages and querier election (lowest IP wins).
- **IGMPv3** — Adds source filtering (INCLUDE/EXCLUDE) — required for SSM.
- **IGMP snooping** — Switch listens to IGMP to forward multicast only to interested ports.
- **PIM** — Protocol Independent Multicast — builds distribution trees using the unicast routing table.
- **PIM Dense Mode** — Flood-and-prune model; assumes receivers everywhere — rarely used.
- **PIM Sparse Mode** — Explicit-join model using an RP for source discovery.
- **Rendezvous Point** — PIM-SM meeting point: root of shared trees, target of source registers.
- **Shared tree (*,G)** — Tree rooted at the RP serving all sources for a group.
- **Source tree (S,G)** — Shortest-path tree rooted at a specific source.
- **SPT switchover** — Last-hop router joins the source tree after learning the source (Cisco default: immediately).
- **RPF check** — Accept multicast only on the interface used to reach the source via unicast; else drop.
- **PIM DR** — Designated router on a segment — registers sources/joins for receivers (highest priority/IP).
- **SSM** — Source-Specific Multicast — receivers specify (S,G) directly; no RP needed.
- **Bidirectional PIM** — Shared-tree-only mode for many-to-many traffic; no (S,G) state.
- **MSDP** — Connects RPs across PIM domains, exchanging Source-Active messages over TCP.
- **Auto-RP / BSR** — Dynamic RP-distribution mechanisms (Cisco / standards-based).

## Ch 14 — Quality of Service (17 cards)

- **IntServ** — QoS by per-flow reservation (RSVP) end to end — precise but unscalable.
- **DiffServ** — QoS by marking packets into classes treated per hop (PHB) — the scalable standard.
- **ToS/DiffServ field** — The IP header byte carrying DSCP (6 bits) + ECN (2 bits).
- **DSCP** — 64-value packet marking driving per-hop treatment.
- **EF** — Expedited Forwarding, DSCP 46 — low-loss/low-latency PHB for voice.
- **AFxy** — Assured Forwarding: class x (1–4), drop precedence y (1–3); e.g., AF31 = class 3, low drop.
- **CS values** — Class Selector codepoints (CS0–CS7) backward compatible with IP precedence.
- **MQC** — Modular QoS CLI: class-map (match) → policy-map (action) → service-policy (apply with direction).
- **Classification** — Identifying traffic (ACL, NBAR, DSCP match) to assign it to a class.
- **Marking** — Writing DSCP/CoS values, ideally at the trust boundary.
- **Trust boundary** — Point where markings from devices are accepted or rewritten (e.g., IP phone, access port).
- **Policing** — Enforces a rate by dropping/re-marking excess immediately — no added delay.
- **Shaping** — Buffers excess to smooth output to a target rate — adds delay, used toward provider circuits.
- **CBWFQ** — Class-based weighted fair queuing — per-class minimum bandwidth guarantees.
- **LLQ** — CBWFQ plus a strict-priority queue (priority command) with built-in policing.
- **WRED** — Random early dropping of lower-priority packets as queues fill — avoids global TCP sync.
- **NBAR2** — Deep-packet application recognition used for classification.

## Ch 15 — IP Services (18 cards)

- **NTP stratum** — Distance from the reference clock; 1 = directly attached, 16 = unsynchronized.
- **ntp server vs peer** — Client syncs to a server; peers may sync to each other (symmetric).
- **PTP (IEEE 1588)** — Precision Time Protocol — sub-microsecond sync via hardware timestamping.
- **PTP grandmaster** — The authoritative clock source elected for the PTP domain.
- **Boundary clock** — PTP device that syncs upstream and re-serves time downstream.
- **Transparent clock** — PTP switch that corrects packets for its own residence/transit delay.
- **FHRP** — First-hop redundancy protocol family — virtual gateway IP shared by routers (HSRP, VRRP, GLBP).
- **HSRP** — Cisco FHRP; Active/Standby; vMAC 0000.0c07.acXX; preempt OFF by default.
- **VRRP** — Standard FHRP; Master/Backup; vMAC 0000.5e00.01XX; preempts by default; 224.0.0.18.
- **GLBP** — Cisco FHRP load-balancing across gateways: AVG assigns vMACs to AVFs.
- **Preempt** — Allows a higher-priority router to take over the active/master role.
- **Object tracking** — Ties FHRP priority (decrement) to interface/route/SLA health.
- **Inside local** — Inside host's address as seen inside (private IP).
- **Inside global** — Inside host's address as seen from outside (translated public IP).
- **Outside local/global** — Outside host's address as seen inside / as it really is outside.
- **Static NAT** — Permanent one-to-one mapping.
- **Pooled NAT** — Dynamic one-to-one from an address pool.
- **PAT (overload)** — Many-to-one translation distinguished by port numbers.

## Ch 16 — Overlay Tunnels (17 cards)

- **GRE** — Generic Routing Encapsulation, IP protocol 47 — multiprotocol tunnel that carries multicast/IGPs; no encryption.
- **Recursive routing** — Tunnel failure mode: route to the tunnel destination learned through the tunnel itself.
- **IPsec** — Standards framework for authenticated/encrypted IP transport.
- **ESP** — IP protocol 50 — encryption + integrity; works with NAT-T.
- **AH** — IP protocol 51 — integrity only, no encryption; breaks through NAT.
- **IKE/ISAKMP** — Negotiates SAs: Phase 1 secure channel, Phase 2 IPsec data SAs.
- **Transform set** — The agreed cipher/hash combination for IPsec data protection.
- **Tunnel vs transport mode** — Encapsulate entire IP packet vs. protect payload between original endpoints.
- **GRE over IPsec** — GRE for routing/multicast flexibility wrapped in IPsec for confidentiality.
- **VTI** — Virtual Tunnel Interface — routable IPsec tunnel interface without GRE overhead or crypto maps.
- **LISP** — Locator/ID Separation Protocol — splits endpoint identity (EID) from location (RLOC).
- **EID / RLOC** — EID = host/site identity prefix; RLOC = underlay address of the site's router.
- **ITR / ETR** — Ingress tunnel router encapsulates toward RLOCs; egress decapsulates to EIDs.
- **Map Server / Map Resolver** — LISP mapping system answering "which RLOC serves this EID?"
- **VXLAN** — MAC-in-UDP (port 4789) overlay with 24-bit VNIs (~16M segments).
- **VTEP** — VXLAN tunnel endpoint performing encap/decap.
- **VNI** — VXLAN Network Identifier — the overlay segment ID.

## Ch 22 — Enterprise Network Architecture (12 cards)

- **Access layer** — Connects endpoints; PoE, QoS trust, security features live here.
- **Distribution layer** — Aggregates access switches; policy, summarization, L2/L3 boundary.
- **Core layer** — High-speed backbone interconnecting distribution blocks — fast and simple.
- **Two-tier (collapsed core)** — Core+distribution combined — fits smaller campuses.
- **Three-tier** — Dedicated core justified when multiple distribution blocks must interconnect.
- **Routed access** — L3 pushed to access switches — no STP/FHRP between access and distribution.
- **SSO** — Stateful Switchover — standby supervisor takes over with synchronized state.
- **NSF** — Nonstop Forwarding — keep forwarding on CEF while the control plane recovers (with GR).
- **Graceful Restart** — Neighbors assist a restarting router, keeping routes during recovery.
- **NSR** — Nonstop Routing — state preserved internally; no neighbor assistance required.
- **StackWise/VSS-style aggregation** — Multiple physical switches operating as one logical switch.
- **Redundancy/FHRP/SSO** — The three HA techniques explicitly named in exam topic 1.1.b.

## Ch 23 — Fabric Technologies: SD-Access & Catalyst SD-WAN (19 cards)

- **SD-Access** — Cisco's intent-based campus fabric: LISP control, VXLAN data, SGT policy, managed by Catalyst Center.
- **Underlay** — The routed physical network carrying fabric tunnels (typically IS-IS/OSPF).
- **Overlay** — The virtualized network built on top (VXLAN tunnels between fabric nodes).
- **Control plane node** — Runs LISP MS/MR — the fabric's host-tracking database.
- **Border node** — Connects the fabric to external networks (known and unknown/default borders).
- **Edge node** — Fabric access switch — endpoints attach here; encap/decap VXLAN.
- **Fusion device** — Router/firewall outside the border leaking routes between fabric VNs and legacy networks.
- **Virtual network (VN)** — Macro-segmentation in SD-Access — maps to VRFs.
- **Scalable Group Tag (SGT)** — TrustSec tag enabling micro-segmentation within a VN.
- **Catalyst Center** — Controller (formerly DNA Center): Design, Policy, Provision, Assurance workflows + APIs.
- **Catalyst SD-WAN** — Controller-based WAN overlay (formerly Viptela) across any transport.
- **vSmart** — SD-WAN control plane — distributes routes/policy via OMP.
- **vBond (Validator)** — SD-WAN orchestrator — authenticates and onboards devices; NAT traversal.
- **SD-WAN Manager** — Management plane (formerly vManage) — templates, policy, monitoring, APIs.
- **WAN Edge** — The SD-WAN data-plane router building IPsec tunnels between sites.
- **OMP** — Overlay Management Protocol — carries prefixes, TLOCs, keys, and policy.
- **TLOC** — Transport Locator — a WAN Edge's connection point (IP/color/encapsulation) into a transport.
- **ZTP/PnP** — Zero-touch onboarding of WAN Edge devices.
- **Cloud OnRamp** — SD-WAN feature optimizing paths to SaaS/IaaS.

## Ch 24 — Network Assurance (21 cards)

- **Syslog severities** — 0 emergency, 1 alert, 2 critical, 3 error, 4 warning, 5 notification, 6 informational, 7 debugging.
- **Syslog message format** — %FACILITY-SEVERITY-MNEMONIC: description — the middle number is the severity.
- **logging trap level** — Sends that severity and all MORE severe (lower-numbered) messages to the server.
- **Conditional debug** — Debug scoped by ACL or debug condition (interface, etc.) — production-safe troubleshooting.
- **Traceroute mechanics** — Probes with incrementing TTL; each hop replies ICMP Time Exceeded; * = no reply (often ICMP filtered).
- **SNMP** — Management protocol reading/writing MIB objects identified by OIDs.
- **SNMP trap vs inform** — Both are agent notifications; informs are acknowledged, traps are not.
- **SNMPv2c vs v3** — v2c uses plaintext community strings; v3 adds users with auth + encryption.
- **SNMPv3 authPriv** — Security level with both authentication (SHA/MD5) and privacy (AES/DES).
- **Flexible NetFlow** — Customizable flow accounting: flow record + flow exporter + flow monitor applied to an interface.
- **Key vs non-key fields** — match fields define a flow's uniqueness; collect fields are extra data gathered.
- **Flow exporter** — Defines where (collector IP/port) and how flow data is exported.
- **Flow monitor** — Binds record + exporter; must be applied to an interface with a direction.
- **SPAN** — Mirrors traffic from source ports/VLANs to a local destination port for analysis.
- **RSPAN** — SPAN across switches via a dedicated RSPAN VLAN carried on trunks.
- **ERSPAN** — SPAN encapsulated in GRE — routable across Layer 3 to a remote analyzer.
- **IP SLA** — Synthetic probes (icmp-echo, udp-jitter, http) measuring delay/jitter/loss/reachability.
- **IP SLA responder** — Far-end IOS feature required for udp-jitter accuracy — must be explicitly enabled.
- **IP SLA + tracking** — SLA results feed object tracking to trigger FHRP/static-route failover.
- **Catalyst Center Assurance** — Health scores, issue detection, and AI-driven baselining/insights for clients, devices, and apps.
- **AI Network Analytics** — Machine-learning baselines in Catalyst Center spotting anomalies and predicting issues.

## Ch 25 — Secure Network Access Control (18 cards)

- **Threat defense** — Layered design detecting/blocking threats: firewalls, IPS, analytics, endpoint, DNS security.
- **Cisco Secure Network Analytics** — (Stealthwatch) NetFlow-based behavioral anomaly detection inside the network.
- **Cisco Talos** — Cisco's threat-intelligence group feeding reputation/signatures to security products.
- **Cisco Umbrella** — DNS-layer security blocking malicious domains before connections form.
- **Cisco Secure Endpoint** — (AMP) Endpoint malware prevention/detection with retrospective file verdicts.
- **NGFW** — Next-generation firewall: stateful + application visibility/control + NGIPS + identity/threat intel.
- **NGIPS** — Next-gen intrusion prevention — signature + context-aware traffic inspection.
- **Cisco Secure Firewall / FMC** — Cisco's NGFW platform and its central Management Center.
- **Cisco ISE** — Identity Services Engine — AAA/policy decision point; assigns SGTs, posture, profiling.
- **802.1X** — Port-based authentication: supplicant, authenticator (switch), authentication server (ISE/RADIUS).
- **MAB** — MAC Authentication Bypass — fallback authentication by MAC for agentless devices.
- **WebAuth** — Browser-based fallback authentication for users/guests.
- **TrustSec** — Segmentation by Scalable Group Tags instead of IP-based ACLs.
- **TrustSec phases** — Classification (assign SGT), propagation (inline/SXP), enforcement (SGACL).
- **SXP** — SGT Exchange Protocol — carries IP-to-SGT mappings where inline tagging isn't supported.
- **SGACL** — Policy matrix permitting/denying traffic between source and destination SGTs.
- **MACsec** — 802.1AE hop-by-hop Layer 2 encryption at line rate.
- **MKA** — MACsec Key Agreement protocol negotiating session keys (from 802.1X EAP or pre-shared CAK).

## Ch 26 — Device Access Control & Infrastructure Security (17 cards)

- **AAA** — Authentication (who you are), authorization (what you may do), accounting (what you did).
- **aaa new-model** — Enables AAA processing; always pair with local fallback to avoid lockout.
- **Method list** — Ordered authentication/authorization sources (e.g., group tacacs+ local) tried in sequence.
- **TACACS+** — TCP 49, encrypts entire payload, separates authen/author — per-command control; device administration.
- **RADIUS** — UDP 1812/1813, encrypts only the password, combines authen/author — network access (802.1X).
- **Local fallback** — "local" at the end of a method list — used when servers are unreachable (not when they reject).
- **access-class** — Applies an ACL to vty lines to restrict management sources.
- **transport input ssh** — Restricts vty access to SSH only.
- **Privilege levels** — 0–15 command authorization tiers; 15 = full enable.
- **Standard ACL** — Matches source only (1–99); place near the destination.
- **Extended ACL** — Matches source/destination/protocol/ports (100–199); place near the source.
- **Wildcard mask** — Inverse mask in ACLs: 0 bits must match, 1 bits are ignored.
- **PACL / VACL** — ACLs applied to switch ports / VLANs for intra-VLAN filtering.
- **ZBFW** — Zone-Based Firewall — interfaces in zones; policy applied to zone pairs; default deny between zones.
- **Self zone** — ZBFW zone for traffic to/from the router itself (management, routing protocols).
- **CoPP** — Control Plane Policing — MQC policy on the control-plane interface rate-limiting CPU-bound traffic.
- **CoPP risk** — Over-policing routing/management classes breaks adjacencies — baseline before enforcing.

## Ch 27 — Virtualization (8 cards)

- **Type 1 hypervisor** — Runs on bare metal (ESXi, Hyper-V, KVM) — data-center standard.
- **Type 2 hypervisor** — Runs atop a host OS (VMware Workstation/Fusion, VirtualBox) — desktop use.
- **Virtual machine** — Full guest OS on virtual hardware (vCPU/vRAM/vNIC/vDisk), isolated by the hypervisor.
- **vSwitch** — Software switch connecting VM vNICs to each other and physical NICs; avoids loops by design rather than STP.
- **Container** — Process-level isolation sharing the host kernel — lighter and faster than VMs.
- **VNF** — Virtual Network Function — a network appliance (router/FW/WLC) as software.
- **NFVI / VIM** — NFV infrastructure (compute/storage/network) and its Virtualized Infrastructure Manager.
- **ENFV / NFVIS** — Cisco Enterprise NFV — branch services consolidated as VNFs on an x86 NFVIS host.

## Ch 28 — Network Programmability (17 cards)

- **API** — Contract for software-to-software interaction — request in, structured response out.
- **REST** — Stateless API style over HTTP using verbs on resource URIs.
- **CRUD ↔ HTTP** — Create=POST, Read=GET, Update=PUT/PATCH, Delete=DELETE.
- **HTTP status classes** — 2xx success, 3xx redirect, 4xx client error, 5xx server error.
- **Key status codes** — 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.
- **401 vs 403** — 401 = authentication missing/invalid; 403 = authenticated but not permitted.
- **JSON** — Key:value data format — objects {}, arrays [], quoted keys/strings, no trailing commas.
- **XML** — Tag-based data format used by NETCONF.
- **YANG** — Data modeling language defining structure/types of config and state data.
- **NETCONF** — SSH port 830, XML-encoded RPCs (get-config, edit-config) against datastores.
- **NETCONF datastores** — running (live), candidate (staged, commit/validate), startup (boot).
- **RESTCONF** — HTTPS + REST verbs on YANG-modeled paths (/restconf/data), JSON or XML.
- **Catalyst Center Intent API** — REST API; authenticate for a token, send it as X-Auth-Token on each call.
- **SD-WAN Manager API** — REST API for the SD-WAN controller (device, template, policy operations).
- **REST API security** — TLS transport, token/OAuth authentication, least-privilege authorization, rate limiting; never hardcode credentials.
- **Python dict/list access** — data["devices"][0]["hostname"] — index the parsed JSON structure.
- **requests library** — Python HTTP client: requests.get(url); response.json() parses the body.

## Ch 29 — Automation Tools (12 cards)

- **EEM** — Embedded Event Manager — on-box automation reacting to device events.
- **EEM applet** — event (syslog/CLI/timer/track/SNMP) + ordered actions (cli, syslog, mail).
- **EEM action order** — Actions run in alphanumeric label order (1.0, 1.5, 2.0).
- **Tcl policy** — Script-based EEM alternative for complex logic.
- **Agent-based tool** — Software installed on the node pulls config from a master — Puppet, Chef.
- **Agentless tool** — Pushes over existing SSH/API access — Ansible (also salt-ssh).
- **Ansible** — Agentless, push, YAML playbooks over SSH/NETCONF; control node only.
- **Playbook** — Ansible's YAML task list executing modules against inventory hosts.
- **Idempotency** — Re-running produces the same end state — only differences are changed.
- **Puppet** — Agent-based, pull; manifests (desired state) compiled by a Puppet server.
- **Chef** — Agent-based, pull; Ruby recipes/cookbooks define configuration.
- **SaltStack** — Event-driven automation; minion agents or agentless via salt-ssh.
