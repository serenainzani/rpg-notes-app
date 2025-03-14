import { existsSync } from "fs";
import sqlite3 from "sqlite3";

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database("./db/notes.db", (err: Error | null) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
});

function addTestData() {
    const values1 = [
        "note",
        "Basic Pokemon. HP 60. Surprise Attack 20. Flip a coin. If heads, this attack does 10 more damage. Water Gun 30. Weakness: Lightning x2. Resistance: none. Retreat Cost: 1.",
    ];

    const insertSql = `INSERT INTO notes(type, description) VALUES(?, ?)`;

    db.run(insertSql, values1, function (err: Error) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Rows inserted`);
    });
}

if (!existsSync("./db/notes.db")) {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('note', 'person', 'place', 'important')),
        description TEXT NOT NULL,
        name TEXT,
        created TEXT DEFAULT (datetime('now', 'localtime'))
      )`,
            (err: Error) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("Created notes table.");
            }
        );
        addTestData();
    });
}

db.close((err: null | Error) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Closed the database connection.");
});
