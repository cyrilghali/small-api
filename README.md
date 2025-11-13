# Hello, Friend

All routes were tested and implemented.

In real-case scenario, APIs should answer to business needs, and that context has much influence on tech implementation.
Choices were made here, for example:

- **JSON payload size** is limited to 2MB maximum. In theory, we should understand user needs and check if it fits.
- **All CORS origins** are allowed (`*`) as this is a development/testing API (production APIs should restrict to specific origins)
- **No authentication/authorization** is required. (production APIs should validate API keys, JWT tokens, or OAuth)
- **No rate limiting** is required. (production should implement per-IP limits to prevent abuse)
- **Logging is not required**, it’s lightly implemented to enhance the developer experience (DX)
- **Strategy pattern** is used for crypto/signature algorithms to allow easy swapping of implementations without changing business logic. See [refactoring.guru/design-patterns/strategy](https://refactoring.guru/design-patterns/strategy).

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
pnpm test:run

# Production
pnpm run build
SIGNATURE_SECRET=$(openssl rand -hex 32) node dist/index.js

# Load testing
DISABLE_LOGGING=true node dist/index.js
```

### Environment Variables

- **SIGNATURE_SECRET**: A secure random string used for cryptographic signatures. Generate one with:
  - `openssl rand -hex 32` (Unix/Linux/macOS)
  - Or any 32+ character random string
  - Can also be set in a `.env` file
- **PORT**: Server port (default: 3000)
- **DISABLE_LOGGING**: Set to `"true"` to disable request logging

## What could be improved

- We could generate a request ID so we can correlate logs more easily.
- We could have proper JSON logging so it can be aggregated in another observability tool.
- Coverage is mostly enough. We could define a target and cover missing paths.
- We could have concurrency and loads tests to check how robust our api is, and define SLAs for it
- The list could be infinite here; it's more a matter of what the users' needs (both dev and client users) are and what we choose to tackle.
