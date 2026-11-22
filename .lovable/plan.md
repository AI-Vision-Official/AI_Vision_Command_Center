# Move off the limited backend

## Your options
1. **Upgrade your current backend account** (paid plan on supabase.com). Fastest, nothing changes in the app. Limits stop.
2. **Switch to Lovable Cloud** (recommended). Same capabilities, no external account, usage billed from your Lovable credits (20 free Cloud credits per month). Requires disconnecting the current external backend in Settings → General, then I rebuild it on Cloud.
3. **A second free external account/project**. Possible, but free limits return and data must be moved by hand.

## What I would do for option 2
- Recreate the database tables, storage bucket "media-files" and its security rules (owner-only upload/list/delete) on Lovable Cloud.
- Reconnect the 19 app files that use the backend; no screen changes.
- Login: existing users must sign up again (accounts can't be copied with passwords).
- Optionally export and re-import existing data rows and media files.
- Verify login, uploads and the tools in the preview.

## What you do first
- Pick an option. For option 2, disconnect the external backend in project Settings → General, then approve this plan.

## Technical details
- App currently reads VITE_SUPABASE_URL / project id from .env via src/integrations/supabase/client.ts; Cloud regenerates these.
- Migrations re-applied from supabase/migrations; storage policies re-created.
