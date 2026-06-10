# ENCOR 350-401 v1.2 Practice Question Bank

Original practice questions keyed to the OCG 2nd Edition chapters and the ENCOR v1.2 exam topics. Answers with explanations follow each chapter's questions. Pair with the book's own "Do I Know This Already?" quizzes and the Pearson Test Prep exams included with the book.

---

## Chapter 1 — Packet Forwarding (supporting 3.1.a)

**1.1** A switch receives a unicast frame whose destination MAC address is not in its MAC address table. What does the switch do?
a. Drops the frame
b. Floods the frame out all ports in the same VLAN except the ingress port
c. Sends the frame to the default gateway
d. Buffers the frame until the address is learned

**1.2** How many bytes does an 802.1Q tag add to an Ethernet frame, and where is it inserted?
a. 8 bytes, before the destination MAC
b. 4 bytes, between the source MAC and Type/Length fields
c. 4 bytes, appended after the FCS
d. 2 bytes, inside the payload

**1.3** Traffic on the native VLAN of an 802.1Q trunk is sent how?
a. Tagged with VLAN 1
b. Tagged with the native VLAN ID
c. Untagged
d. Dropped unless explicitly allowed

**1.4** Which device boundary separates broadcast domains by default?
a. Hub
b. Layer 2 switch
c. Router
d. Repeater

**1.5** Which command displays the VLANs currently allowed and forwarding on a trunk link?
a. show vlan brief
b. show interfaces trunk
c. show spanning-tree summary
d. show etherchannel summary

### Answers — Chapter 1
1.1 **b** — Unknown unicast frames are flooded within the VLAN (except the receiving port).
1.2 **b** — The 4-byte 802.1Q tag sits between the source MAC and Type/Length fields; the FCS is recalculated.
1.3 **c** — Native VLAN traffic is untagged on 802.1Q trunks; a native VLAN mismatch can merge VLANs.
1.4 **c** — Routers (or SVIs/routed ports) bound broadcast domains; switches only bound collision domains.
1.5 **b** — `show interfaces trunk` shows allowed, active, and forwarding VLANs per trunk.

---

## Chapter 2 — Spanning Tree Protocol (3.1.c)

**2.1** How is the STP root bridge elected?
a. Highest bridge priority; highest MAC breaks ties
b. Lowest bridge priority; lowest MAC breaks ties
c. Lowest MAC address only
d. Highest port cost

**2.2** On a non-root switch, the root port is the port with the:
a. Lowest port number
b. Lowest cost path to the root bridge
c. Highest bandwidth, regardless of path
d. Lowest MAC address neighbor

**2.3** Which 802.1D port states exist, in order, when a port comes up?
a. Listening, learning, blocking, forwarding
b. Blocking, listening, learning, forwarding
c. Learning, listening, forwarding
d. Disabled, forwarding

**2.4** In RSTP (802.1W), which port role provides an alternate path to the root and stays discarding?
a. Backup port
b. Designated port
c. Alternate port
d. Edge port

**2.5** What is the default 802.1D-era short-mode path cost for a 1 Gbps link?
a. 100
b. 19
c. 4
d. 1

**2.6** Two switches are connected back to back. Both ports claim designated. Which values are compared, in order, to resolve the tie?
a. Port priority, then port number
b. Root path cost, bridge ID, port priority, port number
c. Bridge MAC only
d. Interface bandwidth, then duplex

**2.7** RSTP can rapidly transition a port to forwarding without proposal/agreement when the port is:
a. A point-to-point designated port
b. An edge port (PortFast)
c. A root port on a shared segment
d. Any half-duplex port

**2.8** Which timer defines how long a switch waits, by default, before aging out a BPDU from a neighbor in classic STP?
a. Hello (2 s)
b. Forward delay (15 s)
c. Max age (20 s)
d. Aging (300 s)

### Answers — Chapter 2
2.1 **b** — Lowest bridge ID wins: priority first, then lowest system MAC.
2.2 **b** — Root port = lowest accumulated root path cost; ties broken by neighbor bridge ID, port priority, port number.
2.3 **b** — Blocking → listening → learning → forwarding (~30 s with default timers).
2.4 **c** — Alternate ports back up the root port. Backup ports back up a designated port on the same segment.
2.5 **c** — Short-mode costs: 10 Mbps=100, 100 Mbps=19, 1 Gbps=4, 10 Gbps=2.
2.6 **b** — Designated port election: lowest root path cost, then lowest bridge ID, then port priority/number.
2.7 **b** — Edge ports skip proposal/agreement and go straight to forwarding.
2.8 **c** — Max age (20 s) is how long superior BPDU info is retained before being aged out.

---

## Chapter 3 — Advanced STP Tuning (3.1.c)

**3.1** Root guard is enabled on a designated port. What happens when a superior BPDU arrives on that port?
a. The port is err-disabled permanently
b. The port enters root-inconsistent state and blocks until superior BPDUs stop
c. The switch becomes the new root
d. The BPDU is ignored silently

**3.2** BPDU guard is best deployed on which ports?
a. Uplinks between distribution and core
b. PortFast-enabled access ports facing end hosts
c. Trunk ports only
d. The root bridge's designated ports

**3.3** A port protected by BPDU guard receives a BPDU. The port:
a. Blocks for twice the forward delay
b. Goes err-disabled
c. Becomes a root port
d. Filters the BPDU and stays forwarding

**3.4** Which feature should you configure so the root bridge role is deterministic in your campus?
a. Leave all priorities at 32768
b. Lower the priority (e.g., 0 or 4096) on the intended root and set a secondary
c. Enable BPDU filter globally
d. Raise port costs on the root

**3.5** What does STP PortFast do?
a. Increases port speed
b. Skips listening/learning so the port forwards immediately
c. Forces the port to become a root port
d. Disables BPDU processing

**3.6** Which command/feature automatically recovers an err-disabled port after a timeout?
a. errdisable recovery cause bpduguard
b. spanning-tree backbonefast
c. shutdown / no shutdown is the only option
d. spanning-tree pathcost method long

**3.7** Why is BPDU filter on access ports riskier than BPDU guard?
a. It err-disables ports too aggressively
b. It can silently allow a loop because BPDUs are neither sent nor processed
c. It changes the root bridge
d. It only works on trunks

### Answers — Chapter 3
3.1 **b** — Root guard blocks (root-inconsistent) only while superior BPDUs are received, then auto-recovers.
3.2 **b** — BPDU guard protects the edge: hosts should never send BPDUs.
3.3 **b** — BPDU guard err-disables the port; recovery is manual or via errdisable recovery.
3.4 **b** — Explicitly set primary/secondary root priorities; never rely on defaults.
3.5 **b** — PortFast transitions edge ports straight to forwarding (and suppresses TCN generation on flap).
3.6 **a** — `errdisable recovery cause ...` with a recovery interval re-enables the port automatically.
3.7 **b** — Filtering BPDUs removes loop detection on that port entirely; guard fails safe, filter fails open.

---

## Chapter 4 — Multiple Spanning Tree Protocol (3.1.c)

**4.1** Which three parameters must match for two switches to be in the same MST region?
a. Hostname, domain, VTP version
b. Region name, revision number, VLAN-to-instance mapping
c. Bridge priority, MAC, max age
d. IOS version, region name, VLAN list

**4.2** In MST, which instance always exists and interacts with non-MST switches?
a. MSTI 1
b. IST (instance 0)
c. CST instance 4094
d. PVST instance per VLAN

**4.3** The main scalability benefit of MST over Rapid PVST+ is:
a. Faster hello timers
b. One spanning-tree instance can carry many VLANs
c. It eliminates BPDUs
d. It removes the need for a root bridge

**4.4** How does an MST region appear to an external PVST+/RSTP switch?
a. As one logical switch
b. As a separate instance per VLAN
c. As a routing domain
d. It is invisible

**4.5** VLANs 10–20 are mapped to MSTI 1, but VLAN 15's traffic must take a different path. What must you do?
a. Change VLAN 15's priority in MSTI 1
b. Map VLAN 15 to a different instance (configuration change across the region)
c. Configure per-VLAN cost inside MSTI 1
d. Nothing; MST balances automatically

**4.6** Where is MST instance/VLAN mapping configured?
a. Interface mode
b. spanning-tree mst configuration mode (then name/revision/instance mappings)
c. VTP server only
d. Via DTP negotiation

### Answers — Chapter 4
4.1 **b** — Name, revision, and the VLAN-to-instance mapping table (a digest of it) must match exactly.
4.2 **b** — Instance 0 (IST) runs on all links in the region and represents the region to the CST.
4.3 **b** — A few instances replace per-VLAN topologies, cutting BPDU and CPU/TCAM load.
4.4 **a** — The whole region collapses into a single logical bridge from the outside (CST view).
4.5 **b** — Path control in MST is per instance; moving a VLAN requires updating the mapping on every region switch.
4.6 **b** — `spanning-tree mst configuration` submode holds name, revision, and instance mappings.

---

## Chapter 5 — VLAN Trunks and EtherChannel Bundles (3.1.a, 3.1.b)

**5.1** Which DTP mode combination does NOT form a trunk?
a. desirable + desirable
b. desirable + auto
c. auto + auto
d. trunk + auto

**5.2** What is the safest way to configure a trunk you fully control?
a. switchport mode dynamic desirable both sides
b. switchport mode trunk + switchport nonegotiate on both sides
c. switchport mode access
d. Leave DTP defaults

**5.3** A trunk comes up but VLAN 30 traffic fails across it. `show interfaces trunk` shows VLAN 30 not in the allowed list. Fix?
a. switchport trunk allowed vlan add 30
b. switchport trunk allowed vlan 30 (replacing the list)
c. Recreate VLAN 30
d. Change native VLAN to 30

**5.4** Which LACP mode combination forms an EtherChannel?
a. passive + passive
b. active + passive
c. on + active
d. auto + desirable

**5.5** PAgP "desirable" corresponds most closely to which LACP mode?
a. passive
b. active
c. on
d. standby

**5.6** Which mismatch will prevent an interface from joining an EtherChannel bundle?
a. Different interface descriptions
b. Different speed/duplex or switchport mode/allowed VLANs
c. Different cable lengths
d. Different port numbers

**5.7** Mode "on" is configured on one side and LACP active on the other. Result?
a. Channel forms via LACP
b. Channel does not form (and may err-disable/loop risk)
c. PAgP takes over
d. Half the links bundle

**5.8** Which command shows bundle status with flags such as (P) bundled and (s) suspended?
a. show etherchannel summary
b. show interfaces status
c. show lacp neighbor detail only
d. show port-channel database

