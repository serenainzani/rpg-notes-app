import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

// Let's initialize it as null initially, and we will assign the actual database instance later.
let db: any = null;

// Define the GET request handler function
export async function GET(req: any, res: any) {
    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: path.resolve(process.cwd(), "db/notes.db"), // Specify the database file path
            driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
    }

    // Perform a database query to retrieve all items from the "items" table
    const items = await db.all("SELECT * FROM notes");

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}
