# Ch 23 Cheat Sheet — Fabric Technologies (SD-Access & Catalyst SD-WAN)

**ENCOR v1.2 relevance:** Two full exam topics — **1.3 (Cisco SD-Access: control/data plane elements, traditional campus interop)** and **1.2 (Cisco Catalyst SD-WAN: control/data plane elements, benefits and limitations)** — plus the workflow half of 4.5. ⚠ **Naming:** the book predates the rebrand — DNA Center = **Catalyst Center**, vManage = **SD-WAN Manager**, vBond = **Validator**, vSmart = **Controller**. Expect either name on the exam.

---

# SD-Access (1.3)

**SD-Access = Campus Fabric + Catalyst Center.** Same fabric managed by CLI/NETCONF-YANG instead = just "campus fabric." Designed for **enterprise campus and branch ONLY** (not DC/SP/WAN).

Why: automation (one point of management), assurance/telemetry, **wired + wireless host mobility**, identity via ISE, **group-based policy (SGACLs) instead of IP-based ACLs**, segmentation, virtualization (VNs).

## The three fabric planes (1.3.a — memorize)

| Plane | Protocol | Detail |
|---|---|---|
| **Control** | **LISP** | Control plane node = **MS/MR** with a host-tracking database of EID→RLOC; routers query instead of holding every route; gives mobility + smaller tables |
| **Data** | **VXLAN (VXLAN-GPO)** | MAC-in-IP/UDP — chosen over LISP encapsulation because LISP can't carry the **Layer 2** header. GPO variant adds the **Group Policy ID field carrying the SGT** (up to 64k tags) into the VXLAN header |
| **Policy** | **Cisco TrustSec (SGTs)** | Policy follows the tag, not the IP; enforced anywhere; carried inline in VXLAN-GPO or via SXP outward |

## Architecture layers

**Physical** (Catalyst switches, routers, WLCs+APs, Catalyst Center & ISE appliances — no firewalls/IPS in the fabric architecture) → **Network** (underlay + overlay) → **Controller** (NCP automation + NDP analytics inside Catalyst Center, plus **ISE** for identity) → **Management** (GUI; Design/Policy/Provision/Assurance).

**Underlay:** recommended = **Layer 3 routed access running IS-IS** (no IP-dependent adjacencies, protocol-agnostic). Two models: **manual** (customizable, any IGP, supports legacy/3rd-party gear) vs **automated** (Catalyst Center **LAN Automation** + Plug and Play builds the IS-IS design hands-free; no customization).

## Fabric roles

| Role | Function |
|---|---|
| **Control plane node** | LISP MS/MR; the EID→RLOC host database (size it for the whole fabric) |
| **Border node** | LISP **PxTR** to outside networks; types: **internal** (known company networks), **default** (unknown/Internet — default route), internal+default |
| **Edge node** | LISP xTR at access; **802.1X onboarding, SGT assignment, anycast gateway** (same SVI/IP everywhere), registers endpoint EIDs, VXLAN encap/decap |
| **Fabric WLC** | Sits outside the fabric; registers wireless EIDs on behalf of APs. **Control plane stays centralized (CAPWAP to WLC), data plane is distributed — APs tunnel client data in VXLAN straight to the edge node** (vs traditional CAPWAP hauling everything to the WLC) |
| Intermediate node | Underlay transport only |
| Extended node | Non-fabric access switch attached through automation |

**Key concepts:** **VN = VRF = macro-segmentation**; **SGT = micro-segmentation inside a VN**; anycast gateway = seamless roaming. **Traditional-campus interop (1.3.b): through the border node** — typically with a fusion router/firewall leaking routes between fabric VNs and the legacy network.

## Catalyst Center workflows (4.5)

**Design** (site hierarchy, network settings/AAA/DHCP/DNS, image repository, profiles) → **Policy** (group-based access control = SGACLs via ISE, IP-based ACLs, application/QoS policy, traffic copy/ERSPAN, VNs) → **Provision** (assign devices to sites, create fabrics, set device roles, host onboarding) → **Assurance** (health dashboards, Client 360 / Device 360, proactive + reactive issues).

