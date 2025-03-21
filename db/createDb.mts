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
    const mockData = [
        {
            type: "note",
            description: "it's sunny today with a light breeze",
        },
        {
            type: "person",
            name: "Captain O'Hara",
            description:
                "Short, young women with serious air. Owns the largest ship in the port. Hates smell of tomatoes.",
        },
        {
            type: "place",
            name: "Toadport",
            description:
                "Neutral ground for pirates and merchants alike to sell their wares",
        },
        {
            type: "note",
            description:
                "The portal in the woods randomly shoots out frogs every few minutes. Villager said a mage in the labyrinth may know why.",
        },
        {
            type: "note",
            description:
                "Stepped on a plate, floor collapsed. Now in a room with glowing symbols. Walls shifting. Something's in here. ",
        },
        {
            type: "important",
            description:
                "we got cursed, so whilst in this labyrinth we take an extra 1d4 of damage when attacked",
        },
        {
            type: "note",
            description:
                "Exiting the alchemy lab, we turned left, the right, then left, then straight ahead. We ended up at a metal door",
        },
    ].reverse();

    const dataForSql = mockData
        .map(({ type, name = null, description }) => [type, name, description])
        .flat();

    const insertSql = `INSERT INTO notes(type, name, description) VALUES${"(?,?,?),".repeat(
        mockData.length - 1
    )}(?,?,?)`;

    db.run(insertSql, dataForSql, (err: Error) => {
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
                    console.log(err);
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
