import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const noteId = crypto.randomUUID();
    const { type, name, description } = await req.json();

    const supabase = await createClient();

    const { data: rpgNotes, error } = await supabase
        .from("rpg-notes")
        .insert({ type, name, description, noteId })
        .select();

    console.log(error);

    return new Response(JSON.stringify(rpgNotes), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
