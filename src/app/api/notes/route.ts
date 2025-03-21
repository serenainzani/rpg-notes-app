import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function GET(req: Request) {
    const db = await open({
        filename: path.resolve(process.cwd(), "db/notes.db"),
        driver: sqlite3.Database,
    });

    const items = await db.all("SELECT * FROM notes");

    db.close();

    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
