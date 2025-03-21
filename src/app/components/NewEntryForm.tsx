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
import { ChangeEvent, FormEvent, useState } from "react";
import { AddBox } from "@mui/icons-material";

import { DiaryEntryType } from "../__tests__/data";

type EntryFormProps = {
    updateNotes: (entry: DiaryEntryType) => void;
};

const defaultFormValues = {
    name: "",
    type: "",
    description: "",
};

export default function NewEntryForm({ updateNotes }: EntryFormProps) {
    const [formEntryValues, setFormEntryValues] = useState(defaultFormValues);

    const handleChange = (
        event:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>
    ) => {
        setFormEntryValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const description = formData.get("description");
        const type = String(formData.get("type")) || "note";
        const name = ["place", "person"].includes(type)
            ? formData.get("name")
            : null;
        const bodyData = {
            name,
            type,
            description,
        };

        const response = await fetch("/api/note", {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();
        updateNotes(responseData);
        setFormEntryValues(defaultFormValues);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white pb-2">
            <Stack direction="row" className="w-96 pb-2">
                <FormControl className="w-48 mr-1">
                    <InputLabel id="entry-type-label">Entry Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="type-select"
                        name="type"
                        defaultValue="note"
                        label="entry type"
                        onChange={handleChange}
                        value={formEntryValues.type}
                    >
                        <MenuItem value="note">Note</MenuItem>
                        <MenuItem value="person">Person</MenuItem>
                        <MenuItem value="place">Place</MenuItem>
                        <MenuItem value="important">Important</MenuItem>
                    </Select>
                </FormControl>
                {["person", "place"].includes(formEntryValues.type) && (
                    <TextField
                        id="name"
                        name="name"
                        label="Name"
                        required
                        onChange={handleChange}
                        value={formEntryValues.name}
                        className="ml-1"
                    />
                )}
            </Stack>
            <Stack direction="row" className="items-center">
                <TextField
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    required
                    className="w-96"
                    onChange={handleChange}
                    value={formEntryValues.description}
                />
                <IconButton
                    aria-label="submit"
                    size="large"
                    type="submit"
                    className="h-14"
                >
                    <AddBox className="text-3xl" />
                </IconButton>
            </Stack>
        </form>
    );
}
