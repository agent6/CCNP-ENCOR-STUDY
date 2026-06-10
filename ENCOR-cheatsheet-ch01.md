# Ch 1 Cheat Sheet — Packet Forwarding

**ENCOR v1.2 relevance:** This chapter is foundation material. The old "hardware/software switching mechanisms (CEF/CAM/TCAM)" exam topic was **dropped in v1.2**, so study the forwarding-architecture half for understanding, not memorization depth. The VLAN/access/trunk material directly supports topic **3.1.a (troubleshoot 802.1Q trunking)** — that's the part to know cold.

---

## Layer 2 vs Layer 3 Forwarding

| | Layer 2 (switch) | Layer 3 (router/MLS) |
|---|---|---|
| Forwards on | **Destination MAC** | **Destination IP** |
| Table used | MAC address table (CAM) | Routing table (RIB) → FIB |
| Bounds | Collision domains (per port) | Broadcast domains (per VLAN/subnet) |

- **Collision domain:** segment where transmissions can collide (CSMA/CD, half duplex). Every switch port = its own collision domain → full duplex.
- **Broadcast domain:** reach of a L2 broadcast (FF:FF:FF:FF:FF:FF). Broadcasts stop at L3 boundaries. Hub = repeats everything; switch = splits collision domains; router = splits broadcast domains.
- **MAC address:** 48 bits, 6 hex octets; first 3 = OUI (vendor), last 3 = vendor-assigned unique.
- **Unknown unicast flooding:** destination MAC not in table → flood out all ports in the VLAN except ingress.
- Switches **learn from source MACs**; multiple MACs on one port ⇒ a switch/hub/hypervisor vSwitch is attached there.

## VLANs & 802.1Q

The 802.1Q tag adds **32 bits (4 bytes)** to the frame:

| Field | Size | Purpose |
|---|---|---|
| TPID | 16 bits | 0x8100 = "this is 802.1Q" |
| PCP | 3 bits | CoS (L2 QoS priority) |
| DEI | 1 bit | Drop-eligible under congestion |
| VLAN ID | 12 bits | The VLAN (4094 usable) |

**VLAN ID ranges:** 0 reserved (802.1p) · **1 default** (can't modify/delete) · 2–1001 normal · 1002–1005 reserved legacy · **1006–4094 extended**.

- Frames are tagged **only on trunk links** — never inside the switch or on access ports.
- Create: `vlan 10` + `name PCs` (commits when you leave the vlan context).

## Access vs Trunk Ports

- **Access port:** one VLAN, untagged. `switchport mode access` + `switchport access vlan 99` (configuring by name still stores the number).
- **Trunk port:** carries many VLANs with 802.1Q tags. `switchport mode trunk`.
- **Native VLAN:** untagged traffic on a trunk = native VLAN (**default VLAN 1**). Change per port: `switchport trunk native vlan X`. **Must match on both ends.** Hardening best practice: set it to an unused VLAN (control-plane traffic rides VLAN 1).
- **Allowed VLANs:** `switchport trunk allowed vlan {ids | all | none | add | remove | except}`.
  ⚠️ **Classic outage:** forgetting `add` overwrites the whole list. Always `... allowed vlan add 30`.

## L3 forwarding essentials

- **Same subnet:** sender ARPs for the destination directly (broadcast ARP request → unicast reply → ARP table).
- **Different subnet:** sender uses next hop (static route, default gateway, or routing protocol), ARPs for the **next hop's** MAC.
- **MAC rewrite at each hop:** router swaps source MAC = its egress interface, dest MAC = next hop; **IPs never change** (sans NAT). TTL decremented by 1 per hop (TTL 0 = discard); checksum recomputed.
- **Connected routes:** interface up + IP configured → injected into RIB with **AD 0** (nothing can preempt).
- Secondary IPv4: `ip address ... secondary`. IPv6: repeat `ipv6 address` (no keyword needed).

**Three ways to route VLANs:**

| Method | Config | Use case |
|---|---|---|
| Routed subinterface | `int g0/0/1.10` + `encapsulation dot1q 10` + IP | Router-on-a-stick |
| SVI | `interface vlan 10` + IP | MLS inter-VLAN routing (needs ≥1 up port in the VLAN) |
| Routed switch port | `no switchport` + IP | P2P L3 links between switches — avoids transit-VLAN/STP issues |

## Forwarding architectures (foundation only in v1.2)

- **Process switching ("slow path"):** CPU's ip_input process handles each packet. Fallback for punted traffic: packets to/from the router itself, IP options, unresolved ARP ("glean" adjacency).
- **CEF (default):** built from two structures —
  - **FIB:** mirror of the routing table optimized for lookups (prefix → next hop).
  - **Adjacency table:** next-hop IP → MAC + egress interface, pre-built from ARP.
- **Software CEF** = CPU does CEF; **hardware CEF** = ASICs/NPUs/TCAM do it (software CEF then just programs the hardware). **dCEF** = CEF tables pushed to line cards.
- **CAM vs TCAM:** CAM = binary match (MAC table). TCAM = ternary 0/1/don't-care, stored as Value/Mask/Result — matches multiple fields at once (ACL, QoS, L2/L3) in constant time regardless of entry count.
- **Centralized vs distributed:** forwarding engine on the RP vs. on each line card (distributed = better throughput/port density; egress on another card goes across the switch fabric, bypassing the RP).
- **SDM templates:** repartition fixed TCAM among MAC/route/ACL resources: `sdm prefer {vlan | advanced}` + **reload required**; must match across a stack; overflow past TCAM goes to CPU (performance hit). IPv6 entries consume double space.

## Diagnostic command toolkit

| Command | Tells you |
|---|---|
| `show vlan [brief\|id X\|name N\|summary]` | VLAN-to-port assignments |
| `show interfaces trunk` | Trunks, native VLAN, allowed VLANs, STP-forwarding VLANs (3 sections — if a VLAN is missing from section 2, it's not allowed; missing from 3, it's blocked/pruned) |
| `show interfaces X switchport` | Admin vs **Operational** mode (access/trunk/down), access VLAN, native VLAN, negotiation |
| `show interfaces status` | Per-port one-liner: connected/notconnect/err-disabled, VLAN/trunk/routed, duplex/speed (a- prefix = auto-negotiated) |
| `show mac address-table [dynamic\|address M\|vlan X]` | Where a MAC lives; `clear mac address-table dynamic` to flush |
| `show ip arp` | IP→MAC mappings (next-hop resolution) |
| `show ip interface brief` (+ `\| exclude unassigned`) | Interface IP/state at a glance |
| `show ipv6 interface brief` | Same for IPv6 (note link-local FE80:: + global per interface) |
| `show sdm prefer` | Active SDM template and resource counts |
| `mac address-table static M vlan X interface Y` | Static MAC entry (legacy: prevent unicast flooding) |

## Exam-day nuggets

- Frame to unknown dest MAC → **flood**; known → single port. L2 uses **dest MAC**, L3 uses **dest IP** (DIKTA Q1/Q3).
- Switch shrinks **collision** domains; router shrinks **broadcast** domains (Q2/Q4).
- MAC table ↔ **CAM**; multi-field hardware matching ↔ **TCAM** (Q5).
- **Distributed** forwarding = port density + scale (Q6).
- CEF = **FIB + adjacency table** (Q7).
- A host on an access port in VLAN 10 can talk to a host on a trunk whose native VLAN is 10 — both untagged. Not best practice, but legal (and exam-worthy).
- Operational Mode "down"/"static access" on both sides of an intended trunk → check DTP modes (full story in Ch 5).
