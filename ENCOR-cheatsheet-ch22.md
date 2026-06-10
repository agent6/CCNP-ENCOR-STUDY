# Ch 22 Cheat Sheet — Enterprise Network Architecture

**ENCOR v1.2 relevance:** Topic **1.1.a — high-level enterprise network design (2-tier, 3-tier, fabric, cloud)** and **1.1.b — high availability techniques (redundancy, FHRP, SSO)**. Design-judgment questions: when to add a core, which HA tech fits which failure, and what each access-layer design trades away.

---

## Hierarchical LAN design — why and what

Modular layers that replicate: **simplified design, scalability, better performance, easier troubleshooting, fault containment** (changes touch a subset, not a flat full mesh). NOT the model for modern data centers — those use **leaf–spine** for east–west traffic; hierarchical fits north–south flows.

| Layer | Nickname | Job |
|---|---|---|
| **Access** | **The network edge** | Endpoint connectivity (wired/wireless), VLAN segmentation, **QoS trust boundary**, port security. Access switches are NOT interconnected to each other — inter-switch traffic goes through distribution. Critical single-homed endpoints → redundant supervisors |
| **Distribution** | Aggregation | Aggregates access switches; **the L2/L3 boundary** — STP fault domain stops here, routing **summarization** toward the core starts here. Deployed in **pairs (two per building block)**, interconnected L2 or L3. Placed per building to cut long fiber runs |
| **Core** | Backbone | Interconnects distribution blocks; fast, simple, highly available. Reduces mesh complexity from **N×(N−1) to N links** |

Two layers suffice for a single building; three when the campus spans buildings — same modular services either way.

## Network blocks (PINs) hanging off the core/distribution

- **WAN edge:** remote sites/branches + **dedicated cloud interconnects** (AWS/Azure/GCP direct connections).
- **Internet edge:** general Internet, e-commerce, remote-access VPN, and cloud access *without* dedicated circuits. (Cloud reachability = WAN edge AND Internet edge.)
- **Data center/server room:** business apps; modern ones use leaf–spine.
- **Network services:** WLC, ISE, CUCM, collaboration managers.

## Two-tier vs three-tier (1.1.a)

| | **Two-tier (collapsed core)** | **Three-tier** |
|---|---|---|
| What | Core + distribution merged into one switch pair | Dedicated core layer |
| When | Smaller campus, single building, cost-sensitive | **More than two distribution pairs**: multi-building campus, growing WAN/Internet/DC density, fiber sprawl back to one collapsed core |
| Trade | Cheaper; plan for future scale before choosing | More boxes, clean scaling |

## High availability design (1.1.b)

**Network level:** redundant devices/links at every layer, no single point of failure, simplify with clustering tech, monitor proactively. **System level:** redundant power/fans/supervisors, hot-swap/OIR hardware, **SSO/NSF (+GR or NSR)**, fast failure detection (BFD, UDLD), **FHRPs** (HSRP/VRRP/GLBP).

### The SSO/NSF/GR/NSR family (the testable core)

- **SSO** — dual route processors; active RP **checkpoints config, line-card state, and L2 protocol state** to standby. Switchover keeps interfaces up and the box running, but L3 adjacencies still reset.
- **NSF** — checkpoints the **FIB** so the data plane keeps forwarding on CEF entries while the control plane recovers. **Not separately configurable — enabled automatically with SSO** (hence "SSO/NSF").
- Problem without help: neighbors see the adjacency drop and route around you. Two fixes:

| | **Graceful Restart (GR)** | **NSR** |
|---|---|---|
| Standard? | RFC 4724, standards-based | Cisco internal |
| Mechanism | **Routing protocol EXTENSIONS** tell neighbors "keep forwarding to me, my adjacency will blip" | Active RP continuously checkpoints **adjacency + TCP state** to standby — neighbors never notice |
| Neighbor requirement | Neighbor must be **GR-aware** (helper) | **None** — works with GR-unaware peers |
| Cost | Light | Heavy ongoing checkpointing (CPU/memory) |

Router categories: **SSO/NSF-capable** (dual RP, preserves FIB) · **GR-aware/helper** (supports the extensions; doesn't need dual RPs) · **GR-unaware**. Scaled best practice: **GR with aware neighbors, NSR for the unaware ones**. Cisco docs/CLI say "NSF" when they mean GR — read carefully.

## Access-layer design options

| Design | Mechanics | Trade-offs |
|---|---|---|
| **L2 access (STP-based)** | Distribution = IP gateway; FHRP pair | Keep each VLAN on ONE access switch = loop-free; spanning VLANs across switches = blocked links + loop risk. HSRP/VRRP use one uplink (manual odd/even VLAN balancing); GLBP load-balances but **loop-free topologies only** |
| **L3 routed access** | L2/L3 boundary moves INTO the access switch; routed point-to-point uplinks | **No FHRP, no STP, both uplinks forwarding**, ping/traceroute troubleshooting, fast IGP convergence. Can't span VLANs across access switches; L3 access switches cost more |
| **Simplified campus** | Clustering: **VSS / StackWise Virtual** (distribution/core pairs → one logical switch), **StackWise** (access stacks). **MEC** (multichassis EtherChannel) and cross-stack EtherChannel span the physical boxes | Fewer boxes, no FHRP needed, STP reduced to a failsafe, all uplinks active, hub-and-spoke logical topology, **VLANs can span access switches safely**, interchassis SSO/NSF failover |
| **SD-Access** | Fabric (VXLAN/LISP) + Catalyst Center automation | The 1.1.a "fabric" option — detail in Ch 23 |

## Exam-day nuggets

- Hierarchical model = scalable, simple, performant, fast fault isolation — but **not** the data center answer (leaf–spine).
- Access layer = "**network edge**"; distribution switches come in **pairs (max two per block)**.
- **NSF cannot be enabled without SSO** — they're a unit. **GR is the one needing routing protocol extensions**; NSR is self-contained and CPU-hungry.
- Collapsed core = **two-tier**. End users reach cloud providers via **WAN edge** (dedicated interconnects) and **Internet edge**.
- Simplified campus = clustering + stacking + **VSS + StackWise Virtual** (daisy-chaining is the distractor); its EtherChannel forms: **MEC** across VSS/SWV pairs, cross-stack across StackWise members.
- Routed access kills both STP AND FHRP needs but can't span VLANs; simplified campus achieves VLAN spanning loop-free.
- Distribution layer's two-sided job: stop STP (L2 side), summarize routes (L3 side).
- Core math: N links instead of N×(N−1) interconnects.
