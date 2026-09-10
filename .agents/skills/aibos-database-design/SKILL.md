---
name: aibos-database-design
description: "Use when designing a new database schema, adding tables/columns to an existing one, choosing keys and indexes, planning migrations, or reviewing a schema for anti-patterns. Triggers: 'thiết kế database', 'schema', 'ERD', 'migration', 'index chậm', 'chuẩn hóa', slow queries caused by structure. Covers relational modeling (ERD → 3NF → deliberate denormalization), index design from query patterns, expand-contract migrations, and NoSQL access-pattern-first design."
license: MIT
metadata:
  hermes:
    tags: [sdlc-pro, database, schema, erd, indexing, migration, sql]
    related_skills: [aibos-architecture-ddia, aibos-architecture-ddd, performance-profiling, system-design]
---

# Database Design — Schema, Indexes, Migrations

## Vietnamese Output Contract

Output và tài liệu phải bằng tiếng Việt; giữ nguyên keyword/code/SQL/Mermaid, tên file và identifier. Không bịa dữ liệu, quyết định hoặc nguồn; tách rõ `confirmed`, `proposed`, `assumption`, `risk` và `open question`; nêu nguồn, trade-off, blocker và bước tiếp theo khi phù hợp. Nếu project có output contract riêng, đọc contract đó trước khi thực hiện.


Khi dùng trong AIBOS, toàn bộ phân tích, schema notes, ERD explanation, migration plan và output tài liệu phải bằng tiếng Việt; giữ nguyên SQL, tên bảng/cột, mã requirement và thuật ngữ kỹ thuật khi cần.

## Overview

Design schemas from the domain model and the **query patterns**, not from the UI. The two questions that decide everything: *what must be consistent together?* (→ aggregate → transaction boundary → table cluster) and *how will it be read?* (→ indexes, denormalization). `aibos-architecture-ddia` covers distributed data theory; this skill covers the daily craft it assumes you know.

## When to Use

- Creating or extending a schema (SQL or NoSQL)
- Reviewing slow queries whose cause is structural (missing index, wrong key, EAV)
- Planning any migration on a table that has production data
- Don't use for: query-only optimization with a fine schema (use `performance-profiling`), or distributed replication/partitioning strategy (use `aibos-architecture-ddia`)

## Workflow (relational)

### Step 1 — Entities from the domain, boundaries from aggregates

