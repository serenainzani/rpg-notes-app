"use client";

import { Box, Paper, Typography } from "@mui/material";
import FiltersBar from "./components/FiltersBar";
import NewEntryForm from "./components/NewEntryForm";
import Entry from "./components/Entry";
import { useState, useEffect } from "react";
import { DiaryEntryType } from "./__tests__/data";

export default function Home() {
    const [value, setValue] = useState("");
    const [notes, setNotes] = useState<DiaryEntryType[]>([]);
    const [cardClicked, setCardClicked] = useState("");

    useEffect(() => {
        fetch("/api/notes")
            .then((res) => res.json())
            .then((data) => setNotes(data))
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    const updateNotes = (entry: DiaryEntryType, method: string) => {
        switch (method) {
            case "POST":
                setNotes((prevNotes) => [...prevNotes, entry]);
                break;
            case "DELETE":
                const removedNotes = notes.filter(
                    (note) => entry.id !== note.id
                );
                setNotes(removedNotes);
                break;
            case "PATCH":
                const modifiedNotes = notes.map((existingNote) =>
                    existingNote.id === entry.id ? entry : existingNote
                );
                console.log("ath!", modifiedNotes);
                setNotes(modifiedNotes);
                break;
        }
    };

    const handleFilterChange = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        newValue !== value ? setValue(newValue) : setValue("");
    };

    const handleCardClick = (id: string) => {
        cardClicked !== id ? setCardClicked(id) : setCardClicked("");
    };

    const filteredNotes = value
        ? notes.filter((entry) => entry.type === value)
        : notes;

    return (
        <div>
            <div className="pb-64 pt-8">
                <Typography variant="h2" component="h1" gutterBottom>
                    RPG Notes
                </Typography>
                {filteredNotes.map((entry) => (
                    <Entry
                        key={entry.id}
                        id={entry.id}
                        type={entry.type}
                        name={entry.name}
                        description={entry.description}
                        updateNotes={updateNotes}
                        handleCardClicked={handleCardClick}
                        isCardClicked={cardClicked === entry.id}
                    />
                ))}
            </div>
            <Box className="fixed bottom-0 pt-5 bg-white">
                <NewEntryForm updateNotes={updateNotes} />
                <Paper elevation={3}>
                    <FiltersBar
                        value={value}
                        handleFilterChange={handleFilterChange}
                    />
                </Paper>
            </Box>
        </div>
    );
}
