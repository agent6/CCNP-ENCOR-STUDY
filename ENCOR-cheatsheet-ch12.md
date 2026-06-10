# Ch 12 Cheat Sheet — Advanced BGP

**ENCOR v1.2 relevance:** The other half of **3.2.c — the best path selection algorithm**. Memorize the algorithm order cold; everything else here (filtering, route maps, communities) is supporting context the exam draws scenario questions from.

---

## THE Best-Path Algorithm (memorize this order)

Longest prefix match happens first at the ROUTER level (before BGP attributes matter at all). Then BGP compares paths for the same prefix:

| # | Attribute | Wins | Scope / direction |
|---|---|---|---|
| 1 | **Weight** | Highest | Cisco-only, 16-bit, never leaves the router; influences outbound |
| 2 | **Local preference** | Highest (default 100) | AS-wide via iBGP, never sent to eBGP peers; influences outbound exit |
| 3 | **Locally originated** | network/redistributed > locally aggregated > peer-learned | — |
| 4 | AIGP | Lowest metric | Optional; single-admin multi-AS designs; AIGP path beats non-AIGP |
| 5 | **Shortest AS_Path** | Fewest hops | Prepending lengthens it — influences inbound |
| 6 | **Origin** | i (IGP) > e (EGP) > ? (incomplete) | network stmt = i; redistribution = ? |
| 7 | **Lowest MED** | Lowest (missing = 0) | Suggests entry point to the NEIGHBORING AS; compared only between paths from the same AS by default; influences inbound |
| 8 | **eBGP over iBGP** | external > confederation > internal | — |
| 9 | Lowest IGP metric to next hop | Closest exit | Hot-potato routing |
| 10 | Oldest eBGP session | Stability tiebreak | Non-deterministic by design |
| 11 | Lowest advertising **RID** | — | — |
| 12 | Minimum cluster list length | Fewest RR hops | — |
| 13 | Lowest neighbor address | Final tiebreak (iBGP) | — |

Memory hook for 1–8: **W**e **L**ove **O**ranges **A**S **O**range **M**akes **E**xcellent juice (Weight, LocalPref, Originated, AS_Path, Origin, MED, External-over-internal).

Quick tools: `show bgp ipv4 unicast <net> bestpath` and `... best-path-reason` (prints "Lower weight," "Longer AS path," etc. per losing path).

Recalculation triggers: next-hop reachability change, eBGP-facing interface failure, redistribution change, new/withdrawn paths.

## Influence cheat table

| Goal | Knob | Where |
|---|---|---|
| Steer MY outbound (this router) | Weight | Inbound route map / per neighbor |
| Steer AS-wide outbound | Local preference | Inbound at the edge, propagates via iBGP |
| Deter inbound on a link | AS_Path prepend | Outbound advertisement |
| Suggest inbound entry to adjacent AS | MED (lower preferred) | Outbound |
| Guarantee deterministic inbound | **Longest match**: summary from all edges + specific prefix from the preferred edge | — (immune to neighbor policy) |

## Multihoming & transit

- Resiliency ladder: one router/one SP link → two links same SP → two SPs → two routers + two SPs (iBGP between edge routers).
- ⚠ **Accidental transit AS:** multihomed enterprise re-advertising SP-learned routes becomes a path for strangers' traffic (its short AS_Path looks attractive). Fix = **outbound filtering: advertise only locally originated routes** — AS_Path ACL `permit ^$` applied out to all eBGP peers.
- Branch designs: filter outbound at branches so they advertise only LAN routes — keeps failover **deterministic** (symmetric, predictable) and stops a branch becoming an undersized transit during SP failures. Planned transit belongs at data centers.

## Conditional matching toolbox

