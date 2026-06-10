# Ch 24 Cheat Sheet — Network Assurance

**ENCOR v1.2 relevance:** The biggest single-chapter haul — **4.1 (diagnose with debugs/conditional debugs/traceroute/ping/SNMP/syslog), 4.2 (Flexible NetFlow), 4.3 (SPAN/RSPAN/ERSPAN), 4.4 (IP SLA), 4.5 (Catalyst Center)**. Nearly every question from domain 4 starts here; output interpretation is the dominant format.

---

## ping (4.1)

- Read the output: `!` = reply, `.` = timeout; success rate %, round-trip **min/avg/max**.
- Workhorse options: `repeat <n>` (long pings to watch recovery), `size 1500` + `df-bit` (MTU/tunnel-overhead testing), `source <interface|ip>` (test a specific path — otherwise the egress interface IP is used; interface names must be typed in full).
- Extended ping adds: ToS (184 decimal = EF — test QoS, though some SPs ignore marked ICMP), data patterns (0x0000/0xffff for serial line/clocking issues), strict/loose/record/timestamp options, sweep sizes.
- Troubleshooting flow: verify basic reachability FIRST — most "complex" failures are L1–L3.

## traceroute (4.1)

- Increments TTL; each hop answers ICMP Time Exceeded. `*` = no reply for that probe (timeout); tries **30 hops by default** before quitting.
- All-asterisk rows = missing route/typo'd destination. `!H` = host unreachable — a less-specific route got you to the next hop, but the path dies beyond it.
- Overlay reminder: a tunnel shows as one hop.

## debug + conditional debug (4.1)

OSPF adjacency debugging is the exam's favorite case study:

