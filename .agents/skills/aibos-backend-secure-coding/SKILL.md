---
name: aibos-backend-secure-coding
description: "Use when implementing authentication, authorization, session/token handling, input validation, file uploads, rate limiting, or any endpoint touching user data or secrets. Triggers: 'login', 'JWT', 'OAuth', 'phân quyền', 'bảo mật API', 'password', 'upload', 'API key'. This is the BUILD side (secure implementation recipes + ASVS-lite checklist); pentest skills verify afterwards. FAIL-CLOSED: when unsure, deny."
license: MIT
metadata:
  hermes:
    tags: [sdlc-pro, security, authentication, authorization, owasp, jwt, validation]
    related_skills: [aibos-frontend-app-scaffolding, aibos-database-design, release-it, clean-architecture]
---

# Backend Secure Coding — AuthN, AuthZ, Validation, Secrets

## Overview

Security is implemented at build time, not audited in later. This skill gives the default-safe recipes for the 90% cases and an ASVS-lite checklist. Prime directive: **fail closed** — missing permission check = deny; unparseable input = reject; unknown state = error, never "probably fine".

## When to Use

- Any endpoint handling login, sessions, roles, personal data, money, files, or secrets
- Reviewing code that does the above
- Don't use for: penetration testing an existing app (use `optional-skills/security/web-pentest`), infra hardening (use `vps-provisioning`)

## 1. Authentication

**Session vs JWT — decide, don't drift:**

| Context | Choice | Why |
|---|---|---|
| Same-origin web app | **Server session + httpOnly cookie** (default) | revocable, no client storage problem |
| Mobile/3rd-party API clients | Short-lived access JWT (≤15m) + rotating refresh token | statelessness actually needed |
| Microservices internal | mTLS or signed service tokens | user JWTs don't belong between services |

Session recipe: httpOnly + Secure + SameSite=Lax cookie; session id ≥128-bit random; **rotate session id on login** (fixation); absolute timeout (e.g. 24h) + idle timeout; server-side revocation list.

JWT recipe: RS256/EdDSA (asymmetric) unless single-service; validate `exp`, `iss`, `aud` — libraries skip `aud` by default; refresh tokens are single-use and **rotated on every refresh** with reuse-detection → revoke family; access tokens never in localStorage for web (XSS = game over) — httpOnly cookie or memory only.

Passwords: **argon2id** (m=64MB,t=3) or bcrypt(cost≥12); generic error "invalid credentials" for both wrong-user and wrong-password; rate limit + lockout with backoff on failures; password reset tokens: single-use, ≤30min, hashed at rest, session invalidated on reset.

OAuth2/OIDC (login-with-X): Authorization Code + **PKCE** always (including confidential clients); validate `state`; verify ID token signature + nonce; never accept unverified emails as account-linking keys.

## 2. Authorization — where IDOR is born and dies

- Check at the **resource layer**, not just the route: `GET /orders/123` must verify `order.owner_id == current_user.id` (or explicit grant) AFTER fetching — route-level "is logged in" is not authorization.
- Centralize policy: one `can(user, action, resource)` module; inline `if user.role == 'admin'` scattered in handlers = unauditable. RBAC for coarse roles; add ownership/attribute checks per resource.
- Deny by default: new endpoints require an explicit policy entry; a route without one fails closed (enforce with middleware that rejects unannotated routes if feasible).
- Never trust client-sent identity: `user_id` in request body is display data at best — actor comes from the session/token ONLY.
- Mass assignment: bind request bodies to explicit DTOs/schemas (pydantic/zod/class-validator with whitelist) — never `Model(**request.json)`.

## 3. Input validation & injection

