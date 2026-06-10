# Ch 13 Cheat Sheet — Multicast

**ENCOR v1.2 relevance:** Topic **3.3.d — describe multicast protocols, such as RPF check, PIM SM, IGMP v2/v3, SSM, bidir, and MSDP**. This chapter covers RPF, PIM-SM, and IGMP thoroughly; SSM and bidir get light treatment; **MSDP is NOT in the book — supplement with Cisco docs** (RP-to-RP Source-Active messages over TCP linking PIM domains).

---

## Why multicast

One-to-many delivery: one stream, replicated only where the tree forks. Unicast = per-receiver sessions and N× bandwidth on shared links. Broadcast = everyone's CPU processes it + IP directed broadcast invites DDoS. Multicast: server keeps ONE session; uninterested hosts drop frames at the NIC (or never see them with IGMP snooping). Vocabulary: stream, **group address (G)**, receivers, multicast distribution tree (MDT).

## Addressing

**224.0.0.0/4** (Class D, first bits 1110). The blocks that matter:

| Block | Range | Use |
|---|---|---|
| Local network control | **224.0.0.0/24** | Link-local, never forwarded (TTL 1) |
| Internetwork control | 224.0.1.0/24 | Forwardable control: NTP 224.0.1.1, **Auto-RP 224.0.1.39/.40** |
| **SSM** | **232.0.0.0/8** | Source-Specific Multicast default range |
| GLOP | 233.0.0.0/8 | 16-bit ASN baked into middle octets (233.X.Y.0/24) |
| **Admin-scoped** | **239.0.0.0/8** | Private — the RFC 1918 of multicast |

Well-known: .1 all-hosts · .2 all-routers · .5/.6 OSPF · .9 RIPv2 · .10 EIGRP · **.13 all-PIM-routers** · .18 VRRP · .22 IGMPv3 reports · .102 HSRPv2/GLBP.

**L2 mapping:** MAC = **01:00:5E** + 0 (25th bit) + low 23 bits of the group IP. 5 IP bits are lost → **32 group addresses share one MAC** (239.255.1.1 and 239.127.1.1 both → 01:00:5E:7F:01:01).

## IGMP (receiver ⇄ local router)

IP protocol 2, **TTL 1**, router-alert option. Runs between hosts and the LHR.

**IGMPv2 message set:** membership report ("IGMP join"), leave group (sent to 224.0.0.2), general query (router → 224.0.0.1, max response time default 10 s), group-specific query (follows a leave to check for remaining members).

- Hosts randomize report timers and **suppress duplicates** if another member answers first.
- **Querier election: LOWEST interface IP wins** (note the contrast: PIM DR = highest). Non-queriers re-elect after 2× query interval (120 s) of silence.

**IGMPv3:** adds **source filtering** — reports carry INCLUDE (only these sources) or EXCLUDE (all but these) lists. Required for **SSM** (the receiver names the source, so no RP needed). Backward compatible with v2; empty-exclude = v2 behavior.

**IGMP snooping** (RFC 4541): the switch inspects IGMP joins and forwards group traffic only out member ports (multicast MACs are never source MACs, so the CAM never learns them otherwise → unknown-multicast flooding). 224.0.0.0/24 traffic still floods. Alternative: static MAC entries.

## Trees: SPT vs RPT

| | Source tree (**SPT**) | Shared tree (**RPT**) |
|---|---|---|
| State | **(S,G)** | **(*,G)** |
| Root | The source | The **RP** |
| Cost | One tree per source — more state | One per group — less state |
| Path | Optimal | Possibly longer; carries ALL sources for G (bandwidth + security downside) |

## PIM essentials

- "Protocol independent" = RPF checks use whatever populates the unicast RIB. IP protocol **103**; hellos every **30 s** to **224.0.0.13**.
- Modes: Dense, **Sparse**, Sparse-Dense, **SSM**, **Bidir** (DM+SM = "any-source multicast").
- Key messages: hello · **register** (FHR → RP, unicast) · **register-stop** (RP → FHR, unicast) · join/prune (224.0.0.13) · bootstrap · assert · C-RP advertisement.
- Roles: **FHR** (attached to source; registers it) · **LHR** (attached to receivers; sends joins) · RPF interface/neighbor (toward source or RP) · IIF in, OIF/OIL out · MRIB (mroute table) → MFIB (hardware forwarding).

## PIM Dense Mode (flood and prune)