From the SRS/domain model (`aibos-architecture-ddd`): each **aggregate** = the set of rows that must change in one transaction. Draw the ERD before writing any DDL:

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_LINE : contains
  PRODUCT ||--o{ ORDER_LINE : "referenced by"
  ORDER { uuid id PK, uuid customer_id FK, text status, timestamptz created_at }
  ORDER_LINE { uuid id PK, uuid order_id FK, uuid product_id FK, int qty, numeric unit_price }
```

Rule: FK **within** an aggregate → enforce with constraint + cascade rules decided explicitly. FK **across** aggregates → constraint yes, cascade NO (cross-aggregate deletes are business decisions, not DB side effects).

**Done when:** every entity has a PK strategy, every relationship has cardinality and an on-delete decision.

### Step 2 — Normalize to 3NF, then denormalize on purpose

- 1NF: no arrays-of-things in one column (JSON columns allowed ONLY for genuinely schemaless payloads you never filter/join on).
- 2NF/3NF: every non-key column depends on the whole key and nothing but the key.
- Then denormalize **only** with a written justification: "read X is 100:1 vs write Y; duplicating `customer_name` on `order` avoids join Z; staleness acceptable because ...". Copy-columns need an update trigger or an accepted staleness window — state which.

### Step 3 — Keys and types

| Decision | Default | When to deviate |
|---|---|---|
| PK | `uuid` v7 (time-ordered) or `bigint identity` | v4 UUID only if generation must be uncoordinated — it fragments b-tree clustering |
| Money | `numeric(19,4)` | never float |
| Time | `timestamptz` UTC | naive timestamps are a bug |
| Enum-ish | `text` + CHECK constraint | native ENUM only if values are truly frozen |
| Soft delete | avoid; use `archived_at timestamptz NULL` + partial indexes | full soft-delete-everywhere poisons every query with `WHERE deleted_at IS NULL` |

Naming: `snake_case`, singular table names or plural — pick ONE repo-wide; FK named `<referenced_table>_id`; indexes `ix_<table>_<cols>`, unique `ux_`, check `ck_`.

### Step 4 — Indexes from the query list, not from guesses

Write the top-10 expected queries FIRST, then derive indexes:

1. Every FK column gets an index (joins + prevents lock escalation on parent delete).
2. Composite index column order: equality filters first, then range, then sort. `WHERE tenant_id = ? AND created_at > ? ORDER BY created_at` → `(tenant_id, created_at)`.
3. Covering: add `INCLUDE (cols)` when the query needs 1-2 extra columns and is hot.
4. Partial: `WHERE status = 'active'` queries on a 95%-inactive table → `CREATE INDEX ... WHERE status='active'`.
5. Every index costs writes. >5-6 indexes on a hot-write table = smell; justify each.

**Done when:** each top-10 query has `EXPLAIN (ANALYZE)` showing index usage on realistic row counts (generate synthetic data if needed — 100 rows proves nothing).

### Step 5 — Migrations: expand-contract, never break

Production migration discipline (works with Alembic/Flyway/Prisma/raw SQL):

1. **Expand**: add new column/table (nullable or defaulted) — old code still runs.
2. **Backfill** in batches (`UPDATE ... WHERE id BETWEEN ...`, thousands per batch, sleep between) — never one giant UPDATE that locks the table.
3. **Dual-write** window: new code writes both, reads old.
4. **Switch reads** to new; verify.
5. **Contract**: drop old column in a LATER release, after a full rollback window.

Hard rules: no `DROP`/`RENAME` in the same release that introduces the replacement; every migration has a tested `down` (or a documented "irreversible — restore from backup" note); adding NOT NULL to an existing column = 3 steps (add nullable → backfill → set NOT NULL).

## NoSQL (document / wide-column)

Design from **access patterns first**: list every read ("get cart by user", "orders by user by date desc") before modeling. Embed what you read together (order + lines in one document); reference what grows unboundedly or is shared (product catalog). One document = one aggregate = the unit of atomic update. If you need multi-document transactions routinely, the data is relational — use Postgres.

## Anti-Pattern Catalog

| Smell | Why it hurts | Fix |
|---|---|---|
| EAV (entity_attribute_value table) | no types, no constraints, unindexable | real columns; JSONB for the truly dynamic tail |
| Polymorphic FK (`owner_type` + `owner_id`) | no FK constraint possible | separate FK columns or association tables |
| Implicit FK without index | parent deletes lock child scans | index every FK (Step 4.1) |
| N+1 from ORM lazy loading | 1 query becomes 500 | eager load / JOIN; verify with query log |
| Business logic in triggers | invisible, untestable | app-layer services; triggers only for audit/denorm-sync |
| One `status` column driving 12 workflows | states multiply, queries rot | state per concern; or workflow table with history |
| Storing derived data with no sync plan | silently wrong forever | trigger, materialized view with refresh policy, or compute on read |

## Common Pitfalls

1. **Designing from the admin UI form** — model the domain, not the screen; screens change weekly.
2. **Testing migrations on empty DBs** — always test against a data-volume clone; empty-table `ALTER` lies about lock time.
3. **UUID v4 PK on huge insert-heavy tables** — random insert points fragment the index; use v7/ULID.
4. **Skipping the on-delete decision** — every FK missing explicit `ON DELETE` behavior is a future incident.
5. **Letting the ORM generate the schema unreviewed** — ORMs create nullable-everything, index-nothing schemas. Review generated DDL like code.
6. **No retention/PII plan** — mark PII columns at design time; deleting users later without it is archaeology.

## Verification Checklist

- [ ] ERD (Mermaid) exists; every relationship has cardinality + on-delete behavior
- [ ] Every denormalization has a written justification + staleness/sync plan
- [ ] Every FK indexed; composite indexes match the written top-10 query list
- [ ] `EXPLAIN (ANALYZE)` run on top queries against realistic data volume
- [ ] Money=numeric, time=timestamptz UTC, no float money, no naive time
- [ ] Migration follows expand-contract; NOT NULL additions done in 3 steps; batched backfill
- [ ] `down` migration tested or irreversibility documented
- [ ] PII columns flagged; retention stated
- [ ] Naming conventions consistent (spot-check 3 tables)
