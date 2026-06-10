# Ch 10 Cheat Sheet — OSPFv3

**ENCOR v1.2 relevance:** Topic **3.2.b** names OSPFv3 directly ("configure simple OSPFv2/**v3** environments"). This chapter is mostly *deltas from OSPFv2* — same mechanics underneath (areas, SPF, DR/BDR, network types, timers), new plumbing on top. Learn the differences table and the config recipe.

---

## What changed from OSPFv2 (the differences table)

| Aspect | OSPFv3 behavior |
|---|---|
| Address families | Supports **both IPv6 and IPv4** (one protocol, two AFs) |
| Prefix handling | Addressing semantics REMOVED from packet headers — prefixes ride in LSA payloads; SPF is per **link**, not per subnet |
| New/renamed LSAs | Router LSA carries only interface type + metric. Prefixes move to two new LSAs: **Link LSA** (link-local info) and **Intra-Area Prefix LSA**. "Network summary" → **inter-area prefix LSA**; "ASBR summary" → **inter-area router LSA** |
| SPF impact | Dijkstra examines only router/network LSAs → **adding/changing an IP prefix no longer forces a full SPF run** |
| Transport | Runs directly over IPv6, still **protocol 89** |
| Adjacencies | Formed over **link-local addresses** (FE80::/10); neighbors don't even need a shared global subnet; NBMA neighbors must be specified manually by link-local address |
| Authentication | Stripped from OSPF itself — handled by **IPsec extension headers** in IPv6 |
| Router ID | Still **32-bit**; with no IPv4 addresses on the box it becomes 0.0.0.0 and **no adjacencies form** — set it manually |
| Instance ID | New field; controls which routers on a segment may peer (and selects address family per RFC 5838) |
| Flooding | New link-state type field defines flooding scope + unknown-LSA handling |

**Unchanged:** five packet types, neighbor states, DR/BDR logic, network types, timers (10/40 broadcast & p2p), area rules, cost.

**Multicast:** **FF02::5** AllSPFRouters (hellos, DR floods) and **FF02::6** AllDRouters — mirror images of 224.0.0.5/.6.

## Configuration recipe

```
ipv6 unicast-routing                  ! prerequisite
router ospfv3 1
 router-id 192.168.1.1                ! manual — mandatory on IPv6-only routers
 address-family ipv6 unicast          ! optional; auto-created on first interface
interface Gi0/1
 ipv6 address 2001:db8:0:1::1/64
 ospfv3 1 ipv6 area 0                 ! interface-level enablement — NO network statement
```

- **There is no network statement in OSPFv3.** Interface enablement only.
- Legacy syntax you may still see: `ipv6 router ospf` + `ipv6 ospf <pid> area <id>` — migrate to `ospfv3`.
- Passive interfaces: same commands (`passive-interface X`, `passive-interface default`, `no passive-interface Y`) under the process (cascades to both AFs) or under one address family.

## Verification (swap `ip ospf` → `ospfv3`)

| Task | Command | Notes |
|---|---|---|
| Neighbors | `show ospfv3 ipv6 neighbor` | Same Pri/State/Dead columns; **Interface ID** replaces neighbor IP |
| Interface detail | `show ospfv3 interface [X]` | Shows link-local address, instance ID, network type, DR/BDR, timers; "No Hellos (Passive interface)" flags passive |
| Interface summary | `show ospfv3 interface brief` | Adds an **AF column** (ipv4/ipv6) — dual-stack interfaces appear TWICE, once per AF |
| Routes | `show ipv6 route ospf` | **O** intra-area, **OI** inter-area, OE1/OE2 external; AD still 110; **next hop = the neighbor's link-local (FE80::...)**, not a global address |

## Summarization

- Same rule as v2: internal summarization happens **on ABRs**.
- Config lives under the address family: `area <id> range <prefix>/<length>`.
- ⚠ **Hex trap:** summarization math is binary/hex, not decimal. The hextet 2001 is 0x20 and 0x01 — don't treat "2001" like the decimal number two-thousand-one when picking a summary boundary (e.g., loopbacks ::1–::3 summarize at 2001:db8::/65).

## Network types

Same five as OSPFv2, same defaults and timers. Change per interface: `ospfv3 network {point-to-point | broadcast}` — P2P skips DR election; `show ospfv3 interface brief` State column shows P2P.

## IPv4 routing over OSPFv3 (RFC 5838 address families)

OSPFv3 can carry IPv4 routes — one protocol for both stacks. Instance IDs 64–95 are reserved for IPv4 (0–31 for IPv6).

1. The interface needs an **IPv6 address (at least link-local)** — OSPFv3 packets are IPv6 even when carrying IPv4 routes — plus its IPv4 address.
2. Enable per interface: `ospfv3 1 ipv4 area 0`.

Verify: `show ip route ospfv3` (IPv4 RIB), `show ospfv3 neighbor` (separate ipv4 and ipv6 address-family sections — two adjacencies per neighbor when dual-stacked), `show ospfv3 interface brief` (entry per AF).

## Exam-day nuggets

- OSPFv3 keeps **five** packet types (DIKTA 1). Hellos target **FF02::5** (DIKTA 2).
- Enablement = interface command **`ospfv3 <pid> ipv6 area <id>`** — no network statements (DIKTA 3).
- Link-local + enablement is NOT sufficient on a fresh IPv6-only router — **the RID must be set manually** or adjacencies never form (DIKTA 4: false).
- IPv4-over-OSPFv3 needs more than an IPv4 address: the interface also needs an **IPv6/link-local address** because the protocol packets are IPv6 (DIKTA 5: false).
- Prefix changes don't trigger full SPF — topology (router/network LSAs) and prefixes (link/intra-area prefix LSAs) are decoupled.
- Routing table decoder: O vs **OI** (note: not "O IA" like v2), next hops are FE80:: link-locals.
- Neighbors can form adjacency without sharing a global subnet — link-local peering (contrast with v2's matching-subnet rule).
