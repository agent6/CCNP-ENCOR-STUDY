# ENCOR 350-401 v1.2 Exam Topics → OCG Chapter Mapping

**Book:** CCNP and CCIE Enterprise Core ENCOR 350-401 Official Cert Guide, 2nd Edition (written for blueprint v1.1)
**Blueprint:** ENCOR v1.2 (current, 2025)

The big v1.2 change: **all wireless topics were removed** from the exam, so Chapters 17–21 can be skipped entirely.

---

## Chapters to Study (and their v1.2 exam topics)

### Part I – Forwarding

**Chapter 1 – Packet Forwarding** *(supporting only)*
- 3.1.a Troubleshoot static and dynamic 802.1q trunking protocols (VLAN/access/trunk port basics)
- Note: the old v1.1 topic on CEF/CAM/TCAM switching mechanisms was **removed in v1.2**. Skim for foundation; don't deep-study.

### Part II – Layer 2

**Chapter 2 – Spanning Tree Protocol**
- 3.1.c Configure and verify common Spanning Tree Protocols (RSTP, MST) and enhancements (root guard, BPDU guard)

**Chapter 3 – Advanced STP Tuning**
- 3.1.c (root guard, BPDU guard and other STP enhancements)

**Chapter 4 – Multiple Spanning Tree Protocol**
- 3.1.c (MST)

**Chapter 5 – VLAN Trunks and EtherChannel Bundles**
- 3.1.a Troubleshoot static and dynamic 802.1q trunking protocols
- 3.1.b Troubleshoot static and dynamic EtherChannels

### Part III – Routing

**Chapter 6 – IP Routing Essentials**
- 3.2.a Compare routing concepts of EIGRP and OSPF
- 3.2.d Describe policy-based routing
- 2.2.a Configure and verify VRF

**Chapter 7 – EIGRP**
- 3.2.a Compare routing concepts of EIGRP and OSPF

**Chapter 8 – OSPF**
- 3.2.a Compare routing concepts of EIGRP and OSPF
- 3.2.b Configure simple OSPFv2/v3 environments

**Chapter 9 – Advanced OSPF**
- 3.2.a Compare routing concepts of EIGRP and OSPF
- 3.2.b OSPF summarization, filtering, areas

**Chapter 10 – OSPFv3**
- 3.2.b Configure simple OSPFv2/v3 environments

**Chapter 11 – BGP**
- 3.2.c Configure and verify eBGP between directly connected neighbors

**Chapter 12 – Advanced BGP**
- 3.2.c (best path selection algorithm)

**Chapter 13 – Multicast**
- 3.3.d Describe multicast protocols (RPF check, PIM SM, IGMP v2/v3, SSM, bidir, MSDP)
- ⚠️ Gap: **MSDP is not covered in the book** (new in v1.2) — supplement with Cisco docs.

### Part IV – Services

**Chapter 14 – Quality of Service (QoS)**
- 1.4 Interpret QoS configurations

**Chapter 15 – IP Services**
- 3.3.a Interpret NTP and PTP configurations
- 3.3.b Configure NAT/PAT
- 3.3.c Configure FHRPs (HSRP, VRRP)
- 1.1.b High availability techniques (FHRP portion)

### Part V – Overlay

**Chapter 16 – Overlay Tunnels**
- 2.2.b GRE and IPsec tunneling
- 2.3.a LISP
- 2.3.b VXLAN

### Part VII – Architecture

**Chapter 22 – Enterprise Network Architecture**
- 1.1.a High-level enterprise network design (2-tier, 3-tier, fabric, cloud)
- 1.1.b High availability techniques (redundancy, FHRP, SSO)

**Chapter 23 – Fabric Technologies**
- 1.2 Cisco Catalyst SD-WAN solution (1.2.a control/data plane elements, 1.2.b benefits and limitations)
- 1.3 Cisco SD-Access solution (1.3.a control/data plane elements, 1.3.b traditional campus interop)
- 4.5 Catalyst Center workflows (Design/Policy/Provision/Assurance portions)

**Chapter 24 – Network Assurance**
- 4.1 Diagnose problems with debugs, conditional debugs, traceroute, ping, SNMP, syslog
- 4.2 Configure and verify Flexible NetFlow
- 4.3 Configure SPAN/RSPAN/ERSPAN
- 4.4 Configure and verify IPSLA
- 4.5 Catalyst Center configuration, monitoring, management
- ⚠️ Gap: v1.2 adds "AI-powered workflows" in Catalyst Center — supplement with Cisco docs. (Book uses old name "DNA Center.")

### Part VIII – Security

**Chapter 25 – Secure Network Access Control**
- 5.4.a Threat defense
- 5.4.b Endpoint security
- 5.4.c Next-generation firewall
- 5.4.d TrustSec and MACsec

**Chapter 26 – Network Device Access Control and Infrastructure Security**
- 5.1.a Lines and local user authentication
- 5.1.b Authentication and authorization using AAA
- 5.2.a ACLs
- 5.2.b CoPP

### Part IX – SDN

**Chapter 27 – Virtualization**
- 2.1.a Hypervisor type 1 and 2
- 2.1.b Virtual machine
- 2.1.c Virtual switching

**Chapter 28 – Foundational Network Programmability Concepts**
- 4.6 Configure and verify NETCONF and RESTCONF
- 5.3 Describe REST API security
- 6.1 Interpret basic Python components and scripts
- 6.2 Construct valid JSON-encoded files
- 6.3 Describe data modeling languages (YANG)
- 6.4 Describe APIs for Cisco Catalyst Center and SD-WAN Manager (book: "DNA Center and vManage")
- 6.5 Interpret REST API response codes and payloads (Catalyst Center, RESTCONF)

**Chapter 29 – Introduction to Automation Tools**
- 6.6 Construct an EEM applet
- 6.7 Compare agent vs. agentless orchestration tools (Chef, Puppet, Ansible, SaltStack)

---

## Chapters to SKIP (not on v1.2 exam)

| Chapter | Title | Why |
|---|---|---|
| 17 | Wireless Signals and Modulation | Wireless removed in v1.2 |
| 18 | Wireless Infrastructure | Wireless removed in v1.2 |
| 19 | Wireless Roaming and Location Services | Wireless removed in v1.2 |
| 20 | Authenticating Wireless Clients | Wireless removed in v1.2 (incl. old 802.1X/WebAuth/PSK wireless security topics) |
| 21 | Troubleshooting Wireless Connectivity | Wireless removed in v1.2 |
| 30 | Final Preparation | Study-plan chapter, no exam topics |
| 31 | ENCOR 350-401 Exam Updates | Check anyway — it exists to bridge blueprint changes |

---

## Known v1.2 gaps in this (v1.1-era) book

1. **MSDP** (topic 3.3.d) — not in the book at all.
2. **AI-powered workflows in Catalyst Center** (topic 4.5) — new in v1.2.
3. **Naming updates**: book says "SD-WAN/vManage" and "DNA Center"; exam now says "Catalyst SD-WAN/SD-WAN Manager" and "Catalyst Center." Same technology, new names.
