import dbOpen from "@/app/helpers/dbOpen";

export async function POST(req: Request) {
    const db = await dbOpen();

    const id = crypto.randomUUID();
    const { type, name, description } = await req.json();
    const sql = `INSERT INTO notes(id, type, name, description) VALUES(?,?,?,?)`;

    db.run(sql, [id, type, name, description], (err: Error) => {
        if (err) return console.error(err.message);
        console.log(`New entry added: ${id}`);
    });

    db.close();

    return new Response(JSON.stringify({ id, type, name, description }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
