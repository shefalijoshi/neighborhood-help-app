# Database Constraints Reference

This document lists all table constraints in the database, including primary keys, foreign keys, unique constraints, and check constraints.

| Table Name               | Constraint Name                                       | Type         | Columns / References                                | Check / Notes |
|--------------------------|-----------------------------------------------------|-------------|----------------------------------------------------|---------------|
| `assists`                | `assists_pkey`                                      | PRIMARY KEY | `id`                                               | —             |
| `assists`                | `assists_helper_id_fkey`                            | FOREIGN KEY | `helper_id` → `profiles.id`                        | —             |
| `assists`                | `assists_offer_id_fkey`                             | FOREIGN KEY | `offer_id` → `offers.id`                           | —             |
| `assists`                | `assists_request_id_fkey`                           | FOREIGN KEY | `request_id` → `requests.id`                       | —             |
| `assists`                | `assists_seeker_id_fkey`                            | FOREIGN KEY | `seeker_id` → `profiles.id`                        | —             |
| `assists`                | `2200_17733_1_not_null`                             | CHECK       | —                                                  | `id IS NOT NULL` |
| `assists`                | `2200_17733_2_not_null`                             | CHECK       | —                                                  | `request_id IS NOT NULL` |
| `assists`                | `2200_17733_3_not_null`                             | CHECK       | —                                                  | `seeker_id IS NOT NULL` |
| `assists`                | `2200_17733_4_not_null`                             | CHECK       | —                                                  | `helper_id IS NOT NULL` |
| `assists`                | `2200_17733_5_not_null`                             | CHECK       | —                                                  | `verification_code IS NOT NULL` |
| `assists`                | `2200_17733_10_not_null`                            | CHECK       | —                                                  | `expected_duration IS NOT NULL` |
| `assists`                | `verification_code_format`                           | CHECK       | —                                                  | `(verification_code ~* '^[0-9]{4,6}$'::text)` |
| `caregiver_relationships`| `caregiver_relationships_pkey`                     | PRIMARY KEY | `id`                                               | —             |
| `caregiver_relationships`| `caregiver_relationships_caregiver_id_fkey`       | FOREIGN KEY | `caregiver_id` → `profiles.id`                     | —             |
| `caregiver_relationships`| `caregiver_relationships_dependent_id_fkey`       | FOREIGN KEY | `dependent_id` → `profiles.id`                     | —             |
| `caregiver_relationships`| `caregiver_relationships_caregiver_id_dependent_id_key` | UNIQUE  | `caregiver_id, dependent_id`                        | —             |
| `caregiver_relationships`| `2200_17791_1_not_null`                             | CHECK       | —                                                  | `id IS NOT NULL` |
| `caregiver_relationships`| `2200_17791_2_not_null`                             | CHECK       | —                                                  | `caregiver_id IS NOT NULL` |
| `caregiver_relationships`| `2200_17791_3_not_null`                             | CHECK       | —                                                  | `dependent_id IS NOT NULL` |
| `caregiver_relationships`| `no_self_care`                                      | CHECK       | —                                                  | `(caregiver_id <> dependent_id)` |
| `help_details`           | `help_details_pkey`                                 | PRIMARY KEY | `id`                                               | —             |
| `help_details`           | `help_details_seeker_id_fkey`                       | FOREIGN KEY | `seeker_id` → `profiles.id`                        | —             |
| `help_details`           | `2200_17663_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| `help_details`           | `2200_17663_2_not_null`                              | CHECK       | —                                                  | `seeker_id IS NOT NULL` |
| `help_details`           | `2200_17663_3_not_null`                              | CHECK       | —                                                  | `name IS NOT NULL` |
| `invite_codes`           | `invite_codes_pkey`                                 | PRIMARY KEY | `id`                                               | —             |
| `invite_codes`           | `invite_codes_created_by_fkey`                      | FOREIGN KEY | `created_by` → `profiles.id`                       | —             |
| `invite_codes`           | `invite_codes_neighborhood_id_fkey`                 | FOREIGN KEY | `neighborhood_id` → `neighborhoods.id`            | —             |
| `invite_codes`           | `invite_codes_used_by_fkey`                         | FOREIGN KEY | `used_by` → `profiles.id`                          | —             |
| `invite_codes`           | `2200_17633_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| `invite_codes`           | `2200_17633_2_not_null`                              | CHECK       | —                                                  | `code IS NOT NULL` |
| `invite_codes`           | `2200_17633_3_not_null`                              | CHECK       | —                                                  | `neighborhood_id IS NOT NULL` |
| `invite_codes`           | `2200_17633_4_not_null`                              | CHECK       | —                                                  | `created_by IS NOT NULL` |
| `invite_codes`           | `2200_17633_5_not_null`                              | CHECK       | —                                                  | `expires_at IS NOT NULL` |
| `invite_codes`           | `code_format`                                       | CHECK       | —                                                  | `(code ~* '^[A-Z0-9]{6,8}$'::text)` |
| issue_reports            | `issue_reports_pkey`                                 | PRIMARY KEY | `id`                                               | —             |
| issue_reports            | `issue_reports_assist_id_fkey`                       | FOREIGN KEY | `assist_id` → `assists.id`                         | —             |
| issue_reports            | `issue_reports_neighborhood_id_fkey`                | FOREIGN KEY | `neighborhood_id` → `neighborhoods.id`            | —             |
| issue_reports            | `issue_reports_reported_by_fkey`                     | FOREIGN KEY | `reported_by` → `profiles.id`                      | —             |
| issue_reports            | `issue_reports_reported_against_fkey`               | FOREIGN KEY | `reported_against` → `profiles.id`                 | —             |
| issue_reports            | `2200_17765_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| issue_reports            | `2200_17765_2_not_null`                              | CHECK       | —                                                  | `assist_id IS NOT NULL` |
| issue_reports            | `2200_17765_3_not_null`                              | CHECK       | —                                                  | `reported_by IS NOT NULL` |
| issue_reports            | `2200_17765_4_not_null`                              | CHECK       | —                                                  | `reported_against IS NOT NULL` |
| neighborhood_memberships | `neighborhood_memberships_pkey`                     | PRIMARY KEY | `id`                                               | —             |
| neighborhood_memberships | `neighborhood_memberships_neighborhood_id_fkey`    | FOREIGN KEY | `neighborhood_id` → `neighborhoods.id`            | —             |
| neighborhood_memberships | `neighborhood_memberships_profile_id_fkey`         | FOREIGN KEY | `profile_id` → `profiles.id`                       | —             |
| neighborhood_memberships | `neighborhood_memberships_primary_vouch_by_fkey`   | FOREIGN KEY | `primary_vouch_by` → `profiles.id`                | —             |
| neighborhood_memberships | `neighborhood_memberships_secondary_vouch_by_fkey` | FOREIGN KEY | `secondary_vouch_by` → `profiles.id`              | —             |
| neighborhood_memberships | `2200_17600_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| neighborhood_memberships | `2200_17600_2_not_null`                              | CHECK       | —                                                  | `profile_id IS NOT NULL` |
| neighborhood_memberships | `2200_17600_3_not_null`                              | CHECK       | —                                                  | `neighborhood_id IS NOT NULL` |
| neighborhoods            | `neighborhoods_pkey`                                | PRIMARY KEY | `id`                                               | —             |
| neighborhoods            | `neighborhoods_created_by_fkey`                     | FOREIGN KEY | `created_by` → `profiles.id`                       | —             |
| neighborhoods            | `2200_17582_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| neighborhoods            | `2200_17582_2_not_null`                              | CHECK       | —                                                  | `name IS NOT NULL` |
| neighborhoods            | `2200_17582_3_not_null`                              | CHECK       | —                                                  | `center_lat IS NOT NULL` |
| neighborhoods            | `2200_17582_4_not_null`                              | CHECK       | —                                                  | `center_lng IS NOT NULL` |
| neighborhoods            | `valid_radius`                                      | CHECK       | —                                                  | `(radius_miles > 0)` |
| offers                   | `offers_pkey`                                       | PRIMARY KEY | `id`                                               | —             |
| offers                   | `offers_helper_id_fkey`                             | FOREIGN KEY | `helper_id` → `profiles.id`                        | —             |
| offers                   | `offers_request_id_fkey`                             | FOREIGN KEY | `request_id` → `requests.id`                       | —             |
| offers                   | `2200_17706_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| offers                   | `2200_17706_2_not_null`                              | CHECK       | —                                                  | `request_id IS NOT NULL` |
| offers                   | `2200_17706_3_not_null`                              | CHECK       | —                                                  | `helper_id IS NOT NULL` |
| profiles                 | `profiles_pkey`                                     | PRIMARY KEY | `id`                                               | —             |
| profiles                 | `profiles_user_id_fkey`                              | FOREIGN KEY | `user_id` → `auth.users.id`                        | —             |
| profiles                 | `2200_17557_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| profiles                 | `2200_17557_2_not_null`                              | CHECK       | —                                                  | `user_id IS NOT NULL` |
| profiles                 | `2200_17557_3_not_null`                              | CHECK       | —                                                  | `role IS NOT NULL` |
| profiles                 | `2200_17557_4_not_null`                              | CHECK       | —                                                  | `display_name IS NOT NULL` |
| profiles                 | `2200_17557_7_not_null`                              | CHECK       | —                                                  | `address IS NOT NULL` |
| profiles                 | `positive_rate`                                     | CHECK       | —                                                  | `(rate IS NULL OR rate >= 0)` |
| requests                 | `requests_pkey`                                     | PRIMARY KEY | `id`                                               | —             |
| requests                 | `requests_seeker_id_fkey`                            | FOREIGN KEY | `seeker_id` → `profiles.id`                        | —             |
| requests                 | `requests_neighborhood_id_fkey`                     | FOREIGN KEY | `neighborhood_id` → `neighborhoods.id`            | —             |
| requests                 | `2200_17679_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| requests                 | `2200_17679_2_not_null`                              | CHECK       | —                                                  | `seeker_id IS NOT NULL` |
| requests                 | `2200_17679_3_not_null`                              | CHECK       | —                                                  | `neighborhood_id IS NOT NULL` |
| requests                 | `2200_17679_4_not_null`                              | CHECK       | —                                                  | `dog_size IS NOT NULL` |
| requests                 | `2200_17679_6_not_null`                              | CHECK       | —                                                  | `temperament IS NOT NULL` |
| requests                 | `2200_17679_7_not_null`                              | CHECK       | —                                                  | `duration IS NOT NULL` |
| requests                 | `2200_17679_10_not_null`                             | CHECK       | —                                                  | `expires_at IS NOT NULL` |
| requests                 | `2200_17679_11_not_null`                             | CHECK       | —                                                  | `street_name IS NOT NULL` |
| requests                 | `2200_17679_12_not_null`                             | CHECK       | —                                                  | `full_address IS NOT NULL` |
| requests                 | `valid_duration`                                    | CHECK       | —                                                  | `duration = ANY (ARRAY[15, 30, 45, 60])` |
| seed_users               | `seed_users_pkey`                                   | PRIMARY KEY | `id`                                               | —             |
| seed_users               | `seed_users_neighborhood_id_fkey`                   | FOREIGN KEY | `neighborhood_id` → `neighborhoods.id`            | —             |
| seed_users               | `seed_users_profile_id_fkey`                        | FOREIGN KEY | `profile_id` → `profiles.id`                       | —             |
| seed_users               | `seed_users_neighborhood_id_profile_id_key`         | UNIQUE       | `neighborhood_id, profile_id`                       | —             |
| seed_users               | `2200_17814_1_not_null`                              | CHECK       | —                                                  | `id IS NOT NULL` |
| seed_users               | `2200_17814_2_not_null`                              | CHECK       | —                                                  | `neighborhood_id IS NOT NULL` |
| seed_users               | `2200_17814_3_not_null`                              | CHECK       | —                                                  | `profile_id IS NOT NULL` |

## How to regenerate this document

Run the following query in the Supabase SQL Editor:

SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    chk.check_clause
FROM information_schema.table_constraints AS tc
LEFT JOIN information_schema.key_column_usage AS kcu
       ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
       ON tc.constraint_name = ccu.constraint_name
      AND tc.table_schema = ccu.table_schema
LEFT JOIN information_schema.check_constraints AS chk
       ON tc.constraint_name = chk.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

