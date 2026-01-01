# RLS Policies Reference

## RLS Policy Overview

RLS policies enforce **who can see or change data**, aligned with real-world trust boundaries:

- **Ownership-Based Access**
  - Users manage their own profiles, requests, offers, assists, and help details.
  - Helpers and seekers are strictly scoped to their roles.

- **Relationship-Aware Visibility**
  - Assists are visible only to the involved helper and seeker.
  - Issue reports are visible only to involved parties or seed users in the same neighborhood.
  - Neighborhood membership gates access to neighborhood-scoped data.

- **Role & Status Enforcement**
  - Only seekers can create requests.
  - Only helpers can make offers.
  - State transitions are tightly controlled (e.g., only pending offers can be cancelled).

- **Neighborhood Trust Model**
  - Active membership is required to view neighborhoods, profiles, and create invite codes.
  - Seed users gain elevated read access for moderation and safety.

RLS ensures **least-privilege access**, **neighborhood isolation**, and **role correctness** directly at the database layer.


This document lists all Row-Level Security (RLS) policies in the database.
Request & Assist Flow
Requests:

Creation: Restricted to users with the "seeker" role.

Management: Seekers can only edit/cancel their own active requests.

Visibility: Requests are visible to neighbors within the same neighborhood.

Offers:

Creation: Helpers can submit offers to requests.

Management: Users can only modify their own offers.

Visibility: Visible to the helper who made the offer and the seeker who received it.

Assists (Active Help):

Progress: Helpers can update the status (e.g., mark as in-progress or completed).

Visibility: Limited to the specific helper and seeker involved in the task.

👥 Profiles & Memberships
Profiles:

Privacy: Users can view and edit their own profiles.

Community: Users can view profiles of other neighbors only if they both belong to the same neighborhood and the viewer is an "active" member.

Neighborhoods: Users can only view details of neighborhoods they have joined.

Memberships: Users can view their own membership status (e.g., to check if they are "pending" or "active").

🛡️ Safety & Governance
Issue Reports:

Creation: Any user can report an issue.

Visibility: Reports are visible to the parties involved.

Moderation: "Seed Users" (trusted community founders) have elevated permissions to view all issue reports within their specific neighborhood to help with moderation.

Seed Users: A dedicated policy allows Seed Users to verify their own administrative status.

🔑 Access & Invites
Invite Codes:

Usage: Anyone can view valid (unexpired and unused) invite codes to join a neighborhood.

Creation: Only existing active members can generate new invite codes.

Caregiver Relationships: Special logic allows designated caregivers to manage the needs of their dependents (e.g., elderly family members) and allows dependents to see who is authorized to help them.

🛠️ Technical Implementation Detail
The policies rely heavily on Supabase Auth Metadata. They frequently check auth.jwt() -> 'app_metadata' for profile_id and user_role to make instant permission decisions without needing complex joins, ensuring the database remains performant.

## How to regenerate this document

Run the following query in the Supabase SQL Editor:

SELECT
  n.nspname AS schema,
  c.relname AS table,
  p.polname AS policy_name,
  -- USING (read) expression
  pg_get_expr(p.polqual, p.polrelid) AS using_expression,
  -- WITH CHECK (write) expression
  pg_get_expr(p.polwithcheck, p.polrelid) AS with_check_expression,
  p.polcmd AS for_command
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
LEFT JOIN pg_roles rol ON
  -- attempt to resolve polroles when stored as oid[] or oidvector
  (pg_typeof(p.polroles)::text LIKE '%oid%' AND rol.oid = ANY( (p.polroles)::oid[] ))
WHERE n.nspname NOT IN ('pg_catalog','information_schema')
GROUP BY
  n.nspname,
  c.relname,
  p.polname,
  c.relowner,
  p.polrelid,
  p.polqual,
  p.polwithcheck,
  p.polpermissive,
  p.polcmd,
  p.oid,
  p.polroles
ORDER BY n.nspname, c.relname, p.polname;