### Answers — Chapter 5
5.1 **c** — auto+auto: both wait passively; no trunk. (trunk+auto works because trunk mode actively sends DTP.)
5.2 **b** — Static trunk with DTP disabled (`nonegotiate`) removes negotiation attack surface and flap risk.
5.3 **a** — Use the `add` keyword; omitting it overwrites the entire allowed list (a classic outage cause).
5.4 **b** — LACP needs at least one active side: active+active or active+passive.
5.5 **b** — PAgP desirable and LACP active both initiate negotiation (auto/passive only respond).
5.6 **b** — Members must match speed, duplex, mode, native/allowed VLANs, etc., or they're suspended.
5.7 **b** — "on" sends no protocol; LACP side won't bundle. Static "on" must be used on both sides.
5.8 **a** — `show etherchannel summary` flags: P bundled, s/S suspended, D down, w waiting.

---

## Chapter 6 — IP Routing Essentials (3.2.a, 3.2.d, 2.2.a)

**6.1** Order these default administrative distances from most to least preferred: OSPF, eBGP, EIGRP (internal), static.
a. static (1), eBGP (20), EIGRP (90), OSPF (110)
b. static (1), EIGRP (90), eBGP (20), OSPF (110)
c. eBGP (20), static (1), OSPF (110), EIGRP (90)
d. static (5), eBGP (20), OSPF (90), EIGRP (110)

**6.2** Two routes to the same prefix come from OSPF (metric 50) and EIGRP internal (metric 30000). Which is installed?
a. OSPF, lower metric
b. EIGRP, lower AD (90 vs 110)
c. Both, ECMP
d. Neither; AD tie

**6.3** Which statement about link-state vs. advanced distance vector protocols is true?
a. OSPF routers share full topology within an area; EIGRP routers know only what neighbors advertise
b. EIGRP floods LSAs
c. OSPF supports unequal-cost load balancing natively
d. EIGRP requires areas

**6.4** What makes a static route "floating"?
a. A next hop on a different subnet
b. An AD set higher than the primary route so it installs only on failure
c. A route to null0
d. Recursive lookup

**6.5** A recursive static route requires:
a. The next hop be resolved via another routing table lookup
b. An exit interface only
c. A /32 mask
d. CEF disabled

**6.6** Policy-based routing is applied:
a. Outbound on the egress interface
b. Inbound on the interface receiving the traffic to be policy-routed
c. Globally only
d. Only to locally generated traffic

**6.7** In a route map used for PBR, which action forwards matched traffic to a specific router?
a. set ip default next-hop
b. set ip next-hop
c. match ip next-hop
d. set interface null0

**6.8** Which commands place an interface into VRF "RED" and verify RED's routes? (Choose two.)
a. vrf forwarding RED (interface)
b. ip vrf RED (interface)
c. show ip route vrf RED
d. show vrf route RED

### Answers — Chapter 6
6.1 **a** — Connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, IS-IS 115, RIP 120, iBGP 200.
6.2 **b** — AD decides between different protocols; metric only compares routes within the same protocol.
6.3 **a** — Link-state floods topology (LSDB); EIGRP is advanced distance vector ("routing by rumor" plus DUAL/feasible successors).
6.4 **b** — e.g., `ip route 0.0.0.0 0.0.0.0 203.0.113.1 250` as backup.
6.5 **a** — Next-hop-only static routes need a second lookup to find the exit interface.
6.6 **b** — `ip policy route-map X` goes on the ingress interface; `ip local policy` handles router-generated traffic.
6.7 **b** — `set ip next-hop` overrides the routing table for matched packets (default next-hop applies only when no specific route exists).
6.8 **a, c** — Modern syntax `vrf forwarding RED` (older: `ip vrf forwarding`); verify with `show ip route vrf RED`. Note: assigning an interface to a VRF removes its IP address.

---

## Chapter 7 — EIGRP (3.2.a)

**7.1** By default, EIGRP's composite metric uses which two values?
a. Bandwidth and delay
b. Bandwidth and reliability
c. Delay and load
d. Hop count and MTU

**7.2** The feasibility condition states that a route qualifies as a feasible successor when:
a. Its reported distance is lower than the feasible distance of the successor
b. Its feasible distance is lower than the reported distance
c. It has the same metric as the successor
d. It is learned on the same interface

**7.3** What is the main benefit of a feasible successor?
a. Load balancing is disabled
b. Immediate, loop-free failover without going Active (no DUAL query)
c. Lower administrative distance
d. Automatic summarization

**7.4** Which parameters must match for two routers to become EIGRP neighbors? (Choose two.)
a. Autonomous system number
b. K values
c. Hello timers
d. Router IDs

**7.5** What does the EIGRP `variance 2` command enable?
a. Two equal-cost paths only
b. Unequal-cost load balancing across feasible successors whose metric is within 2x the successor's FD
c. Doubling of the hello timer
d. Two EIGRP processes

**7.6** EIGRP "Stuck in Active" occurs when:
a. A neighbor doesn't reply to a query for a route that lost its successor
b. The hold timer expires
c. Two routers have duplicate router IDs
d. Variance is misconfigured

**7.7** Which multicast address does EIGRP use for hellos (IPv4)?
a. 224.0.0.5
b. 224.0.0.10
c. 224.0.0.13
d. 224.0.0.18

### Answers — Chapter 7
7.1 **a** — K1 (bandwidth) and K3 (delay) are on by default; reliability/load are off.
7.2 **a** — RD < FD guarantees the neighbor isn't routing through you (loop-free).
7.3 **b** — FS routes are pre-validated backups; convergence is nearly instant.
7.4 **a, b** — AS number and K values must match. EIGRP hello timers do NOT need to match (unlike OSPF).
7.5 **b** — Variance multiplier allows unequal-cost paths, but only routes meeting the feasibility condition.
7.6 **a** — Unanswered queries leave the route Active until the timer expires and the neighborship resets.
7.7 **b** — 224.0.0.10 (OSPF uses .5/.6, PIM .13, VRRP .18).

---

## Chapter 8 — OSPF (3.2.a, 3.2.b)

**8.1** Which parameters must match for an OSPF adjacency to form? (Choose three.)
a. Hello and dead intervals
b. Area ID
c. Subnet/mask on the link
d. Router ID
e. Process ID

**8.2** Two OSPF routers on Ethernet remain in 2WAY state with each other. Most likely reason?
a. MTU mismatch
b. Both are DROTHERs — full adjacency forms only with DR/BDR on broadcast networks
c. Authentication failure
d. Different process IDs

**8.3** Neighbors are stuck in EXSTART/EXCHANGE. Classic cause?
a. MTU mismatch
b. Wrong network type
c. Duplicate area
d. Passive interface

**8.4** How is the OSPF router ID chosen if not configured manually?
a. Lowest IP on any interface
b. Highest loopback IP, else highest active physical interface IP
c. The interface MAC
d. Random 32-bit value

**8.5** DR election on a broadcast segment prefers:
a. Lowest priority, then lowest RID
b. Highest priority, then highest RID (priority 0 = never DR)
c. First router booted, always preempted
d. Highest interface bandwidth

**8.6** Default hello/dead timers on broadcast and point-to-point networks?
a. 30/120
b. 10/40
c. 5/20
d. 10/30

**8.7** What does `passive-interface` do in OSPF?
a. Stops advertising that interface's subnet
b. Advertises the subnet but sends no hellos (no adjacencies on that interface)
c. Drops OSPF traffic inbound
d. Sets cost to infinity

**8.8** Which network type does OSPF assume on a GigabitEthernet interface by default, and what's a common tuning on a p2p Ethernet link?
a. Point-to-point; change to broadcast
b. Broadcast; change to point-to-point to skip DR election and speed adjacency
c. Non-broadcast; add neighbor statements
d. Point-to-multipoint; nothing needed

**8.9** Which command enables OSPF on an interface without a network statement?
a. ip ospf 1 area 0 (interface mode)
b. router ospf 1 interface Gi0/1
c. ospf enable
d. network interface Gi0/1

### Answers — Chapter 8
8.1 **a, b, c** — Timers, area, subnet (plus auth, stub flags, MTU for full adjacency). RIDs must DIFFER; process IDs are locally significant.
8.2 **b** — On broadcast networks, DROTHER-DROTHER pairs stay in 2WAY by design. Stuck 2WAY with a DR is a problem; 2WAY between DROTHERs is normal.
8.3 **a** — Database description exchange fails when MTUs differ (or use `ip ospf mtu-ignore`).
8.4 **b** — Manual `router-id` > highest loopback > highest physical interface IP.
8.5 **b** — Highest priority wins (default 1); ties broken by highest RID. No preemption once elected.
8.6 **b** — 10/40 on broadcast and p2p; 30/120 on NBMA types.
8.7 **b** — Subnet stays advertised; hellos stop. Standard for user-facing interfaces.
8.8 **b** — Ethernet defaults to broadcast; `ip ospf network point-to-point` removes DR/BDR overhead on router-to-router links.
8.9 **a** — Interface-level `ip ospf <pid> area <area>` is the modern alternative to network statements.

---

## Chapter 9 — Advanced OSPF (3.2.a, 3.2.b)

**9.1** Match the LSA type: which LSA carries inter-area routes and which carries external routes?
a. Type 1 inter-area, Type 2 external
b. Type 3 inter-area (from ABR), Type 5 external (from ASBR)
c. Type 5 inter-area, Type 7 intra-area
d. Type 2 inter-area, Type 4 external

**9.2** Which area type blocks Type 5 LSAs but allows redistribution inside the area via Type 7?
a. Stub
b. Totally stubby
c. NSSA
d. Backbone

**9.3** A totally stubby area receives which routes from its ABR?
a. All inter-area and external routes
b. Only a default route (plus intra-area)
c. External routes only
d. Nothing

**9.4** Where is `area X range` configured and what does it do?
a. On the ASBR; summarizes external routes
b. On the ABR; summarizes Type 3 inter-area advertisements for that area's prefixes
c. On any router; filters LSAs
d. On the DR; compresses the LSDB

**9.5** To summarize redistributed (external) routes, use:
a. area range on the ABR
b. summary-address on the ASBR
c. distribute-list in
d. ip summary-address ospf on the interface

**9.6** Which OSPF filtering method prevents routes from being installed in the local RIB but does NOT stop LSA flooding?
a. area filter-list
b. distribute-list in
c. summary-address not-advertise
d. passive-interface

**9.7** Every OSPF area must connect to area 0. If a remote area can't physically touch the backbone, the classic fix is:
a. A second OSPF process
b. A virtual link across the transit area
c. Redistribution
d. NSSA conversion

**9.8** OSPF external Type 1 (E1) routes differ from E2 because E1:
a. Adds internal path cost to the external metric; E2 keeps only the redistribution metric
b. Is always preferred less than E2
c. Cannot be summarized
d. Only exists in NSSAs

