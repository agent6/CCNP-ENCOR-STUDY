# Ch 7 Cheat Sheet — EIGRP

**ENCOR v1.2 relevance:** Feeds topic **3.2.a — compare routing concepts of EIGRP and OSPF** (path selection, path operations, metrics, load balancing). The successor/feasible-successor logic and topology-table reading are the most testable pieces — expect exhibit questions on `show ip eigrp topology`.

---

## Identity card

- Enhanced distance vector ("hybrid"); originally Cisco-proprietary, now RFC 7868.
- **IP protocol 88**; multicast **224.0.0.10** (MAC **01:00:5E:00:00:0A**) when possible, unicast when needed.
- Beats classic DV with: composite metric (not hop count), neighbors/hellos, incremental triggered updates (full table only at adjacency), precomputed loop-free backups (DUAL), unequal-cost load balancing, 255-hop reach.

**Autonomous system:** each EIGRP process = one AS = one routing domain. Same AS ⇒ same metric formula, routes exchanged only within. A router can join multiple ASes (separate topology tables); routes do NOT leak between them without redistribution. Not related to BGP ASNs.

## The five packet types

| Packet | Job |
|---|---|
| **Hello** | Neighbor discovery + liveness |
| **Update** | Carry routing/reachability info |
| **Query** | Hunt for a path during convergence |
| **Reply** | Answer a query |
| **Request** | Pull specific info from neighbors |

## Core vocabulary (the heart of the chapter)

| Term | Meaning |
|---|---|
| **Successor route** | Lowest-metric path to the destination |
| **Successor** | First next-hop router on that path |
| **Feasible distance (FD)** | Your locally calculated metric for the best path |
| **Reported distance (RD)** | The advertising neighbor's own FD (their cost from where they sit) |
| **Feasibility condition** | **RD < FD** ⇒ the neighbor is provably not routing through you ⇒ loop-free |
| **Feasible successor (FS)** | Backup path that passes the feasibility condition — usable instantly |

## Reading the topology table

```
P 10.4.4.0/24, 1 successors, FD is 3328
   via 10.13.1.3 (3328/3072), Gi0/1     ← successor (metric/RD)
   via 10.14.1.4 (5376/2816), Gi0/2     ← RD 2816 < FD 3328 ⇒ FEASIBLE SUCCESSOR
```

- Parentheses = **(total metric via this path / neighbor's RD)**.
- FS test uses the **RD vs the FD**, never the total metrics against each other. RD ≥ FD (even equal) = not an FS.
- **P (passive) = stable/good. A (active) = DUAL is recomputing** — counterintuitive: passive is what you want.
- Table holds: prefixes, the neighbors advertising each, their metrics (RD, hop count), and metric components (min bandwidth, total delay, load, reliability).

## Metric (classic)

Simplified default formula (K1=K3=1, K2=K4=K5=0):

**metric = 256 × ( 10⁷ / min-bandwidth(kbps) + total-delay / 10 )**

- **Bandwidth** = the SLOWEST link in the path, referenced to 10 Gbps (10⁷ kbps). **Delay** = cumulative along the path, counted in tens of µs.
- K values must match between neighbors or no adjacency.
- Per-hop propagation: hop count +1, min bandwidth shrinks to the bottleneck, delay accumulates, RD updates.
- **Tune paths with interface `delay`, not `bandwidth`** — bandwidth changes ripple into QoS/other protocols (and only matters when it's the path minimum); delay always counts.

Default metrics worth recognizing: Serial 64k = 40,512,000 · T1 = 2,170,031 · 10M Ethernet = 281,600 · FastE = 28,160 · **GigE = 2816** · 10GigE = 512.

**Wide metrics:** classic math can't tell 11 Gbps from 50 Gbps. Wide metrics scale by **65,536** (good to 655 Tbps), measure latency in **picoseconds**, and add **K6** (jitter/energy/extended). Backward compatible: adjacency forms when K1–K5 match and K6 unset; the wide-metric router rescales for classic peers.

## Load balancing

- **ECMP:** multiple equal-metric successor routes install natively.
- **Unequal-cost (EIGRP-exclusive):** `variance <multiplier>` — any **feasible successor** whose metric < (FD × multiplier) installs too.
  - Multiplier math: ceil(FS metric ÷ successor metric). E.g., 5376/3328 → variance 2.
  - Only FS paths qualify — variance can never install a path that fails the feasibility condition.
  - Traffic splits proportionally — see "traffic share count" per path in `show ip route <prefix>`.

## Timers & failure detection

| Interface class | Hello | Hold |
|---|---|---|
| Fast (default) | **5 s** | **15 s** |
| Slow (T1/64k and below) | 60 s | 180 s |

Hold = 3× hello, resets on every hello, counts down to 0 ⇒ neighbor declared dead ⇒ DUAL notified. (Timers do NOT need to match between neighbors — unlike OSPF.)

## Convergence (DUAL in action)

**With a feasible successor:** promotion is immediate — FS becomes successor, an update goes out with new metrics, downstream routers re-run DUAL locally. Sub-second, no route goes active.

**Without an FS:** route flips **P → A (active)** and the router sends **queries with delay set to infinity** to all neighbors, tracking a reply flag per neighbor per prefix. Receiving router logic:

- No route? Reply "no route."
- Query from a **non-successor**? Reply with its own attributes (it still has a good path) — this creates a **query boundary**.
- Query from its **successor**? Mark active too and propagate the query downstream.

Replies cascade back; when the last outstanding reply arrives, the router computes, returns the route to passive, and answers its own upstream queries. (Unanswered queries = Stuck-in-Active territory; summarization keeps query scopes small.)

## Summarization

- Configured **per interface**, not under the process (classic true/false trap).
- Component routes inside the range are suppressed; only the summary advertises — and only while at least one component exists.
- Bonus beyond smaller tables: a summary creates a **query boundary**, shrinking the query domain and speeding convergence in large ASes.

## Exam-day nuggets

- Protocol **88**; **five** packet types; multicast **224.0.0.10** / MAC 01:00:5E:00:00:0A (DIKTA 1, 2, 5).
- Successor = the **next-hop router** of the lowest-metric path (the route itself is the successor *route*) (DIKTA 3).
- Topology table holds prefix, hop count, total delay, neighbor list — bandwidth stored is the **minimum**, not maximum (DIKTA 4).
- Steer EIGRP without touching other protocols: **interface delay** (DIKTA 6). Reference bandwidth = **10 Gbps** (DIKTA 7).
- Hello **5 s** on fast links (DIKTA 8). Stable route = **passive** (DIKTA 9). Path recomputation signal = **query with delay = infinity** (DIKTA 10). Summarization is per-interface, NOT automatic everywhere (DIKTA 11: false).
- FS condition in one breath: *backup's RD must beat my FD.*
- vs OSPF for 3.2.a: EIGRP = DV logic + composite bandwidth/delay metric + UCMP + timers needn't match; OSPF = full-topology SPF + cost metric + ECMP only + timers must match.