- Validate at the boundary with schemas (same-schema-shared rule from `aibos-frontend-modern-stack`); types+ranges+lengths+enums; reject unknown fields.
- SQL: parameterized queries ALWAYS; ORM raw fragments (`.raw()`, `text()`) get parameters, never f-strings.
- Command exec: avoid; if forced, arg arrays (no shell=True), allowlist inputs.
- Path/file: `basename` + join under a fixed root + verify the resolved path is still under root.
- Uploads: allowlist MIME **and** sniff magic bytes; size cap; store outside webroot under random names (original filename is display metadata); images → re-encode (strips payloads+EXIF); serve from separate domain/CDN with `Content-Disposition`.
- SSRF: user-supplied URLs → allowlist schemes+hosts, resolve and block private ranges (169.254.x, 10.x, 172.16-31.x, 192.168.x, localhost) before fetching.

## 4. Secrets & sensitive data

- Secrets only via env/secret manager (`aibos-frontend-app-scaffolding` fail-fast rule); grep for hardcoded keys before every commit (`requesting-code-review` does scan — don't create work for it).
- Logs: never log passwords, tokens, cookies, full card/ID numbers; add a redaction filter to the logger config once, centrally.
- PII at rest: flag columns at design time (`aibos-database-design`); encrypt what regulation requires; deletion path implemented, not promised.
- Responses: problem-details errors without stack traces or SQL fragments; 404 (not 403) for resources the caller shouldn't know exist, applied consistently.

## 5. Transport & headers (app-level)

HTTPS assumed from infra (`vps-provisioning`); app sets: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy` (start `default-src 'self'`; report-only first), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`. CORS: explicit origin list — `*` with credentials is a vulnerability, not a config.

## 6. Rate limiting & abuse

Per-IP AND per-account on: login, signup, password reset, OTP, expensive queries. Sliding window in Redis; 429 + `Retry-After`. Login lockout: exponential backoff per account (not hard-lock — that's a DoS vector against your users). Audit log (append-only): auth events, permission denials, admin actions — with actor, resource, trace_id.

## ASVS-lite Checklist (gate before merge)

- [ ] Passwords argon2id/bcrypt≥12; generic auth errors; reset tokens single-use ≤30m hashed
- [ ] Session id rotated at login; cookies httpOnly+Secure+SameSite; revocation works (test logout-then-replay)
- [ ] JWT: asymmetric alg pinned, `exp/iss/aud` all validated, refresh rotation + reuse detection
- [ ] Every resource endpoint has ownership/permission check AFTER fetch (write one IDOR test per resource: user A requests user B's object → 404)
- [ ] All bodies bound to whitelist schemas; unknown fields rejected
- [ ] Zero string-built SQL/shell (grep `f"SELECT`, `+ sql`, `shell=True`)
- [ ] Uploads: magic-byte sniff, size cap, random names, outside webroot
- [ ] User-URL fetches blocked from private IP ranges
- [ ] Security headers present (curl -I and read them); CORS origin list explicit
- [ ] Rate limits on auth endpoints; audit log writes verified
- [ ] Log output inspected: no tokens/passwords/PII in sample requests

## Common Pitfalls

1. **Route-guard-only authorization** — "logged in" ≠ "allowed"; IDOR lives here. The after-fetch ownership check is the fix.
2. **JWT in localStorage** because a tutorial did — one XSS = every account.
3. **`alg` not pinned** — accepting attacker-chosen `none`/HS256-with-public-key.
4. **Validating on the frontend only** — the API is the boundary; the browser is a suggestion.
5. **403 vs 404 leaks** — 403 on other users' resource ids confirms existence; return 404 consistently.
6. **Rolling your own crypto/token format** — use the platform library; novelty here is a CVE.
7. **Fixing security in review instead of build** — this checklist runs BEFORE `requesting-code-review`, which then verifies instead of discovering.

## Verification Checklist

- [ ] ASVS-lite checklist above fully walked, each item evidenced (command output or file:line)
- [ ] IDOR test per resource type exists and passes
- [ ] Logout/replay test passes; refresh-reuse test revokes family
- [ ] `web-pentest` (or aibos-qa-exploratory adversarial pass) scheduled as independent verification
