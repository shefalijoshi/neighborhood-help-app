# RPC / Stored Procedure Reference

This document lists all user-defined functions (RPCs) and trigger functions in the database.

Neighborhood & Membership Management
These functions handle the creation of neighborhoods, joining via invite codes, and the vouching process.

initialize_neighborhood: Creates a new neighborhood centered on the user's location (with a 0.5-mile radius), creates their membership as "active," and promotes them to a "Seed User."

join_neighborhood: Allows a user to join via an invite code. It checks the user's distance from the neighborhood center; if within 0.5 miles, they are "active"; otherwise, they are marked as "pending_second_vouch."

verify_location_activation: Used by pending members to upgrade to "active" status if they can prove they are physically within the 0.5-mile neighborhood radius.

request_vouch_handshake: Generates a 6-digit verification code for a pending member to show a neighbor for an in-person "handshake" vouch.

vouch_via_handshake: Allows an active neighbor to enter a pending member's handshake code to activate their membership.

🤝 Request & Offer Handling
Logic for managing help requests and the offers made by neighbors.

accept_neighborhood_offer: An atomic operation that accepts a specific help offer, declines all other competing offers for that request, marks the request as "filled," and creates a record in the assists table.

decline_competing_offers: A trigger function that automatically declines all pending offers when a request's status changes to "filled."

👤 User Profiles & Metadata
Triggers and functions that maintain user stats, roles, and synchronization with Supabase Auth.

handle_new_user_signup: Automatically creates a profile record in the public schema when a new user signs up.

manage_profile_logic: A trigger that initializes new profiles (setting assist_count to 0) and maintains the updated_at timestamp.

handle_assist_count_sync: Increments a helper’s assist_count when a task is completed and decrements it if the completion is undone or deleted.

sync_user_flags: Automatically flags a user profile (is_flagged = true) if they receive 3 or more issue reports.

sync_user_metadata_to_auth: Synchronizes public profile data (role, seed status, neighborhood ID) back into the auth.users metadata for easier access in RLS policies or frontend JWTs.

🛠️ Utilities & Helpers
General-purpose logic for distance, codes, and data integrity.

calculate_distance: Implements the Haversine formula to calculate the distance (in miles) between two sets of coordinates.

generate_invite_code: Creates a random 6-character alphanumeric code (excluding ambiguous characters like 'I' or '1').

generate_verification_code: Generates a random 6-digit numeric string.

set_assist_verification_code: A trigger that ensures every assist record has a verification code generated upon creation.

stamp_report_neighborhood: Automatically attaches the correct neighborhood_id to an issue report based on the related assist/request chain.

update_updated_at_column: A standard utility trigger to update the updated_at timestamp on row modification.

Triggers:
Automation & Synchronization
These triggers ensure that data remains consistent across different tables without manual intervention.

tr_sync_assist_count (assists table):

Event: After Insert, Update, or Delete.

Logic: Calls handle_assist_count_sync to keep the helper's total assist count updated on their profile whenever a task is finished or removed.

tr_sync_strikes_on_change (issue_reports table):

Event: After Insert, Update, or Delete.

Logic: Calls sync_user_flags to automatically flag users as problematic if they accumulate 3 or more issue reports.

tr_sync_metadata_to_jwt (auth.users table):

Event: Before Update.

Logic: Calls sync_user_metadata_to_auth to push changes from the public profile (like neighborhood ID or role) into the Supabase Auth metadata, ensuring RLS policies always have current data.

📝 Data Integrity & Setup
These triggers handle the "heavy lifting" when new records are created or modified.

tr_create_profile_on_signup (auth.users table):

Event: After Insert.

Logic: Calls handle_new_user_signup to automatically create a corresponding row in the public.profiles table whenever a new user registers.

tr_master_profile_trigger (profiles table):

Event: Before Insert or Update.

Logic: Calls manage_profile_logic to initialize new profiles and ensure the updated_at timestamp is current.

tr_set_verification_code (assists table):

Event: Before Insert.

Logic: Calls set_assist_verification_code to generate a unique security code for every new assist record.

tr_stamp_report_neighborhood (issue_reports table):

Event: Before Insert.

Logic: Calls stamp_report_neighborhood to automatically determine which neighborhood an issue belongs to based on the request/assist being reported.

🧹 Workflow Cleanup
tr_decline_competing_offers (requests table):

Event: After Update.

Logic: Calls decline_competing_offers to automatically mark all other pending offers as "declined" once a seeker accepts a specific helper's offer.

🕒 Utility Triggers
update_help_details_updated_at & update_requests_updated_at:

Event: Before Update.

Logic: Standard utility triggers that call update_updated_at_column to ensure the "Last Modified" timestamps are always accurate for requests and help details.

## How to regenerate this document

Run the following query in Supabase SQL editor:

```sql
SELECT
    n.nspname AS schema,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    p.prosrc AS definition,
    t.typname AS return_type
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_type t ON t.oid = p.prorettype
WHERE n.nspname IN ('public')
ORDER BY n.nspname, p.proname;
