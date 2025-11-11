# Cryptographic API

Small-api challenge.

## Specification.

The challenge specified:

1. **POST /encrypt** - Accept JSON object, encode all top-level values to Base64
2. **POST /decrypt** - Accept JSON object, decode Base64 values back
3. **POST /sign** - Generate HMAC-SHA256 signature where property order doesn't matter
4. **POST /verify** - Validate signature, return 204 (success) or 400 (invalid)
5. **Algorithm abstraction** - Both crypto and signing must use pluggable strategies

All 5 requirements implemented and tested.

## What I added (beyond spec)

These weren't required, but show attention to quality:

- **Type preservation** - Decryption restores original types: `"5"` → `5`, `"true"` → `true`, `"null"` → `null`
- **Circular reference detection** - Prevent infinite loops during serialization
- **Timing-safe comparison** - Prevents timing attacks on signature verification
- **Performance optimizations** - Gzip compression, optimized parsing, conditional logging
- **Environment validation** - Startup checks for required secrets and validates constraints
- **Integration tests** - 39 tests covering all endpoints and edge cases

## Architecture

Uses the strategy design pattern to make crypto and signature algorithms pluggable.
You can swap Base64 for AES-256 or HMAC for RSA without touching the business logic.
See [refactoring.guru/design-patterns/strategy](https://refactoring.guru/design-patterns/strategy).

## Load Test Results

Tested with **k6.io**.
In a real scenario, I'll ask for how many users we have, and if performance is an issue or not.

```
Configuration:
  VUs (Virtual Users): Up to 50 concurrent users
  Duration: 40 seconds with gradual ramp-up and ramp-down
  Total Iterations: 1,810
  Total HTTP Requests: 7,240

Results:
  Throughput:         178.4 req/s
  Avg Response Time:  2.25ms
  Min Response Time:  308µs
  Max Response Time:  22.93ms
  P(90) Latency:      3.84ms ✓ (threshold: <200ms)
  P(95) Latency:      4.86ms ✓ (threshold: <200ms)
  P(99) Latency:      7.63ms ✓ (threshold: <500ms)
  Data Sent:          1.3 MB
  Data Received:      1.4 MB
```

## Tech Stack

- Node.js 24+ with TypeScript
- Express 5.1
- Vitest (39 integration tests)
- Joi validation
- ESLint + Prettier + Husky pre-commit hooks

## Quick Start

```bash
# Install
pnpm install

# Development
pnpm dev              # http://localhost:3000

# Testing
pnpm test:run         # 39 tests, once

# Production
npm run build
SIGNATURE_SECRET=your-32-char-secret-here node dist/index.js

# Load testing
DISABLE_LOGGING=true node dist/index.js
```

## Testing

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

## Known Limitations

Secrets management is minimal—single environment variable, no key rotation. In production you'd want versioned keys and a secrets vault.

Signature operations are synchronous. For very large payloads or high concurrency, async operations would help.