### Answers — Chapter 9
9.1 **b** — T1 router, T2 network, T3 inter-area summary, T4 ASBR locator, T5 external, T7 NSSA external.
9.2 **c** — NSSA: no Type 5s in, but local ASBRs inject Type 7 (converted to Type 5 at the ABR).
9.3 **b** — Totally stubby ABRs send a single Type 3 default; no other inter-area or external routes.
9.4 **b** — `area range` summarizes that area's routes as they leave through the ABR.
9.5 **b** — External summarization happens at the redistribution point (ASBR).
9.6 **b** — distribute-list in affects only the local RIB; the LSDB and downstream flooding are untouched.
9.7 **b** — Virtual links extend area 0 logically across a transit area.
9.8 **a** — E1 = external + internal cost (grows with distance); E2 (default) = fixed external metric.

---

## Chapter 10 — OSPFv3 (3.2.b)

**10.1** OSPFv3 adjacencies are formed using which source addresses?
a. Global unicast addresses
b. Link-local addresses (FE80::/10)
c. Site-local addresses
d. The router ID

**10.2** How is OSPFv3 enabled on an interface?
a. network statements with IPv6 prefixes
b. Interface command (e.g., ospfv3 1 ipv6 area 0 / ipv6 ospf 1 area 0)
c. Automatically when IPv6 is enabled
d. Via DHCPv6

**10.3** What is true of the OSPFv3 router ID?
a. It's a 128-bit IPv6 address
b. It remains a 32-bit value and may need manual configuration if no IPv4 addresses exist
c. It's derived from the MAC always
d. It's optional

**10.4** Which OSPFv3 feature lets one process carry both IPv4 and IPv6 routes?
a. Dual stack LSAs
b. Address families (AF) support
c. NAT-PT
d. Type 9 LSAs

**10.5** In OSPFv3, prefix information was moved out of router/network LSAs into:
a. Type 5 only
b. Intra-Area Prefix LSAs (and Link LSAs for link-local info)
c. Hello packets
d. Type 4 LSAs

**10.6** Which multicast groups does OSPFv3 use?
a. FF02::5 (all OSPF routers) and FF02::6 (DR routers)
b. FF02::A and FF02::B
c. FF02::1 and FF02::2
d. FF05::5 only

### Answers — Chapter 10
10.1 **b** — Hellos/adjacencies use link-local source addresses; global prefixes are carried in LSAs.
10.2 **b** — OSPFv3 is interface-enabled; there are no network statements.
10.3 **b** — RID is still 32-bit; an IPv6-only router requires `router-id` to be set manually.
10.4 **b** — OSPFv3 address families allow IPv4 and IPv6 under one v3 process.
10.5 **b** — Decoupling topology from prefixes means prefix changes don't force SPF runs.
10.6 **a** — FF02::5 and FF02::6, mirroring 224.0.0.5/6 in OSPFv2.

---

## Chapter 11 — BGP (3.2.c)

**11.1** BGP sessions are established over:
a. UDP 179
b. TCP 179
c. IP protocol 89
d. TCP 22

**11.2** A neighbor relationship is eBGP rather than iBGP when:
a. The neighbor is in a different autonomous system
b. The neighbor is more than one hop away
c. Multihop is configured
d. The routers share an IGP

**11.3** Which BGP states will you see, in order, for a successfully established session?
a. Down, Init, Up
b. Idle, Connect, OpenSent, OpenConfirm, Established
c. Listening, Learning, Forwarding
d. Active, Passive, Established

**11.4** A session flaps between Idle and Active. Most likely cause?
a. The neighbor's AS is correct
b. TCP reachability problems or wrong neighbor IP/AS configuration
c. Too many prefixes
d. Route reflector missing

**11.5** For the `network 10.10.0.0 mask 255.255.0.0` command to advertise the prefix, what must be true?
a. Nothing; BGP originates it unconditionally
b. An exactly matching route (prefix AND mask) must exist in the local RIB
c. The prefix must be connected
d. A neighbor must request it

**11.6** By default, what TTL do eBGP packets use, and what does that imply?
a. TTL 255; neighbors can be anywhere
b. TTL 1; neighbors must be directly connected unless ebgp-multihop/ttl-security is configured
c. TTL 64; up to 64 hops
d. TTL 0; loopbacks required

**11.7** When a route is advertised to an eBGP peer, which attributes change by default? (Choose two.)
a. Next hop is set to the advertising router
b. Local AS is prepended to AS_Path
c. MED is removed always
d. Weight is copied

**11.8** Which command summarizes BGP neighbor state and prefixes received in one view?
a. show bgp neighbors detail
b. show ip bgp summary
c. show ip route bgp
d. show bgp table

### Answers — Chapter 11
11.1 **b** — TCP 179; one side initiates, the session rides normal TCP.
11.2 **a** — Different ASN = eBGP (AD 20); same ASN = iBGP (AD 200).
11.3 **b** — Idle → Connect → OpenSent → OpenConfirm → Established (Active = retrying TCP).
11.4 **b** — Idle/Active cycling is almost always TCP/reachability or mismatched neighbor statements.
11.5 **b** — BGP's network statement advertises only what already exists exactly in the RIB.
11.6 **b** — eBGP defaults to TTL 1 — hence "directly connected neighbors" in the exam topic.
11.7 **a, b** — eBGP updates rewrite next-hop to self and prepend the sender's ASN to AS_Path.
11.8 **b** — `show ip bgp summary`: neighbor, AS, uptime, state/prefixes received.

---

## Chapter 12 — Advanced BGP: Best Path (3.2.c)

**12.1** Place these best-path criteria in evaluation order: AS_Path length, weight, local preference, origin.
a. Weight → local preference → AS_Path length → origin
b. Local preference → weight → origin → AS_Path
c. AS_Path → weight → local preference → origin
d. Origin → AS_Path → weight → local preference

**12.2** Which best-path attribute is Cisco-proprietary and only locally significant to the router where it's set?
a. Local preference
b. Weight
c. MED
d. Origin

**12.3** Local preference is used to influence:
a. How traffic exits your AS (higher wins, shared via iBGP)
b. How neighbors enter your AS
c. Only eBGP sessions
d. TTL values

**12.4** With all earlier criteria tied, a route via eBGP vs. one via iBGP:
a. iBGP wins
b. eBGP wins
c. Random choice
d. Both install (ECMP)

**12.5** Origin codes are preferred in which order?
a. incomplete < EGP < IGP
b. IGP < EGP < incomplete (IGP best)
c. EGP best
d. They're never compared

**12.6** Which attribute is a *suggestion to a neighboring AS* about which entry point to use into your AS (lower preferred)?
a. Weight
b. Local preference
c. MED
d. Community

### Answers — Chapter 12
12.1 **a** — Weight (highest) → LocPref (highest) → locally originated → shortest AS_Path → origin → lowest MED → eBGP>iBGP → lowest IGP cost to next hop → oldest → lowest RID.
12.2 **b** — Weight never leaves the router; highest wins.
12.3 **a** — LocPref (default 100) is AS-wide outbound path policy.
12.4 **b** — eBGP-learned beats iBGP-learned at that step.
12.5 **b** — IGP (network statement) beats EGP beats incomplete (redistributed).
12.6 **c** — MED (metric) signals preferred ingress to the adjacent AS; lowest wins, compared by default only from the same AS.

---

## Chapter 13 — Multicast (3.3.d)

**13.1** Which range holds all IPv4 multicast addresses, and which sub-range is reserved for SSM?
a. 224.0.0.0/4 overall; 232.0.0.0/8 for SSM
b. 239.0.0.0/8 overall; 224.0.0.0/24 for SSM
c. 224.0.0.0/8 overall; 238.0.0.0/8 for SSM
d. 240.0.0.0/4 overall; 232.0.0.0/16 for SSM

**13.2** What is the purpose of the RPF check?
a. Verify the receiver is authorized
b. Accept multicast only on the interface that is the unicast path back to the source/RP, preventing loops
c. Encrypt the stream
d. Elect the PIM DR

**13.3** In PIM Sparse Mode, what role does the Rendezvous Point play?
a. It is the root of the shared tree (*,G) where sources are first learned by receivers
b. It forwards all traffic permanently
c. It replaces IGMP
d. It blocks SPT switchover

**13.4** (*,G) vs (S,G) entries: which statement is correct?
a. (*,G) = shared tree rooted at the RP; (S,G) = shortest-path tree rooted at the source
b. (*,G) = source tree; (S,G) = shared tree
c. Both are identical
d. (S,G) exists only in dense mode

**13.5** Which IGMP version is required for SSM, and why?
a. IGMPv1; it floods reports
b. IGMPv2; it supports leave messages
c. IGMPv3; receivers specify the source they want (INCLUDE mode)
d. Any version

**13.6** What did IGMPv2 add over v1?
a. Source filtering
b. Leave Group messages and querier election
c. Encryption
d. SSM mapping

**13.7** Which protocol lets RPs in different PIM domains exchange information about active sources?
a. MSDP (Source-Active messages over TCP between RPs)
b. BSR
c. Auto-RP
d. IGMP proxy

**13.8** Bidirectional PIM differs from PIM-SM because bidir:
a. Builds only shared trees — no (S,G)/SPT state — scaling many-to-many apps
b. Floods everywhere then prunes
c. Requires IGMPv3
d. Removes the RP

**13.9** What does IGMP snooping do on a switch?
a. Blocks all multicast
b. Constrains multicast flooding to ports with interested receivers by listening to IGMP messages
c. Routes multicast between VLANs
d. Elects the RP

**13.10** A receiver-side router learns of a source via the shared tree and then joins the SPT. This behavior is called:
a. RPF failover
b. SPT switchover (default at the first packet on Cisco routers)
c. Prune override
d. Asserts