Implicit join: flood everywhere, routers without receivers send **prunes** (out the RPF interface, and out non-RPF interfaces receiving duplicates). **Prunes expire after 3 minutes → periodic reflood.** (S,G) state persists everywhere regardless. Fine for labs/small dense networks; not recommended in production.

## PIM Sparse Mode (explicit join) — the exam's main event

**Receiver side:** IGMP join → LHR sends **(*,G) PIM join hop-by-hop toward the RP** → shared tree (RPT) built RP→LHR.

**Source side:** source transmits → **FHR encapsulates the data in unicast register messages** through a register tunnel to the RP.
- Interested receivers exist → RP forwards the data down the RPT and sends an **(S,G) join toward the source**, building an SPT FHR→RP; once native traffic arrives, RP sends **register-stop**.
- No receivers → RP replies register-stop immediately (FHR stays quiet, re-registers periodically).

**SPT switchover:** Cisco default = the LHR switches to the source tree **upon the very first packet** received down the shared tree (`ip pim spt-threshold 0`): it (S,G)-joins toward the source via its own shortest path, then prunes (S,G) off the RPT. Disable per group or globally if desired.

**Designated router:** elected per LAN by PIM hellos — **highest DR priority (default 1), tie = highest IP**. FHR-side DR does the registering; LHR-side DR sends the joins (prevents duplicate registers/joins from multi-router LANs). Hold time 3.5× hello = 105 s.

## RPF check (loop prevention)

Accept a multicast packet ONLY if it arrives on the interface the unicast RIB would use to reach the source — **(S,G) state checks against the source IP; (*,G) state checks against the RP**. Wrong interface → drop. Equal-cost tie → highest neighbor IP. Joins/prunes are also sent via RPF lookups (S,G joins toward source; *,G joins toward RP).

**PIM forwarder / assert:** duplicate flows hit a shared LAN (e.g., two routers with different IGPs both forwarding) → routers exchange **assert** messages carrying AD + metric to the source. Winner: **lowest AD → lowest metric → highest IP**; loser prunes its OIF (re-asserts every 3 min). Routine in DM; rare in SM.

## Rendezvous points (3 ways to learn the RP)

| Method | How | Notes |
|---|---|---|
| **Static** | Same RP address configured on every router | Simple; no failover, no load splitting, full reconfig to change |
| **Auto-RP** (Cisco) | **C-RPs** announce themselves on **224.0.1.39** (every 60 s); **mapping agents** listen, pick the highest-IP C-RP per range, advertise group-to-RP mappings on **224.0.1.40**; all routers listen to .40 | Multiple RPs/ranges, backup RPs; multiple MAs act independently |
| **BSR** (standard, RFC 5059) | C-BSRs elect a BSR (highest priority, tie highest IP); **C-RPs unicast advertisements to the BSR**; BSR floods the whole RP set hop-by-hop to **224.0.0.13** (TTL 1); **each router runs the same hash to elect the RP** (lower priority preferred, tie highest IP) | The BSR does NOT pick the RP — routers do. Don't run Auto-RP and BSR together |

## Exam-day nuggets

- Multicast = **one-to-many** (DIKTA 1); the essential protocol pair = **PIM + IGMP** (DIKTA 2).
- Admin-scoped block = **239.0.0.0/8** (DIKTA 3); multicast MACs start **01:00:5E** (DIKTA 4).
- Receivers join by sending an **unsolicited membership report (IGMP join)** (DIKTA 5). IGMPv3's difference = the **source-filtering membership report** (DIKTA 6) — and it IS backward compatible with v2 (DIKTA 7: false).
- Stop L2 multicast flooding = **IGMP snooping** (DIKTA 8).
- **SPT = source-rooted, RPT = shared/RP-rooted** (DIKTA 9). LHR receiving an IGMP join → **PIM join toward the RP** (DIKTA 10). FHR with active source and no receivers → unicasts registers until the RP's **register-stop** (DIKTA 11).
- Election directions trip people: IGMP querier = **lowest IP**; PIM DR = **highest priority/IP**; assert winner = lowest AD/metric, then highest IP; Auto-RP/BSR C-RP ties = highest IP.
- 32:1 MAC overlap; PIM = protocol 103 / IGMP = protocol 2; both TTL 1 for link-local messages.
- ⚠ Supplement for 3.3.d: **MSDP** (inter-domain RP peering, SA messages) and a deeper pass on **bidir PIM** (shared-tree-only, no SPT/(S,G), for many-to-many) — both named in the blueprint, both thin or absent here.
