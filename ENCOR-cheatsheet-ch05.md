# Ch 5 Cheat Sheet — VLAN Trunks and EtherChannel Bundles

**ENCOR v1.2 relevance:** This chapter carries TWO exam topics: **3.1.a (troubleshoot static and dynamic 802.1Q trunking)** and **3.1.b (troubleshoot static and dynamic EtherChannels)**. Both are *troubleshoot*-level verbs — expect exhibit questions on DTP mode combos, `show etherchannel summary` flags, and member-mismatch failures.

---

## VTP — VLAN Trunking Protocol

Cisco-proprietary VLAN provisioning: create a VLAN once on a server, it propagates through the domain.

| Role | Creates/edits VLANs? | Forwards advertisements? | Updates own DB from ads? |
|---|---|---|---|
| **Server** | Yes | Yes | Yes |
| **Client** | No (no local VLAN config) | Yes | Yes |
| **Transparent** | Local only | **Yes (passes through)** | No |
| **Off** | Local only | No | No |

(No "proxy" role — distractor alert.)

- **Versions:** v1 (default) and v2 handle VLANs 1–1005 only; **v3 supports 1–4094** and requires a designated **`vtp primary`** server (exec command) to make changes — multiple servers can exist, only the primary edits.
- **Advertisement types:** **Summary** (every 300 s or on change — carries version, domain, **revision number**, timestamp, but NOT VLAN details), **Subset** (the actual VLAN changes, sent after a change), **Client request** (switch with lower revision asks for the subset).
- Config order: `vtp version 3` → `vtp domain NAME` → `vtp mode server|client|transparent|off` → `vtp password X` (recommended) → `vtp primary` (v3 servers).
- Verify: `show vtp status` — version running, domain, operating mode, **Configuration Revision**, VLAN count.

⚠ **The classic VTP disaster:** a switch added to the domain with a HIGHER revision number can overwrite the domain's VLAN database — catastrophic when its DB is missing VLANs (they're deleted everywhere, ports go inactive). **Reset revision to 0 before connecting** — changing the VTP domain name does this.

## DTP — Dynamic Trunking Protocol

- Negotiates trunking; advertises every **30 s**; **VTP domain must match** for negotiation to work.
- Default mode on Catalyst: **dynamic auto**.

| | trunk | desirable | auto |
|---|---|---|---|
| **trunk** | ✓ | ✓ | ✓ |
| **desirable** | ✓ | ✓ | ✓ |
| **auto** | ✓ | ✓ | **✗ no trunk** |

Memory hook: someone has to initiate — *desirable/trunk talk, auto only listens.* Auto+auto = both wait forever = access port (`Operational Mode: static access` on both sides).

- `show interfaces trunk` Mode column: `on` (static), `desirable`, `auto`.
- **`switchport nonegotiate`** stops DTP frames entirely (verify: "Negotiation of Trunking: Off"). Best practice: statically set `switchport mode trunk|access` on both ends, nonegotiate on trunks.

## EtherChannel fundamentals

- IEEE **802.3AD** link aggregation: bundle physical **member interfaces** into one logical **port channel**. Works for **access, trunk, or routed (L3)** interfaces.
- **STP sees only the logical link** — no blocked parallel ports, and a member failure causes **no STP/routing topology change** (as long as one member survives). Benefits to remember: more bandwidth + fewer topology changes.
- Bandwidth of Po = sum of active members (`show interface port-channel 1` → BW 2000000 Kbit/s for 2×1G); QoS/routing metrics adjust automatically.

⚠ **Why dynamic protocols beat mode `on`:** static bundles have **no health check**. Across DWDM/taps/media converters, a far-side link failure isn't seen locally — the member stays "up," the hash keeps sending traffic into the void → sporadic packet loss. LACP/PAgP detect end-to-end liveness and pull the member.

## PAgP vs LACP

| | PAgP | LACP |
|---|---|---|
| Standard? | **Cisco proprietary** | **IEEE open standard** |
| Initiating mode | **desirable** | **active** |
| Listening mode | **auto** | **passive** |
| Fails when | auto + auto | passive + passive |
| Extras | silent (default) vs **non-silent** (require PAgP packets — use switch-to-switch) | fast rate, min-links, **max-bundle**, system/port priority |

