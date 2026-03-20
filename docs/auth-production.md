# Auth / magic link — production checklist

## Stack (audit)

| Piece | Role |
|-------|------|
| `src/auth.ts` | NextAuth v5 + Resend email provider, JWT sessions, Prisma adapter (users + verification tokens), `signIn` allowlist, `jwt`/`session` email hydration, `redirect` uses request `baseUrl`. |
| `basePath: "/api/auth"` | **Locked in code** — must match `src/app/api/auth/[...nextauth]/route.ts`. `AUTH_URL` should be **origin only** (`https://www.getcran.ai`), not a path. |
| `src/app/admin/layout.tsx` | `dynamic` + `noStore()` + `auth()`; needs signed-in user with an email (domain already enforced when the link was sent). |
| `src/lib/admin-email.ts` | Domain allowlist for **magic-link request** only (+ optional client hint on sign-in form). |
| `src/lib/prisma-auth-adapter.ts` | Case-insensitive `getUserByEmail` for Postgres. |
| `instrumentation.ts` | Production startup: logs `getAuthEnvIssues()` from `src/lib/auth-env.ts`. |

Emails deliver but you get sent back to sign-in or “denied” when opening `/admin` almost always means **the session cookie is missing or not sent** on the next request—not Resend.

## Required (Vercel **Production**)

| Variable | Value |
|----------|--------|
| `AUTH_SECRET` | One stable secret for this project (never rotate casually; changing it logs everyone out). |
| `AUTH_URL` | **Origin only**: `https://www.getcran.ai` (no extra path, or exactly `/api/auth` if you really mirror that — prefer origin only). Not `*.vercel.app` for the live site. |
| `NEXT_PUBLIC_SITE_URL` | Same canonical origin, e.g. `https://www.getcran.ai`. |

Redeploy after changing env vars.

## Strongly recommended

| Variable | When |
|----------|------|
| `AUTH_COOKIE_DOMAIN=.getcran.ai` | If anyone opens **both** `https://getcran.ai` and `https://www.getcran.ai`. Without this, the cookie is **host-only** and logging in on one hostname does not count as logged in on the other. **Do not** set this on localhost or preview URLs. |

## Code behavior (this repo)

- Admin UI uses **`dynamic = "force-dynamic"`** and **`noStore()`** so Next.js does not cache a “logged out” layout without your cookies.
- Magic links use the origin Auth.js builds (driven by `AUTH_URL` / request), so it must match where users click the link.

## Quick verification in the browser

1. Open DevTools → **Application** → **Cookies** → `https://www.getcran.ai`.
2. After a successful magic-link redirect, you should see something like **`__Secure-authjs.session-token`** (or chunked variants).
3. Navigate to `/admin` in the **same** tab/window; the cookie should still be there.
4. If the cookie appears under `vercel.app` but you browse `getcran.ai`, fix **`AUTH_URL`** to `https://www.getcran.ai` and sign in again on that host.

## Still broken?

- Confirm **Production** env (not only Preview) has the values above.
- Ensure you are not blocking **third-party cookies** in a way that affects **first-party** `getcran.ai` (rare; usually fine).
- In Vercel logs, search for `[auth] signIn denied` — that path is allowlist-related; **no log + bounce to sign-in** is usually **no session cookie**.
