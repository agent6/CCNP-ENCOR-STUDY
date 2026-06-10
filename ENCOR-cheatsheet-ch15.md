# Ch 15 Cheat Sheet — IP Services

**ENCOR v1.2 relevance:** Three exam topics in one chapter: **3.3.a (interpret NTP and PTP configurations)**, **3.3.b (configure NAT/PAT)**, **3.3.c (configure FHRPs — HSRP, VRRP)**, plus FHRP/redundancy support for 1.1.b. The FHRP comparison table and NAT terminology are the highest-yield items.

---

## NTP (3.3.a — interpret)

- **UDP 123**, client/server hierarchy. Why sync matters: certificates, key exchange, log/event correlation, troubleshooting.
- **Stratum** = distance from the authoritative clock: stratum 1 = directly attached to the reference; a client of stratum 1 = stratum 2 — even across multiple router hops (NTP is an application). Valid through 15; 16 = unsynchronized.
- Sync is SLOW: seconds of accuracy in a few polls; tens of ms takes hours/days (client "drifts toward" the server).
- Config decode: `ntp server <ip> [prefer] [source <int>]` — multiple servers allowed for redundancy, **the client synchronizes to ONE (best/preferred) server, not all of them**. `ntp master [stratum]` = act as authoritative server. A router that has synced can serve time downstream.
- Verify: `show ntp status` (sync state, stratum, reference).

## PTP (3.3.a — interpret)

- **IEEE 1588**; PTPv2 (1588-2008) is **NOT backward compatible with PTPv1**. Sub-microsecond accuracy for industrial/measurement networks (e.g., utility billing); low overhead; adjusts clocks dynamically to ride out queuing/buffering delay.
- Hierarchy: **Grand Master** (best clock, chosen via Announce messages / Best Master Clock logic) → **boundary clocks** (sync upstream, re-serve downstream) → clients. **Transparent clocks** sit in-path and correct for their own residence delay.
- Two message families:
  - **Event messages (timestamped):** Sync, Delay_Request, Pdelay_Request, Pdelay_Response — these carry/trigger the timestamps used to compute path delay.
  - **General messages (not timestamped):** Announce (master election), Follow_Up, Delay_Response, Management, Signaling — build/maintain the topology.
- Switch modes: **boundary**, **forward** (pass PTP multicast through), **transparent** (default on industrial switches). `ptp mode boundary`; verify `show ptp clock`, `show ptp port` ("Port state FAULTY: FALSE" = healthy).

## Object tracking (the FHRP companion)

- `track 1 ip route 192.168.3.3/32 reachability` or `track 2 interface Gi0/1 line-protocol`; verify `show track`.
- FHRPs reference the object and **decrement priority** when it goes down (`standby 10 track 1 decrement 20` / VRRPv3 `track 1 decrement 20`) — decrement enough to fall below the peer's priority. Typical use: track the WAN uplink so the gateway role fails over with it.

## FHRPs (3.3.c) — the comparison table

| | **HSRP** | **VRRP** | **GLBP** |
|---|---|---|---|
| Standard? | **Cisco** | **IETF open** | **Cisco** |
| Roles | Active / Standby | Master / Backup | **AVG + up to 4 AVFs** |
| Preempt default | **OFF** | **ON** | OFF (gateway role) |
| Multicast | v1: 224.0.0.2 · v2: **224.0.0.102** | 224.0.0.18 | 224.0.0.102 |
| Virtual MAC | v1 **0000.0C07.ACxx** · v2 0000.0C9F.Fxxx | **0000.5E00.01xx** | 0007.B400.xxyy (per AVF) |
| Groups | v1: 0–255 · v2: 0–4095 | 0–255 | 0–1023 |
| Timers | hello 3 s / hold 10 s (v2 adds msec) | advertisement 1 s | hello 3 s / hold 10 s |
| Load balancing | Only via multiple groups | Only via multiple groups | **Built in** |
| Config | `standby 10 ip 172.16.10.1` | `vrrp 20 ip 172.16.20.1` | `glbp 30 ip 172.16.30.1` |

