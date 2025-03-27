import dbOpen from "@/app/helpers/dbOpen";

export async function DELETE(req: Request, res: Response) {
    const db = await dbOpen();

    const { id } = await req.json();
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

export async function PUT(req: Request, res: Response) {}
