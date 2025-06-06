import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: rpgNotes } = await supabase
            .from("rpg-notes")
            .select()
            .order("created", { ascending: false });

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
