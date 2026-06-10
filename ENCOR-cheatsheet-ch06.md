# Ch 6 Cheat Sheet — IP Routing Essentials

**ENCOR v1.2 relevance:** Triple-duty chapter — **3.2.a** (compare EIGRP vs OSPF routing concepts: algorithm classes, path selection, load balancing), **3.2.d** (describe policy-based routing), and **2.2.a** (configure and verify VRF). The path-selection order and AD table are pure exam gold.

---

## Routing protocol classes

- **IGP vs EGP:** RIPv2, EIGRP, OSPF, IS-IS = IGPs (within an AS). **BGP = the EGP** (between ASes; iBGP inside an AS, eBGP between ASes).

| Class | Protocols | Loop-free path found via | Mental model |
|---|---|---|---|
| Distance vector | RIPv2 | **Hop count** (Bellman-Ford) | Road sign: "destination 2 miles west" — trust it blindly; knows only what neighbors said |
| Enhanced distance vector | EIGRP (DUAL) | Composite metric (bandwidth + delay; can use reliability/load) | Hybrid: DV advertising, but with hellos/neighbors, triggered (not periodic) updates, rapid convergence, unequal-cost LB |
| Link-state | OSPF (LSA), IS-IS (LSP) | **Interface cost** via Dijkstra SPF | GPS with full map: every router floods link info unchanged → identical LSDB → computes own tree. Costs more CPU/RAM, fewer loops |
| Path vector | BGP | **Path attributes** (AS_Path, MED, origin, local pref…) | Loop prevention: a router rejects any advertisement already containing its own AS in AS_Path |

Why hop count fails: RIPv2 happily sends traffic over a 2-hop 64 Kbps serial path while a 3-hop gigabit path sits idle; EIGRP's bandwidth/delay metric picks the gigabit path.

## Path selection — the order that decides everything

1. **Longest prefix match** (most specific subnet) — ALWAYS first
2. **Administrative distance** — between different routing sources for the same prefix
3. **Metric** — within the winning protocol

A /28, /26, and /24 covering the same space are three *different* RIB entries; a packet uses whichever range matches with the longest mask. AD and metric never override a longer prefix.

## AD table (memorize cold)

| Source | AD |
|---|---|
| Connected (and static-to-interface) | 0 |
| Static | 1 |
| EIGRP summary route | 5 |
| **eBGP** | **20** |
| **EIGRP internal** | **90** |
| **OSPF** | **110** |
| IS-IS | 115 |
| RIPv2 | 120 |
| **EIGRP external** | **170** |
| **iBGP** | **200** |

RIB install logic: new prefix → accept; existing prefix → lower AD wins, loser protocol keeps the route and asks to be re-notified if the winner is withdrawn (so OSPF takes over instantly if the EIGRP route dies). Subtlety: each protocol submits only its *own* best path — BGP might submit an iBGP path (AD 200) even though an eBGP path (AD 20) exists elsewhere in its table. Changing default ADs is possible but risks loops — handle with extreme care.

## ECMP & unequal-cost load balancing

- **ECMP:** equal-metric best paths all install; supported by RIPv2, EIGRP, OSPF, IS-IS. Spot it: one prefix, multiple `via` lines, same [AD/metric].
- **Unequal-cost LB: EIGRP only** (variance; off by default). Different metrics per path; traffic split proportionally — `show ip route <prefix>` shows per-path **traffic share count** (e.g., 120 vs 71 packets).

## Static route taxonomy

| Type | Syntax | Behavior / gotcha |
|---|---|---|
| **Directly attached** | `ip route NET MASK <interface>` | Installs while interface is up; shows as "directly connected," no [AD/metric]. Fine on P2P serial; **bad on Ethernet** — router must ARP for every destination in the prefix (CPU/memory pain) |
| **Recursive** | `ip route NET MASK <next-hop-ip>` | Next hop must be resolvable in the RIB — and **cannot resolve via the default route**; extra lookup to find exit interface |
| **Fully specified** | `ip route NET MASK <interface> <next-hop-ip>` | No recursion, no ARP problem; removed if interface goes down. **Required when the next hop is an IPv6 link-local address.** Best answer for "avoid unintentional paths after an Ethernet link failure" |
| **Floating** | append AD (1–255), e.g. `... 10.12.1.2 210` | Higher AD than primary → installs only when primary is withdrawn. RIB shows it without the AD once active — confirm with `show ip route <prefix>` ("distance 210") |
| **Null0** | `ip route NET MASK Null0` | Drops matched traffic with zero CPU cost. Standard loop-stopper when you hold a summary (e.g., ISP routes 172.16.0.0/20 at you, you only use part of it — without Null0, unused subnets ping-pong between you and the ISP via your default route until TTL dies) |
| **IPv6** | `ipv6 route NET/len {int \| [int] next-hop}` | Same logic; requires `ipv6 unicast-routing` first; verify `show ipv6 route` |

## Policy-based routing (3.2.d — describe level)

PBR forwards on criteria *other than* destination IP: source/destination address, protocol (ICMP/TCP/UDP), packet length — e.g., shove one customer's traffic down a longer path while everyone else follows the IGP.

- Evaluated on **ingress**; `ip local policy` covers router-generated traffic.
- PBR verifies the configured next hop exists (can list backups; if none resolve, packets route normally).
- **PBR never modifies the RIB.** `show ip route` shows the IGP next hop while matched traffic goes elsewhere — verify with **traceroute from matching vs non-matching sources**. This invisibility is the troubleshooting trap.
- Costs: admin burden at scale, no dynamic intelligence, harder troubleshooting, platform feature gaps.

## VRF — virtual routing and forwarding (2.2.a)

Multiple isolated virtual routers on one box: separate interfaces, RIBs, and forwarding tables per VRF. Like VLANs, but for Layer 3 — segmentation without encryption, and **overlapping IP ranges are legal** across VRFs. Unassigned interfaces live in the **global VRF** (the normal routing table).

Config recipe (multiprotocol VRF):

```
vrf definition MGMT
 address-family ipv4        ! and/or ipv6
interface Gi0/3
 vrf forwarding MGMT        ! assign FIRST...
 ip address 10.0.3.1 255.255.255.0   ! ...then (re)apply the IP
```

- Verify: `show ip route vrf MGMT` — VRF routes never appear in plain `show ip route`, and vice versa.
- The same IP can exist in global and MGMT simultaneously — different tables, no conflict.

## Exam-day nuggets

- BGP is the lone **EGP**; RIPv2/EIGRP/OSPF/IS-IS are IGPs (DIKTA 1–2).
- Best-path discriminator by class: path vector → **attributes**; distance vector → **hop count**; link-state → **interface cost** (DIKTA 3–5).
- Forwarding criteria order: **longest match first, AD second** (DIKTA 6–7). Multiple equal-metric installs = **ECMP** (DIKTA 8).
- The static route that dodges weird failover paths on Ethernet = **fully specified** (DIKTA 9). VRF supports **both IPv4 and IPv6** (DIKTA 10).
- Recursive statics can't lean on the default route; directly attached statics on Ethernet = ARP storm.
- EIGRP is the only IGP doing unequal-cost load balancing; look for differing metrics + traffic share counts.
- PBR is invisible in the RIB; Null0 summaries kill ISP routing loops.
