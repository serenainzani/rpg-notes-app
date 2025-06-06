"use client";

import { Paper, ThemeProvider, Typography } from "@mui/material";
import FiltersBar from "./components/FiltersBar";
import NewEntryForm from "./components/NewEntryForm";
import Entry from "./components/Entry";
import { useState, useEffect } from "react";
import { DiaryEntryType } from "./__tests__/data";
import { theme } from "./themeOptions";

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
                console.log("new entry", entry);
                setNotes((prevNotes) => {
                    const updatedNotes = [...prevNotes, entry];
                    console.log("updated notes", updatedNotes); // Debugging the notes state
                    return updatedNotes;
                });
                break;
            case "DELETE":
                const removedNotes = notes.filter(
                    (note) => entry.noteId !== note.noteId
                );
                setNotes(removedNotes);
                break;
            case "PATCH":
                const modifiedNotes = notes.map((existingNote) =>
                    existingNote.noteId === entry.noteId ? entry : existingNote
                );
                setNotes(modifiedNotes);
                break;
        }
    };

    const handleFilterChange = (_: React.SyntheticEvent, newValue: string) => {
        newValue !== value ? setValue(newValue) : setValue("");
    };

    const handleCardClick = (id: string) => {
        cardClicked !== id ? setCardClicked(id) : setCardClicked("");
    };

    const filteredNotes = value
        ? notes.filter((entry) => entry.type === value)
        : notes;

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Typography
                    variant="h2"
                    component="h1"
                    className="text-center py-5"
                    color="primary"
                >
                    RPG Notes
                </Typography>
                <NewEntryForm updateNotes={updateNotes} />
                <Paper elevation={3} className="mb-3">
                    <FiltersBar
                        value={value}
                        handleFilterChange={handleFilterChange}
                    />
                </Paper>

                {filteredNotes.map((entry, index) => (
                    <Entry
                        key={entry.noteId || index}
                        noteId={entry.noteId}
                        type={entry.type}
                        name={entry.name}
                        description={entry.description}
                        updateNotes={updateNotes}
                        handleCardClicked={handleCardClick}
                        isCardClicked={cardClicked === entry.noteId}
                    />
                ))}
            </div>
        </ThemeProvider>
    );
}