---

# Catalyst SD-WAN (1.2)

Cloud-delivered overlay WAN (Viptela-based). **Benefits (1.2.b):** transport independence (**any IP transport — Internet, MPLS, 3G/4G LTE, satellite**), centralized config/policy from one GUI, app visibility with SLA-driven path control, end-to-end segmentation + encryption, seamless cloud/SaaS extension, lower cost. **Limitations:** controller dependency, Cisco-only fabric, overlay+underlay complexity, vEdge legacy platforms lack newer security features (URL filtering/IPS live in IOS XE containers on cEdge).

## The four mandatory components (+1 optional)

| Component (new name) | Plane | Job |
|---|---|---|
| **vBond (Validator)** | Orchestration | **Authenticates every device (certificates/RSA) and orchestrates connectivity** between edges, vSmart, vManage; **NAT detection via STUN**; load-balances controller assignments; permanent DTLS to every vSmart; reach it by FQDN for scale |
| **vManage (SD-WAN Manager)** | Management | **Single pane of glass** — device configs/templates, software upgrades, policy creation, REST APIs |
| **vSmart (Controller)** | **Control** | **OMP over DTLS** to edges: advertises routes, **TLOCs**, encryption keys, and policy; converts vManage policies and pushes them — no CLI per device. Does NOT forward user data |
| **Edge devices** (cEdge IOS XE; legacy vEdge) | **Data** | Build **IPsec tunnels edge-to-edge**, run BFD per tunnel, keep local smarts (OSPF/EIGRP/BGP, ACLs, QoS); DTLS+OMP up to vSmart |
| vAnalytics (optional) | Analytics | WAN visibility, forecasting, what-if, carrier comparisons |

⚠ Connection decoder: **vSmart↔edge = DTLS carrying OMP (control). Edge↔edge = IPsec (data).** vSmart does not form IPsec tunnels to edges.

## Policy & path intelligence

- **Local policy** (pushed to the device: ACLs, QoS, routing) vs **centralized policy** (lives on vSmart): **topology**, **VPN membership**, **application-aware routing (AAR)**, **traffic data** policies.
- **AAR:** per-tunnel **BFD probes measure loss/latency/jitter**; traffic steered app-by-app to whichever transport meets the app's SLA — automatic re-path on brownouts/soft failures.
- **Cloud OnRamp (CoR):**
  - **SaaS:** edge sends **HTTP probes** toward the SaaS app (no far-end edge for BFD); paths scored by **vQoE 0–10**; modes: DIA site (local Internet exits), gateway site (compare local DIA vs fabric-to-hub path via OMP-shared stats), client site (private transports only — pick the best gateway).
  - **IaaS:** SD-WAN **cloud routers** instantiated in AWS VPCs / Azure VNETs extend the fabric, segmentation, and QoS into public cloud over any transport (including DX/ER dedicated circuits).

## Exam-day nuggets

- SD-Access trio: **LISP control / VXLAN-GPO data / TrustSec policy**; VXLAN won the data plane because it carries L2 + the SGT.
- Control plane node answers "where is this host?"; border = PxTR to the outside (internal vs default); edge = anycast gateway + 802.1X + EID registration; fabric wireless = **centralized control, distributed VXLAN data**.
- SD-Access is for **campus + branch** only; the architecture parts list includes WLCs, APs, switches, routers, ISE, Catalyst Center — **not firewalls/IPS**.
- SD-WAN mandatory four: **vManage, vSmart, vBond, edge devices** (vAnalytics optional). vManage = single pane of glass. vBond = authenticate + orchestrate (incl. NAT/STUN).
- OMP advertises **routes, TLOCs, keys, policy**. Any IP transport works — "Internet or MPLS only" is false.
- Underlay best practice: routed access + **IS-IS**; LAN Automation = the automated underlay.
- Interop answer for 1.3.b: border node (+ fusion device for VRF route leaking).
