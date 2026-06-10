# Ch 2 Cheat Sheet — Spanning Tree Protocol

**ENCOR v1.2 relevance:** Core material for topic **3.1.c — configure and verify common Spanning Tree Protocols (RSTP, MST)**. This chapter is the 802.1D/RSTP foundation; Ch 3 covers the guard features and Ch 4 covers MST. Expect output-interpretation questions from `show spanning-tree`.

---

## Why STP exists

Redundant L2 links = forwarding loops. L2 has **no TTL**, so broadcasts/unknown unicasts loop forever, MAC tables churn between ports, CPU/memory climb until the switch falls over. STP blocks redundant ports to build a loop-free tree.

**STP flavors:** 802.1D (original, one tree), PVST/PVST+ (Cisco, per-VLAN), 802.1W RSTP (fast convergence), 802.1S MST (instances). Catalyst switches run **Rapid PVST+ (default on most), PVST+, or MST** — all backward compatible with 802.1D.

## BPDUs & Bridge ID

- BPDUs go to MAC **01:80:c2:00:00:00**, every **2 s** (hello).
- **Two BPDU types:** Configuration BPDU (root/cost/bridge/port IDs, timers) and **TCN** BPDU (topology changes).
- **Bridge ID = system priority (default 32768) + sys-id-ext (12-bit VLAN ID) + system MAC.**
  That's why VLAN 1 shows priority **32769** and VLAN 10 shows **32778** — the VLAN number is added.

## Root bridge election

1. Every switch boots believing it's root, advertising itself.
2. On receiving a **superior** BPDU (lower priority, then lower MAC), the switch adopts that root and re-advertises with updated root path cost. Inferior BPDUs ignored.
3. Result: lowest Bridge ID in the topology = root. **All root-bridge ports are designated ports** and forward.

⚠ Default priorities everywhere → oldest switch (lowest MAC) wins. Always set priorities deliberately (Ch 3).

## Path cost

Root path cost = sum of interface costs **toward** the root. The root advertises cost 0; **the receiver adds its ingress port cost** (the sender does not include its egress port).

| Speed | Short mode (default) | Long mode |
|---|---|---|
| 10 Mbps | 100 | 2,000,000 |
| 100 Mbps | 19 | 200,000 |
| 1 Gbps | **4** | 20,000 |
| 10 Gbps | 2 | 2,000 |
| 20+ Gbps | 1 | 1,000 → 2 |

Long mode: `spanning-tree pathcost method long` — must match on **every switch** in the L2 domain.

## Port roles & tiebreakers

**Root port** (one per switch, best path to root) — selection order on ties:

1. Lowest root path cost
2. Lowest advertising switch priority
3. Lowest advertising switch MAC
4. Lowest port priority (from advertising switch)
5. Lowest port number (from advertising switch)

**Designated port** (one per segment). When two non-root switches face each other, the loser blocks, decided by: not-the-RP → lower path cost forwards → lower system priority → lower system MAC. The blocked side shows as **Altn BLK** (alternate).

## 802.1D states & timers

Blocking → Listening (15 s) → Learning (15 s) → Forwarding = **~30 s** to forward. (Disabled = shutdown; Broken = detected problem, discards.)

| Timer | Default | Meaning |
|---|---|---|
| Hello | 2 s | BPDU advertisement interval |
| Max Age | 20 s | How long stored BPDU info stays valid after contact lost |
| Forward delay | 15 s | Duration of listening AND of learning |

Tune per VLAN: `spanning-tree vlan X max-age | hello-time | forward-time`.

- **Listening:** sends/receives BPDUs only, no MAC learning.
- **Learning:** adds MAC learning, still no forwarding.

## Topology changes (TCN)

1. Switch detects link change → sends **TCN out its root port** toward the root (each upstream switch ACKs and relays).
2. Root sets the **Topology Change flag** in its config BPDUs, flooded to everyone.
3. All switches drop MAC aging from 300 s to the **forward delay (15 s)** — flushing stale entries (NOT all entries; active talkers survive).
4. Side effect: temporary spike in unknown-unicast flooding.

Troubleshoot with `show spanning-tree vlan X detail` → "Number of topology changes … last change occurred … from <interface>". A climbing TCN count = flapping port somewhere; chase it hop by hop. TCNs are per-VLAN, so big flat VLANs amplify the pain.

## Convergence times to memorize (802.1D)

| Failure | Recovery | Time |
|---|---|---|
| Link fails where the OTHER side was already blocking | nothing to do; just TCN/flush | ~0 s |
| Direct failure of a root-facing link (blocked port becomes RP) | skip Max Age; listening + learning | **30 s** |
| Direct failure where downstream switch declares itself root | Max Age on neighbor (20) + listening (15) + learning (15) | **50 s** |
| **Indirect** failure (link up, BPDUs lost/corrupted) | Max Age expiry (20) + listening + learning | **50 s** |

## RSTP (802.1W)

**States collapse 5 → 3:**

| 802.1D | RSTP |
|---|---|
| Disabled, Blocking, Listening | **Discarding** |
| Learning | Learning |
| Forwarding | Forwarding |

**Roles:** Root, Designated, **Alternate** (backup path to root, ready to take over the RP role), **Backup** (backs up your own DP on a shared/hub segment).

**Port types:** **Edge** (host-facing = PortFast, forwards immediately), Non-edge (received a BPDU), **Point-to-point** (full-duplex link to another RSTP switch — half duplex falls back to 802.1D behavior).

**Proposal/Agreement sync** (replaces timer-based convergence):

1. New link comes up full duplex → both switches propose being DP.
2. Superior switch (lower BID) wins; inferior switch marks its port as RP, **blocks all its other non-edge ports** (sync), and sends an agreement.
3. Both ends go forwarding immediately; the process cascades downstream switch by switch.

- RSTP ages neighbor info after **3 missed hellos (6 s)** — not 20 s Max Age.
- No RSTP handshake from the far end (e.g., a PC) → port behaves like 802.1D (hence hosts still see ~30 s delay without PortFast).
- The network forwards as it converges — no "wait for full convergence" requirement.

## Command toolkit

| Command | Shows |
|---|---|
| `show spanning-tree root` | Root BID, root path cost, timers, **root port** per VLAN (root port blank + cost 0 ⇒ you ARE the root) |
| `show spanning-tree [vlan X]` | Root section vs Bridge ID section (same = root; "This bridge is the root"), per-port Role/State/Cost/Type |
| `show spanning-tree interface X [detail]` | Per-VLAN state on one trunk; detail adds BPDU counters, transitions |
| `show spanning-tree vlan X detail` | TCN count, time, and source interface |

Output decode: Roles = Root/Desg/**Altn**/Back · States = FWD/BLK/LIS/LRN · Type **P2p** / **P2p Edge** (PortFast) · `*TYPE_Inc` = port mode/type mismatch with the neighbor (e.g., access vs trunk).

## Exam-day nuggets

- **Two** BPDU types; **bridge priority** (then MAC) elects the root; 1 Gbps short-mode cost = **4**; root bridge ports are all **DP**; listening lasts **15 s** (DIKTA 1–5).
- TC flag received → age out **old** MACs (set aging to forward delay) — not "flush everything" (DIKTA 6).
- RSTP has **no blocking or listening** state (DIKTA 7); 5 states → **3**, not 4 (DIKTA 8).
- RSTP forwards while converging (DIKTA 9).
- Missing VLAN on a trunk's STP output? Check the trunk **allowed VLAN list** first (ties back to Ch 1/Ch 5).
- BPDU advertised root path cost does NOT include the egress port — cost is added at ingress.
