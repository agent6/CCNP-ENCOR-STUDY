# Ch 27 Cheat Sheet — Virtualization

**ENCOR v1.2 relevance:** Topic **2.1 — describe device virtualization technologies: (a) hypervisor type 1 and 2, (b) virtual machine, (c) virtual switching**. Describe-level. The NFV/ENFV half supports the broader virtualization story and supplies several easy definition questions.

---

## Why virtualize servers

Bare-metal servers (one OS, one app, one user) historically ran at ~10–25% CPU utilization. VMs and containers reclaim that waste.

## Virtual machines & hypervisors (2.1.a / 2.1.b)

- **VM = a software emulation of a PHYSICAL server with an operating system** — virtual CPU, RAM, NIC, disk; the app can't tell the difference. The **hypervisor** creates VMs and abstracts the hardware so many VMs run concurrently.

| Hypervisor | Runs on | Examples | Use |
|---|---|---|---|
| **Type 1** | **Bare metal** (directly on hardware) | ESXi/vSphere, Hyper-V, XenServer, **KVM** | Data center standard |
| **Type 2** | **On a host OS** | VMware Fusion/Workstation, VirtualBox | Client/desktop |

- VM migration moves a running VM between hosts with transactional integrity → zero-downtime hardware maintenance and HA (failed host's VMs respawn elsewhere).

## Containers (the contrast set)

- **A container = an isolated environment where a containerized app runs** — the app plus exactly the dependencies (bins/libs) it needs. NOT "a lightweight VM": containers **share the host OS kernel** and include **no guest OS**.
- **Container image** = the file (app + dependencies) created by a container engine; it becomes a container when run → extreme portability, no "works on my machine" drift.
- Startup: VM must boot a guest OS (minutes); container leverages the already-running kernel (seconds).
- **Container engines: Docker** (dominant), **rkt**, **LXD**, Linux-VServer, Open Container Initiative, Windows Containers. (A "vSphere hypervisor" is the distractor.)

## Virtual switching (2.1.c)

- **vSwitch = a software version of a physical LAYER 2 Ethernet switch** — connects VM vNICs to each other and to the physical NICs (pNICs).
- Rules worth knowing: **multiple vSwitches per host are supported**, but traffic cannot flow directly vSwitch-to-vSwitch, and two vSwitches can't share one pNIC (in the book's example, inter-vSwitch traffic transits a virtual firewall VNF).
- **Distributed virtual switching** aggregates the vSwitches of a server cluster into one logical switch: centralized config, policies/statistics that migrate with live VM moves, cluster-wide consistency.
- **Containers need vSwitches too** (virtual bridges): Docker creates **Docker0** (default 172.17.0.0/16), giving each container a veth/eth0 and a private IP — same-node containers talk; cross-node reachability needs routing/overlays or an orchestrator (**Kubernetes**).
- Popular vSwitches: **Open vSwitch (OVS)**, VMware VSS/VDS/NSX, Hyper-V Virtual Switch, Libvirt.

## NFV — the ETSI framework

**NFV** = ETSI's architectural framework for decoupling **network functions (NF)** from proprietary appliances and running them as software on standard **x86** servers. Benefits echo virtualization generally: lower capex/opex, faster time-to-market, elasticity, vendor openness.

| Component | Role |
|---|---|
| **VNF** | The virtualized network function itself — typically a VM on a hypervisor (Catalyst 8000V router, ASA virtual / FTD virtual firewall, vWAAS, 9800-CL WLC) — L4–7 AND L2/L3 functions |
| **NFVI** | All hardware + software hosting the VNFs |
| **VIM** | Manages NFVI resources (compute/storage/network), lifecycle, and **service chaining** |
| EM/EMS | Per-VNF FCAPS management |
| **MANO** | NFV **orchestrator** (creates/maintains/tears down end-to-end VNF services) + VNF manager |
| OSS/BSS | SP-grade operations and business systems |

**Service chaining** = connecting two or more VNFs in sequence (LB → firewall → WAN-opt → router) to build a service.

**VNF performance I/O ladder** (how VNF traffic bypasses bottlenecks): standard **OVS** (kernel-space switching) → **OVS-DPDK** (user-space fast path, polls the NIC) → **PCI passthrough** (VNF owns the whole pNIC) → **SR-IOV** — the pNIC presents **VFs (virtual functions)** to VNFs and a **PF (physical function)**, with a hardware virtual Ethernet bridge; multiple VNFs share one NIC at near-line rate. Traffic patterns matter: north–south (in/out via pNIC) vs east–west (VNF-to-VNF chains).

## Cisco Enterprise NFV (ENFV)

Collapse the branch hardware stack (router, firewall, WLC, WAN-opt…) into VNFs on one x86 box. Four parts mapped to ETSI:

1. **MANO = Cisco DNA/Catalyst Center** — network profiles per branch (interfaces, VNFs + CPU/memory + service-chain parameters, config templates), Plug and Play zero-touch onboarding.
2. **VNFs** — Cisco (Catalyst 8000V, vEdge, ASAv/FTDv, vWAAS, 9800-CL, ThousandEyes, Meraki vMX) + broad third-party support (Palo Alto, Fortinet, F5, Windows/Linux servers…).
3. **NFVIS** — the host OS: **standard Linux** packaged with **KVM hypervisor + OVS vSwitch**, VM lifecycle management (ESC-Lite: bring-up, monitoring, auto-restart, alarms), PnP client, REST/CLI/HTTPS/NETCONF orchestration interfaces, local web portal, RBAC, resource manager.
4. **Hardware** — x86 hosts: **ENCS** (Enterprise Network Compute System) and Catalyst 8200 Edge uCPE.

Benefits: fewer boxes/truck rolls, minutes-fast service rollout, central management, VM-style flexibility (snapshots, moves, upgrades).

## Exam-day nuggets

- VM = software emulation of a **physical** server **with an OS** (DIKTA 1); container = **isolated runtime environment**, not a lightweight VM (DIKTA 2); engines = **Docker, rkt, LXD** (DIKTA 3).
- vSwitch = software **Layer 2** switch (DIKTA 4); a host can run **multiple** vSwitches (DIKTA 5: false that only one); **containers DO need vSwitches/bridges** to communicate (DIKTA 6: false).
- **VNF** = the virtual function itself; **NFV** = the ETSI framework; **NFVI** = the infrastructure; **NFVIS** = Cisco's Linux-based host OS (DIKTA 7, 8, 12).
- VNF-to-VNF chains = **service chaining** (DIKTA 9). The VF/PF I/O technology = **SR-IOV** (DIKTA 10). ENFV's orchestrator = **DNA/Catalyst Center** (DIKTA 11).
- Type 1 vs Type 2 in one line: bare metal vs hosted-on-an-OS.
- Containers share the kernel → seconds to start; VMs boot a guest OS → minutes.
