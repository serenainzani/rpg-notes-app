import dbOpen from "@/app/helpers/dbOpen";

export async function GET() {
    const db = await dbOpen();

    const items = await db.all("SELECT * FROM notes");

    db.close();

    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
