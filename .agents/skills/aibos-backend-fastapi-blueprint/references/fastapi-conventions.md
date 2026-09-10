# FastAPI Conventions

## API

- Prefix routes with `/api/v1` and group by bounded context.
- Use explicit HTTP methods, response models and status codes.
- Standardize error envelope: `code`, `message`, `details`, `request_id`.
- Validate pagination/filter bounds at the API boundary.
- Keep OpenAPI tags, summaries and examples close to route/schema definitions.
- A route handler should be mechanically boring: dependency extraction, DTO mapping, one use-case call, response mapping. Any conditional branch must be transport concern only (for example content negotiation); business branching belongs in application/domain.
- Do not import `infrastructure.db.models`, SQLAlchemy `Session`, repository implementations or provider clients from route modules. Wire them through a composition-root factory/dependency.

## Connection

```text
Pydantic Settings
  → engine/session factory in lifespan
    → request-scoped dependency
      → repository
        → use case
```

- PostgreSQL default via SQLAlchemy 2.x + Alembic.
- MySQL is a separate adapter/profile.
- MongoDB is selected for document access patterns.
- Redis is selected for cache, queue, session or rate limit.
- Do not create one unbounded global manager for all data services.
- Pool size must be derived from database limits, worker count and instance count.
- The request-scoped session/unit-of-work is owned by the application transaction boundary. Repositories receive that boundary; they do not silently create a second session or commit independently.

## Auth and policy

- Authentication identifies the actor; authorization checks actor/action/resource/context.
- Centralize `can(actor, action, resource)` or equivalent policy service.
- Apply tenant/locality scope before database query execution.
- Never return raw exception, credential, SQL or provider response to clients.

## External integrations

Each adapter declares timeout, retryable errors, max retries, circuit-breaker decision, idempotency key and redaction rules. External clients are injected into services instead of constructed inside route functions.

Use-case/application code depends on a typed gateway port, not on the adapter. Provider DTOs are translated at the adapter boundary and never returned by a use case.

## Minimum architecture checks

Before marking a backend slice complete, run checks equivalent to:

```bash
ruff check app
pytest tests/unit tests/integration tests/contract
```

and an import-boundary check (for example `import-linter`, `grimp` or a project script) that fails when `domain/application` imports framework/infrastructure modules or when `api` bypasses application use cases. If no tool is configured, add a small deterministic check before claiming the gate passes.
