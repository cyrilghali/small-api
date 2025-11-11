# Hello, Friend

All routes were tested and implemented.
We use the strategy design pattern to make crypto and signature algorithms pluggable.
See [refactoring.guru/design-patterns/strategy](https://refactoring.guru/design-patterns/strategy).

In real-case scenario, APIs should answer to business needs, and that context has much influence on tech implementation.
Choices were made here, for example, we assume that:

- **JSON payload size** is limited to 100KB maximum (compression enabled for larger responses)
- **All CORS origins** are allowed (`*`) as this is a development/testing API (production APIs should restrict to specific origins)
- **No authentication/authorization** is implemented (production APIs should validate API keys, JWT tokens, or OAuth)
- **No rate limiting** is configured (production should implement per-IP or per-user limits to prevent abuse)
- **Logging is optional** and can be disabled for performance testing (production should log security events and errors)
- **Strategy pattern** is used for crypto/signature algorithms to allow easy swapping of implementations without changing business logic

## Tech Stack

- Node.js 24+ with TypeScript
- Express 5.1
- Vitest.
- Joi validation
- ESLint + Prettier + Husky pre-commit hooks
- Github CI.

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
