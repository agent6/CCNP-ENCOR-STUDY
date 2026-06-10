# Ch 14 Cheat Sheet — Quality of Service (QoS)

**ENCOR v1.2 relevance:** Topic **1.4 — INTERPRET QoS configurations**. The verb matters: expect an MQC policy exhibit and questions about what happens to a given class. Read the MQC section and the priority-vs-bandwidth distinction until they're automatic.

---

## The three enemies (why QoS exists)

**Lack of bandwidth · latency/jitter · packet loss.** Latency budget: real-time traffic wants **< 150 ms** (noticeably degrades past ~200 ms); never exceed 400 ms.

| Latency component | Fixed/Variable | What it is |
|---|---|---|
| Propagation delay | Fixed | Distance ÷ (speed of light / refractive index ≈ 200,000 km/s in fiber) |
| Serialization delay | Fixed | Packet bits ÷ link speed (1500 B on 1 Gbps ≈ 12 µs) |
| Processing delay | Fixed | Input interface → output queue (CPU, switching mode, features) |
| **Delay variation (jitter)** | Variable | Difference in latency between packets of one flow — caused by queuing; voice/video dejitter buffers absorb ~30 ms |

Loss fixes: more bandwidth, congestion management/avoidance, policing (drop the junk), shaping (delay instead of drop — but shaping adds jitter, so not for real-time).

## The three models

| Model | How | Verdict |
|---|---|---|
| Best effort | No QoS | Default |
| **IntServ** | Apps SIGNAL reservations via **RSVP** (PATH out, RESV back), per-flow state on every node, CAC | Guarantees, but doesn't scale |
| **DiffServ** | Classify + mark; **per-hop behaviors (PHB)**, policy defined independently at each device | The standard; no signaling, no flow state; not strictly end-to-end-guaranteed |

## MQC — the framework you must read fluently

```
class-map match-all VOIP        ! match-all = AND (default); match-any = OR
 match dscp ef
 match access-group name VOICE
policy-map EDGE
 class VOIP
  priority percent 30           ! the QoS ACTION
 class class-default            ! implicit catch-all for unclassified traffic
  fair-queue
interface Gi0/1
 service-policy output EDGE     ! nothing happens until applied with a direction
```

- **class-map** classifies (CoS, DSCP, ACL, `match protocol` = NBAR2 deep packet inspection — ~1500 apps, subport/URL/MIME matching, protocol packs without IOS upgrades).
- **policy-map** acts per class; **service-policy {input|output}** applies; reusable across interfaces; one in + one out max per interface.
- Hierarchical (nested) policies: a child policy applied with `service-policy <child>` inside a parent's class (classic shape-then-queue design).
- Names are case sensitive.

## Marking — the DSCP map

- **L2:** 802.1p **CoS, 3 bits** (0–7) in the 802.1Q tag — exists only on trunk links, lost at every L3 hop. **L2.5:** MPLS EXP. **L3: DSCP, 6 bits = 64 values** (survives end to end); IPP = old 3-bit field.
- Per-hop behaviors:

| PHB | Pattern | Purpose |
|---|---|---|
| **DF** | 000000 (0) | Best effort |
| **CS** | xxx000 (CS0–CS7) | IPP backward compatibility (CS×8 = decimal) |
| **AF** | aaadd0 — class a (1–4), drop precedence d (1–3) | Bandwidth guarantee; **decimal = 8x + 2y** (AF41 = 8·4+2·1 = 34) |
| **EF** | 101110 = **46** | Low loss/latency/jitter — voice; maps to IPP 5 |

- AF drop logic: within a class, **AFx3 drops first, then AFx2, then AFx1** (WRED uses the drop precedence). AF4 is not "better" than AF1 — classes are independent queues.
- **Scavenger = CS1** — *less* than best effort (P2P, gaming, streaming entertainment).
- Memorize: EF 46 · AF41 34 · AF31 26 · AF21 18 · AF11 10 · CS3 24 · CS6 48.
- **Trust boundary:** mark/classify as close to the endpoint as possible; switches trust or re-mark. IP phones mark their voice EF/CoS 5 and **zero out the attached PC's markings** by default.
- Wireless (WLC per-WLAN): **Platinum = voice (EF) · Gold = video (AF41) · Silver = best effort (default) · Bronze = background (AF11)**.

## Policing vs shaping

| | **Policer** | **Shaper** |
|---|---|---|
| Excess traffic | **Drop or mark down** immediately | **Buffer and delay** |
| Direction | Inbound or outbound | **Egress only** |
| Where | Network edge | **SP-facing interfaces** (match the SLA before they police you) |
| Side effects | TCP retransmissions | Added delay/jitter (avoid for real-time) |

