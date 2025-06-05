import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract the last segment of the path

    if (!id) {
        return new Response(JSON.stringify({ error: "ID is required" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }

    const supabase = await createClient();

    const { data: rpgNotes } = await supabase
        .from("rpg-notes")
        .delete()
        .eq("noteId", id)
        .select();

    const responseData = rpgNotes?.[0];

    return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}

export async function PATCH(req: NextRequest) {
    const { noteId, type, name, description } = await req.json(); //todo use path param for id instead of body

    const supabase = await createClient();

    const { data: rpgNotes } = await supabase
        .from("rpg-notes")
        .update({ type, name, description })
        .eq("noteId", noteId)
        .select();

    const responseData = rpgNotes?.[0];

    return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