### Answers — Chapter 13
13.1 **a** — 224/4 total; 224.0.0.0/24 link-local; 232/8 SSM; 239/8 admin-scoped.
13.2 **b** — RPF: if the packet didn't arrive on the interface used to reach the source/RP via unicast routing, drop it.
13.3 **a** — Receivers join toward the RP; sources register to it; RP joins source trees on their behalf.
13.4 **a** — Shared tree (*,G) via RP; source tree (S,G) is the optimal path.
13.5 **c** — SSM has no RP; the receiver must name the source — only IGMPv3 can.
13.6 **b** — Leave messages cut leave latency; querier election picks the lowest IP.
13.7 **a** — MSDP peers (typically RPs) exchange SA messages so domains learn external sources. (Supplement: MSDP isn't covered in the OCG.)
13.8 **a** — Bidir uses only (*,G) state both up and down the shared tree — ideal for many-to-many.
13.9 **b** — Snooping builds a Layer 2 forwarding map from IGMP joins instead of flooding.
13.10 **b** — IOS defaults `ip pim spt-threshold 0`: switch to SPT immediately.

---

## Chapter 14 — Quality of Service (1.4)

**14.1** Which QoS model uses RSVP to reserve bandwidth end to end, and which uses per-hop behaviors based on markings?
a. IntServ = RSVP reservations; DiffServ = per-hop behaviors
b. DiffServ = RSVP; IntServ = PHB
c. Best effort = RSVP
d. Both use RSVP

**14.2** In the MQC, configuration objects are applied in which structure?
a. class-map (classify) → policy-map (actions) → service-policy (apply to interface)
b. policy-map → class-map → access-list
c. service-policy → class-map → policy-map
d. route-map → policy-map → interface

**14.3** Which DSCP value is standard for voice bearer traffic?
a. CS3 (24)
b. AF41 (34)
c. EF (46)
d. Default (0)

**14.4** In AF marking "AF31," what do the 3 and the 1 represent?
a. Class 3, drop precedence 1 (low drop probability)
b. Priority 3, queue 1
c. Bandwidth 3 Mbps, burst 1 MB
d. CoS 3, ToS 1

**14.5** Policing vs. shaping — which statement is correct?
a. Policing buffers excess; shaping drops it
b. Policing drops or re-marks excess immediately; shaping buffers and smooths it (adding delay)
c. Both buffer
d. Shaping is inbound-only

**14.6** Interpret: `priority 512` under a class in a policy-map does what that `bandwidth 512` does not?
a. Guarantees minimum bandwidth only
b. Creates a low-latency (LLQ) strict-priority queue, policed to 512 kbps during congestion
c. Reserves memory
d. Disables queuing

**14.7** What does WRED do?
a. Drops all excess traffic at queue full (tail drop)
b. Randomly drops lower-priority packets early as queues fill, to avoid global TCP synchronization
c. Re-marks DSCP to 0
d. Fragments large packets

**14.8** A policy-map applied with `service-policy input PM-X` on Gi0/1 will:
a. Shape outbound traffic
b. Classify/act on traffic entering Gi0/1
c. Apply to all interfaces
d. Fail; policies are output-only

### Answers — Chapter 14
14.1 **a** — IntServ = signaled reservations (RSVP); DiffServ = markings + PHBs, the scalable norm.
14.2 **a** — Classify with class-maps, define actions in policy-maps, attach with service-policy.
14.3 **c** — EF/DSCP 46 for voice; CS3/AF31 commonly for call signaling.
14.4 **a** — AFxy: x = class (queue), y = drop precedence within that class.
14.5 **b** — Police = drop/re-mark (no delay added); shape = buffer/delay to a target rate.
14.6 **b** — `priority` = LLQ with built-in policer; `bandwidth` = CBWFQ minimum guarantee without strict priority.
14.7 **b** — Weighted random early detection drops selectively pre-congestion based on DSCP/precedence.
14.8 **b** — Direction is set at attach time; input policies act on ingress traffic.

---

## Chapter 15 — IP Services (3.3.a, 3.3.b, 3.3.c, 1.1.b)

**15.1** In NTP, what does "stratum" measure?
a. Hop count to the NTP server's reference clock (lower = closer/more authoritative)
b. Packet delay in ms
c. Server CPU load
d. Encryption strength

**15.2** Interpret: `ntp server 10.1.1.1 prefer` vs `ntp peer 10.1.1.2`:
a. Both are identical
b. server = this device synchronizes to 10.1.1.1; peer = mutual synchronization possible with 10.1.1.2
c. peer = one-way sync
d. server = broadcast mode

**15.3** Why can PTP (IEEE 1588) achieve far better accuracy than NTP?
a. It uses TCP
b. Hardware timestamping and on-path clock roles (boundary/transparent clocks) remove network jitter
c. It polls more often only
d. It uses GPS exclusively

**15.4** In PTP, which device recalculates time and acts as a master to downstream slaves?
a. Transparent clock
b. Boundary clock
c. Ordinary slave
d. Stratum-1 server

**15.5** Default HSRP behavior: a router with higher priority comes online after another router is already Active. What happens?
a. It immediately takes over
b. Nothing — HSRP does not preempt by default
c. Both go Active
d. The group resets

**15.6** Which virtual MAC pattern indicates HSRPv1 group 10?
a. 0000.5e00.010a
b. 0000.0c07.ac0a
c. 0007.b400.0a00
d. 0000.0c9f.f00a

**15.7** VRRP differs from HSRP in which ways? (Choose two.)
a. VRRP is an open standard
b. VRRP preempts by default
c. VRRP is Cisco proprietary
d. VRRP cannot track objects

**15.8** What is the purpose of object tracking with an FHRP?
a. Authentication
b. Decrement priority when an upstream interface/route fails so the peer takes over
c. Load balancing
d. Faster hellos

**15.9** A packet from inside host 192.168.1.10 is translated to 203.0.113.5 before leaving. In NAT terms, 203.0.113.5 is the:
a. Inside local address
b. Inside global address
c. Outside local address
d. Outside global address

**15.10** Which configuration enables PAT for an inside network using the outgoing interface address?
a. ip nat inside source list 1 interface Gi0/0 overload
b. ip nat outside source static ...
c. ip nat inside source static tcp ...
d. ip nat pool only

### Answers — Chapter 15
15.1 **a** — Stratum 0 = reference clock, 1 = directly attached server; devices prefer lower stratum.
15.2 **b** — `server` is client mode toward that address; `peer` allows mutual (symmetric) sync.
15.3 **b** — PTP's precision comes from hardware timestamps plus boundary/transparent clocks correcting on-path delay.
15.4 **b** — Boundary clocks terminate and regenerate PTP; transparent clocks just correct residence time in the packet.
15.5 **b** — HSRP preempt is off by default (VRRP's is on). Enable `standby X preempt` for deterministic roles.
15.6 **b** — HSRPv1: 0000.0c07.acXX (XX = group hex). VRRP: 0000.5e00.01XX.
15.7 **a, b** — VRRP = IETF standard, preempts by default, multicasts to 224.0.0.18 (master/backup roles).
15.8 **b** — e.g., `standby 1 track 100 decrement 20` ties gateway role to upstream health.
15.9 **b** — Inside local = private as seen inside; inside global = the inside host as seen from outside.
15.10 **a** — list + interface + `overload` = many-to-one PAT on the egress interface IP.

---

## Chapter 16 — Overlay Tunnels (2.2.b, 2.3.a, 2.3.b)

**16.1** GRE is identified by which IP protocol number, and what notable capability does it add over plain IPsec tunnel mode?
a. 50; encryption
b. 47; can carry multicast/routing protocols and non-IP traffic
c. 89; compression
d. 51; authentication

**16.2** A GRE tunnel flaps repeatedly with "recursive routing" messages. Cause?
a. MTU too large
b. The tunnel destination is being learned through the tunnel itself
c. Keepalives disabled
d. Wrong tunnel key

**16.3** Which IPsec protocol provides encryption, and which provides only integrity/authentication?
a. AH encrypts; ESP authenticates
b. ESP (IP 50) can encrypt and authenticate; AH (IP 51) authenticates only — and breaks with NAT
c. Both encrypt
d. IKE encrypts data traffic

**16.4** IKE's two phases accomplish what?
a. Phase 1: secure management channel (ISAKMP SA); Phase 2: negotiate IPsec SAs for data
b. Phase 1: data; Phase 2: keys
c. Both negotiate routing
d. Phase 2 is optional always

**16.5** Why is GRE over IPsec popular for site-to-site VPNs running an IGP?
a. It's faster than plain GRE
b. GRE carries the routing protocol/multicast; IPsec encrypts the whole GRE package
c. It avoids tunnel interfaces
d. It requires no crypto config

**16.6** In LISP, what do EID and RLOC represent?
a. EID = endpoint identity (host/site prefix); RLOC = the locator (underlay address) of the site's router
b. EID = router loopback; RLOC = host address
c. Both are MAC addresses
d. EID = AS number; RLOC = area

**16.7** Which LISP component answers "where is this EID?" queries from ITRs?
a. The VTEP
b. The Map Server/Map Resolver (mapping system)
c. The RP
d. The route reflector

**16.8** VXLAN encapsulates Layer 2 frames into:
a. GRE over TCP
b. UDP (destination port 4789) with a VXLAN header carrying a 24-bit VNI
c. ESP
d. MPLS labels

**16.9** What scale advantage does the 24-bit VNI provide over 802.1Q?
a. ~16 million segments vs. 4094 VLANs
b. Faster forwarding
c. Longer cables
d. Lower MTU

### Answers — Chapter 16
16.1 **b** — GRE = IP protocol 47; multiprotocol + multicast support is why IGPs can run over it.
16.2 **b** — The route to the tunnel endpoint must stay in the underlay; learning it via the tunnel collapses it.
16.3 **b** — ESP = confidentiality + integrity (NAT-friendly with NAT-T); AH = integrity only, NAT-incompatible.
16.4 **a** — Phase 1 builds the secure negotiation channel; Phase 2 builds the data-plane SAs.
16.5 **b** — Combine GRE flexibility with IPsec confidentiality (or use VTI as a cleaner alternative).
16.6 **a** — LISP splits identity (EID) from location (RLOC), enabling mobility and smaller core tables.
16.7 **b** — ITRs query the MS/MR mapping system — LISP's "DNS for routing." ITR encapsulates; ETR decapsulates.
16.8 **b** — MAC-in-UDP/4789; the VTEP performs encap/decap.
16.9 **a** — 24 bits ≈ 16.7M VNIs vs. 12-bit VLAN IDs (4094 usable).

---

## Chapter 22 — Enterprise Network Architecture (1.1.a, 1.1.b)

**22.1** A two-tier (collapsed core) design combines which layers?
a. Access and distribution
b. Core and distribution
c. Core and access
d. WAN and core

**22.2** When does a three-tier design become appropriate?
a. Never; two-tier always scales
b. When multiple distribution blocks must interconnect (large/multi-building campus)
c. Only with SD-Access
d. When using only Layer 2

**22.3** Which functions belong at the distribution layer in a classic campus? (Choose two.)
a. First-hop gateway/policy boundary between L2 access and L3 core
b. End-device connectivity and PoE
c. Aggregation of access switches and summarization toward the core
d. Internet peering

**22.4** SSO provides what on a dual-supervisor switch?
a. Stateful failover of the control plane to the standby supervisor
b. Load balancing across supervisors
c. Faster STP
d. Power redundancy

**22.5** NSF/graceful restart complements SSO by:
a. Restarting all routing adjacencies immediately
b. Continuing to forward on stale CEF entries while routing protocols resync after switchover
c. Disabling CEF
d. Forcing OSPF to flush LSAs

**22.6** Which are high-availability techniques named in exam topic 1.1.b? (Choose three.)
a. Redundancy
b. FHRP
c. SSO
d. NAT

**22.7** In a routed-access design, the L2/L3 boundary moves to:
a. The core
b. The access layer (no FHRP/STP between access and distribution)
c. The firewall
d. The WAN edge

### Answers — Chapter 22
22.1 **b** — Collapsed core = core + distribution in one layer; fits smaller campuses.
22.2 **b** — A dedicated core simplifies interconnecting many distribution blocks.
22.3 **a, c** — Distribution = aggregation, summarization, policy, gateway boundary.
22.4 **a** — Stateful Switchover keeps state synced to the standby supervisor for sub-second control-plane failover.
22.5 **b** — Forwarding continues during routing protocol recovery (with GR/NSR-aware neighbors).
22.6 **a, b, c** — Redundancy, FHRPs, and SSO are the listed HA techniques.
22.7 **b** — Routed access pushes L3 to the access switch, eliminating FHRP/STP convergence dependencies.

---

## Chapter 23 — Fabric Technologies: SD-Access & Catalyst SD-WAN (1.2.a, 1.2.b, 1.3.a, 1.3.b, 4.5)

**23.1** In SD-Access, which protocols form the control plane and data plane of the fabric?
a. OSPF control, GRE data
b. LISP control plane, VXLAN data plane (with TrustSec/SGTs for policy)
c. BGP control, MPLS data
d. STP control, 802.1Q data

**23.2** Which SD-Access fabric role tracks endpoint-to-edge mappings (the "host database")?
a. Border node
b. Control plane node (LISP MS/MR)
c. Edge node
d. Intermediate node

**23.3** Which fabric role connects the SD-Access fabric to external networks?
a. Edge node
b. Border node
c. Extended node
d. WLC

**23.4** How does traditional (non-fabric) campus connect with SD-Access during migration?
a. It cannot
b. Through the border (often with a fusion device handling VRF route leaking)
c. Via VTP
d. Through the control plane node directly

**23.5** In Catalyst SD-WAN, which component is the control-plane brain distributing routing/policy via OMP?
a. SD-WAN Manager (vManage)
b. vSmart controller
c. vBond orchestrator
d. WAN Edge router

**23.6** Which component authenticates and orchestrates initial onboarding, including NAT traversal?
a. vBond (Validator)
b. vSmart
c. Catalyst Center
d. The RP

**23.7** SD-WAN Manager (vManage) provides:
a. Data plane forwarding
b. Centralized management — config templates/policies, monitoring, the single pane of glass
c. IPsec key generation only
d. Underlay routing

**23.8** Which protocol carries routes, TLOCs, and policy between vSmart and WAN Edge routers?
a. OSPF
b. OMP (Overlay Management Protocol)
c. LISP
d. BGP only

**23.9** Which are commonly cited Catalyst SD-WAN benefits? (Choose two.)
a. Transport independence (MPLS/Internet/LTE) with app-aware routing
b. Centralized policy and zero-touch provisioning
c. Eliminates the need for security
d. Unlimited free bandwidth

**23.10** Catalyst Center's four primary workflow areas are:
a. Plan, Build, Run, Bill
b. Design, Policy, Provision, Assurance
c. Discover, Monitor, Alert, Patch
d. Code, Test, Deploy, Operate

### Answers — Chapter 23
23.1 **b** — LISP (control), VXLAN (data), Cisco TrustSec SGTs (policy) — orchestrated by Catalyst Center.
23.2 **b** — The control plane node runs the LISP Map Server/Resolver tracking EID-to-fabric-edge mappings.
23.3 **b** — Borders translate between fabric and outside (known and unknown/default borders).
23.4 **b** — Border + fusion router/firewall leaks routes between fabric VNs and the legacy network.
23.5 **b** — vSmart distributes routes/policies over OMP; it is the control plane.
23.6 **a** — vBond validates devices and brokers initial control connections (works across NAT).
23.7 **b** — Management plane: templates, software, monitoring, APIs.
23.8 **b** — OMP advertises prefixes, TLOCs, keys, and policy inside the overlay.
23.9 **a, b** — Transport independence, app-aware routing, central policy, ZTP are the headline benefits; limitations include controller dependency and overlay/underlay complexity.
23.10 **b** — Design → Policy → Provision → Assurance (topic 4.5; includes AI-powered assurance workflows).

---

## Chapter 24 — Network Assurance (4.1, 4.2, 4.3, 4.4, 4.5)

**24.1** Syslog severity levels run 0–7. Which is correct?
a. 0 = debugging, 7 = emergency
b. 0 = emergency, 7 = debugging
c. 1 = informational
d. 5 = critical

**24.2** `logging trap 4` sends which messages to the syslog server?
a. Only level 4
b. Levels 0 through 4 (emergency..warning)
c. Levels 4 through 7
d. Nothing until level 7 events occur

**24.3** What advantage does a conditional debug (e.g., `debug ip packet` with an ACL, or `debug condition interface`) give?
a. More verbose output
b. Limits debug output to matching traffic/interfaces, reducing CPU risk on production gear
c. Writes directly to NVRAM
d. Persists across reloads

**24.4** How does traceroute discover the path?
a. Sends pings with increasing payload
b. Sends probes with incrementing TTL; each hop returns ICMP Time Exceeded
c. Queries each router's SNMP agent
d. Uses LLDP

**24.5** Which SNMP version added authentication and encryption, and which mode provides both?
a. v2c; noAuthNoPriv
b. v3; authPriv
c. v1; authNoPriv
d. v3; community strings

**24.6** Flexible NetFlow requires which three components tied together?
a. Flow record, flow exporter, flow monitor (monitor applied to the interface)
b. Sampler, logger, trap
c. Class-map, policy-map, service-policy
d. Tracker, probe, schedule

**24.7** In a flow record, `match` vs `collect` fields differ how?
a. match = key fields that define a unique flow; collect = additional data gathered about it
b. collect defines the flow; match is optional
c. They're interchangeable
d. match is for IPv6 only

**24.8** Which SPAN variant sends mirrored traffic across a Layer 3 network using GRE encapsulation?
a. Local SPAN
b. RSPAN
c. ERSPAN
d. VSPAN

**24.9** RSPAN requires what to carry mirrored traffic between switches?
a. A GRE tunnel
b. A dedicated RSPAN VLAN trunked end to end (with MAC learning disabled in it)
c. A NetFlow exporter
d. An IPsec SA

**24.10** Which IP SLA operation is best for measuring one-way jitter/latency for voice, and what must the far end run?
a. icmp-echo; nothing special
b. udp-jitter; an IP SLA responder on the target device
c. http-get; a web server
d. tcp-connect; a route reflector

### Answers — Chapter 24
24.1 **b** — 0 emergency, 1 alert, 2 critical, 3 error, 4 warning, 5 notification, 6 informational, 7 debugging.
24.2 **b** — The trap level is the maximum (least severe) level sent; lower numbers are more severe and always included.
24.3 **b** — Conditional debugging scopes output — the safe way to debug in production.
24.4 **b** — TTL=1, 2, 3... expirations map the path; the destination answers with port-unreachable (UDP) or echo-reply.
24.5 **b** — SNMPv3 authPriv = authentication (MD5/SHA) + privacy (DES/AES). v1/v2c use plaintext communities.
24.6 **a** — Record (what to match/collect) → exporter (where to send) → monitor (binds them, applied per interface/direction).
24.7 **a** — Key fields distinguish flows; collected fields are extra telemetry (counters, timestamps, etc.).
24.8 **c** — ERSPAN = GRE-encapsulated, routable mirroring; SPAN/RSPAN are L2-bound.
24.9 **b** — The RSPAN VLAN must exist on every switch in the path and be allowed on trunks.
24.10 **b** — udp-jitter gives jitter/one-way delay/MOS; enable `ip sla responder` on the far router.

---

## Chapter 25 — Secure Network Access Control (5.4.a–d)

**25.1** Which component of a threat-defense design analyzes NetFlow telemetry to detect anomalies inside the network?
a. Cisco Secure Network Analytics (Stealthwatch)
b. A standard ACL
c. NTP
d. EtherChannel guard

**25.2** What distinguishes a next-generation firewall from a traditional stateful firewall? (Choose two.)
a. Application-layer visibility/control (AVC) regardless of port
b. Integrated intrusion prevention and threat intelligence
c. Only L3/L4 port-based rules
d. No logging

**25.3** Endpoint security such as Cisco Secure Endpoint (AMP) primarily provides:
a. Switch port security
b. Malware detection/response on hosts with retrospective analysis of file behavior
c. VLAN assignment
d. Routing protection

**25.4** In Cisco TrustSec, what replaces IP-based ACL management for segmentation policy?
a. MAC filtering
b. Security Group Tags (SGTs) enforced by SGACLs
c. VLAN maps only
d. NAT rules

**25.5** TrustSec operates in which three functional phases?
a. Classification, propagation, enforcement
b. Discovery, marking, drop
c. Ingress, transit, egress
d. Design, provision, assure

**25.6** MACsec (802.1AE) provides:
a. End-to-end Layer 3 encryption
b. Hop-by-hop Layer 2 encryption at line rate between directly connected devices
c. Application encryption
d. Wireless encryption

**25.7** Which protocol negotiates MACsec session keys?
a. IKEv2
b. MKA (MACsec Key Agreement)
c. TLS
d. OMP

**25.8** Which solution serves as the policy decision point for identity-based network access (and distributes SGTs)?
a. Catalyst Center only
b. Cisco ISE
c. The DHCP server
d. The WLC

### Answers — Chapter 25
25.1 **a** — Secure Network Analytics baselines flows and flags anomalies (data exfil, lateral movement).
25.2 **a, b** — NGFW = AVC + NGIPS + identity/threat feeds (e.g., Talos) beyond stateful L3/L4 inspection.
25.3 **b** — Host-resident detection/quarantine, including retrospective verdicts on files seen earlier.
25.4 **b** — Policy follows the tag, not the IP — the basis of SD-Access microsegmentation.
25.5 **a** — Classify (assign SGT at ingress/ISE), propagate (inline tagging or SXP), enforce (SGACLs).
25.6 **b** — Per-link L2 encryption; combine links to cover a path (downlink vs. uplink MACsec).
25.7 **b** — MKA handles key exchange (often seeded by 802.1X/EAP or pre-shared CAK).
25.8 **b** — ISE authenticates (802.1X/MAB/WebAuth), authorizes, and assigns SGTs/policy.

---

## Chapter 26 — Device Access Control & Infrastructure Security (5.1.a, 5.1.b, 5.2.a, 5.2.b)

**26.1** Which configuration restricts which source IPs may SSH to the vty lines?
a. An extended ACL applied with `access-class X in` on line vty
b. ip access-group on Gi0/0
c. A prefix list
d. CoPP only

**26.2** Why is `username admin secret ...` preferred over `username admin password ...`?
a. secret allows longer names
b. secret stores a strong hash (MD5/scrypt/SHA-256 by type) instead of a weak/reversible password
c. password is hashed stronger
d. No difference

**26.3** In AAA, what are the three A's?
a. Access, Accounting, Auditing
b. Authentication (who), Authorization (what they may do), Accounting (what they did)
c. Authentication, Association, Access
d. Admission, Authorization, Assurance

**26.4** TACACS+ vs RADIUS for device administration — why is TACACS+ preferred? (Choose two.)
a. TACACS+ (TCP 49) encrypts the entire payload and separates authentication from authorization (per-command control)
b. RADIUS encrypts everything
c. RADIUS (UDP 1812/1813) combines authen/author and encrypts only the password
d. TACACS+ is UDP-based

**26.5** What does `aaa new-model` do, and what's the common safety net with it?
a. Resets all passwords; no safety needed
b. Enables AAA processing; define local fallback (e.g., method list ending in `local`) so you're not locked out if servers fail
c. Disables line passwords permanently
d. Encrypts the config

**26.6** Where should an extended ACL generally be placed, and a standard ACL?
a. Extended near the source; standard near the destination
b. Both at the core
c. Extended near destination; standard near source
d. Placement is irrelevant

**26.7** What is the purpose of CoPP?
a. Rate-limit/protect traffic destined TO the device's control plane (CPU) using an MQC policy on `control-plane`
b. Encrypt management traffic
c. Block all ICMP
d. Police transit data traffic

**26.8** In a CoPP policy, why must you be careful with the class-default and with ACLs matching routing protocols?
a. class-default cannot exist
b. Dropping/over-policing routing or management protocols can break adjacencies and lock you out
c. ACLs aren't supported
d. CoPP only matches ICMP

### Answers — Chapter 26
26.1 **a** — `access-class` on the vty lines filters management access (plus `transport input ssh`).
26.2 **b** — `secret` = irreversible hash; `password` (even with service password-encryption type 7) is trivially reversible.
26.3 **b** — Authentication, Authorization, Accounting.
26.4 **a, c** — Full-payload encryption + granular per-command authorization make TACACS+ the device-admin choice; RADIUS dominates network access (802.1X).
26.5 **b** — Always configure local fallback before pointing login at AAA servers.
26.6 **a** — Extended can be precise, so filter early (near source); standard matches only source, so place near destination.
26.7 **a** — CoPP polices punted/CPU-bound traffic classes (routing, management, ICMP, undesirable).
26.8 **b** — Misclassified BGP/OSPF/SSH under an aggressive policer is a self-inflicted outage; always baseline and use conservative rates.

---

## Chapter 27 — Virtualization (2.1.a, 2.1.b, 2.1.c)

**27.1** Type 1 vs Type 2 hypervisors:
a. Type 1 runs on bare metal (ESXi, KVM/Hyper-V); Type 2 runs atop a host OS (VMware Workstation, VirtualBox)
b. Type 2 is bare metal
c. Both require a host OS
d. Type 1 is desktop-only

**27.2** A virtual machine consists of:
a. Shared kernel processes only
b. Virtual hardware (vCPU, vRAM, vNIC, virtual disk) running a full guest OS isolated by the hypervisor
c. A container image
d. Firmware only

**27.3** What connects VM vNICs to each other and to physical NICs on a host?
a. A virtual switch (vSwitch)
b. An external router only
c. USB passthrough
d. The BIOS

**27.4** How do containers differ from VMs?
a. Containers include a full guest OS
b. Containers share the host kernel and isolate at the process level — lighter and faster to start
c. Containers are slower
d. No difference

**27.5** In NFV terminology, a virtualized router or firewall image (e.g., Catalyst 8000V) is called a:
a. VTEP
b. VNF (virtual network function)
c. VRF
d. vSmart

**27.6** Cisco Enterprise NFV (ENFV) lets a branch:
a. Replace all hardware with cloud services
b. Run router/firewall/WLC functions as VNFs on a single x86 platform (NFVIS)
c. Eliminate WAN links
d. Run only containers

### Answers — Chapter 27
27.1 **a** — Type 1 = bare metal (production data centers); Type 2 = hosted on a desktop OS.
27.2 **b** — Full OS on emulated hardware, isolated by the hypervisor.
27.3 **a** — vSwitches do L2 forwarding in software (typically no STP; loop prevention by design).
27.4 **b** — Shared kernel, process isolation, small images — vs. full OS per VM.
27.5 **b** — VNFs are the virtualized network functions; NFVI/VIM provide infrastructure and management.
27.6 **b** — ENFV consolidates branch services onto NFVIS-based x86 hosts.

---

## Chapter 28 — Network Programmability (4.6, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5)

**28.1** Which HTTP methods map to CRUD operations in a REST API?
a. POST=create, GET=read, PUT/PATCH=update, DELETE=delete
b. GET=create, POST=read
c. PUT=read, GET=update
d. DELETE=create

**28.2** Interpret these REST response codes: 200, 201, 401, 404, 500.
a. 200 OK, 201 Created, 401 Unauthorized, 404 Not Found, 500 Server Error
b. 200 Created, 201 OK, 401 Not Found, 404 Unauthorized, 500 OK
c. All success codes
d. All client errors

**28.3** Which JSON snippet is valid?
a. {"hostname": "SW1", "ports": [1, 2, 3]}
b. {hostname: SW1}
c. {"hostname" = "SW1"}
d. {"ports": (1,2,3)}

**28.4** In JSON, square brackets vs curly braces represent:
a. [ ] = ordered array/list; { } = object of key:value pairs
b. [ ] = object; { } = array
c. Both are arrays
d. Both are objects

**28.5** What is YANG?
a. A transport protocol
b. A data modeling language defining the structure/types of config and state data, used by NETCONF/RESTCONF
c. An encryption standard
d. A Python library

**28.6** NETCONF vs RESTCONF transport and encoding:
a. NETCONF = SSH (port 830) + XML and RPC operations/datastores; RESTCONF = HTTPS + JSON or XML using HTTP verbs
b. NETCONF = HTTP + JSON; RESTCONF = SSH + XML
c. Both use SNMP
d. Both are XML-only

**28.7** Which NETCONF datastore holds config that can be validated/committed before applying?
a. running
b. candidate
c. startup
d. volatile

**28.8** How do you authenticate to the Catalyst Center (DNA Center) REST API?
a. SNMP community
b. POST credentials to the token endpoint, then send the X-Auth-Token header on subsequent calls
c. Telnet login
d. No auth needed

**28.9** Which practices secure a REST API? (Choose three.)
a. TLS/HTTPS for transport encryption
b. Token/OAuth-based authentication with least-privilege authorization
c. Rate limiting/throttling
d. Embedding admin credentials in client-side code

**28.10** In Python, `response = requests.get(url); data = response.json()` — `data["devices"][0]["hostname"]` returns:
a. The "hostname" value of the first element in the "devices" list
b. A syntax error
c. All hostnames
d. The HTTP status code

### Answers — Chapter 28
28.1 **a** — POST create, GET read, PUT replace / PATCH modify, DELETE remove. REST is stateless.
28.2 **a** — 2xx success, 4xx client-side (401 auth missing/bad, 403 forbidden, 404 missing), 5xx server-side.
28.3 **a** — Keys quoted, string values quoted, arrays in [ ], no = signs, no trailing commas.
28.4 **a** — Arrays are ordered lists; objects are unordered key:value maps.
28.5 **b** — YANG models the data; NETCONF/RESTCONF transport it.
28.6 **a** — Know both stacks cold: 830/SSH/XML/RPC vs HTTPS//restconf/data with JSON (YANG-driven URLs).
28.7 **b** — Candidate allows validate/commit (with rollback); running is live; startup survives reboot.
28.8 **b** — Token-based auth: authenticate once, reuse the token in headers.
28.9 **a, b, c** — Encrypt, authenticate/authorize minimally, throttle. Never hardcode credentials.
28.10 **a** — Dict/list indexing into parsed JSON — the pattern ENCOR loves to test.

---

## Chapter 29 — Automation Tools (6.6, 6.7)

**29.1** Where does an EEM applet run?
a. On Catalyst Center
b. Locally on the IOS device itself
c. On an external server
d. In the cloud

**29.2** Which EEM applet reacts to a syslog message and runs commands?
a. event manager applet X / event syslog pattern "..." / action 1.0 cli command "..."
b. kron policy-list
c. ip sla schedule
d. snmp-server enable traps

**29.3** In EEM, actions execute in what order?
a. Random
b. Alphanumeric order of the action labels (1.0, 1.5, 2.0...)
c. Reverse order
d. Simultaneously

**29.4** Agent-based vs agentless: which pairing is correct?
a. Puppet/Chef = agent-based (pull model); Ansible = agentless (push over SSH)
b. Ansible = agent-based; Puppet = agentless
c. All require agents
d. All are agentless

**29.5** Ansible playbooks are written in which format, and what property makes re-running them safe?
a. XML; transactions
b. YAML; idempotency (only changes what differs from desired state)
c. JSON; locking
d. INI; backups

**29.6** Why is an agentless tool often preferred for network devices?
a. Agents are faster
b. Most network OSs can't easily run third-party agents; SSH/API push works with existing access
c. Agentless tools need no credentials
d. It isn't preferred

### Answers — Chapter 29
29.1 **b** — EEM is on-box automation: events (syslog, CLI, timers, SNMP, track) trigger local actions.
29.2 **a** — Classic applet structure: one event statement, ordered action statements.
29.3 **b** — Labels sort alphanumerically — number them with room to insert (1.0, 2.0, ...).
29.4 **a** — Puppet/Chef install agents that pull from a master; Ansible pushes via SSH/NETCONF/API. (SaltStack: agent (minion) or agentless via salt-ssh.)
29.5 **b** — YAML playbooks; idempotent modules converge devices to desired state.
29.6 **b** — No agent footprint on IOS/NX-OS; reuses SSH/HTTPS management plane.

---

*End of Part I — 188 core questions. Generated as original study material keyed to ENCOR 350-401 v1.2 exam topics and the OCG 2nd Edition chapter scope.*

---
---

# Part II — Output Interpretation Questions

"Refer to the exhibit" style — the format Cisco leans on hardest for *interpret*, *troubleshoot*, *configure and verify*, and *diagnose* topics. All outputs are simulated lab scenarios.

---

## Chapter 2 — Spanning Tree Protocol (Scenarios)

**2.9** Refer to the output. Which statement about SW2 is correct?

```
SW2# show spanning-tree vlan 10

VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586
             Address     0017.5a4b.c801
             Cost        4
             Port        24 (GigabitEthernet1/0/24)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0023.04ee.be01

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- ----
Gi1/0/23            Altn BLK 4         128.23   P2p
Gi1/0/24            Root FWD 4         128.24   P2p
```

a. SW2 is the root bridge for VLAN 10
b. SW2 is not the root; it reaches the root via Gi1/0/24 at cost 4, and Gi1/0/23 is a blocked alternate path
c. Gi1/0/23 is down
d. The root bridge has priority 32778

### Answers — Chapter 2 (Scenarios)
2.9 **b** — Root ID and Bridge ID differ, so SW2 is not root. Gi1/0/24 is the root port (FWD); Gi1/0/23 is an alternate (Altn/BLK) backup path. On the root bridge, Root ID = Bridge ID and the output adds "This bridge is the root."

---

## Chapter 3 — Advanced STP Tuning (Scenarios)

**3.8** Refer to the log. What happened, and what is required to restore the port (assuming no recovery timer is configured)?

```
%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Gi1/0/5 with
 BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Gi1/0/5,
 putting Gi1/0/5 in err-disable state
```

a. Root guard blocked the port; it recovers when superior BPDUs stop
b. A BPDU arrived on a BPDU guard port; the port is err-disabled and needs shutdown/no shutdown (or errdisable recovery) to come back
c. The port flapped due to UDLD
d. BPDU filter dropped a BPDU; no action needed

### Answers — Chapter 3 (Scenarios)
3.8 **b** — BPDU guard err-disables on any received BPDU (a switch was likely plugged into an access port). Unlike root guard, it does not self-recover; bounce the port or configure `errdisable recovery cause bpduguard`.

---

## Chapter 5 — VLAN Trunks and EtherChannel Bundles (Scenarios)

**5.9** Refer to the output. Why is the port-channel not forming?

```
SW1# show etherchannel summary
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        ...
Group  Port-channel  Protocol    Ports
------+-------------+-----------+--------------------------
1      Po1(SD)        LACP      Gi1/0/1(I)   Gi1/0/2(I)
```

a. The ports are err-disabled
b. SW1 runs LACP but its member ports are stand-alone (I) — the far side is not negotiating LACP (e.g., mode on or PAgP)
c. The VLANs are pruned
d. Po1 needs an IP address

**5.10** Both switch ports are configured identically as shown. Why is the link an access port?

```
SW1# show interfaces Gi1/0/13 switchport | include Mode
Administrative Mode: dynamic auto
Operational Mode: static access

SW2# show interfaces Gi1/0/13 switchport | include Mode
Administrative Mode: dynamic auto
Operational Mode: static access
```

a. DTP is disabled
b. Both sides are dynamic auto — neither initiates DTP negotiation, so no trunk forms
c. The native VLANs mismatch
d. VTP pruned the trunk

**5.11** Refer to the log. What is the most likely cause?

```
%EC-5-CANNOT_BUNDLE2: Gi1/0/2 is not compatible with Gi1/0/1
 and will be suspended (speed of Gi1/0/2 is 100M, Gi1/0/1 is 1000M)
```

a. LACP system priority mismatch
b. A member-port attribute mismatch — Gi1/0/2 negotiated a different speed, so it is suspended from the bundle
c. Spanning tree blocked the port
d. The port-channel number is wrong

### Answers — Chapter 5 (Scenarios)
5.9 **b** — (I) stand-alone means LACP got no partner response. Fix the far end to LACP active/passive (or both sides static on).
5.10 **b** — auto+auto is the classic non-trunk combo: both passively wait. Set one side desirable, or hardcode `switchport mode trunk`.
5.11 **b** — All bundle members must match speed/duplex/mode/VLAN settings; mismatched ports get suspended (s/(s) in the summary).

---

## Chapter 6 — IP Routing Essentials (Scenarios)

**6.9** Refer to the routing table. Which next hop is used for a packet to 10.1.1.99?

```
R1# show ip route | include 10.
D        10.0.0.0/8 [90/130816] via 192.168.12.2
O        10.1.0.0/16 [110/20] via 192.168.13.3
S        10.1.1.0/24 [1/0] via 192.168.14.4
```

a. 192.168.12.2, because EIGRP has the lowest AD
b. 192.168.13.3, because OSPF metric 20 is lowest
c. 192.168.14.4, because 10.1.1.0/24 is the longest prefix match
d. The packet is dropped (ambiguous routes)

**6.10** OSPF and a static route to the same prefix are configured. Why does the routing table show only the OSPF route, and when would that change?

```
R1# show running-config | include ip route
ip route 172.16.5.0 255.255.255.0 10.9.9.9 250

R1# show ip route 172.16.5.0
Routing entry for 172.16.5.0/24
  Known via "ospf 1", distance 110, metric 65, type intra area
```

a. The static route is malformed
b. The static is a floating route (AD 250 > 110); it installs only if the OSPF route disappears
c. OSPF always beats static routes
d. 10.9.9.9 is unreachable

### Answers — Chapter 6 (Scenarios)
6.9 **c** — Longest prefix match is evaluated BEFORE AD or metric. /24 beats /16 and /8 regardless of protocol.
6.10 **b** — AD 250 makes it a backup. AD only breaks ties between sources for the SAME prefix; the floating static installs the moment OSPF withdraws 172.16.5.0/24.

---

## Chapter 7 — EIGRP (Scenarios)

**7.8** Refer to the topology table. Is the path via 10.1.13.3 a feasible successor?

```
R1# show ip eigrp topology 10.20.0.0/16
EIGRP-IPv4 Topology Entry for AS(100)/ID(1.1.1.1) for 10.20.0.0/16
  State is Passive, Query origin flag is 1, 1 Successor(s), FD is 131072
        via 10.1.12.2 (131072/130816), GigabitEthernet0/1
        via 10.1.13.3 (196608/131328), GigabitEthernet0/2
```

a. Yes — its total metric 196608 is acceptable
b. No — its reported distance 131328 is not lower than the FD 131072, so the feasibility condition fails
c. Yes — any second path is a feasible successor
d. No — it is on a different interface

### Answers — Chapter 7 (Scenarios)
7.8 **b** — FS requires RD < FD. Here RD (second number, 131328) ≥ FD (131072), so this path waits for DUAL computation if the successor fails. The numbers in parentheses are (FD via this path / neighbor's RD).

---

## Chapter 8 — OSPF (Scenarios)

**8.10** Refer to the output. What is the most likely cause?

```
R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address      Interface
2.2.2.2           1   EXSTART/DR      00:00:33    10.1.12.2    Gi0/0

%OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on Gi0/0 from EXSTART to DOWN,
 Neighbor Down: Too many retransmissions
```

a. Hello timer mismatch
b. MTU mismatch between the two interfaces — database description exchange keeps failing
c. Wrong area ID
d. Authentication failure

**8.11** Refer to the debug. What prevents the adjacency?

```
R1# debug ip ospf hello
OSPF-1 HELLO Gi0/0: Rcv hello from 2.2.2.2 area 0 10.1.12.2
OSPF-1 HELLO Gi0/0: Mismatched hello parameters from 10.1.12.2
OSPF-1 HELLO Gi0/0: Dead R 40 C 120, Hello R 10 C 30
```

a. Area mismatch
b. Hello/dead interval mismatch — received 10/40 vs configured 30/120 (often a broadcast vs. non-broadcast network type mismatch)
c. Duplicate router ID
d. Passive interface

**8.12** Refer to the output on a broadcast segment. Does the 2WAY state indicate a problem?

```
R4# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address      Interface
3.3.3.3           1   2WAY/DROTHER    00:00:31    10.1.0.3     Gi0/1
1.1.1.1           1   FULL/DR         00:00:34    10.1.0.1     Gi0/1
2.2.2.2           1   FULL/BDR        00:00:38    10.1.0.2     Gi0/1
```

a. Yes — all neighbors must reach FULL
b. No — R4 and 3.3.3.3 are both DROTHERs; on broadcast networks DROTHERs go FULL only with the DR and BDR
c. Yes — 3.3.3.3 has an MTU mismatch
d. No — 2WAY means the link is down intentionally

### Answers — Chapter 8 (Scenarios)
8.10 **b** — Stuck EXSTART/EXCHANGE with retransmission failures is the signature MTU-mismatch symptom. Match MTUs or use `ip ospf mtu-ignore`.
8.11 **b** — The debug spells it out: R = received (10/40, broadcast defaults), C = configured (30/120, NBMA defaults). Timers (and usually network types) must agree.
8.12 **b** — Expected behavior. DROTHER↔DROTHER pairs stop at 2WAY by design; full adjacencies form only with the DR/BDR.

---

## Chapter 9 — Advanced OSPF (Scenarios)

**9.9** Refer to the routing table entries. What do the markings on the two routes indicate?

```
R5# show ip route ospf
O IA  172.16.30.0/24 [110/35] via 10.5.5.1, 00:10:11, Gi0/0
O E2  198.51.100.0/24 [110/20] via 10.5.5.1, 00:10:11, Gi0/0
```

a. Both are intra-area routes
b. IA = inter-area route learned via an ABR (Type 3 LSA); E2 = external route with a fixed metric of 20 that does not grow along the internal path
c. IA = external; E2 = stub route
d. E2's metric includes the full internal cost

### Answers — Chapter 9 (Scenarios)
9.9 **b** — O IA comes from another area through an ABR. O E2 (the redistribution default) keeps its seed metric end to end; E1 would add internal cost as the route propagates.

---

## Chapter 11 — BGP (Scenarios)

**11.9** Refer to the output. What does the "Active" state actually mean here?

```
R1# show ip bgp summary
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.1.1.2        4 65002       0       0        1    0    0 never    Active
```

a. The session is established and actively exchanging routes
b. The session is NOT established — R1 is actively retrying the TCP connection (check reachability, neighbor IP/AS, TTL)
c. The neighbor is in a different VRF
d. BGP is converging normally; wait

**11.10** Refer to the output. The session is up, but no routes are arriving from the peer. Where do you look first?

```
R1# show ip bgp summary
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.1.1.2        4 65002     124     130        5    0    0 01:58:23        0
```

a. The TCP session — it is down
b. The session is Established (state column shows a prefix count); investigate whether the peer is advertising anything and whether inbound filters are stripping routes
c. The AS number — it must match ours
d. The Up/Down timer — it must reach 24 hours

### Answers — Chapter 11 (Scenarios)
11.9 **b** — "Active" is the most misleading word in BGP: it means trying (and failing) to establish TCP. Idle/Active cycling = fix reachability or neighbor config.
11.10 **b** — When State/PfxRcd shows a NUMBER, the session is Established. 0 prefixes for 2 hours points to the peer's outbound policy or your inbound filters — not the session.

---

## Chapter 12 — Advanced BGP: Best Path (Scenarios)

**12.7** Refer to the output. Why was path #2 selected as best?

```
R1# show ip bgp 203.0.113.0/24
BGP routing table entry for 203.0.113.0/24, version 14
Paths: (2 available, best #2)
  65010 65020
    192.168.1.1 from 192.168.1.1 (10.0.0.1)
      Origin IGP, localpref 100, metric 0, valid, external
  65030
    192.168.2.2 from 192.168.2.2 (10.0.0.2)
      Origin IGP, localpref 100, metric 0, valid, external, best
```

a. Lower router ID
b. Weight and local preference tie, so the shorter AS_Path (one AS vs. two) wins
c. Lower MED
d. It was learned first

### Answers — Chapter 12 (Scenarios)
12.7 **b** — Both paths show localpref 100 (and default weight). Next decision point in the algorithm is AS_Path length: "65030" (1 hop) beats "65010 65020" (2 hops).

---

## Chapter 13 — Multicast (Scenarios)

**13.11** Multicast from source 10.1.50.10 arrives on interface Gi0/1. Refer to the output — what happens to the stream?

```
R3# show ip rpf 10.1.50.10
RPF information for ? (10.1.50.10)
  RPF interface: GigabitEthernet0/2
  RPF neighbor: ? (10.1.23.2)
  RPF route/mask: 10.1.50.0/24
  RPF type: unicast (ospf 1)
```

a. It is forwarded normally
b. It fails the RPF check and is dropped — the unicast path back to the source is via Gi0/2, not Gi0/1 where the traffic arrived
c. It is flooded to all PIM neighbors
d. It is tunneled to the RP

### Answers — Chapter 13 (Scenarios)
13.11 **b** — RPF accepts multicast only on the interface the router would use to reach the source via unicast routing. Arriving on any other interface = drop. Fix the unicast topology or the multicast tree, not the symptom.

---

## Chapter 14 — QoS (Scenarios)

**14.9** Refer to the configuration. During congestion on Gi0/0, how is VOICE traffic treated?

```
policy-map WAN-EDGE
 class VOICE
  priority 1000
 class CRITICAL-DATA
  bandwidth 2000
 class class-default
  fair-queue
  random-detect dscp-based

interface GigabitEthernet0/0
 service-policy output WAN-EDGE
```

a. Guaranteed a 1000 kbps minimum, sharing leftover bandwidth
b. Served first from a strict-priority (LLQ) queue but policed to 1000 kbps during congestion
c. Shaped to 1000 kbps at all times
d. Dropped first because priority queues drop early

**14.10** Refer to the configuration. What happens to SCAVENGER traffic that exceeds 8000 bps?

```
policy-map EDGE-IN
 class SCAVENGER
  police 8000 conform-action transmit exceed-action drop
```

a. It is buffered and sent later
b. It is dropped immediately — policing does not queue or delay excess traffic
c. It is re-marked to EF
d. It is fragmented

### Answers — Chapter 14 (Scenarios)
14.9 **b** — `priority` = LLQ: strict priority with a built-in conditional policer so voice can't starve other classes. `bandwidth` (CRITICAL-DATA) is a CBWFQ minimum guarantee without strict priority.
14.10 **b** — Police drops (or re-marks) on the spot; shape would buffer. The exceed-action here is explicit: drop.

---

## Chapter 15 — IP Services (Scenarios)

**15.11** Refer to the output. The local router's priority is then raised to 110. What happens, and why?

```
R2# show standby brief
                     P indicates configured to preempt.
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Vl10        10   90    Standby  10.1.10.3       local           10.1.10.1
```

a. R2 immediately becomes Active
b. Nothing changes until the current Active fails — the P column is empty, so preemption is not configured
c. The group renegotiates and both go Active
d. The virtual IP moves to R2

**15.12** Refer to the output. Which statement is correct?

```
R1# show ip nat translations
Pro  Inside global       Inside local        Outside local       Outside global
tcp  203.0.113.5:34012   192.168.1.10:34012  198.51.100.7:443    198.51.100.7:443
tcp  203.0.113.5:51877   192.168.1.22:51877  198.51.100.9:443    198.51.100.9:443
```

a. This is static NAT — one-to-one mappings
b. Multiple inside hosts share inside global 203.0.113.5 distinguished by port — this is PAT (overload); 192.168.1.10 appears externally as 203.0.113.5
c. 198.51.100.7 is the inside global address
d. The translations are broken — ports should differ from the local ports

**15.13** Refer to the output. What does it tell you?

```
R4# show ntp status
Clock is unsynchronized, stratum 16, no reference clock
```

a. R4 is a stratum-16 authoritative server
b. R4 has not synchronized to any NTP source — stratum 16 is the "unsynchronized" marker; check ntp server config and reachability
c. NTP is working normally
d. The hardware clock failed

### Answers — Chapter 15 (Scenarios)
15.11 **b** — HSRP does not preempt by default. Higher priority matters only at election time or with `standby 10 preempt` configured.
15.12 **b** — Same inside global IP + unique ports = PAT. Inside global = how inside hosts appear outside; outside global = the real destination.
15.13 **b** — Stratum 16 means "no valid time source." Verify the server address, reachability, and (if used) NTP authentication; sync also takes several minutes to settle.

---

## Chapter 16 — Overlay Tunnels (Scenarios)

**16.10** Refer to the outputs. Why is the tunnel down?

```
R1# show interface Tunnel0
Tunnel0 is up, line protocol is down
  Hardware is Tunnel
  Tunnel source 10.1.1.1, destination 10.2.2.2

R1# show ip route 10.2.2.2
% Network not in table
```

a. The tunnel key mismatches
b. R1 has no route to the tunnel destination 10.2.2.2, so the tunnel cannot be brought up
c. GRE keepalives are unsupported
d. The MTU is too small

### Answers — Chapter 16 (Scenarios)
16.10 **b** — A GRE tunnel needs a valid underlay route to its destination. (And remember: if that route later points THROUGH the tunnel itself, you get recursive routing flaps.)

---

## Chapter 24 — Network Assurance (Scenarios)

**24.11** Refer to the syslog message. What is its severity?

```
*Jun  9 14:02:11.123: %LINEPROTO-5-UPDOWN: Line protocol on Interface
 GigabitEthernet1/0/7, changed state to down
```

a. 5 = critical
b. 5 = notification — the number after the facility (LINEPROTO) is the severity level
c. 7 = debugging, from the "1/0/7"
d. 2 = critical, from "%...-2-"

**24.12** Refer to the traceroute. What is the most accurate interpretation?

```
R1# traceroute 198.51.100.50
  1 10.1.12.2    1 msec  1 msec  1 msec
  2 10.1.23.3    2 msec  2 msec  2 msec
  3  *  *  *
  4  *  *  *
```

a. The destination is definitely unreachable
b. Hops 3+ are not returning ICMP TTL-exceeded messages — a device may be filtering ICMP or rate-limiting replies; it does not necessarily mean user traffic is dropped there
c. Hop 3 has high CPU
d. The route loops between hops 3 and 4

**24.13** Flexible NetFlow is configured as shown, but the cache is always empty. What is missing?

```
flow record REC
 match ipv4 source address
 match ipv4 destination address
 collect counter bytes

flow exporter EXP
 destination 10.99.99.10
 transport udp 2055

flow monitor MON
 record REC
 exporter EXP
```

a. A sampler
b. The monitor was never applied to an interface (e.g., `ip flow monitor MON input` under Gi0/0)
c. The exporter port is wrong
d. `collect counter packets` is required

**24.14** Refer to the output of a udp-jitter probe targeting another router. What is the most likely fix?

```
R1# show ip sla statistics 10
IPSLAs Latest Operation Statistics

IPSLA operation id: 10
Type of operation: udp-jitter
        Latest operation return code: Timeout
Number of successes: 0
Number of failures: 119
```

a. Increase the frequency
b. Enable `ip sla responder` on the target router — udp-jitter requires a responder
c. Change to ICMP jitter
d. Reboot the source router

### Answers — Chapter 24 (Scenarios)
24.11 **b** — Format is %FACILITY-SEVERITY-MNEMONIC. 5 = notification (0 emer, 1 alert, 2 crit, 3 err, 4 warn, 5 notif, 6 info, 7 debug).
24.12 **b** — Asterisks mean no TTL-exceeded reply came back — commonly ICMP filtering/rate-limiting, not proof of packet loss for real traffic (which the exam loves to test).
24.13 **b** — Record + exporter + monitor exist, but a flow monitor collects nothing until applied to an interface with a direction.
24.14 **b** — Timeouts with 0 successes on udp-jitter = no responder answering. The responder must be explicitly enabled on the far-end IOS device.

---

## Chapter 26 — Device Access Control & Infrastructure Security (Scenarios)

**26.9** Refer to the configuration. Which sessions can reach the CLI of this switch?

```
ip access-list extended MGMT
 10 permit tcp 10.1.50.0 0.0.0.255 any eq 22
 20 deny   ip any any log

line vty 0 4
 access-class MGMT in
 transport input ssh
 login local
```

a. SSH and Telnet from anywhere
b. SSH only, and only from sources in 10.1.50.0/24 (authenticated against local usernames); everything else is denied and logged
c. Telnet only from 10.1.50.0/24
d. SSH from anywhere, because access-class only filters Telnet

**26.10** Refer to the configuration. The TACACS+ servers become unreachable. What happens to logins?

```
aaa new-model
aaa authentication login default group tacacs+ local
```

a. All logins fail until a server returns
b. Logins fall back to the local username database — the method list tries TACACS+ first, then local when servers don't respond
c. The enable password is used
d. Authentication is bypassed entirely

### Answers — Chapter 26 (Scenarios)
26.9 **b** — `access-class in` filters vty access by source, `transport input ssh` kills Telnet, `login local` authenticates against local users. The deny logs everything else.
26.10 **b** — Method lists are tried in order; "local" is the lifeline. Note the distinction: fallback occurs when servers are UNREACHABLE, not when they REJECT a login.

---

## Chapter 28 — Network Programmability (Scenarios)

**28.11** Refer to the API exchange. What should the script do next?

```
GET https://catalystcenter.example.com/dna/intent/api/v1/network-device
--- response ---
HTTP/1.1 401 Unauthorized
{
  "response": {
    "errorCode": "INVALID_CREDENTIALS",
    "message": "Authentication token is invalid or expired"
  }
}
```

a. Retry the same request — 401 is a transient server error
b. Re-authenticate to the token endpoint and resend with a fresh X-Auth-Token header — 401 means the credentials/token were missing, invalid, or expired
c. Treat it as success; data follows
d. Switch from GET to POST

**28.12** Refer to the RESTCONF response. What is the state of GigabitEthernet1?

```
HTTP/1.1 200 OK
Content-Type: application/yang-data+json

{
  "ietf-interfaces:interface": {
    "name": "GigabitEthernet1",
    "type": "iana-if-type:ethernetCsmacd",
    "enabled": false,
    "ietf-ip:ipv4": {
      "address": [{ "ip": "10.0.0.1", "netmask": "255.255.255.0" }]
    }
  }
}
```

a. The request failed
b. The request succeeded (200), and the interface is administratively disabled ("enabled": false) with IP 10.0.0.1/24 configured
c. The interface is up with no IP
d. 200 means the interface is operationally up

### Answers — Chapter 28 (Scenarios)
28.11 **b** — 401 = authentication problem (vs 403 = authenticated but not allowed). Catalyst Center tokens expire; re-auth and retry is the standard pattern.
28.12 **b** — The status code describes the API call, not the interface. The YANG data shows admin state false = shutdown, with an IPv4 address configured.
