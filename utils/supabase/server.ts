import { createServerClient } from "@supabase/ssr";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export async function createClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

const unauthorizedResponse = () =>
    new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
    });

export async function requireAuth(
    supabase: SupabaseClient
): Promise<
    | { user: User; errorResponse: null }
    | { user: null; errorResponse: Response }
> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { user: null, errorResponse: unauthorizedResponse() };
    return { user, errorResponse: null };
}
