# Ch 3 Cheat Sheet — Advanced STP Tuning

**ENCOR v1.2 relevance:** Directly serves topic **3.1.c** — the exam topic names "Spanning Tree enhancements such as **root guard and BPDU guard**" explicitly. The protection-feature comparison table below is the money slide; expect scenario questions about which guard goes where and what each does when triggered.

---

## Deliberate root bridge placement

Never leave root election to default priorities. Two ways to set priority:

- `spanning-tree vlan X priority <0–61440>` — manual, **increments of 4096 only**
- `spanning-tree vlan X root {primary | secondary} [diameter D]` — a macro:
  - **primary → 24576** (and if some switch is already lower, the script goes lower still to win)
  - **secondary → 28672**
  - `diameter` = max L2 hops from root; tunes timers, which propagate via the root's BPDUs (no need to set timers elsewhere)

Best practice: hardest possible lockdown = **priority 0 on primary, 4096 on secondary, plus root guard** on ports toward everything else. Root usually belongs at the L2/L3 boundary (distribution/core), minimizing hops and sized for cross-switch traffic.

Verify: `show spanning-tree vlan 1` — remember displayed priority = configured + VLAN (24576 + 1 = 24577).

## Steering the topology

**Port cost** (affects YOUR path selection, configured on the receiving switch):
`spanning-tree [vlan X] cost <value>` — lower a port's cost to make it the root path / designated; raise to push it to blocking. Omitting `vlan` changes all VLANs.
Key mechanic (repeat from Ch 2, tested as true/false): **the advertised root path cost does NOT include the egress port's cost** — cost is added by the receiver on ingress.

**Port priority** (tiebreaker for parallel links to the same switch, configured on the **upstream/downstream-facing** switch — the one closer to the root controls the downstream switch's choice):
`spanning-tree [vlan X] port-priority <value>` — **lower is preferred**, default 128. Shows up in `Prio.Nbr` (e.g., 64.6).

Tiebreak order recap: cost → advertising bridge priority → advertising bridge MAC → **port priority** → port number.

## L2 forwarding loops — symptoms & causes

No TTL at Layer 2 → loops run forever: CPU spike, memory exhaustion, MAC table churn, app slowness, switch crash.

Telltale syslog: `%SW_MATM-4-MACFLAP_NOTIF: Host ... is flapping between port X and port Y` → investigate STP on every switch carrying that VLAN.

Common causes: STP disabled, load balancer sending one MAC out multiple ports, hypervisor vSwitch bridging two uplinks (vSwitches don't run STP), end-user hub/dumb switch.

## The protection features (know this table cold)

| Feature | Put it on | Trigger | Action | Recovery |
|---|---|---|---|---|
| **Root guard** | Designated ports toward switches that must never be root | **Superior** BPDU received | Port → **root-inconsistent** (acts like listening, no forwarding) | **Automatic** when superior BPDUs stop |
| **BPDU guard** | PortFast/host-facing access ports | **Any** BPDU received | Syslog + port → **err-disabled** | Manual shut/no shut, or errdisable recovery |
| **BPDU filter** | (Rarely; avoid) | — | Stops sending/processing BPDUs | n/a — removes loop protection |
| **Loop guard** | Root/alternate ports (uplinks); NEVER on PortFast ports | BPDUs **stop arriving** | Port → **loop-inconsistent** (BKN, \*LOOP_Inc) instead of becoming designated | **Automatic** when BPDUs resume |
| **UDLD** | Fiber/SFP links | Echo of its own IDs not returned | Normal: mark undetermined, stay up · **Aggressive: 8 retries @1 s → err-disable** | udld recovery (default 5 min) |

## PortFast

- Skips listening/learning → immediate forwarding (helps DHCP/PXE) and **suppresses TCN generation** for host ports.
- Receiving a BPDU strips PortFast from the port (it reverts to normal states). Makes the port an **RSTP edge port**.
- Config: per-port `spanning-tree portfast` · global `spanning-tree portfast default` (then `spanning-tree portfast disable` per port to exempt) · `spanning-tree portfast trunk` only for single-host trunks (hypervisor/server NIC with VLANs).
- Verify: port type shows **P2p Edge**; `show spanning-tree interface X detail` → "The port is in the portfast mode".

## BPDU guard details

- Global pattern (the standard design): `spanning-tree portfast bpduguard default` — applies to all PortFast ports; exempt one with `spanning-tree bpduguard disable`.
- Trip sequence in syslog: `%SPANTREE-2-BLOCK_BPDUGUARD` → `%PM-4-ERR_DISABLE` → line protocol down. `show interfaces status` shows **err-disabled**.
- **Error Recovery service:** `errdisable recovery cause bpduguard` + `errdisable recovery interval <30–86400>` (default **300 s**). Check with `show errdisable recovery`. If BPDUs are still arriving, the port re-trips immediately after each recovery.

## BPDU filter details (handle with care)

- **Global** (`spanning-tree portfast bpdufilter default`): PortFast ports send ~10–12 BPDUs after link-up, then go quiet — but the port still reacts to received superior BPDUs. Failsafe-ish.
- **Per-interface** (`spanning-tree bpdufilter enable`): sends and processes **nothing**, ever — loop detection is gone on that port. If the far end runs BPDU guard, the far end may err-disable. Most designs don't need filter at all.

## Unidirectional fiber problems

One broken strand = link stays "up/up" but BPDUs flow one way → downstream switch ages out its root port info and unblocks a port → **forwarding loop**. Two fixes:

**Loop guard:** `spanning-tree loopguard default` (global) or `spanning-tree guard loop` (interface). On BPDU loss the port goes BKN \*LOOP_Inc rather than forwarding. List affected ports per VLAN: `show spanning-tree inconsistentports`. Conflicts with PortFast logic — keep it off edge ports.

**UDLD:** sends packets carrying its system ID/port ID; neighbor echoes them back; failure to see your own ID echoed = unidirectional.
- Modes: **normal** (alert only, port stays active) vs **aggressive** (8 packets at 1 s intervals, then err-disable).
- Config: `udld enable [aggressive]` globally (applies to SFP ports), `udld port [aggressive]` per interface, `udld port disable` to exempt, `udld recovery [interval ...]`.
- Verify: `show udld neighbors` → state should be **Bidirectional**; `show udld <int>` for detail.
- Must run on **both ends** of the link.

## Exam-day nuggets

- Priority increments = **4096** (DIKTA 1). root primary = 24576, secondary = 28672.
- Advertised path cost **excludes** the egress port cost — receiver adds ingress cost (DIKTA 2: false).
- **Lower** port priority is preferred (DIKTA 3: true).
- BPDU guard = syslog + **err-disabled** (DIKTA 4). Root guard = superior BPDU → **root-inconsistent** (DIKTA 5).
- UDLD exists for **one-way fiber links** (DIKTA 6).
- Distinguish the two "inconsistent" states: root-inconsistent (root guard, superior BPDU arrived) vs loop-inconsistent (loop guard, BPDUs stopped). Both self-recover; err-disable (BPDU guard/UDLD aggressive) does not.
- Guard placement mental model: **root guard faces down** (toward switches that shouldn't be root), **loop guard faces up** (on your root/alternate uplinks), **BPDU guard faces out** (toward hosts).