- **Extended ACLs for BGP:** source fields match the **network**, destination fields match the **mask** (e.g., `permit ip 10.0.0.0 0.0.255.0 255.255.255.0 0.0.0.0` = any 10.0.x.0/24).
- **Prefix lists:** high-order bit pattern/count + optional `ge`/`le`. Rule: bit-count < ge ≤ le. Examples: `10.0.0.0/8 ge 22 le 26` = anything starting "10." with /22–/26 length. No params = exact match. Sequences auto-increment by 5; IPv6 version identical (hex!).
- **Regex for AS_Path** (`show bgp ipv4 unicast regexp ...`):
  - `^$` locally originated · `^200_` learned FROM AS 200 · `_200$` ORIGINATED in AS 200 · `_200_` passes THROUGH AS 200
  - `_`=space, `^`=start, `$`=end, `.`=any char, `*`=zero+, `+`=one+

## Route maps

Four parts: **sequence, match criteria, permit/deny action, optional set**. Rules to burn in:

- No action specified → **permit**; no sequence → +10; **no match statement → matches everything**; routes matching no sequence → **implicit deny**.
- One `match` line with multiple values = **OR**. Multiple different `match` lines in a sequence = **AND**.
- A **deny in the referenced ACL/prefix-list** just excludes the route from THAT sequence (it falls through to later sequences) — it doesn't drop it.
- `continue` lets processing carry on past a match (rarely used).
- Apply per neighbor: `neighbor X route-map NAME {in|out}`; best practice = separate in/out policies per neighbor.

## The four BGP filtering methods (per neighbor, in/out)

| Method | Command | Matches on |
|---|---|---|
| Distribute list | `neighbor X distribute-list ACL {in\|out}` | ACL (network+mask trick) |
| Prefix list | `neighbor X prefix-list NAME {in\|out}` | Prefix/length |
| Filter list | `neighbor X filter-list <as-path-acl> {in\|out}` | AS_Path regex (`ip as-path access-list 1 permit ^$`) |
| Route map | `neighbor X route-map NAME {in\|out}` | Anything + can SET attributes |

⚠ Distribute list and prefix list cannot both be applied to the same neighbor in the same direction.

**Applying changes:** hard reset `clear ip bgp <ip|*>` (tears session down) vs **soft reset** `clear bgp ipv4 unicast <ip|*> soft [in|out]` (route refresh — non-disruptive, preferred).

## BGP communities

- **Optional transitive** PA; 32-bit tag, "new format" AS:value (`ip bgp-community new-format`).
- **Not sent by default** — enable per neighbor: `neighbor X send-community [both]`.
- Well-known: **Internet** (advertise everywhere), **No_Advertise** (no peer at all), **No_Export** (no eBGP peer; iBGP OK), **Local-AS** (not even confederation-external).
- Match: `ip community-list 1-99` (standard) / 100–500 (expanded, regex) → `match community N` in a route map. View: `show bgp ipv4 unicast community 333:333`.
- Set: `set community 10:23 [additive]` — without **additive**, existing communities are OVERWRITTEN.

## Exam-day nuggets

- Recite it: **Weight → LocalPref → locally originated → AIGP → AS_Path → Origin → MED → eBGP>iBGP → IGP metric → oldest → RID**. Weight/LocPref highest win; AS_Path/Origin/MED lowest-or-shortest win.
- Weight and LocalPref steer **outbound**; prepending and MED steer **inbound**. LocalPref stays inside the AS; MED crosses only to the adjacent AS; weight never leaves the router.
- Longest prefix match trumps every BGP attribute — and is the only inbound steering an SP can't override with policy.
- Prevent transit AS = AS_Path ACL `^$` outbound. Routes from neighbor AS only = `^65200_`; originated in AS = `_65200$`.
- Route map traps: missing match = match-all; implicit deny at the end; multiple values on one line OR, separate lines AND; ACL deny ≠ route drop.
- Origin preference is i > e > ? — a network-statement route beats the same route redistributed.
- MED needs same-AS paths to compare; missing MED = 0 on IOS XE.
- SPs typically reject prefixes longer than /24 (IPv4) or /48 (IPv6).
