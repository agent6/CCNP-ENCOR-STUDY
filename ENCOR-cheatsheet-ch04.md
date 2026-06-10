# Ch 4 Cheat Sheet — Multiple Spanning Tree Protocol

**ENCOR v1.2 relevance:** MST is named directly in topic **3.1.c** ("configure and verify common Spanning Tree Protocols (RSTP, **MST**)"). Closes out the STP trilogy (Ch 2 fundamentals, Ch 3 tuning/guards). Know the region-matching rules, the IST, and the two interop designs.

---

## Why MST exists — the STP evolution

| Mode | Trees | Trade-off |
|---|---|---|
| CST (802.1D) | **One topology for every VLAN** | No per-VLAN load sharing — all traffic follows the same blocked/forwarding ports |
| PVST/PVST+ | One tree **per VLAN** | Full tuning flexibility, but thousands of VLANs = thousands of topologies: BPDU processing and reconvergence burden on the CPU |
| **MST (802.1S)** | One tree per **instance**; many VLANs map to each instance | Per-VLAN-group engineering with only a handful of topologies to compute |

MST's two exam-stated wins: **traffic load balancing for groups of VLANs** + **reduced CPU/memory** in VLAN-heavy environments.

## MST region — the matching trio

Switches belong to the same region only when ALL THREE match:

1. **Region name**
2. **Revision number** — NOT locally significant, NOT auto-propagated; you set the same value on every switch by hand
3. **VLAN-to-instance mapping table**

⚠ The root bridge does **not** advertise the mappings — every switch must be configured identically (config management matters; a mismatch silently splits the region).

To the outside world, the entire region presents itself as **one virtual switch**. External switches calculate STP against the region as if it were a single hop — which is why an outside switch two physical hops from the root may still block a port (the region "hop" counts as one bridge).

## IST and MSTIs

- **IST = instance 0.** Always exists; runs on **every port in the region regardless of access VLAN**.
- Other instances (MSTIs, typically 1–15; ≥16 instances supported) carry whatever VLANs you map to them. **By default all 4094 VLANs live in instance 0.**
- The IST BPDU carries the other instances' information **nested inside it** — one BPDU set for the whole region no matter how many instances. That's the BPDU-reduction magic.
- MSTIs never interact outside the region; only the IST speaks at boundaries.

## Configuration (the 5-step recipe)

```
spanning-tree mode mst
spanning-tree mst 0 root primary        ! per-instance priority (24576/28672, 4096 steps)
spanning-tree mst 1 root primary
spanning-tree mst configuration         ! the region-defining submode:
 name ENTERPRISE_CORE
 revision 2
 instance 1 vlan 10,20
 instance 2 vlan 99
```

Per-instance tuning mirrors PVST+ (MST is fully tunable): `spanning-tree mst <N> cost <c>` and `spanning-tree mst <N> port-priority <p>` on interfaces.

Note from outputs: MST uses **long-mode costs** (1 Gbps = 20000, not 4).

## Verification

| Command | Look for |
|---|---|
| `show spanning-tree mst configuration` | Name, revision, instance/VLAN map — instance 0 shows "everything else" (e.g., 1-9,11-19,21-98,100-4094) |
| `show spanning-tree` | Sections per MST instance (MST0, MST1…); protocol shows **mstp**; priority = base + **instance number** as the sys-id-ext (24576 + instance 2 = 24578) |
| `show spanning-tree mst [N]` | Topology per instance WITH "vlans mapped" column — easiest troubleshooting view; root line says "this switch for the **CIST**" on instance 0 |
| `show spanning-tree mst interface X` | Per-instance role/state on one port, plus edge/guard/BPDU filter/guard flags and **Boundary** status |

## The two classic MST misconfigurations

**1. User VLANs left on the IST.** The IST spans every link in the region, so its topology is computed across ALL ports — including links you thought were dedicated to one VLAN. A VLAN mapped to instance 0 can end up blocked on the very access link it was supposed to use. Fixes: map user VLANs to a real MSTI, or allow IST VLANs on all inter-switch trunks.

**2. Pruning trunk VLANs that splits an instance.** The MSTI topology is computed per instance, not per VLAN. If you prune VLAN 20 off one trunk and VLAN 10 off another while both live in the same instance, the instance topology no longer matches where the VLANs can actually flow → blackholed traffic. **Rule: prune all of an MSTI's VLANs together on a trunk, or none.**

## Region boundary & PVST+ interop

A **boundary port** connects to a different MST region or to a PVST+/RSTP (802.1D/802.1W) switch.

- Outbound: **PVST simulation** replicates the IST-derived BPDU into per-VLAN PVST+ BPDUs (one per VLAN), since PVST+ can't parse IST BPDUs.
- Inbound: only the **VLAN 1** PVST+ BPDU is mapped into the IST; the rest are ignored for topology math.

Only two supported designs (all-or-nothing):

| Design | Behavior |
|---|---|
| **MST region is root for ALL VLANs** (preferred) | Region floods superior BPDUs for every VLAN; the external PVST+ switches do the blocking. External switch can still load-balance by tuning its per-VLAN uplink costs. |
| **MST region is root for NO VLAN** | Boundary ports block or forward **for all VLANs as one** — no per-VLAN load balancing possible, since everything rides the single IST view. |

The enforcement mechanism: if a boundary port hears a **better BPDU for some specific VLAN** (i.e., an in-between case), the **PVST simulation check** fails and the port is blocked (root-inconsistent style) to guarantee loop-freedom — even if that isolates downstream switches.

## Exam-day nuggets

- MST solves per-VLAN-group load balancing AND CPU/memory burden (DIKTA 1: A, B). VLANs map to **instances** (DIKTA 2).
- CST and 802.1D share the trait of **one topology** (DIKTA 3).
- VLAN-to-instance mappings are **not advertised** by the root — configure every switch (DIKTA 4: false).
- The revision number must **match region-wide** — it is not locally significant (DIKTA 5: false).
- MST is tunable like PVST+/RSTP — priority, cost, port-priority per instance (DIKTA 6: true).
- Interop is binary: region is root for **all** VLANs or the PVST+ side is root for **all** VLANs (DIKTA 7: A, C).
- Region trio: **name + revision + mappings**. Two of three matching = still two different regions.
- Instance 0 = IST, runs everywhere, carries everyone's BPDUs; "this switch for the CIST" in output = root of the inter-region tree.
