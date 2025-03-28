import dbOpen from "@/app/helpers/dbOpen";
import { NextRequest } from "next/server";

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    const db = await dbOpen();
    console.log(params);

    const id = params.id;
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

export async function PATCH(req: Request, res: Response) {
    const db = await dbOpen();

    const { id, type, name, description } = await req.json();
    const sql = `UPDATE notes
    SET name = '${name}', description = '${description}'
    WHERE id = ${id}`;

    db.run(sql, [id, name, description], (err: Error) => {
        if (err) return console.error(err.message);
        console.log(`Entry changed: ${id}`);
    });

    db.close();

    return new Response(JSON.stringify({ id, type, name, description }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
