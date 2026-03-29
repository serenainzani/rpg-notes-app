import { createClient, requireAuth } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const noteId = crypto.randomUUID();
    const { type, name, description, campaign_id } = await req.json();

    const supabase = await createClient();

    const { user, errorResponse } = await requireAuth(supabase);
    if (errorResponse) return errorResponse;

    const { data: rpgNotes, error } = await supabase
        .from("rpg-notes")
        .insert({ type, name, description, noteId, user_id: user.id, campaign_id: campaign_id ?? null })
        .select();

    console.log(error);

    if (!error && campaign_id) {
        await supabase
            .from("rpg-notes-campaign")
            .update({ last_note: new Date().toISOString() })
            .eq("id", campaign_id);
    }

    return new Response(JSON.stringify(rpgNotes), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
