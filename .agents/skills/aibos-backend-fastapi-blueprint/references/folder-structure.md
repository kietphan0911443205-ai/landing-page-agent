# FastAPI Folder Structure

```text
apps/
├── api/
│   ├── app/
│   │   ├── main.py                 # FastAPI app/lifespan
│   │   ├── core/                   # config, logging, security, errors
│   │   ├── api/v1/                 # HTTP routes + dependencies
│   │   ├── domain/                 # entities, value objects, policies
│   │   ├── application/            # commands, queries, use cases
│   │   ├── infrastructure/         # DB, repositories, integrations
│   │   └── schemas/                # Pydantic API schemas when shared
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── contract/
├── worker/
│   ├── celery_app.py
│   └── tasks/
├── migrations/                     # Alembic versions
└── pyproject.toml
```

## Domain module shape

```text
app/domain/attendance/
├── entities.py
├── policies.py
├── ports.py
└── errors.py

app/application/attendance/
├── commands.py
├── queries.py
└── service.py

app/infrastructure/db/
├── session.py
├── models.py
└── repositories/attendance.py

app/api/v1/
└── routes_attendance.py
```

## Dependency contract

Allowed direction for every module:

```text
api / worker / infrastructure  →  application  →  domain
infrastructure                  →  ports defined by application/domain
composition root                →  all concrete implementations
```

The following are forbidden inside `domain` and `application`: FastAPI, API-facing Pydantic schemas, SQLAlchemy/ORM models, database sessions, database drivers, HTTP/provider SDKs, Celery, filesystem access and environment reads. `api` must not import ORM models or repositories directly; it depends on a use-case factory or application port. Persistence models belong under `infrastructure` and are mapped to domain objects at that boundary.

For each new bounded context, add a short `ARCHITECTURE.md` or module contract containing:

1. owned aggregates/resources and actor/resource authorization rules;
2. allowed and forbidden imports;
3. use cases and their transaction owner;
4. repository/gateway ports and adapter implementations;
5. one vertical-slice test proving the route-to-use-case wiring.

Small projects may keep `domain`, `application` and `infrastructure` flatter. Do not create layers with no behavior; the boundary matters more than folder count.

## Mapping from current Flask style

| Flask style | FastAPI blueprint |
|---|---|
| `controllers/*` | `api/v1/routes_*` |
| `services/*` | `application/*` and domain services |
| `models/*` | domain entities + persistence models |
| `db/connection_manager.py` | `infrastructure/db/session.py` and dependencies |
| `common/jwt.py` | `core/security.py` + policy module |
| `celery/*` | `worker/` |
| `job/*` | worker tasks or scripts with explicit entry point |
| Flasgger docstring | FastAPI Pydantic/OpenAPI contract |
