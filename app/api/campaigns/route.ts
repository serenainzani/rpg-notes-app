import { createClient, requireAuth } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { user, errorResponse } = await requireAuth(supabase);
        if (errorResponse) return errorResponse;

        const { data: campaigns } = await supabase
            .from("rpg-notes-campaign")
            .select()
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        return new Response(JSON.stringify(campaigns, null, 2), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error in GET /api/campaigns:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: (error as Error).message }),
            { headers: { "Content-Type": "application/json" }, status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        const { user, errorResponse } = await requireAuth(supabase);
        if (errorResponse) return errorResponse;

        const { title, description } = await req.json();

        const { data: campaign, error } = await supabase
            .from("rpg-notes-campaign")
            .insert({ title, description, user_id: user.id })
            .select()
            .single();

        return new Response(JSON.stringify(campaign), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error in POST /api/campaigns:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: (error as Error).message }),
            { headers: { "Content-Type": "application/json" }, status: 500 }
        );
    }
}
