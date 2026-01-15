# Architecture Summary

The LocalLoop is built on a **Fortress-style, data-centric architecture** that prioritizes safety, trust, and correctness in a community-driven environment.

The system models real-world interactions—requests, offers, assists, and neighborhood membership—as explicit, stateful workflows. Each core entity has a clearly defined lifecycle, with transitions that mirror how neighbors safely coordinate help in the real world.

**Data integrity and security are enforced at the platform level**, not delegated to the client. Business rules, role boundaries, and trust relationships are encoded directly into the system’s core, ensuring that invalid states and unauthorized actions are structurally impossible rather than merely discouraged.

Access control follows a **least-privilege, relationship-aware model**. Users can only see or act on data that is directly connected to them through ownership, participation, or verified neighborhood membership. Elevated visibility is granted sparingly for moderation and safety purposes, without breaking isolation between neighborhoods.

Neighborhoods act as **hard trust boundaries**. Nearly all interactions are scoped to a neighborhood context, preventing cross-community data leakage while enabling localized discovery, reputation, and accountability.

Workflows are designed to be **auditable and resilient**. Historical records are preserved rather than overwritten, allowing moderation, dispute resolution, and community health metrics to be derived from real usage over time.

Overall, the architecture favors **clarity over cleverness**, **constraints over conventions**, and **platform-enforced guarantees over client-side assumptions**, enabling the app to scale trust and safety as the community grows.


- **Constraints** defend against invalid states.
- **RLS policies** defend against invalid actors.
- **Triggers and RPCs** orchestrate transitions safely.

Together, they form a layered, defense-in-depth “Fortress” model where **rules live with the data**, not just the app.

