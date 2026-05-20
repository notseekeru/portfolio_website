---
title: Server Security Measures
date: 2026-04-12
description: Transforming a standard Linux server into a hardened, production-ready edge gateway.
---

---

# Summary

This present my journey of hardening a Raspberry Pi 5 server, transitioning from a default setup to a secure, Tailscale only gateway. I detail the audit process, the implementation of strict firewall rules, and the architectural shift that transformed my server into a sophisticated node.

## Building a Secure Foundation

When I started self-hosting services on my Raspberry Pi 5, I quickly realized that `hosting is 10% application logic and 90% defensive engineering`. My initial setup relied on open ports and default configurations which is a structural liability for any public-facing server.

Though in our region, CGNAT is prevelant on every PH ISPs. I still decided to decommission the "default" mindset and rebuild my server's security from the ground up.

---

## Identifying the Attack Surface

**The Problem:** Every open port is a potential entry point for unauthorized bot attacks.

**The Audit:** Performed a full audit of running services, group permissions, and user accounts.

**The Solution:** Before enabling UFW, double-check that /etc/ssh/sshd_config has Port 223 set and you have restarted the service. This ensures you don't lock yourself out when you enable the firewall.

- Enforced non-root user management for all persistent processes.
- Implemented a "Defense in Depth" strategy using UFW with a strict default-deny policy.
- SSH Key-based authentication only, with port forwarding disabled and root login prohibited.
- Eliminated `password-based SSH` access in favor of hardened key-based authentication.
- Public Access is None thanks to Tailscale, which provides a secure, encrypted bridge between my local desktop and the Raspberry Pi.

Using `sudo ss -tupln`, I audited my listening ports and found several services exposing unnecessary surfaces.

Other commands I used for the audit:

```bash
# Verify listening ports
sudo ss -tupln
# UFW Commands
sudo ufw status verbose # Check current firewall status
sudo ufw allow 223/tcp # Allow SSH on port 223
sudo ufw default deny incoming # Deny all incoming by default
sudo ufw default allow outgoing # Allow all outgoing by default
sudo ufw enable # Enable the firewall
# Audit service logs
journalctl -u tailscaled --since "1 hour ago"
```

The most critical architectural shift was transitioning the server from an **Unsecure node** to a **Tailscale Private Gateway** to maximize `Defense in Depth`.

By binding internal services exclusively to the Tailscale interface, they are unreachable from the public internet.

---

## Post Mortem

I hit a "locked-out" state once due to me layering UFW rules incorrectly, effectively blocking all incoming connections. This was a critical learning moment. I had to physically access the Raspberry Pi, connect a monitor and keyboard, and manually disable UFW to regain access. This experience underscored the importance of careful planning and testing when implementing security measures. This helped me design my ansible playbook to be idempotent and avoid human error and intervention when provisioning future infrastructure.

---

## When Security Meets Infrastructure

1. **"Secure by Default is Flawed:** Standard Linux distros prioritize usability. I learned that hardening is an active process—you have to hunt for "defaults" and consciously dismantle them.
2. **Audit over Intuition:** I stopped "vibe-coding" my security. I spent hours in `journalctl` and `systemctl` logs, learning the precise handshake failures between my services.
3. **Documentation as Defense:** By mapping out my port requirements in an ADR, I stopped making "emergency" firewall exceptions and started implementing "architectural" security policies.
4. **Future Vision:** I eventually made my whole infrastructure setup to a portable `ansible playbook` to power my `Idempotent` nodes to minimize human intervention and labor to provision systems. This allowed me to automate my future infrastructure to a modular `ansible role` and minimize server downtime and planned Disaster Recover.

---

## Conclusion

By hardening the base layer, I’ve established an **Anchor**. Any service I deploy now inherits these security defaults (UFW rules, non-root user isolation, Network commands, SSH hardening). I’m no longer just "running code"—I’m operating a secure, deterministic edge gateway.

---
