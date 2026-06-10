# Ch 16 Cheat Sheet — Overlay Tunnels

**ENCOR v1.2 relevance:** Three topics: **2.2.b (configure and verify GRE and IPsec tunneling)** at config depth, plus **2.3.a (LISP)** and **2.3.b (VXLAN)** at describe depth. GRE/IPsec is hands-on; LISP/VXLAN is roles, ports, and packet formats.

---

## GRE (2.2.b — configure/verify)

- IP protocol **47**; carries any protocol (multiprotocol, multicast, IGPs) over IP — the foundation of most VPN designs. Adds **24 bytes** of overhead (GRE+IP); GRE+AES+SHA-1 can add 62–77 bytes — hence the `ip mtu 1400` convention on tunnels.
- Config recipe: `interface tunnel100` → `tunnel source <int|ip>` → `tunnel destination <ip>` → `ip address ...` + optional `bandwidth` (virtual interfaces need it for IGP metrics), `keepalive [10 s ×3 default]`, `ip mtu 1400`.
- Line protocol comes up when a **route to the tunnel destination exists** (keepalives add real bidirectional verification).
- The overlay hides the underlay: traceroute shows the tunnel as **one hop**; the passenger TTL decrements once regardless of transit hops (GRE outer TTL defaults to 255).
- Verify: `show interfaces tunnel100` (source/destination, GRE/IP protocol, keepalive).

⚠ **Recursive routing:** advertising the underlay (tunnel endpoints) into the IGP running over the tunnel makes the router try to reach the tunnel destination *through the tunnel*: syslog `%TUN-5-RECURDOWN — temporarily disabled due to recursive routing`, tunnel flaps in a loop. Fix: keep the tunnel-endpoint prefixes out of the overlay routing protocol.

## IPsec building blocks

**Four security services:** peer authentication (PSK or certificates), confidentiality (encryption), integrity (HMAC hashes), replay detection (sequence numbers). Modern picks: **AES** (DES/3DES deprecated), **SHA** (MD5 deprecated), DH group **14+**.

| Header | Proto # | Gives you | NAT traversal |
|---|---|---|---|
| **ESP** | **50** | Encryption + integrity + auth | **Yes (NAT-T)** |
| AH | 51 | Integrity/auth only — no encryption | **No** — avoid |

**Modes:** **tunnel** (encrypts the entire original packet, adds a new IPsec IP header — provides the overlay) vs **transport** (protects only the payload; original header still routes — used under GRE so the GRE header does the overlay work).

## IKE — v1 vs v2

| | IKEv1 | IKEv2 |
|---|---|---|
| Phase 1 (mgmt SA) | Main mode (6 msgs) or aggressive (3) | SA_INIT + IKE_AUTH |
| Phase 2 (IPsec SA) | **Quick mode** | CREATE_CHILD_SA |
| Total to establish | 9 (main) / 6 (aggressive) | **4** |
| Auth | PSK, RSA certs — both sides same method | adds **EAP** (remote access!), ECDSA, **asymmetric** auth |
| Extras | — | NGE crypto (AES-GCM, SHA-256+), **anti-DoS** |

## VPN solution lineup (know the one-liners)

| Solution | Claim to fame |
|---|---|
| Site-to-site IPsec | **Multivendor**, low scale, config-heavy |
| **DMVPN** | Cisco; **mGRE + NHRP + IPsec**; hub-and-spoke with on-demand spoke-to-spoke tunnels |
| **GET VPN** | Cisco; **tunnel-less** (keeps original IP header), any-to-any over **private WAN/MPLS**, native multicast/QoS |
| **FlexVPN** | Cisco's **IKEv2-only** unified framework (site-to-site + remote access + spoke-to-spoke) |
| Remote access | TLS/DTLS or IKEv2; per-user VPN |

## GRE over IPsec — two config styles (2.2.b)

