# Enums (Reference)

This document lists all enum types currently defined in the database.
It reflects the **actual state of the PostgreSQL schema** and should be updated
whenever enum definitions change.

Source of truth:
- `pg_type`
- `pg_enum`
- `pg_namespace`

---

## approval_mode

Defines how a request or action requires approval.

Order:
1. must_approve
2. notify_after
3. independent

---

## assist_status

Represents the lifecycle of an assist once a helper has been selected.

Order:
1. confirmed
2. in_progress
3. completed
4. cancelled

---

## dog_size

Used for dog-related requests and preferences.

Order:
1. small
2. medium
3. large
4. extra_large

---

## membership_status

Represents a user's membership state within a neighborhood.

Order:
1. pending_location
2. pending_second_vouch
3. active
4. inactive

---

## offer_status

Represents the state of a helper's offer on a request.

Order:
1. pending
2. accepted
3. declined
4. cancelled

---

## request_status

Represents the lifecycle of a help request.

Order:
1. active
2. filled
3. expired
4. cancelled
5. archived

---

## user_role

Defines a user's role within the system.

Order:
1. seeker
2. helper
3. caregiver
4. dependent

---

## walker_preference

Used to indicate preferences when selecting a helper.

Order:
1. no_preference
2. prefers_male
3. prefers_female

---

## How to regenerate this document

Run the following query in the Supabase SQL Editor:

```sql
SELECT
  t.typname AS enum_name,
  e.enumlabel AS enum_value,
  e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
ORDER BY enum_name, e.enumsortorder;
