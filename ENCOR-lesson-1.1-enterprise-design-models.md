# Lesson — Compare Enterprise Design Models

**Exam topic:** 350-401 v1.2 › 1.0 Architecture (15%) › **1.1 Explain the different design principles used in an enterprise network** › 1.1.a High-level enterprise network design such as 2-tier, 3-tier, fabric, and cloud

**Source:** OCG 2nd Ed., Chapter 22 "Enterprise Network Architecture" (pp. 622–640). All statements below are validated against the book text. (1.1.b — HA techniques, FHRP, SSO — is the second half of this same chapter and is treated as its own lesson.)

---

## 1. Why hierarchical design at all

A hierarchical LAN design divides the network into **modular layers**, each implementing specific functions. The book's exact selling points (DIKTA Q1 — all of these are correct answers):

- Improved performance
- Highly scalable
- Simplified design
- Easier troubleshooting / **faster problem isolation**

What it is NOT: "the best design for modern data centers" — that's the distractor. Modern data centers with east–west traffic use **leaf–spine** instead; hierarchical LAN design suits **north–south** flows (endpoints → WAN/data center/Internet/services).

The hierarchy avoids a flat, fully meshed network where every change affects many systems. Modularity gives **fault containment**: components can be placed in or taken out of service with little impact on the rest.

## 2. The three layers

| Layer | Book definition | Exam-critical details |
|---|---|---|
| **Access** | "Gives endpoints and users direct access to the network" | Also called the **network edge** (DIKTA Q2 — not "endpoint layer" or "aggregation layer"). Endpoint connectivity (PCs, IP phones, printers, APs, cameras); APs and IP phones *extend* the access layer one more layer out. **QoS trust boundary** and security enforcement live here. Access switches are **not interconnected to each other**. Segment with VLANs. Critical single-attached endpoints → use redundant supervisors |
| **Distribution** | "Aggregation point for the access layer; services and control boundary between access and core" | The **Layer 2 / Layer 3 boundary**: L2 side bounds STP fault propagation, L3 side is the logical point for **route summarization** into the core (smaller tables, less protocol overhead, faster recovery). Deployed in **pairs** (DIKTA Q3: maximum **two** per building block), interconnected by an L2 or L3 link. Multiple distribution layers cut costly fiber runs between buildings |
| **Core** | "Backbone — provides connections between distribution layers for large environments" | Aggregation point for multiple networks; scalability, HA, fast convergence. Reduces complexity from **N × (N – 1) links to N links** for N distribution blocks. Consider a core once you grow **beyond three distribution layers in one location** |

A small single-building campus may need only access + distribution; a multi-building campus needs all three. Either way each layer provides the same services — that's the modularity.

## 3. The design model options (the actual comparison)

The book lists six deployable options — and because campus networks are modular, **one enterprise can mix all of them**:

### 3.1 Two-tier design (collapsed core)

- Core function is **collapsed into the distribution layer** — one pair of switches is both core and distribution.
- Why: cost-effective for smaller campuses (no core devices to buy) **without sacrificing most three-tier benefits**. DIKTA Q6: "collapsed core" = **two-tier design**.
- Before choosing it, evaluate **future scale, expansion, and manageability**.
- The collapsed core/distribution pair connects the end-user access layer to the other **network blocks**:

| Block | Function (per the book) |
|---|---|
| **WAN edge** | Remote data centers, branches, other campuses; **dedicated interconnections** to cloud providers — the "big three": AWS, Microsoft Azure, Google Cloud Platform |
| **Internet edge** | Regular Internet access, e-commerce, remote-branch connection, remote VPN access, and **cloud connectivity that does NOT need a dedicated interconnect** |
| **Data center / server room** | Business-critical servers: web, email, apps, storage, big data, backup, e-commerce |
| **Network services edge** | WLCs, Cisco ISE, TelePresence Manager, CUCM |

> **This is the "cloud" piece of exam topic 1.1.a:** cloud access reaches end users through **two** blocks — the **WAN edge** (dedicated interconnects) and the **Internet edge** (everything else). That's DIKTA Q7 verbatim.

### 3.2 Three-tier design

- Separate core and distribution. Recommended **when more than two pairs of distribution switches are required**.
- The book's three triggers for multiple distribution pairs:
  1. Large campus with **multiple buildings**, each needing its own distribution layer
  2. Growing **density of WAN routers, Internet edge devices, data center servers, network services** affecting performance/throughput
  3. **Geographic dispersion** of access switches — too many fiber runs back to a single collapsed core
- Exception inside the architecture: the **data center block uses leaf–spine**, the common modern alternative for **east–west** server-to-server traffic. Hierarchical = **north–south**.

### 3.3 Layer 2 access (STP-based) — the traditional design

- Access is Layer 2; distribution is the **Layer 3 IP gateway** for hosts.
- **Loop-free** variant: restrict each VLAN to a single access switch — recommended; the cost is flexibility (hosts of a VLAN locked to one switch).
- **Looped** variant: VLAN spans multiple access switches — STP **blocks links**, cutting bandwidth and slowing convergence.
- Needs an **FHRP** (gateway redundancy) at the distribution pair:
  - **HSRP / VRRP** — most common; only the active router's uplink carries upstream traffic, leaving an uplink idle. Load balancing requires **manual odd/even-VLAN split** between the two distribution switches.
  - **GLBP** — load-balances hosts across uplinks, **but works only on loop-free topologies**.
  - All FHRPs need their defaults **tuned for sub-second convergence**, at a CPU cost.

### 3.4 Layer 3 access (routed access)

