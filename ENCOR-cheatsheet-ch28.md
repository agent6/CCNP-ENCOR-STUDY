# Ch 28 Cheat Sheet — Foundational Network Programmability

**ENCOR v1.2 relevance:** The biggest automation chapter — **4.6 (NETCONF/RESTCONF), 5.3 (REST API security), 6.1 (Python), 6.2 (JSON), 6.3 (YANG), 6.4 (Catalyst Center & SD-WAN Manager APIs), 6.5 (REST response codes/payloads)**. Expect "what does this response/snippet mean" questions more than configuration.

---

## Why not CLI?

CLI weaknesses the exam cites: **prone to human error/misconfiguration** and **device-by-device operation** (doesn't scale), plus slow execution, per-platform syntax drift, and plaintext risk if Telnet. Programmatic interfaces fix consistency and scale.

## API directions & REST

- **Northbound API** = applications/GUI ↔ the controller (e.g., your browser to Catalyst Center — typically REST over TLS).
- **Southbound API** = controller ↔ network devices (pushing changes down).
- **REST** = API style using HTTP methods; consistent across vendors.

| HTTP verb | CRUD | Action |
|---|---|---|
| **POST** | CREATE | Submit data (e.g., send login credentials) |
| **GET** | READ | Retrieve data |
| **PUT** | UPDATE | **Replace** data |
| **PATCH** | UPDATE | **Append/modify** data |
| **DELETE** | DELETE | Remove data |

**CRUD = CREATE, READ, UPDATE, DELETE** (watch the distractors: not "retrieve/restore/receive").

## HTTP status codes (6.5 — memorize)

| Code | Meaning | Typical cause |
|---|---|---|
| **200 OK** | Success | GET/POST exchanged data |
| **201 Created** | Resource made | Successful create via POST |
| **400 Bad Request** | Client-side error | Malformed request |
| **401 Unauthorized** | Not authenticated | Missing/expired token or credentials |
| **403 Forbidden** | Authenticated but not allowed | Insufficient rights |
| **404 Not Found** | URL/resource doesn't exist | Wrong URI |

Decoder reflex: 2xx success · 4xx your fault · (5xx server's fault). **401 vs 403** is the favorite pair.

## Data formats (6.2)

- **XML:** tag-based — every `<tag>` needs a matching `</tag>`; human- and machine-readable; used by NETCONF.
- **JSON:** **key/value pairs** inside `{ }` objects (arrays in `[ ]`), keys and string values quoted, separated by commas. Cleaner and now dominant. Recognize valid JSON on sight:

```json
{ "user": "root", "role": "admin", "ports": [1, 2, 3] }
```

## Controller APIs (6.4)

**Catalyst Center (DNA Center) — token workflow:**

1. **POST** to `.../api/system/v1/auth/token` using **Basic Auth** (username/password) + header `Content-Type: application/json`.
2. Response = a **Token** (unique per authenticated session).
3. Every later call (e.g., **GET** `.../api/v1/network-device` for the inventory) carries the token in the **`X-Auth-Token`** header. 200 OK + JSON payload = success.

**SD-WAN Manager (vManage):** authentication POST uses **`Content-Type: x-www-form-urlencoded`** (credentials as j_username/j_password) — the odd one out, and a DIKTA favorite.

**REST API security (5.3):** transport encryption (TLS/HTTPS), authenticate then use short-lived **tokens** rather than resending credentials, least-privilege authorization, rate limiting, and never hardcode credentials in scripts/repos. Test against sandboxes (DevNet) — an authenticated API DELETE is as real as a CLI delete.

**Postman** = the API test console: per-tab requests, a unique URL per API call, saved **collections**, history.

## YANG (6.3)

- The **data modeling language** that defines the structure/types of config and operational data — the schema that NETCONF and RESTCONF both operate on. Models are vendor-neutral (IETF/OpenConfig) or native (Cisco).
- Building blocks: **module** → **container** (grouping) → **list** → **leaf** (a single typed value). DIKTA pair: **leaf and container** are YANG model parts (not "method").
- Mental model: a nested shopping list — categories (containers) holding items (leaves).

## NETCONF (4.6)

- **SSH transport, port 830**, payload = **XML** RPC messages, data structured by YANG. Session starts with a **capabilities** exchange.
- Operations: **get** (running config + state), **get-config** (a datastore's config), **edit-config** (CRUD changes into a datastore), **copy-config**, **delete-config**.
- **Datastores:** running, startup, and **candidate** (stage + validate + commit before touching the live box).

## RESTCONF (4.6)

- **RFC 8040** — RESTful access to the SAME YANG-modeled data: **HTTPS**, URIs under **`/restconf/data/...`**, payloads in **JSON or XML** (`application/yang-data+json`), methods GET/POST/PUT/DELETE/OPTIONS.
- **Complements NETCONF, doesn't replace it.** Same models, different transport/encoding.
- Example read: GET `/restconf/data/Cisco-IOS-XE-native:native/logging/monitor/severity` → 200 + `{"Cisco-IOS-XE-native:severity": "critical"}`.

| | NETCONF | RESTCONF |
|---|---|---|
| Transport | SSH (830) | HTTPS |
| Encoding | XML only | JSON or XML |
| Style | RPC operations, datastores | REST verbs on YANG URIs |

## DevNet & GitHub

- **DevNet** (developer.cisco.com): **Documentation** = the API references; **Learn** = guided labs; Technologies; **Community** = the place to ask questions; Events. Sandboxes (always-on/reserved) = safe practice targets.
- **GitHub:** hosted version control — a **repository stores code, shares it with other developers, and holds its documentation** (README); tracks changes/commits, enables collaboration and peer review.

## Python survival kit (6.1)

- Reputation: one of the EASIEST languages to pick up (true/false bait).
- Reading a script: `#` = comment · triple quotes = multi-line string/docstring · `import json, requests` pulls in **modules** · `def name():` defines a function · indentation defines blocks.
- **Dictionary** = JSON-like key/value structure: `dnac = {"host": "...", "port": 443, "username": "...", "password": "..."}` — access with `dnac["host"]`.
- **Condition:** `if ENVIRONMENT_IN_USE == "sandbox":` (== compares; = assigns).
- The canonical API pattern: `response = requests.post(url, auth=HTTPBasicAuth(u,p), headers=headers, verify=False)` → `token = response.json()["Token"]` → later `requests.get(url, headers={"x-auth-token": token})` and loop `for item in data['response']:`.

## Exam-day nuggets

- Authenticate to Catalyst Center = **POST** with **Basic Auth** to the Token API; then **X-Auth-Token** header everywhere (DIKTA 2, 10). vManage auth Content-Type = **x-www-form-urlencoded** (DIKTA 4).
- CRUD = CREATE/READ/UPDATE/DELETE (DIKTA 3); PUT replaces, PATCH appends.
- YANG parts = **leaf + container** (DIKTA 14). NETCONF = SSH/830/XML; RESTCONF = HTTPS//restconf/data/JSON-or-XML, and it does NOT replace NETCONF.
- CLI cons = error-prone + device-at-a-time (DIKTA 13). GitHub repo = store + share + document code (DIKTA 12). DevNet Documentation page = API references.
- JSON is the format with quoted key/value pairs in braces (DIKTA 5); Python is easy (DIKTA 1: false that it's difficult).
- Status pairs to keep straight: 200 vs 201 (ok vs created), 401 vs 403 (unauthenticated vs unauthorized).
