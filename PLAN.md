     Plan: Add Google OAuth + Per-User Notes

     Context
     The app currently has no authentication — all notes are shared and visible to
     anyone. The goal is to add Google OAuth via Supabase Auth so each user sees only
      their own notes. Supabase RLS is the security backbone; middleware handles
     redirects for the UX.

     ---
     Manual Steps (User Must Do First)

     1. Google Cloud Console

     1. Create an OAuth 2.0 client ID (Web application type)
     2. Add Authorised redirect URI:
     https://<project-ref>.supabase.co/auth/v1/callback
     3. Copy the Client ID and Client Secret

     2. Supabase Dashboard

     Auth → Providers → Google: paste Client ID + Client Secret, enable it.
     Copy the Supabase redirect URL shown there for step 1 above.

     Auth → URL Configuration → Redirect URLs: add:
     - http://localhost:3000/auth/callback
     - https://rpg-notes-app.vercel.app/auth/callback

     SQL Editor — run in this order:

     -- Add user_id column
     ALTER TABLE "rpg-notes"
     ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

     -- Enable RLS (blocks all access until policies are added — do NOT run this
     before auth flow is deployed)
     ALTER TABLE "rpg-notes" ENABLE ROW LEVEL SECURITY;

     -- Policies
     CREATE POLICY "Users can view their own notes" ON "rpg-notes"
       FOR SELECT USING (auth.uid() = user_id);

     CREATE POLICY "Users can insert their own notes" ON "rpg-notes"
       FOR INSERT WITH CHECK (auth.uid() = user_id);

     CREATE POLICY "Users can update their own notes" ON "rpg-notes"
       FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

     CREATE POLICY "Users can delete their own notes" ON "rpg-notes"
       FOR DELETE USING (auth.uid() = user_id);

     ▎ Important: Enable RLS only AFTER the auth flow (middleware + login page +
     ▎ callback route) is deployed, or you'll lock yourself out.

     3. Environment Variables

     Add to .env.local and Vercel project settings:
     NEXT_PUBLIC_SITE_URL=http://localhost:3000   # production:
     https://rpg-notes-app.vercel.app

     ---
     Code Changes

     New: middleware.ts (project root)

     - Use @supabase/ssr createServerClient with NextRequest/NextResponse
     cookies (different pattern from utils/supabase/server.ts — must pass both
     request and response cookies so refreshed tokens are written back)
     - Call supabase.auth.getUser() (not getSession() — getUser() validates
      with Supabase server)
     - If no user and path is not /login or /auth/callback → redirect to /login
     - If user exists and path is /login → redirect to /
     - Matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']

     New: app/login/page.tsx

     - "use client" component
     - Use createBrowserClient from @supabase/ssr
     - Button calls supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo:
     ${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback } })
     - Use MUI components + ThemeProvider from app/themeOptions.ts for consistent
      brown theme
     - Simple centred layout: heading + "Sign in with Google" Button variant="contained"

     New: app/auth/callback/route.ts

     - GET handler
     - Extract code from request.nextUrl.searchParams
     - Call supabase.auth.exchangeCodeForSession(code) (creates session, writes
     cookies)
     - Redirect to / on success, /login on failure

     Modified: app/api/note/route.ts (POST)

     - After createClient(), call supabase.auth.getUser() → return 401 if no user
     - Add user_id: user.id to the .insert() payload

     Modified: app/api/notes/route.ts (GET)

     - After createClient(), call supabase.auth.getUser() → return 401 if no user
     - No query change needed — RLS filters automatically

     Modified: app/api/note/[id]/route.ts (DELETE + PATCH)

     - After createClient(), call supabase.auth.getUser() → return 401 if no user
     - No query change needed — RLS blocks cross-user operations silently

     Modified: app/page.tsx

     - Add sign-out button (top area, aligned right)
     - Use createBrowserClient inline and call supabase.auth.signOut() on click,
     then router.push('/login')
     - Add if (res.status === 401) { router.push('/login'); return; } guard after
     fetch('/api/notes') in the useEffect

     ---
     Critical Files

     - utils/supabase/server.ts — reference for Supabase client pattern
     - app/themeOptions.ts — import into login page
     - app/page.tsx — add sign-out + 401 guard
     - app/api/note/route.ts — add 401 guard + user_id in insert
     - app/api/notes/route.ts — add 401 guard
     - app/api/note/[id]/route.ts — add 401 guard

     ---
     Verification

     1. Incognito window → app → confirm redirect to /login
     2. Sign in with Google → confirm redirect to / with empty notes
     3. Create a note → check Supabase Table Editor that user_id is populated
     4. Sign in as second Google account → confirm different empty notes list (data
     isolation)
     5. Sign out → confirm redirect to /login, can't navigate to /
     6. Deploy to Vercel with NEXT_PUBLIC_SITE_URL set → test full flow on
     production URL