Mode `on` = no protocol at all — must be `on` both sides; mixing `on` with LACP/PAgP never bundles (members suspend: "%ETC-5-L3DONTBNDL2 ... suspended: LACP currently not enabled on the remote port").

Config: `channel-group <id> mode {on | active | passive | desirable | auto [non-silent]}` on the members. Set members' L2/L3 character first (`no switchport` for routed); **all post-bundle config goes on the port-channel interface**.

## Reading `show etherchannel summary`

Healthy = **Po1(SU)** with members **(P)**. Case-sensitive!

| Logical flag | Meaning |
|---|---|
| **U** | in use, working |
| D | down |
| **M** | min-links not met → not in use (members show D/P but Po shows SM) |
| S / R | Layer 2 / Layer 3 |

| Member flag | Meaning |
|---|---|
| **P** | bundled, forwarding |
| **H** | hot-standby (exceeds lacp max-bundle) |
| **I** | stand-alone — no LACP/PAgP heard from peer (peer is `on`/unconfigured) |
| **s** | suspended (incompatible with bundle) |
| w | waiting to hear from neighbor |
| D | down |

Counters check: `show lacp counters` / `show pagp counters` — Sent climbing while Recv stays 0 = far end isn't speaking the protocol. `show lacp neighbor`, `show pagp neighbor`, `show etherchannel port` (includes per-member **Load** in hex) for detail.

## Advanced LACP knobs

- **`lacp rate fast`** — LACPDUs every **1 s** (dead in 3 s) vs default slow **30 s** (dead in 90 s). Must match on all interfaces both ends.
- **`port-channel min-links N`** (on Po) — Po stays down until N members bundle (flag M/SM when unmet).
- **`lacp max-bundle N`** (on Po) — cap active members; extras become **hot-standby (H)**. LACP only — **PAgP has no max-links** (DIKTA trap).
- **`lacp system-priority`** — lower value = primary switch for the bundle = decides WHICH members are active.
- **`lacp port-priority`** — on the primary switch, lower priority members win the active slots (tie → lower port number).

## Member-interface consistency (the troubleshooting checklist)

Must match across all members: **port type (L2/L3), port mode (access/trunk), native VLAN, allowed VLANs, speed, duplex, MTU (L3), load interval, storm control.** Mismatch → member suspended (s) and `%EC-5-CANNOT_BUNDLE2`.

Also verify: each member link connects the same two devices; members are up; mode pairing is legal (on+on, active+anything-LACP, desirable+auto/desirable); LACP/PAgP packets flow both directions.

## Load balancing

- **Per-flow hash, never per-packet round robin.** Global setting: `port-channel load-balance <hash>`; view with `show etherchannel load-balance`.
- Hash inputs: src/dst MAC, IP, L4 port, and mixed combos (e.g., `src-dst-mixed-ip-port`).
- Design notes: hash is binary → use **powers of 2** member counts (2, 4, 8) for even spread; when one neighbor is a router, MAC-based hashing collapses (router MAC constant on every flow) → hash on IP/L4 instead.
- Uneven utilization? Check member Load values in `show etherchannel port`, then change the hash.

## Exam-day nuggets

- VTP roles: server, client, transparent, off — **no proxy** (DIKTA 1). Summary ads do NOT carry VLAN details (DIKTA 2). Multiple VTP servers are allowed (DIKTA 3). Moved switch with higher revision **deletes VLANs domain-wide** (DIKTA 4).
- auto + auto ⇒ **no trunk** (DIKTA 5); `switchport nonegotiate` kills DTP (DIKTA 6).
- PAgP is **not** industry standard — LACP is (DIKTA 7). EtherChannel works on access, trunk, AND routed ports (DIKTA 8). Benefits = bandwidth + fewer topology changes (DIKTA 9).
- PAgP **auto** pairs only with **desirable** (DIKTA 10). Max member links is an **LACP-only** feature (DIKTA 11).
- LACP multicast 0180:C200:0002; PAgP multicast 0100:0CCC:CCCC.
- Po(SU)/(P) = healthy; (I) = peer not negotiating; (s) = mismatched member; (H) = max-bundle overflow; (SM)/(D) = min-links unmet.
