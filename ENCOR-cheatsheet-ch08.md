# Ch 8 Cheat Sheet — OSPF

**ENCOR v1.2 relevance:** Core of **3.2.b — configure simple OSPFv2 environments** (neighbor adjacency, point-to-point and broadcast network types, passive-interface) and half of the **3.2.a** EIGRP-vs-OSPF comparison. Heavy exhibit territory: neighbor states, `show ip ospf interface brief`, DR elections.

---

## Identity card

- Link-state IGP (OSPFv2 = RFC 2328/IPv4; OSPFv3 = RFC 5340/IPv6). **IP protocol 89.**
- Multicast: **224.0.0.5 AllSPFRouters** (MAC 01:00:5E:00:00:05) and **224.0.0.6 AllDRouters** (MAC ...:06).
- LSAs flood unchanged → every router in an **area** holds an identical **LSDB** → each runs **Dijkstra SPF** with itself as the root of its own shortest-path tree (SPTs differ per router; the LSDB doesn't).
- Two-tier hierarchy: **Area 0 = backbone**; all other areas must attach to it and transit through it. Areas hide internal topology from outside, shrinking flooding/CPU/memory.
- **Process ID is locally significant** — neighbors can run process 1 and process 1234. Multiple processes on one router keep separate databases (no route sharing without redistribution).

## The five packet types

| # | Packet | Job |
|---|---|---|
| 1 | **Hello** | Discover + maintain neighbors |
| 2 | **DBD** (database description) | Summarize LSDB contents during adjacency setup |
| 3 | **LSR** (link-state request) | Ask for specific missing/stale LSAs |
| 4 | **LSU** (link-state update) | Deliver the LSAs (answers LSRs, floods changes) |
| 5 | **LSAck** | Make flooding reliable |

## Router ID

Selection order: **manual `router-id`** > highest IP on an *up* loopback > highest IP on an *up* physical interface. Chosen at process start; never changes until **`clear ip ospf process`** restarts it. Always set it manually — the topology is built on RIDs.

## Neighbor states (memorize the ladder)

| State | Meaning |
|---|---|
| Down | No hellos heard |
| Attempt | NBMA only — manually configured neighbor, trying |
| Init | Hello received, but they haven't seen *us* yet |
| **2-Way** | Bidirectional (we're in their neighbor list). **DR/BDR election happens here.** Resting state between DROTHERs — normal! |
| **ExStart** | Decide primary/secondary for DB sync. **Stuck here = MTU mismatch** |
| Exchange | Trading DBD packets |
| Loading | Sending LSRs for missing LSAs |
| **Full** | Fully adjacent, synchronized |

## Adjacency requirements (the troubleshooting checklist)

Unique RIDs · same subnet + matching mask (except P2P network types/virtual links) · **matching MTU** · matching area ID · matching DR settings for the segment · **matching hello/dead timers** · matching authentication · matching area-type flags (stub/NSSA). *(Contrast with EIGRP: OSPF timers MUST match; EIGRP's needn't.)*

## Enabling OSPF — two ways

1. **Network statement:** `network <ip> <wildcard> area <id>` — selects interfaces by matching their primary IP; it does NOT "advertise networks" directly (the enabled interface's prefix enters the LSDB). Most-specific (longest match) statement wins area assignment. `network 0.0.0.0 255.255.255.255 area 0` = everything.
2. **Interface mode:** `ip ospf <pid> area <id>` — explicit per interface; **takes precedence over network statements**; picks up secondary addresses unless `secondaries none`.

**Passive interface:** subnet stays in the LSDB/advertised, but no hellos sent and no OSPF packets processed — no adjacency possible. Per port (`passive-interface Gi0/2`) or flip the default (`passive-interface default` + `no passive-interface Gi0/1`). Standard hygiene for host-facing segments.

## Verification trio

- `show ip ospf interface brief` — PID, area, cost, **State** (DR/BDR/DROTH/LOOP), **Nbrs F/C** (Full / seen-2-Way count).
- `show ip ospf neighbor` — Pri, state/role, dead-time countdown, neighbor's interface IP. `2WAY/DROTHER` between two non-DR/BDR routers = working as designed.
- `show ip route ospf` — `O` routes, `[110/metric]`.

## Default route advertisement

`default-information originate [always] [metric X] [metric-type Y]` under the process. Requires a default route in the RIB unless **`always`** is used. Shows up downstream as **O*E2** — an **external** route, not inter-area (classic true/false trap).

## Cost (the OSPF metric)

**cost = reference bandwidth ÷ interface bandwidth**, default reference = **100 Mbps** → T1 = 64, Ethernet = 10, **Fast/Gig/10Gig all = 1** — the reason to raise it: `auto-cost reference-bandwidth <mbps>` (set identically on EVERY router). Manual override per interface: `ip ospf cost <1–65535>` (16-bit LSA field caps interface cost; the cumulative path metric can exceed it).

## Timers

- Defaults: **hello 10 / dead 40** on broadcast and point-to-point; **30 / 120** on non-broadcast and point-to-multipoint. Dead = 4 × hello; changing hello auto-adjusts dead.
- `ip ospf hello-interval` / `ip ospf dead-interval` per interface. Both ends must match.
- Dead timer hits 0 → neighbor down → LSA flood → SPF rerun area-wide.

## DR/BDR — why and how

Multi-access segments would need n(n−1)/2 adjacencies; the **DR** acts as a pseudonode so everyone fully peers only with the DR and BDR. Update flow: router sends LSA to **224.0.0.6** (DR/BDR listen) → DR acks unicast → DR floods to all via **224.0.0.5**.

**Election** (at the tail of 2-Way, after a wait timer = dead interval on fresh segments):

1. Highest **interface priority** (default 1; **0 = never participates**)
2. Tie → highest **RID**
3. **No preemption.** A better router joining later changes nothing until the DR/BDR fails or `clear ip ospf process` runs. BDR is promoted on DR failure, then a new BDR is elected (BDR exists to make that handoff fast).

`ip ospf priority 0–255` — design placement with priority, never by juggling RIDs. Expect the exhibit trap: priority 100 router shown as BDR because the election already happened — restart required to realize the design.

## Network types

| Type | Default on | DR? | Hello/Dead |
|---|---|---|---|
| **Broadcast** | Ethernet | Yes | 10/40 |
| Non-broadcast (NBMA) | Frame Relay main/multipoint | Yes | 30/120 |
| **Point-to-point** | Serial (HDLC/PPP), GRE tunnels, FR p2p subifs | No | 10/40 |
| Point-to-multipoint | (never default; hub-spoke; advertises /32s, next hop rewritten) | No | 30/120 |
| Loopback | Loopback interfaces | n/a | n/a |

- Two routers on an Ethernet link? `ip ospf network point-to-point` skips the DR election and wait timer → faster adjacency, simpler SPF. Neighbor output shows `FULL/ -` (hyphen = no DR on link).
- **Loopback quirk:** loopback network type always advertises the address as **/32** regardless of the configured mask. To advertise the real prefix (e.g., /24), set the loopback to `ip ospf network point-to-point`.

## Exam-day nuggets

- Protocol **89**, **five** packet types, **224.0.0.5** + MAC 01:00:5E:00:00:05 (DIKTA 1–3).
- The network statement is NOT the only enablement method — interface `ip ospf X area Y` works too (DIKTA 4: false). Process IDs need not match (DIKTA 5: false).
- `default-information originate` produces an **external** (E2) route, not inter-area (DIKTA 6: false).
- Serial point-to-point links elect **no DR** at all (DIKTA 7: false). Reference bandwidth = **100 Mbps** (DIKTA 8).
- Block DR candidacy: **`ip ospf priority 0`** (DIKTA 9). A loopback at 10.123.4.1/30 advertises as **10.123.4.1/32** (DIKTA 10).
- Stuck-state decoder: ExStart/Exchange = MTU; Init = one-way hellos; 2WAY between DROTHERs = fine; Down with config present = check passive-interface/timers/area.
- vs EIGRP (3.2.a): OSPF = cost from bandwidth only, timers must match, areas/two-tier, ECMP only; EIGRP = bandwidth+delay, timers free, flat AS + summarization anywhere, UCMP via variance.