| Symptom in debug | Root cause |
|---|---|
| `debug ip ospf adj`: "Nbr ... has smaller/larger interface MTU" | **MTU mismatch** (stuck EXSTART) |
| `debug ip ospf hello`: "Mismatched hello parameters ... Dead R 40 C 120, Hello R 10 C 30" | Timer/**network-type** mismatch (R = received, C = configured; 10/40 broadcast & p2p vs 30/120 non-broadcast & p2mp) |
| Same debug showing "Mask R 255.255.255.0 C 255.255.255.248" | **Subnet mask mismatch** (neighbor stuck INIT) |

- Kill switch: `undebug all`.
- **Conditional debugging** keeps production safe: `debug ip packet <acl>` scopes by ACL; `debug interface <X>` adds an interface condition. ⚠ Interface conditions **survive `undebug all`** — remove with `undebug interface <X>` (router warns about message floods).

## SNMP (4.1)

| Version | Security level | Auth | Encryption |
|---|---|---|---|
| v1 / v2c | noAuthNoPriv | **Community string** | None |
| v3 | noAuthNoPriv | Username | None |
| v3 | authNoPriv | MD5/SHA HMAC | None |
| **v3 authPriv** | **Auth + privacy** | MD5/SHA | **DES/3DES/AES** |

- v2c improved error handling/bulk retrieval over v1; **v3 is best practice**. Restrict with ACLs; community strings are RO or RW.
- Operations: get / get-next / **get-bulk** (large tables) / get-response / set / **trap** (unsolicited, unacknowledged — informs are acknowledged). The **MIB** is the tree of pollable/trappable objects (OIDs).

## Syslog (4.1)

- Severities 0–7: emergency, alert, critical, error, warning, notification, informational, debugging. Format `%FACILITY-SEVERITY-MNEMONIC`.
- Destinations: console, monitor (vty), **buffered** (`logging buffered <size> <level>`), host/collector (`logging host <ip>` — **UDP 514**) with `logging trap <level>` setting the max level shipped (that level and all more-severe).
- `show logging` confirms each destination's level and counts.

## NetFlow & Flexible NetFlow (4.2)

**Classic NetFlow:** unidirectional **flows** keyed on 7 fields: src/dst IP, src/dst port, protocol, ToS, input interface. Latest export format = **Version 9** (template-based). Config: `ip flow ingress`/`ip flow egress` on the interface + `ip flow-export version 9` / `ip flow-export destination <ip> <udp-port>`. Verify: `show ip cache flow` (the flow table), `show ip flow export`, `show ip flow interface`. Quick wins: `ip flow-top-talkers` (top N by bytes/packets → `show ip flow top-talkers`).

**Flexible NetFlow = the customizable, exam-named version:**

| Component | Role |
|---|---|
| **Flow record** | `match` = **key fields** (define the flow) + `collect` = non-key data gathered |
| **Flow exporter** | destination/UDP port/NetFlow v9 |
| **Flow monitor** | **Binds record + exporter; only works once applied to an interface with a direction** (`ip flow monitor NAME input`) |
| Flow sampler (optional) | Samples a subset — less CPU/memory, less accuracy |

The three required pieces: **record, exporter, monitor**. Multiple monitors can watch the same traffic with different policies. FNF's per-header matching makes it a security/anomaly tool (feeds Secure Network Analytics).

## SPAN / RSPAN / ERSPAN (4.3)

| Variant | Scope | Key config |
|---|---|---|
| **Local SPAN** | Same switch | `monitor session 1 source interface X [rx\|tx\|both]` + `destination interface Y` |
| **RSPAN** | Across switches at **L2** | Dedicated **RSPAN VLAN** (`vlan 99` + `remote-span`) carried on trunks end-to-end; source switch: `destination remote vlan 99`; destination switch: `source remote vlan 99` → local port |
| **ERSPAN** | Across **L3** (GRE-encapsulated, routable) | `monitor session 1 type erspan-source` → source + `no shutdown`; destination submode: **`ip address` (analyzer), `erspan-id`, `origin ip address`**; optional `erspan ttl`; `filter vlan` for trunk sources |

Notes: mirrored traffic doubles load on trunks; STP runs on the RSPAN VLAN (no BPDU filtering!); session IDs are locally significant — match them anyway for sanity.

## IP SLA (4.4)

- Synthetic probes measuring: **delay, jitter, packet loss, voice quality scores**, packet sequencing, path, connectivity, web download time. Gives END-TO-END visibility (an SP's SLA covers only its own cloud).
- Config pattern: `ip sla 1` → operation (`icmp-echo <dst> source-interface X`, `http get <url>`, udp-jitter…) → `frequency <sec>` → **`ip sla schedule 1 life forever start-time now`** (unscheduled probes never run!). Verify: `show ip sla configuration`, `show ip sla statistics`.
- udp-jitter requires `ip sla responder` on the far-end IOS device. Results can feed object tracking (FHRP/static-route failover) and SNMP traps (CISCO-RTTMON-MIB).

## Catalyst Center (DNA Center) Assurance (4.5)

- One platform replacing tool sprawl: SD-Access fabric config, **SWIM** (software image management), Plug and Play, simplified provisioning, templates, security policy, **assurance** — for routers, switches, AND wireless (not just routers/switches).
- **Assurance** = 30+ years of TAC logic + **machine learning**: issue detection WITH guided remediation, **health scores** (network/client/app, color-coded), **Client 360 / Device 360** views.
- **Network Time Travel** — the "network DVR": **streaming telemetry** records past state so you can replay "last Tuesday at 3 p.m."; sensors add predictive analytics for the future.
- Integrations via **open APIs/SDKs**: AD, ISE, ServiceNow, Infoblox → search a USER by name and see all their devices and context.
- How it simplifies troubleshooting (exam phrasing): **streaming telemetry for device insight + open APIs for contextual integration**.
- ⚠ v1.2 says "**AI-powered workflows**" — this 2nd-ed coverage (ML-based issue detection, predictive analytics, AI Network Analytics baselining) is the foundation; skim current Catalyst Center AI docs to top up.

## Exam-day nuggets

- traceroute default = **30 hops** (not 20). OSPF debugging diagnoses **MTU, hello/timer, and mask mismatches** (not routing-table viewing).
- NetFlow's latest version = **9**; matching key fields = **Flexible NetFlow**; FNF's required trio = **record + exporter + monitor**.
- Capture across a routed L3 network = **ERSPAN** (RSPAN = L2 trunk path; local SPAN = same box).
- IP SLA monitors **delay, jitter, loss, voice scores** — not syslog/SNMP traps.
- Catalyst Center workflow components include **Design, Provision, Assurance** (plus Policy) — "Plan/Operate" are distractors. It manages more than routers/switches (false), and its troubleshooting magic = telemetry + open APIs.
- Conditional debug leftovers: interface conditions persist past `undebug all`.
- Flow monitor with an empty cache = monitor never applied to an interface (your question bank's exhibit 24.13).