1. **Crypto map** (legacy): crypto ACL `permit gre host <src> host <dst>` → `crypto isakmp policy` (encryption/hash/auth/group) → `crypto isakmp key <psk> address <peer>` → `crypto ipsec transform-set ... + mode transport` → `crypto map VPN 10 ipsec-isakmp` (match address / set peer / set transform-set) → **applied to the PHYSICAL interface**.
2. **IPsec profile** (preferred): same ISAKMP policy/key/transform-set → `crypto ipsec profile P { set transform-set }` → **`tunnel protection ipsec profile P` on the TUNNEL interface**. No crypto ACL needed; the two styles interoperate.

- Use **transport mode** under GRE to avoid double IP-header overhead ("GRE over IPsec"); tunnel mode re-wraps the whole GRE packet ("IPsec over GRE"). Either way the wire shows protocol **50**.
- **VTI** (`tunnel mode ipsec ipv4`): IPsec-native tunnel interface — drops the GRE header entirely (less overhead) but carries IP only.
- Verify: `show interface tunnel100 | i protocol` (GRE/IP vs IPSEC/IP), IGP adjacency over the tunnel, `show crypto ipsec sa`.

## LISP (2.3.a — describe)

**Identity/location split:** **EID** = the endpoint's IP (stays the same when it moves) · **RLOC** = the underlay address of the site router (changes with location). Control plane works like **DNS — a pull model**: ask only for what you need, instead of pushing every route everywhere.

| Role | Job |
|---|---|
| **ITR** | Encapsulates traffic leaving the LISP site (sends map requests) |
| **ETR** | De-encapsulates inbound; **registers its EID prefixes with the MS** (map register / map notify) |
| xTR | ITR + ETR |
| **PITR / PETR** | Same functions for traffic to/from **non-LISP** sites (negative map reply steers the ITR to the PETR) |
| **MS** | Stores the EID-to-RLOC mapping database |
| **MR** | Receives map requests from ITRs, finds the answering ETR |

- Data plane: IP-in-IP/UDP, **destination port 4341**; control plane messages use **4342**. The LISP shim header carries a 24-bit **instance ID** for VRF-style segmentation. Any IPv4/IPv6 RLOC↔EID combination works.
- Flow: ETR registers EIDs → ITR's packet misses the RIB (default route) → encapsulated map request to MR → MS/mapping system forwards to the authoritative ETR → **map reply** with EID→RLOC → ITR caches and forwards.
- Nuance: ETRs are **not** the only map-reply senders — an ETR can set the proxy-reply bit so the **MS answers on its behalf**.

## VXLAN (2.3.b — describe)

Why: classic L2 hits walls — 12-bit VLAN ID (~4000 segments), giant MAC tables from VMs/containers, STP-blocked links, no ECMP, painful host mobility.

- **MAC-in-IP/UDP** encapsulation, **UDP destination port 4789** (pre-standard Linux used 8472 — interop gotcha).
- **VNI = 24 bits → ~16 million segments**, carried in the VXLAN shim header; segments L2 AND L3 traffic.
- **VTEP** = the tunnel endpoint doing encap/decap; has a **local LAN interface** (bridges hosts) and an **IP interface** (underlay-facing, identifies the VTEP).
- ⚠ The VXLAN spec defines **only the data plane** — no control plane is specified (deployments pair it with multicast flood-and-learn, or LISP/BGP EVPN as in SD-Access/data centers).

## Exam-day nuggets

- GRE = proto **47**, +24 bytes; IPsec: **ESP 50** (encrypts, NAT-friendly) vs AH 51 (no encryption, breaks NAT).
- IKEv1 **quick mode** builds the IPsec SA (main/aggressive build the IKE SA); IKEv2 does it all in **4 messages** and adds EAP/anti-DoS.
- Crypto map → physical interface; **`tunnel protection ipsec profile` → tunnel interface** (the modern answer).
- Recursive routing = tunnel destination learned through the tunnel; %TUN-5-RECURDOWN flapping.
- LISP splits addresses into **EIDs and RLOCs**; data **4341** / control **4342**; ITR encap, ETR decap+register, MS/MR = the "DNS"; proxy roles bridge non-LISP sites.
- VXLAN = UDP **4789**, **24-bit VNI** (16M), VTEPs at the edges, **data plane only** per the spec.
- Mode logic: transport under GRE (avoid double headers); tunnel mode when IPsec itself must provide the overlay; VTI when you want IPsec-only with an interface model.
