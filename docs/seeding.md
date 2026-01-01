1. Create the Auth User
First, you need a standard entry in the auth.users table.

Action: Sign up through your app's frontend or via the Supabase Dashboard "Users" section.

Result: This creates your UUID and triggers your handle_new_user_signup function.

2. Verify the Profile Creation
Because of your triggers, a row should automatically appear in your profiles table linked to that UUID.

Check: Verify that your profiles table has a row where user_id matches your Auth UUID.

Status: At this point, you are just a "Standard User" with no neighborhood and a default role.

3. Elevate to Seed User (Manual "God Mode" Step)
Since there is no other admin to vouch for you, you must perform a manual update to your profile to bootstrap the system.

Action: Set is_seed_user = true on your profile record.

Action: Set your user_role to your preferred starting role (e.g., seeker or helper).

4. Manifest the First Neighborhood
Now you need a place for your profile to "live."

Action: Insert a record into the neighborhoods table.

Name: "Main Street" (or your preference).

Anchor: Set a Lat/Lng that represents the center point of your group of 5 neighbors.

Action: Create the membership link. Insert a row into neighborhood_memberships:

profile_id: Your ID.

neighborhood_id: The new Neighborhood ID.

status: Set this to active.

5. The JWT "Stamp" (The Fortress Key)
This is the most critical step in your architecture. Your sync_user_metadata_to_auth trigger needs to fire to "stamp" your Auth JWT with your new status.

The Trigger's Job: It looks at your profiles and neighborhood_memberships and writes that data into the raw_app_meta_data column of your auth.users record.

Validation: You can check this in the Supabase Dashboard under the "Users" table. Look at the "User Metadata" column for your account. You should see is_seed_user: true and your neighborhood_id.

How this affects your Tech Stack
Once this metadata is in the JWT, your Supabase-js client becomes "aware" of your power.

TanStack Query: When you fetch invite_codes, the RLS policy will check your JWT metadata. Since it now matches the neighborhood, the database will return the data.

TanStack Router: You can now code a "Protected Route" that checks user.app_metadata.is_seed_user. If true, it renders the "Invite Management" dashboard.