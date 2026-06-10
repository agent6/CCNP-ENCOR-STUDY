# Ch 26 Cheat Sheet — Device Access Control & Infrastructure Security

**ENCOR v1.2 relevance:** Two configure-and-verify topics: **5.1 (device access control — lines and local user authentication, AAA)** and **5.2 (infrastructure security features — ACLs, CoPP)**, with ZBFW and hardening as supporting material. Expect config exhibits: who can reach the vty lines, which password type, what CoPP does to a class.

---

## ACLs (5.2.a)

- Sequential ACEs, top-down, first match wins, **implicit deny at the end** — add `permit any` if you only meant to filter some traffic.
- **Wildcard mask** = inverse of subnet mask (255.255.255.255 − mask): /16 → 0.0.255.255. Shortcuts: `any` = 0.0.0.0 255.255.255.255; `host x.x.x.x` = wildcard 0.0.0.0.

| Type | Numbers | Matches | Apply with |
|---|---|---|---|
| Standard | 1–99, 1300–1999 | Source only | `ip access-group <acl> {in\|out}` |
| Extended | 100–199, 2000–2699 | Protocol + src/dst + ports (eq/lt/gt, established) | same |
| Named | `ip access-list standard\|extended NAME` | Either style; preferred for readability | same |
| **PACL** | L2 switch ports | IPv4 or MAC ACLs; **inbound only**; can't filter L2 control (CDP/STP/DTP…) | `ip access-group <acl> in` on the switchport |
| **VACL** | VLANs (bridged AND routed traffic) | `vlan access-map NAME seq` → `match ip address ACL` + `action forward\|drop [log]` | `vlan filter MAP vlan-list` |

- One inbound + one outbound ACL per interface. Processing order (routed traffic): **PACL → inbound VACL → inbound SVI ACL → outbound SVI ACL → outbound VACL**. A RADIUS-pushed **dACL overrides the static PACL**.

## Lines & passwords (5.1.a)