- Layer 3 extended **down to the access switch**; access-to-distribution trunks become **L3 point-to-point routed links**; the L2/L3 boundary moves from distribution to access.
- Book's five advantages (know these cold):
  1. **No FHRP needed** (HSRP/VRRP eliminated)
  2. **No STP needed** (no L2 links to block)
  3. **Increased uplink utilization** — both uplinks forward
  4. **Easier troubleshooting** — end-to-end ping/traceroute
  5. **Faster convergence** — EIGRP/OSPF do the failover
- Limitations: still **can't span a VLAN across multiple access switches** (same as the loop-free L2 design), and L3-capable access switches **may cost more**.

### 3.5 Simplified campus design (switch clustering)

- Built on clustering/stacking: **VSS** and **StackWise Virtual (SWV)** merge **two** physical switches into one logical switch; **StackWise** stacks **two or more** (platform-dependent maximum). Single management and control plane. DIKTA Q8: clustering, stacking, VSS, SWV — **not daisy-chaining**.
- Platform targeting: StackWise → access-layer switches; VSS/SWV → distribution/core switches — but any can be used at any layer.
- Cross-chassis EtherChannel is the magic: **MEC** (Multichassis EtherChannel) on VSS/SWV, **cross-stack EtherChannel** on StackWise — devices connect across both physical boxes as if to one switch.
- Advantages (book list): simplified design (fewer boxes), **no FHRP** (gateway is one logical interface), **reduced STP dependence** (still kept as a failsafe if access switches are interconnected), increased uplink utilization, easier troubleshooting (logical hub-and-spoke), faster convergence (sub-second EtherChannel failover, all links forwarding), **distributed VLANs** (span access switches with no blocked links), **high availability** via interchassis SSO/NSF.
- Net effect: loop-free, highly available, flexible, resilient, easy to manage — and it finally solves the "VLAN across multiple access switches" problem the L2 and routed-access designs can't.

### 3.6 SD-Access (the "fabric" model)

- "The industry's first intent-based networking solution for the enterprise," built on Cisco DNA principles.
- Formula to memorize: **SD-Access = campus fabric + DNA Center** (book uses DNAC; v1.2 naming = **Catalyst Center**).
- Adds **fabric capabilities through automation**: automated **end-to-end segmentation** of user/device/application traffic **without a network redesign**, plus **host mobility** and enhanced security on top of normal switching/routing.
- Depth lives in Chapter 23 (exam topics 1.3.a/1.3.b) — for topic 1.1, know *where it sits* in the comparison: it's the fabric overlay alternative to managing the underlying tiers by hand.

## 4. The comparison in one table

| Model | When | FHRP? | STP? | VLAN span across access? | Key cost/limit |
|---|---|---|---|---|---|
| Two-tier (collapsed core) | Small campus, ≤2 distribution pairs | Depends on access design | Depends on access design | — | Plan for future scale before choosing |
| Three-tier | >2 distribution pairs, multi-building | Depends on access design | Depends on access design | — | More devices (core pair) |
| L2 access, loop-free | Traditional, VLAN per switch | **Yes** (HSRP/VRRP/GLBP) | Yes | **No** | Idle uplink (HSRP/VRRP), manual balancing |
| L2 access, looped | VLAN must span switches | **Yes** | Yes — **blocks links** | Yes | Lost bandwidth, slow convergence |
| Routed (L3) access | Modern non-fabric campus | **No** | **No** | **No** | Switch cost; no VLAN spanning |
| Simplified (VSS/SWV/StackWise + MEC) | Any layer, fewer logical boxes | **No** | Failsafe only | **Yes** | Platform support |
| SD-Access (fabric) | Automated, policy-driven campus | Fabric handles it | Fabric handles it | Yes (overlay) | Requires Catalyst Center + fabric roles |

## 5. Exam-day nuggets (every one validated against the chapter)

- Access layer = **network edge**; QoS trust boundary; access switches never interconnect directly.
- Distribution = **pairs only (max two per building block)**; the L2 STP boundary AND the L3 summarization point.
- Core cuts N×(N–1) full-mesh links to **N**; think about adding one beyond **three** distribution layers in a location.
- Collapsed core = **two-tier**; three-tier when **>2 distribution pairs**.
- Cloud reaches end users via **WAN edge (dedicated interconnect: AWS/Azure/GCP)** and **Internet edge (no dedicated interconnect)** — two blocks, not one.
- Leaf–spine ≠ hierarchical: leaf–spine for **east–west** data center traffic; hierarchical for **north–south**.
- Routed access kills FHRP **and** STP but still can't span VLANs; **simplified campus (VSS/SWV/StackWise + MEC)** is the design that spans VLANs with zero blocked links.
- GLBP load-balances but is **loop-free-topologies only**; HSRP/VRRP leave an uplink idle unless you split odd/even VLANs manually.
- Simplified design keeps STP **as a failsafe**, not as the loop manager.
- SD-Access = **campus fabric + Catalyst Center (DNAC)**; segmentation without redesign; detail in Ch 23.

## 6. Self-check (from the book's own DIKTA, answers at bottom)

1. Hierarchical model benefits? (easier troubleshooting, scalable, simplified, improved performance, faster problem isolation — NOT "best for modern data centers")
2. Access layer is also called the ______. (network edge)
3. Max distribution switches per building block? (two)
4. Collapsed core = which design? (two-tier)
5. Which two blocks give end users cloud access? (WAN edge, Internet edge)
6. Simplified campus design technologies? (clustering, stacking, VSS, SWV — not daisy-chaining)
