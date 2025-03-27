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
            id: "2af1301a-8e6e-4b9c-8a09-adaaa2857be6",
        },
        {
            type: "person",
            name: "Captain O'Hara",
            description:
                "Short, young women with serious air. Owns the largest ship in the port. Hates smell of tomatoes.",
            id: "36b233ba-a96c-402d-8c17-cdfdd13f80f7",
        },
        {
            type: "place",
            name: "Toadport",
            description:
                "Neutral ground for pirates and merchants alike to sell their wares",
            id: "6badddaf-5ed4-402f-ac25-cc5524f9d68d",
        },
        {
            type: "note",
            description:
                "The portal in the woods randomly shoots out frogs every few minutes. Villager said a mage in the labyrinth may know why.",
            id: "868a14b0-a8ef-4333-bb43-8b72b2a937bf",
        },
        {
            type: "note",
            description:
                "Stepped on a plate, floor collapsed. Now in a room with glowing symbols. Walls shifting. Something's in here. ",
            id: "2b1f496d-d77a-464d-bad4-4d1316b166e6",
        },
        {
            type: "important",
            description:
                "we got cursed, so whilst in this labyrinth we take an extra 1d4 of damage when attacked",
            id: "0f08a459-f545-4f5e-9940-89009e686a1c",
        },
        {
            type: "note",
            description:
                "Exiting the alchemy lab, we turned left, the right, then left, then straight ahead. We ended up at a metal door",
            id: "3f8b5778-dd0a-404b-afa1-3ecc64740c8c",
        },
    ].reverse();

    const dataForSql = mockData
        .map(({ type, name = null, description, id }) => [
            type,
            name,
            description,
            id,
        ])
        .flat();

    const insertSql = `INSERT INTO notes(type, name, description, id) VALUES${"(?,?,?,?),".repeat(
        mockData.length - 1
    )}(?,?,?,?)`;

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
        id STRING PRIMARY KEY,
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