- Three CLI paths: **console (cty)**, **aux** (modem — disable with `no exec` / `transport input none`), **vty** (Telnet/SSH only — virtual).
- **Password types:** 0 = plaintext · **7 = service password-encryption (trivially reversible — weakest "encrypted" type)** · 5 = MD5 (`enable secret`) · 8 = PBKDF2-SHA256 · **9 = scrypt (strongest)**. Use `username X algorithm-type scrypt secret ...`.
- **`login`** = line password authentication; **`login local`** = username/password authentication from the local database.
- **Privilege levels:** 0 (only disable/enable/exit/help/logout), 1 (user EXEC >), 15 (privileged #). Custom 2–14 via `privilege <mode> level <n> <command>` + `username X privilege <n>` — assigning a multi-word command also grants its leading keywords. Verify with `show privilege`.
- **Restrict vty sources:** ACL + **`access-class <acl> in`** under `line vty` (NOT ip access-group).
- **Restrict protocols:** `transport input {all | none | telnet | ssh | telnet ssh}`; each vty accepts one user, evaluated from vty 0 upward; out of free vtys = "connection refused."
- **SSH setup:** hostname (not Router) → `ip domain-name` → `crypto key generate rsa` (modulus ≥768 for v2; modern IOS XE wants ≥2048) → `ip ssh version 2` (banishes the "SSH 1.99" dual mode) → `login local` + `transport input ssh`.
- Timeouts: `exec-timeout m s` (idle, default 10 min; `exec-timeout 0 0` disables — lab only) and `absolute-timeout` (cuts the session even if active; pair with `logout-warning`).

## AAA (5.1.b)

**Authentication** (who) → **Authorization** (what you may do) → **Accounting** (what you did — the function that logs executed commands).

| | **TACACS+** | **RADIUS** |
|---|---|---|
| Standard | Cisco-developed, open | IETF |
| Transport | **TCP 49** | UDP 1812/1813 |
| Encryption | **Entire payload** | Password only |
| AAA functions | **Separated** — per-command authorization, any time during a session | Combined — all authorization comes back in the single accept |
| Carries EAP? | No | **Yes** |
| Best for | **Device administration** | **Secure network access (802.1X)** |

- Config skeleton: `aaa new-model` → server definitions → method lists like `aaa authentication login default group <ISE-TACACS> local` (**always end with `local` fallback** — used when servers are unreachable, not when they reject) → `aaa authorization exec ...`, `aaa authorization commands 15 ...`, `aaa accounting commands 15 ...`.
- ⚠ `aaa authorization exec default ...` does NOT cover the console — console authorization needs the separate `aaa authorization console` command (classic true/false trap).

## Zone-Based Firewall

- **Stateful** firewall built into IOS XE (vs stateless ACLs) — inspects L4–7, tracks sessions, permits return traffic automatically.
- Interfaces join **zones**; same-zone traffic flows freely; inter-zone traffic is dropped until a policy allows it. Two system zones: **self** (the router's own IPs — management/control traffic; permitted by default until you police it) and **default** (catch-all for unassigned interfaces, must be enabled to use in policies).
- Config chain (MQC-style): `class-map type inspect [match-any|match-all]` (match ACLs/protocols) → `policy-map type inspect` with actions **inspect** (stateful, return traffic allowed), **pass** (one-way; needs a mirror-image zone pair for return — fits ESP/GRE), **drop [log]** (default via class-default) → **`zone-pair security NAME source X destination Y`** + `service-policy type inspect` → `zone-member security X` on interfaces.
- Zone pairs are **directional** — and don't forget a **self-to-outside** policy or the router's own pings/tunnels die after you police outside-to-self.
- Verify: `show policy-map type inspect zone-pair` (per-class packet counts, session table).

## CoPP (5.2.b)

- A **QoS (MQC) policy applied to the control plane** — protects the route processor/CPU from floods while rate-limiting expected punted traffic. Supports **input and output** policies (input is typical).
- Build: ACLs per traffic family (ICMP/traceroute, IPsec/GRE, routing — BGP/OSPF/EIGRP/PIM multicast, management — SSH/SNMP/NTP, DHCP) → class maps → policy map with `police <rate> conform-action transmit exceed-action ...` → `control-plane` + `service-policy input POLICY`.
- ⚠ Baselining strategy: set **violate-action transmit** on vital classes first, watch the counters, tighten later — guessing rates and dropping BGP/SSH is a self-inflicted outage. Keep **class-default policed but allowed** to surface unknown traffic; ACL counters still increment for visibility even though classification (not blocking) is their job here.

## Device hardening

Disable what you don't use, especially on public-facing interfaces: **no cdp enable / no lldp transmit / no lldp receive** (stop leaking topology), `no ip redirects`, `no ip proxy-arp` (MitM vector), `no service config` (TFTP autoload), `no mop enabled`, `no service pad`, plus `service tcp-keepalives-in/out` to reap orphaned sessions.

## Exam-day nuggets

- Interface ACL = `ip access-group`; **vty ACL = `access-class`** — swapping them is the classic wrong answer.
- Weakest listed password type = **7** (that's what `service password-encryption` produces); strongest = **9/scrypt**. `login` = line password, `login local` = username DB.
- Privilege 0 command set: **disable, enable, exit, help, logout**.
- SSH-only vty = `transport input ssh` (optionally + an ACL via access-class).
- Logging executed commands = **accounting**. Device-admin protocol of choice = **TACACS+** (TCP 49, full encryption, command-level authorization); RADIUS owns 802.1X because it carries EAP.
- ZBFW = **stateful + integrated into IOS XE**; system zones = **self and default**; pass ≠ inspect (pass is one-way and stateless).
- The CPU-protection feature = **CoPP**; it supports input AND output policies (true).
- Hardening pair the exam loves: disable **CDP and LLDP**.
- AAA console authorization is separate; `local` fallback fires on server *unreachability*, not rejection.
