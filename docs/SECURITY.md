# Security Guidelines

This document outlines security considerations for the Skintellect application.

## Environment Variables

### Never Commit Secrets

- All secrets must be stored in environment variables
- Never commit `.env`, `.env.local`, or any file containing secrets
- Use `.env.example` as a template (it contains no actual secrets)

### Server-Only Variables

The following should ONLY be accessed server-side:

| Variable | Purpose | Access |
|----------|---------|--------|
| `DATABASE_URL` | PostgreSQL connection | Server only |
| `AMAZON_ACCESS_KEY` | Amazon affiliate API | Server only |
| `AMAZON_SECRET_KEY` | Amazon affiliate API | Server only |
| `SHAREASALE_API_TOKEN` | ShareASale API | Server only |
| `IMPACT_AUTH_TOKEN` | Impact affiliate API | Server only |
| `NEXTAUTH_SECRET` | Session encryption | Server only |

### Client-Safe Variables

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics domain |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics key |

## Database Security

### Connection

- Use SSL in production (`?sslmode=require` in connection string)
- Use connection pooling for production (e.g., PgBouncer)
- Rotate credentials periodically

### Access Patterns

- All database access goes through the `db` singleton in `src/lib/db.ts`
- Never expose raw database queries to client-side code
- Use repository pattern for all data access (`src/lib/repositories/`)

### Data Handling

- Sanitize all user input before database operations
- Use Prisma's parameterized queries (automatic SQL injection protection)
- Never store sensitive PII without encryption

## API Security

### Rate Limiting

When implementing public APIs, add rate limiting:

```typescript
// Example: Implement in middleware or route handlers
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,     // 60 requests per minute
};
```

Recommended limits:
- Public API endpoints: 60 req/min
- Ingredient analysis: 10 req/min (CPU intensive)
- Search suggestions: 100 req/min

### Input Validation

Always validate:
- Search queries (length, allowed characters)
- Ingredient lists (max length, sanitization)
- URL parameters (slugs, IDs)

### CORS

- Configure CORS to allow only trusted origins
- Never use `Access-Control-Allow-Origin: *` in production

## Affiliate Link Handling

### Click Tracking

- Store aggregate counts only, no PII
- Do not store IP addresses or user agents
- Use session-based deduplication if needed

### Redirect Safety

- Validate affiliate URLs against allowlist of known retailers
- Never redirect to user-provided URLs
- Log all redirects for audit purposes

## User Data (Future)

When implementing user accounts:

### Authentication

- Use established auth libraries (NextAuth.js)
- Implement proper password hashing (bcrypt, argon2)
- Enable MFA for sensitive operations

### Data Storage

- Minimize data collection (only what's necessary)
- Encrypt sensitive data at rest
- Implement data retention policies

### GDPR/Privacy

- Provide data export functionality
- Allow account deletion
- Document data processing in privacy policy

## Monitoring & Incident Response

### Logging

- Log security-relevant events (auth failures, rate limit hits)
- Never log sensitive data (passwords, tokens)
- Use structured logging for searchability

### Alerts

Set up alerts for:
- Unusual traffic patterns
- Authentication failures
- Database errors
- API rate limit breaches

### Incident Response

1. Identify and contain the issue
2. Document what happened
3. Notify affected users if data was exposed
4. Implement fixes
5. Post-mortem and prevention

## Security Checklist

Before deploying:

- [ ] All secrets in environment variables
- [ ] `.env*` files in `.gitignore`
- [ ] SSL/TLS enabled
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Error messages don't leak sensitive info
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Dependencies updated and audited

