"use client";

import { Box, Paper, Typography } from "@mui/material";
import FiltersBar from "./components/FiltersBar";
import NewEntryForm from "./components/NewEntryForm";
import Entry from "./components/Entry";
import { useState, useEffect, useOptimistic } from "react";
import { DiaryEntryType } from "./__tests__/data";

export default function Home() {
    const [value, setValue] = useState("");
    const [notes, setNotes] = useState<DiaryEntryType[]>([]);

    useEffect(() => {
        fetch("/api/notes")
            .then((res) => res.json())
            .then((data) => setNotes(data))
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    const updateNotes = (newEntry: DiaryEntryType) => {
        setNotes((notes) => [...notes, newEntry]);
    };

    const handleFilterChange = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        newValue !== value ? setValue(newValue) : setValue("");
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
                {filteredNotes.map((entry, index) => (
                    <Entry
                        key={index}
                        type={entry.type}
                        name={entry.name}
                        description={entry.description}
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