Markdown convention: exceeders go AFx1 → AFx2 → AFx3, then WRED drops the high precedences first network-wide.

**Token bucket math:** tokens (1 token = 1 byte) fill at **CIR**; bucket size = **Bc**; **Tc = (Bc / CIR) × 1000 ms** (recommended 8–125 ms). Packet needs its size in tokens or it's non-conforming. Defaults: Bc = greater of 1500 bytes or CIR/32; Be = Bc.

**Policer flavors:**

| Type | Buckets/rates | Results |
|---|---|---|
| Single-rate two-color | 1 bucket (Bc) | conform / exceed |
| **srTCM** (RFC 2697) | Bc + Be (Be fills from Bc overflow) | conform / exceed / violate |
| **trTCM** (RFC 2698) | Bc@CIR + Be@**PIR** (independent) | conform / exceed / violate — **violate (PIR) checked FIRST**; allows sustained excess rate |

`police [cir] <bps> [bc bytes] [pir bps] [be bytes] conform-action X exceed-action Y violate-action Z` — defaults: conform transmit, exceed/violate drop; actions include set-dscp-transmit (markdown).

## Congestion management (queuing)

Triggered when the interface **Tx-ring fills** (faster-in-than-out, or many-to-one). Legacy: FIFO (one queue), round robin (no priority), WRR (weights), CQ (16 queues), **PQ (strict priority — starves lower queues)**, WFQ (fair per flow, no guarantees).

Modern (MQC):

- **CBWFQ** — up to 256 class queues; `bandwidth` = **minimum guarantee during congestion** (no latency promise → data, not voice). Queue full → tail drop at queue-limit.
- **LLQ = CBWFQ + a strict-priority queue** — `priority` traffic is serviced first BUT is **conditionally policed to its rate during congestion** so it can't starve the other classes (the fix for legacy PQ). All priority classes share ONE physical PQ (two with `priority level 1|2`).

| Command | Meaning |
|---|---|
| `priority <kbps>` / `priority percent N` | LLQ with conditional policer (congestion only) |
| `bandwidth <kbps>` / `percent` / `remaining percent` | CBWFQ minimum guarantee |
| `shape average <rate>` | Class-based shaping (max rate; can pair with bandwidth for min+max) |
| `fair-queue` | Flow-based fairness inside a queue |
| `queue-limit` | Adjust tail-drop depth |
| `random-detect [dscp-based]` | WRED (default is precedence-based — use dscp-based with DSCP marking) |

Coexistence rules worth knowing: `priority` cannot share a class with bandwidth/shape/fair-queue/random-detect; random-detect and fair-queue require bandwidth or shape in the class; `bandwidth percent` can't share a policy with un-policed strict priority, but `bandwidth remaining percent` can.

## Congestion avoidance

- Default = **tail drop** → all new packets dropped when the queue fills → **TCP global synchronization** (all sessions back off and surge together, sawtooth utilization).
- **RED** drops random packets early as the queue grows. **WRED** = Cisco's RED weighted by IPP/DSCP — low-priority/high-drop-precedence dies first (AFx3 → AFx2 → AFx1). **ECN** extension marks instead of drops for ECN-capable endpoints.

## Exam-day nuggets

- QoS problems = bandwidth, latency/jitter, loss (DIKTA 1). Latency types: propagation, serialization, processing (fixed) + delay variation (variable) (DIKTA 2).
- The signaling model = **IntServ/RSVP** (DIKTA 4); most deployed = **DiffServ** (DIKTA 5); "expedited forwarding" is a PHB, not a model (DIKTA 3).
- Inside a policy map it's **`class NAME`** (not class-map) (DIKTA 6); apply with **`service-policy {input|output} NAME`** (DIKTA 7).
- Classify at the **edge**, never the core (DIKTA 8). DSCP is **6 bits/64 values**, not 8 (DIKTA 9). Marking action = **`set dscp ef`** or `set ip dscp ef` (DIKTA 10).
- Interpret-the-policy reflexes: `priority` = LLQ strict + policed under congestion; `bandwidth` = minimum guarantee, no latency promise; `police` = hard rate, drops/re-marks now; `shape` = buffers to a max rate.
- trTCM checks violate→exceed→conform (reverse of srTCM); PIR ≥ CIR; Be ≥ Bc.
- CoS dies at the first routed hop — map it into DSCP at the trust boundary.
