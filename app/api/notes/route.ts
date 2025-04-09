import dbOpen from "@/app/helpers/dbOpen";

export async function GET() {
    try {
        console.log("[API] /api/notes GET called");

        const db = await dbOpen();
        const items = await db.all("SELECT * FROM notes");
        db.close();

        console.log("[API] Returning notes:", items);

        return new Response(JSON.stringify(items), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("[API] Error in /api/notes:", error);

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
