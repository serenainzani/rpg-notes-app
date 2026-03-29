import { createClient, requireAuth } from "@/utils/supabase/server";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { user, errorResponse } = await requireAuth(supabase);
        if (errorResponse) return errorResponse;

        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get("campaign_id");

        let query = supabase
            .from("rpg-notes")
            .select()
            .eq("campaign_id", campaignId)
            .eq("user_id", user.id)
            .order("created", { ascending: false });

        const { data: rpgNotes } = await query;

        return new Response(JSON.stringify(rpgNotes, null, 2), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error in GET /api/notes:", error);

        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                details: (error as Error).message,
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
}
