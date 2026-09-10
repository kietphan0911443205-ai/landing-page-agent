# Flask to FastAPI Conversion

## Phases

1. Inventory Flask routes, status codes, payloads, side effects and dependencies.
2. Capture current behavior with characterization/API tests.
3. Publish an OpenAPI contract and resolve inconsistent endpoint semantics.
4. Extract business logic from controllers into services/use cases.
5. Extract database access behind repository/session dependencies.
6. Add FastAPI routes with equivalent response/error behavior.
7. Run Flask and FastAPI side by side behind a controlled routing switch.
8. Migrate frontend calls and background jobs.
9. Retire Flask endpoints only after traffic, errors and data consistency are verified.

## Endpoint migration record

| Field | Value |
|---|---|
| Legacy route |  |
| FastAPI route |  |
| Owner/domain |  |
| Request compatibility |  |
| Response compatibility |  |
| Auth/policy |  |
| DB side effects |  |
| Tests |  |
| Rollback switch |  |

## Do not carry forward automatically

- wildcard CORS with credentials;
- fallback password or remote DB host;
- global connection manager as implicit dependency;
- unbounded connection pools;
- background infinite loops in web process;
- Swagger documentation that disagrees with runtime behavior;
- controller functions that silently ignore required fields.
