# Ch 29 Cheat Sheet — Introduction to Automation Tools

**ENCOR v1.2 relevance:** The final two exam topics: **6.6 — construct an EEM applet to automate configuration, troubleshooting, or data collection** and **6.7 — compare agent vs. agentless orchestration tools**. Construct-level for EEM (know the applet anatomy cold); compare-level for the tool lineup.

---

## EEM — Embedded Event Manager (6.6)

**On-box automation**: applets run locally on the IOS device — no external server needed. Logic = **if EVENT then ACTIONS** (one event statement, ordered actions).

**Applet anatomy:**

```
event manager applet LOOP0
 event syslog pattern "Interface Loopback0.* down" period 1
 action 1.0 cli command "enable"
 action 2.0 cli command "config terminal"
 action 3.0 cli command "interface loopback0"
 action 4.0 cli command "shutdown"
 action 5.0 cli command "no shutdown"
 action 6.0 syslog msg "Recovered the interface"
```

Rules that get tested:

- **Event types:** `event syslog pattern` (regex match on log messages), `event cli pattern` (trigger when a command is typed — e.g., back up config on "write mem.*"), `event none` (**manual applets** — run with `event manager run <name>`), plus timers/SNMP/track.
- **Actions execute in alphanumeric LABEL order** — labels are strings, so 10.0 sorts after 1.0, not 9.0; use decimal gaps (1.0, 2.0…) so you can insert 1.5 later.
- **Start CLI actions with `enable` (and `config terminal` if configuring)** — the applet starts in user EXEC.
- If AAA command authorization is on, add `event manager session cli username <user>` or the CLI actions fail.
- `$_cli_result` embeds the output of executed CLI commands (e.g., into an email body); `action ... mail server ... to ... from ... subject ... body` sends email; common environment variables: `_email_server`, `_email_to`, `_email_from` (set via `event manager environment <var> <value>`).
- EEM can call **Tcl scripts** stored in flash (`action 1.1 cli command "tclsh flash:/ping.tcl"`).
- Troubleshoot with `debug event manager action cli` (or `... action mail`, `... all`).

## Agent vs agentless (6.7) — the comparison table

| Factor | **Puppet** | **Chef** | **Ansible** | **SaltStack** |
|---|---|---|---|---|
| Architecture | Puppet server + **agents** | Chef server + **clients** | **Control station + remote hosts** | Salt master + **minions** |
| Agent? | **Agent-based** (pull) | **Agent-based** (pull) | **AGENTLESS** (push over SSH/WinRM) | Agent-based (0MQ messaging) |
| Language | Puppet DSL | **Ruby** DSL | **YAML** | YAML / Python |
| Terminology | **Modules & manifests** | **Cookbooks & recipes** | **Playbooks & plays** | **Pillars & grains** |
| Agentless variant | **Puppet Bolt** | — | (native) | **Salt SSH** |

- **Agentless tools: Ansible, Puppet Bolt, Salt SSH** — nothing to install on the managed node; ideal for network gear that can't run agents.
- Vocabulary mapping: Chef cookbook ↔ Puppet module (collection of code); Chef recipe ↔ Puppet manifest (the deployed config code); Chef **knife** uploads cookbooks; Chef **OHAI** reports node state (≈ SaltStack **grains**); Chef's **kitchen** = pre-production testing.
- SaltStack specifics: **masters/minions**, fast parallel execution over **0MQ**, event-driven via **reactors** (on master) and **beacons** (on minions); **grains** = facts gathered FROM minions, **pillars** = data stored on the master FOR specific minions (good for secrets). Salt SSH uses **roster files** for agentless hosts (slower than 0MQ).
- Chef server deployments: Chef Solo (local), Client/Server, Hosted (cloud), Private (on-prem).

## Ansible — the exam's agentless workhorse

- **Control station pushes over SSH** (WinRM for Windows); no admin account needed (sudo escalation); design goals: consistent, secure, reliable, minimal learning curve.
- **Playbook** (a set of plays) → **play** (tasks applied to a host/group) → **task** (a call to a module like `ios_config` / `ios_command`).
- Written in **YAML**: starts with **`---`** (ends optionally with `...`), `#` comments, lists = `- item` lines, dictionaries = unquoted `key: value` pairs; indentation matters. (Validate at YAML Lint. "TAML" is a distractor.)
- **Inventory file** = the host list, with bracketed groups (`[routers]`); a host can be in multiple groups.
- Run a playbook: **`ansible-playbook ConfigureInterface.yaml`**; other CLI: `ansible` (ad hoc modules), `ansible-docs`, `ansible-pull` (flip push→pull), **`ansible-vault`** (encrypt sensitive YAML).
- Reading PLAY RECAP: `ok=1 changed=1` = task succeeded and modified the device.
- Methodology shout-out: **PPDIOO — Prepare, Plan, Design, Implement, Operate, Optimize**.

## Why automate (the soft answers)

Reduced human error, increased agility, lower opex, streamlined management — automation duplicates a *tested* best practice (and will just as faithfully duplicate a bad one). Tool choice follows the team's skills: Ruby shop → Chef; CLI/Python comfort → Ansible/SaltStack.

## Exam-day nuggets

- EEM = **on-box**; actions run in **alphanumeric label order**; CLI actions need `enable` first; `event none` applets run via **`event manager run`**; syslog AND CLI patterns can both trigger (regex).
- Agent-based = **Puppet, Chef, SaltStack** (masters/minions); agentless = **Ansible, Puppet Bolt, Salt SSH**.
- Chef speaks **Ruby**; Puppet/Chef/Ansible/SaltStack ALL scale to large deployments.
- Ansible: **YAML playbooks starting with `---`**, executed with **`ansible-playbook <file>.yaml`**; control station + SSH; vault for secrets.
- Terminology match-ups are free points: modules/manifests (Puppet), cookbooks/recipes (Chef), playbooks/plays (Ansible), pillars/grains (SaltStack).
- PPDIOO = Prepare, Plan, Design, Implement, **Operate**, Optimize ("Observe" is the trap).
- GitHub/Puppet Forge value: version tracking, knowing who changed what, collaboration/sharing, faster project velocity.
