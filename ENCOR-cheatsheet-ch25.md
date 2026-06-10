# Ch 25 Cheat Sheet — Secure Network Access Control

**ENCOR v1.2 relevance:** Topic **5.4 — describe the components of network security design: (a) threat defense, (b) endpoint security, (c) next-generation firewall, (d) TrustSec and MACsec**. Describe-level: know what each product/technology does and how the pieces relate. TrustSec's three phases and MACsec's scope are the most quizzed details.

---

## Cisco SAFE framework (5.4.a)

**SAFE** = Cisco's Secure Architectural Framework: secure each **PIN** (place in the network) — **branch, campus, data center, edge** (highest risk; Internet ingress/egress), **cloud, WAN** — note the Internet itself is NOT a PIN.

**Secure domains** evaluated per PIN: management, security intelligence, **compliance** (PCI DSS, HIPAA), **segmentation**, **threat defense** (visibility via telemetry + file reputation + context), secure services (VPN/encryption). "Segregation" is the distractor.

**Attack continuum:** **before** (know assets, harden — firewalls, NAC, identity) → **during** (detect/block — NGIPS, NGFW, malware/email/web security) → **after** (scope/contain/remediate — AMP retrospection, Secure Network Analytics).

## The security product cast (5.4.a/b — one-liners to know cold)

| Product | One-liner |
|---|---|
| **Cisco Talos** | The Cisco **threat intelligence** organization — feeds reputation/signatures to everything |
| **Secure Malware Analytics** (Threat Grid) | **Sandbox** static + dynamic (behavioral) file analysis; evades sandbox-detection tricks; Glovebox for manual interaction |
| **AMP / Secure Endpoint** (5.4.b) | Endpoint malware defense **beyond point-in-time**: file reputation/disposition from AMP Cloud (clean/malicious/unknown — connectors send hashes, not signatures), sandboxing, **retrospection** — verdicts can change on files already allowed; connectors for endpoints, email, web, networks, Meraki |
| **Secure Client** (AnyConnect) | Modular VPN client (TLS/IKEv2) + posture modules (ISE/HostScan) + Umbrella roaming + flow visibility |
| **Umbrella** (OpenDNS) | **DNS-layer security** — blocks malicious domains before the connection ever forms; cloud-delivered, deploy by pointing DHCP/DNS at it |
| **Secure Web Appliance (WSA)** | Web proxy/gateway: reputation scores (−10…+10), URL filtering + dynamic content analysis, AV scanning, DLP, file retrospection |
| **Secure Email (ESA)** | Email gateway: antispam, reputation, AMP for attachments |
| **Secure Network Analytics** (Stealthwatch) | **NetFlow-based** behavioral threat detection — agentless; Manager + Flow Collectors (+ Flow Sensors, UDP Director, ETA for encrypted traffic w/o decryption) |
| **Secure Cloud Analytics** | SaaS flavor; monitors AWS/GCP/Azure via VPC flow logs |
| **ISE** | Policy decision point: RADIUS (802.1X/MAB/WebAuth), TACACS+ device admin, profiling, posture, guest portals, TrustSec SGT policy, **pxGrid** |

**pxGrid:** the context-sharing bus (IETF framework) — **ISE is the pxGrid controller**; without ISE there is no pxGrid. v2.0 uses WebSocket/REST+STOMP.

## NGFW & NGIPS (5.4.c)

- **NGIPS** (FirePOWER): signature + context-aware IPS with threat intelligence from Talos.
- **NGFW = stateful firewall + application visibility/control + NGIPS + AMP + identity awareness.** Cisco Secure Firewall runs ASA image, ASA+FirePOWER services, or the unified **FTD** image.
- Management: **FMC** (centralized, multi-device event/policy correlation), FDM (single small box), Cisco Defense Orchestrator; FTD has no full CLI config (setup/troubleshooting only).

## 802.1X / NAC

Components: **EAP** (the framework), EAP method, **EAPoL** (L2 transport supplicant↔switch), **RADIUS** (authenticator↔server).