Election: **highest priority (default 100), tie → highest interface IP.** No preemption (HSRP/GLBP) means the first router up keeps the role until it fails — add `preempt` for deterministic design.

- **HSRP** options: `standby <id> {priority|preempt|timers|authentication|mac-address|track}`. Verify `show standby [brief]` (P column = preempt). Multiple groups with alternating priorities = poor-man's load balancing.
- **VRRP** legacy: `vrrp <id> ip/priority/preempt`. **VRRPv3**: `fhrp version vrrp v3` → `vrrp <id> address-family ipv4` → nested `address`, `priority`, `track ... decrement`. v2 and v3 are not compatible (a `vrrpv2` compat command exists). Verify `show vrrp [brief]`.
- **GLBP**: the **AVG answers ARP requests for the VIP** and hands out different **AVF virtual MACs** per host → load balancing without changing host configs. AVG fails → standby AVG; AVF fails → another router inherits its vMAC. Methods: **round-robin (default), weighted** (`glbp 30 load-balancing weighted` + `glbp 30 weighting 80`), **host-dependent** (same host always gets the same AVF). Verify `show glbp [brief]` — the row with Fwd "-" is the AVG; Fwd 1/2 rows are AVFs.

## NAT (3.3.b — configure)

RFC 1918 space: **10/8, 172.16/12, 192.168/16** — never routed on the Internet; NAT makes them appear public.

**The four terms** (memorize against a diagram):

| Term | Meaning |
|---|---|
| **Inside local** | The host's real private IP (10.x address on your LAN) |
| **Inside global** | Your host as the outside sees it (the translated public IP) |
| Outside local | The remote host as YOUR inside sees it (differs only with outside NAT) |
| Outside global | The remote host's real public IP |

**Three types:**

| Type | Mapping | Config core |
|---|---|---|
| **Static** | One-to-one, permanent | `ip nat inside source static <local> <global>` |
| **Pooled** | One-to-one, dynamic from a pool | `ip nat pool P <start> <end> prefix-length X` + `ip nat inside source list ACL pool P` |
| **PAT (overload)** | **Many-to-one** via unique source ports | `ip nat inside source list ACL interface Gi0/0 overload` (or pool + overload) |

- Always mark interfaces first: `ip nat outside` / `ip nat inside`. The ACL defines WHO gets translated.
- **Pooled NAT exhaustion = dropped packets** ("failed to allocate address" in `debug ip nat detailed`) until entries time out — **default dynamic timeout 24 hours**; tune with `ip nat translation timeout`; flush with `clear ip nat translation *` (disrupts active sessions).
- PAT keeps flows distinct by rewriting source ports — translation table shows the same inside global IP with unique ports per inside local host.
- Outside static NAT (`ip nat outside source static`) exists mainly for **overlapping address space** (mergers) — rare.
- Verify: **`show ip nat translations`** — read columns left to right: Inside global | Inside local | Outside local | Outside global.

## Exam-day nuggets

- NTP accuracy concept = **stratum** (DIKTA 1); a client with many servers syncs to **one**, not all (DIKTA 2: false).
- **PTPv2 is not backward compatible** with PTPv1 (DIKTA 3: false).
- FHRPs solve static-default-route/single-gateway limits (DIKTA 4). Cisco-proprietary pair = **HSRP and GLBP**; VRRP is the standard (DIKTA 5).
- HSRP VIP syntax = **`standby 1 ip 10.1.1.1`** (DIKTA 6). The FHRP with built-in load balancing = **GLBP** (DIKTA 7).
- Translation table = **`show ip nat translations`** (DIKTA 8). 10.1.1.1 on your LAN = **inside local** (DIKTA 9). Dynamic NAT entries age out after **24 hours** (DIKTA 10).
- Preemption defaults are THE trick pair: HSRP off, VRRP on. vMAC patterns: 0000.0C07.ACxx (HSRPv1) vs 0000.5E00.01xx (VRRP) — group number in hex at the end.
- GLBP's magic is in ARP: one VIP, different vMAC answers per host.
- Exhibit reflexes: `show standby brief` empty P column = no preempt → higher priority router can sit in Standby; same logic appeared in the Ch 15 scenario questions in your question bank.
