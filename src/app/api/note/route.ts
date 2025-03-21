import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function POST(req: Request, res: Response) {
    const db = await open({
        filename: path.resolve(process.cwd(), "db/notes.db"),
        driver: sqlite3.Database,
    });

    const { type, name, description } = await req.json();
    const sql = `INSERT INTO notes(type, name, description) VALUES(?,?,?)`;

    db.run(sql, [type, name, description], (err: Error) => {
        if (err) return console.error(err.message);
        console.log("New entry added!");
    });

    db.close();

    return new Response(JSON.stringify({ type, name, description }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