| Role | Device |
|---|---|
| **Supplicant** | Software on the endpoint (native OS, Secure Client) |
| **Authenticator** | Switch/WLC — relays EAPoL↔RADIUS, opens the port on accept; **blind to the EAP method** |
| **Authentication server** | RADIUS server = ISE; returns accept/deny + authorization (dACL, VLAN, SGT) |

**EAP methods:**

- **EAP-TLS** — certificates BOTH sides; most secure, hardest to deploy.
- **PEAP** — server-side cert builds a TLS tunnel; inner methods: **MSCHAPv2** (AD-friendly, most common), GTC (OTP/LDAP), even inner EAP-TLS.
- **EAP-FAST** — Cisco's PEAP alternative; **PACs** for fast reauth/roaming; **the one that supports EAP chaining** (machine AND user authenticated in one session).
- EAP-TTLS — like PEAP but also carries legacy inner methods (PAP/CHAP). EAP-MD5 — no mutual auth, avoid.

**Fallbacks:** **MAB** (authenticate by MAC for agentless devices — printers/IoT; ISE profiling builds the identity) and **WebAuth** (browser portal for guests; local or central). Typical port order: 802.1X → MAB → WebAuth.

## TrustSec (5.4.d)

Replace IP/VLAN-based policy with **Scalable Group Tags**. Three phases (the DIKTA list): **classification → propagation → enforcement**.

1. **Classification:** SGT assigned **dynamically** (ISE authorization via 802.1X/MAB/WebAuth) or **statically** (IP/subnet/VLAN/interface/port mappings — data centers without dot1x); ISE can also serve a central IP-to-SGT database.
2. **Propagation:** **inline tagging** (16-bit SGT in the L2 frame's Cisco MetaData — needs TrustSec-capable ASICs end to end; unsupported hardware DROPS tagged frames) or **SXP** (TCP peer-to-peer carrying IP-to-SGT bindings — **speaker** sends, **listener** receives; single- or multi-hop; ISE itself can speak SXP/pxGrid). ⚠ Tags do NOT extend to the endpoints themselves.
3. **Enforcement:** at **egress** — **SGACLs** on switches/routers (ISE policy matrix: source SGT row × destination SGT column → permit/deny/granular ACL) or **SGFW** rules on firewalls.

## MACsec (5.4.d)

- **IEEE 802.1AE — hop-by-hop Layer 2 encryption**: encrypted on the wire, decrypted inside each switch (so QoS/SGT inspection still works) — contrast with IPsec's end-to-end L3 scope. Line-rate via onboard ASICs.
- Frame adds a 16-byte **802.1AE header (EtherType 0x88e5)** + 16-byte **ICV**; encrypts the payload INCLUDING the SGT; uses **AES-GCM** authenticated encryption.
- Keying: **SAP** (Cisco proprietary, switch-to-switch default) and **MKA** (the standard protocol; endpoint-to-switch and switch-to-switch).
- **Downlink MACsec** = endpoint↔switch (MKA + MACsec-capable supplicant; ISE authorization can mandate/override encryption policy). **Uplink MACsec** = switch↔switch (SAP by default; dynamic mode needs 802.1X between switches).

## Exam-day nuggets

- Framework = **Cisco SAFE**; PINs = branch/campus/DC/edge/cloud/WAN (Internet isn't one); secure domains include threat defense, segmentation, compliance — not "segregation."
- Threat intel = **Talos**; sandbox = **Secure Malware Analytics**; NetFlow-driven detection = **Secure Network Analytics**; no ISE → no **pxGrid**.
- EAP chaining = **EAP-FAST**. The authenticator never sees the EAP method.
- TrustSec phases: **classification, propagation, enforcement** (SGTs stop at the access device — endpoints never carry them).
- Inline tagging needs ASIC support end-to-end; SXP bridges the gaps (speaker→listener). Enforcement is **egress**, via SGACL matrix or SGFW.
- MACsec = 802.1AE, **hop-by-hop L2**, AES-GCM, keyed by **MKA** (standard) or SAP (Cisco); downlink vs uplink distinction.
- AMP's superpower = **retrospection** (post-facto verdict changes); Umbrella's = blocking at the **DNS layer** before connections form.
