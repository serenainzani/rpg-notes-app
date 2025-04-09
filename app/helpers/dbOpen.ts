import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export default async function dbOpen() {
    return await open({
        filename: path.resolve(process.cwd(), "db/notes.db"),
        driver: sqlite3.Database,
    });
}
