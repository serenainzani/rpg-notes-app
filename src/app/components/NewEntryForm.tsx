"use client";

import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { AddBox } from "@mui/icons-material";

import { DiaryEntryType } from "../__tests__/data";

type NewEntryFormProps = {
    updateNotes: (entry: DiaryEntryType) => void;
};

export default function NewEntryForm({ updateNotes }: NewEntryFormProps) {
    const [entryType, setEntryType] = useState("");
    const handleEntryTypeInputChange = (event: SelectChangeEvent) => {
        setEntryType(event.target.value as string);
    };

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const bodyData = {
            name: formData.get("name"),
            type: formData.get("type"),
            description: formData.get("description"),
        };
        const response = await fetch("/api/note", {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();

        console.log(responseData);
        updateNotes(responseData);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white">
            <Stack direction="row" className="w-96">
                <FormControl className="w-48">
                    <InputLabel id="entry-type-label">Entry Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="type-select"
                        name="type"
                        defaultValue="note"
                        value={entryType}
                        label="entry type"
                        onChange={handleEntryTypeInputChange}
                    >
                        <MenuItem value="note">Note</MenuItem>
                        <MenuItem value="person">Person</MenuItem>
                        <MenuItem value="place">Place</MenuItem>
                        <MenuItem value="important">Important</MenuItem>
                    </Select>
                </FormControl>
                {["person", "place"].includes(entryType) && (
                    <TextField id="name" name="name" label="Name" required />
                )}
            </Stack>
            <TextField
                id="description"
                name="description"
                label="Description"
                multiline
                rows={5}
                className="w-96"
            />
            <IconButton aria-label="delete" size="large" type="submit">
                <AddBox className="text-3xl" />
            </IconButton>
        </form>
    );
}
