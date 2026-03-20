# Auth / admin magic link — reliability runbook

Email sign-in will only be **predictable** if environment and DNS match how users open the site. No code path can fix wrong `AUTH_URL` or mixed secrets.

## Production checklist (Vercel)

| Variable | Rule |
|----------|------|
| `AUTH_SECRET` | Long random string; **same** across all Production instances. Changing it **logs everyone out**. |
| `AUTH_URL` | Exactly the origin users use: **`https://www.getcran.ai`**. Never `*.vercel.app` for the deployment that serves that traffic. |
| `NEXT_PUBLIC_SITE_URL` | Same origin as `AUTH_URL` (e.g. `https://www.getcran.ai`). |
| `NEXTAUTH_URL` | Optional; if set, must match `AUTH_URL` (avoid duplicating with conflicting values). |
| `RESEND_API_KEY` | Required; domain must be verified in Resend for your from-address. |
| `AUTH_FROM_EMAIL` | Verified sender in Resend. |

## DNS / domains

- Custom domain **`www.getcran.ai`** must be attached to the **same** Vercel project as Production.
- Apex **`getcran.ai`** should redirect to `www` (already configured in `next.config.ts` / `vercel.json`).

## What we validate automatically

- **`scripts/check-auth-env.mjs`** runs before production builds on Vercel (`VERCEL_ENV=production`) and **fails the build** if the above is inconsistent (e.g. `AUTH_URL` still on `vercel.app`).
- **`instrumentation.ts`** logs warnings on server start in production if something is still wrong.

## Allowed admin domains

- Checked **only when sending** the magic link (`src/lib/admin-email.ts` + `signIn` verification request). Same rules: `*.getcran.ai` and `*.cran-us.com`, NFKC-normalized. The link itself is tied to a DB token; callback doesn’t re-run the domain gate.

## If login fails

1. **Redirect to `/auth/signin` with no query** — usually **no session cookie** (secret, host, `AUTH_URL`, or cookie domain).  
2. **`?error=AccessDenied`** — rare; means the server rejected the address when requesting the link (or a non–email-provider path).  
3. Request a **new** magic link after any `AUTH_URL` / secret change.  
4. Confirm in DevTools → Application → Cookies for **`www.getcran.ai`** that `authjs.session-token` (or `__Secure-authjs.session-token`) appears **after** clicking the link.

## Tests

- `npm test` includes Vitest checks for `isAllowedAdminEmail` — run in CI so allowlist regressions are caught.

## Honest limit

**100%** delivery depends on Resend, recipient mail filters, and user inbox — but **your app** can be **100% consistent** on URL, cookie host, secret, and allowlist by enforcing the env rules above and keeping Production config in sync.
