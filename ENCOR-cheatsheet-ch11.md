# Ch 11 Cheat Sheet — BGP

**ENCOR v1.2 relevance:** The configure/verify half of **3.2.c — configure and verify eBGP between directly connected neighbors (best path selection algorithm and neighbor relationships)**. Ch 12 covers best-path; this one owns sessions, states, advertisement, and summarization. Expect `show bgp ipv4 unicast summary` exhibits.

---

## Identity card

- Path-vector EGP over **TCP 179** — reliability, sequencing, multi-hop all come free from TCP.
- **No dynamic neighbor discovery.** Peers are explicitly configured by IP on both sides; the inbound packet's source IP must match the configured neighbor statement or it's discarded.
- Built for scale/stability (Internet ≈ 940k+ IPv4 prefixes): incremental updates only, no periodic refresh.
- **ASNs:** 16-bit originally; RFC 4893 extends to 32-bit. **Private ranges: 64512–65534 and 4,200,000,000–4,294,967,294.** Public ASNs come from IANA (requires public range, multihoming, unique policy — else use your provider's).

## Path attribute categories

| Category | Rules |
|---|---|
| **Well-known mandatory** | Every implementation understands it AND it rides with every prefix (AS_Path, next-hop, origin) |
| Well-known discretionary | Understood by all, optional in advertisements (local pref) |
| Optional transitive | Not required to understand; passes between ASes |
| Optional non-transitive | Not required; stripped at AS boundary (MED) |

**Loop prevention = AS_Path:** a router that sees its own ASN in a received AS_Path discards the route.

## Sessions: iBGP vs eBGP

| | iBGP | eBGP |
|---|---|---|
| Peer ASN | Same | Different |
| AD | **200** | **20** |
| TTL | 255 (multi-hop fine) | **1** — directly connected unless ebgp-multihop/ttl-security |
| On advertise | next hop unchanged | **next hop rewritten to self + own ASN prepended to AS_Path** |

- Multi-hop sessions need a real route to the peer (static/IGP) — **a default route is not sufficient**.
- Transit AS needs **iBGP full mesh** (e.g., R2–R3–R4) — mid routers must know the routes or they blackhole traffic. Redistributing BGP→IGP is NOT the fix: IGPs can't hold Internet scale (~20k route comfort vs 940k+), can't carry path attributes, can't express BGP policy. IGP→BGP redistribution is safe.

## The four message types

| Message | Purpose |
|---|---|
| **OPEN** | Establish: version, ASN, **hold time** (lower of the two proposals wins; ≥3 s or 0), **RID** (must be nonzero), capabilities |
| **KEEPALIVE** | Every ⅓ of hold time — defaults: hold **180 s** / keepalive **60 s** |
| **UPDATE** | Advertise NLRI + PAs and/or withdraw routes; also resets the hold timer |
| **NOTIFICATION** | Error → session closes |

## Neighbor states (FSM)

**Idle → Connect → (Active) → OpenSent → OpenConfirm → Established**

- **Idle:** waiting/starting; repeated failures back off (ConnectRetryTimer doubles).
- **Connect:** TCP three-way handshake in progress. Initiator uses random source port → destination 179 (`show tcp brief` tells you who initiated).
- **Active:** TCP failed, trying again — "actively retrying," NOT established. Idle↔Active cycling = reachability/config problem (wrong IP/ASN, TTL, ACL).
- **OpenSent/OpenConfirm:** OPENs exchanged and validated (version, source IP matches neighbor config, ASN matches remote-as, unique nonzero RIDs, auth) → KEEPALIVE → **Established** (routes exchange via UPDATE).

## Configuration

```
router bgp 65100
 bgp router-id 192.168.1.1                 ! best practice; sessions reset on change
 neighbor 10.12.1.2 remote-as 65200
 !
 address-family ipv4
  network 10.12.1.0 mask 255.255.255.0
  neighbor 10.12.1.2 activate
```

- RID selection mirrors OSPF (manual > highest up loopback > highest up interface).
- IOS XE **auto-activates the IPv4 AF by default** — `no bgp default ipv4-unicast` disables that for clean multi-AF configs (then activate is mandatory).
- **network statement ≠ interface enablement:** it installs a prefix into the BGP table only if an **exact prefix+mask match exists in the RIB** (from any source). Sets origin **i**, weight 32768; connected → next hop 0.0.0.0; learned route → RIB next hop, MED = IGP metric.
- `redistribute` works too — origin becomes **?** (incomplete).

## The three BGP tables

| Table | Holds |
|---|---|
| **Adj-RIB-In** | Routes as received, pre-policy (purged after processing to save RAM) |
| **Loc-RIB** | THE BGP table — local + received routes; validity/next-hop check → best-path → RIB |
| **Adj-RIB-Out** | Post-outbound-policy routes, per neighbor (`show bgp ... neighbors X advertised-routes`) |

**BGP advertises only its best path** — neighbors never see your alternates.

## Verification decoder

- `show bgp ipv4 unicast summary` — **State/PfxRcd: a NUMBER = Established**; a word (Idle/Active) = down. Neighbor timers/capabilities: `show bgp ipv4 unicast neighbors <ip>`.
- `show bgp ipv4 unicast` codes: `*` valid, `>` best, `s` suppressed, blank Network field = another path for the prefix above. Columns: Next Hop (0.0.0.0/:: = locally originated), Metric = **MED**, LocPrf, Weight (32768 = local), Path + origin (**i** network stmt, **e** EGP, **?** redistributed).
- `show ip route bgp` — eBGP routes land as `B [20/0]`.

## Summarization (aggregation)

Two ways: **static** (Null0 static + network statement — always advertised, even if components die) or **dynamic**:

`aggregate-address <network> <mask> [summary-only] [as-set]` (under the AF)

- Created only while ≥1 component exists; originator installs a **Null0 discard route**; the aggregating router becomes the route's originator.
- Default = summary AND components advertised. **summary-only** suppresses components (they show `s>` locally).
- Plain aggregation loses path detail → **atomic-aggregate** flag set; AS_Path now starts at the aggregator (downstream sees only the aggregating AS — loop-prevention info lost).
- **as-set** copies component ASNs into an AS_SET `{65100,65300}` — counts as ONE hop. ⚠ Side effect: any AS listed in the AS_SET will REJECT the aggregate (sees itself = loop) — summarizing routes that include the neighbor's own networks makes the summary vanish at that neighbor.

## MP-BGP / IPv6

- MP-BGP (RFC 2858/4760) adds **AFI/SAFI**: IPv4 unicast = AFI 1/SAFI 1, IPv6 unicast = AFI 2/SAFI 1. Each AF has its own database and policy on one TCP session; capabilities negotiated in OPEN.
- IPv6 config = same skeleton + **`address-family ipv6` + `neighbor X activate` (mandatory)**; IPv6-only routers must set the RID manually.
- Peer over **global unicast** addresses — link-local peering breaks if hardware/MAC changes regenerate the address.
- Table quirks: next hop `::` = locally originated; RIB next hops resolve recursively to **link-local (FE80::)** addresses.
- IPv6 summarization is hex math: the hextet "23" is 0x23 = decimal 35 → needs 6 bits → 2001:db8::/58 covers :0 through :3F.

## Exam-day nuggets

- Private ASNs: **64512–65534** and **4.2B–4,294,967,294** (DIKTA 1). Recognized-by-all + always-attached = **well-known mandatory** (DIKTA 2).
- No dynamic peer discovery (DIKTA 3: false). Sessions can be multi-hop (DIKTA 4: false). IPv4 AF activation is automatic by default (DIKTA 5: false) — but the **IPv6 AF must be initialized** (DIKTA 10: true).
- Timers/capabilities per peer: `show bgp <afi> <safi> neighbors` (DIKTA 6). **Three** tables (DIKTA 7). Only the best path is advertised (DIKTA 8: false on "all paths"). Flap-hiding summary = `aggregate-address ... summary-only` (DIKTA 9).
- Hold-time negotiation takes the LOWER value; keepalive = hold/3 (180/60 defaults).
- "Active" state = actively failing to connect; State/PfxRcd numeric = up.
