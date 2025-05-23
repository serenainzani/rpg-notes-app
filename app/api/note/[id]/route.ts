import dbOpen from "@/app/helpers/dbOpen";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const db = await dbOpen();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract the last segment of the path

    if (!id) {
        return new Response(JSON.stringify({ error: "ID is required" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }

    const sql = `DELETE FROM notes WHERE id=?`;

    db.run(sql, [id], (err: Error) => {
        if (err) return console.error(err.message);
        console.log(`Entry deleted: ${id}`);
    });

    db.close();

    return new Response(JSON.stringify({ id }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}

export async function PATCH(req: NextRequest) {
    const db = await dbOpen();
    const { id, type, name, description } = await req.json(); //todo use path param for id instead of body
    const sql = `UPDATE notes 
    SET name = ?, description = ?
    WHERE id = ?`;
    db.run(sql, [name, description, id], (err: Error) => {
        if (err) return console.error(err.message);
        console.log(`Entry changed: ${id}`);
    });

    db.close();

    return new Response(JSON.stringify({ id, type, name, description }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
