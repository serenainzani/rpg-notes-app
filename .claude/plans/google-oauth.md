# Plan: Add Google OAuth + Per-User Notes

## Context

The app currently has no authentication — all notes are shared and visible to
anyone. The goal is to add Google OAuth via Supabase Auth so each user sees only
their own notes. Supabase RLS is the security backbone. Auth state is managed
entirely within `app/page.tsx` — there is no separate login page. When
unauthenticated, the page shows a "Sign in with Google" button in place of the
notes UI.

## Manual Steps (User Must Do First)

I have already completed the steps in this section

### Google Cloud Console

1. Create an OAuth 2.0 client ID (Web application type)
1. Add Authorised redirect URI:
   https://<project-ref>.supabase.co/auth/v1/callback
1. Copy the Client ID and Client Secret

### Supabase Dashboard

Auth → Providers → Google: paste Client ID + Client Secret, enable it.
Copy the Supabase redirect URL shown there for step 1 above.

Auth → URL Configuration → Redirect URLs: add:

-   http://localhost:3000/auth/callback
-   https://rpg-notes-app.vercel.app/auth/callback

### SQL Editor — run in this order:

-- Add user_id column
ALTER TABLE "rpg-notes"
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS (blocks all access until policies are added — do NOT run this
before auth flow is deployed)
ALTER TABLE "rpg-notes" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "ts" ON "rpg-notes"
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON "rpg-notes"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON "rpg-notes"
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON "rpg-notes"
FOR DELETE USING (auth.uid() = user_id);

> [!IMPORTANT]
> Enable RLS only AFTER the auth flow (middleware + callback route) is deployed, or you'll lock yourself out.

### Environment Variables

Add to .env.local and Vercel project settings:
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # production:
https://rpg-notes-app.vercel.app

## Code Changes

New: middleware.ts (project root)

-   Use @supabase/ssr createServerClient with NextRequest/NextResponse
    cookies (different pattern from utils/supabase/server.ts — must pass both
    request and response cookies so refreshed tokens are written back)
-   Call supabase.auth.getUser() to keep sessions alive (not getSession() —
    getUser() validates with Supabase server)
-   No redirects — auth UI is handled inside app/page.tsx itself
-   Allow /auth/callback through unconditionally
-   Matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']

New: app/auth/callback/route.ts

-   GET handler
-   Extract code from request.nextUrl.searchParams
-   Call supabase.auth.exchangeCodeForSession(code) (creates session, writes
    cookies)
-   Redirect to / on success or failure (page handles unauthenticated state)

Modified: app/page.tsx

-   Add user state: useState<User | null>(null) — import User from @supabase/supabase-js
-   Create browser client once with createBrowserClient from @supabase/ssr
    (outside component or via useMemo to avoid re-creation on each render)
-   In useEffect, call supabase.auth.getUser() first:
    -   If no user → leave user as null, skip notes fetch
    -   If user → set user state, then fetch /api/notes
-   If fetch('/api/notes') returns 401 → set user to null
-   Unauthenticated render (user === null): show only the Typography h2 heading
    + a centred Button variant="contained" "Sign in with Google" that calls
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo:
    `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` } })
-   Authenticated render (user !== null): existing notes UI unchanged, plus a
    centred Button variant="contained" "Sign out" below the last entry that calls
    supabase.auth.signOut() then sets user to null and clears notes state

Modified: app/api/note/route.ts (POST)

-   After createClient(), call supabase.auth.getUser() → return 401 if no user
-   Add user_id: user.id to the .insert() payload

Modified: app/api/notes/route.ts (GET)

-   After createClient(), call supabase.auth.getUser() → return 401 if no user
-   No query change needed — RLS filters automatically

Modified: app/api/note/[id]/route.ts (DELETE + PATCH)

-   After createClient(), call supabase.auth.getUser() → return 401 if no user
-   No query change needed — RLS blocks cross-user operations silently

## Critical Files

-   utils/supabase/server.ts — reference for Supabase client pattern
-   app/themeOptions.ts — import theme for sign-in/sign-out buttons
-   app/page.tsx — auth state, conditional render, sign-in/sign-out
-   app/api/note/route.ts — add 401 guard + user_id in insert
-   app/api/notes/route.ts — add 401 guard
-   app/api/note/[id]/route.ts — add 401 guard

## Verification

1. Open app logged out → see "RPG Notes" heading + "Sign in with Google" button
2. Click sign in → Google OAuth flow → redirected back to / with notes UI
3. Create a note → check Supabase Table Editor that user_id is populated
4. Sign in as second Google account → confirm different empty notes list (data
   isolation)
5. Sign out → login button reappears, notes are cleared
6. Deploy to Vercel with NEXT_PUBLIC_SITE_URL set → test full flow on
   production URL
