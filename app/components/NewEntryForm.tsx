"use client";

import {
    Button,
    FormControl,
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
import { theme } from "../themeOptions";

type EntryFormProps = {
    updateNotes: (entry: DiaryEntryType, command: string) => void;
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

        // TODO put this all in a try catch block, so entry only appears on page if POST was a success

        const response = await fetch("/api/note", {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();
        updateNotes(responseData[0], "POST");
        setFormEntryValues(defaultFormValues);
    }

    return (
        <form onSubmit={handleSubmit} className="w-full pb-2">
            <Stack direction="row" className="w-full pb-2">
                <FormControl
                    className={`${
                        ["person", "place"].includes(formEntryValues.type)
                            ? "w-1/2"
                            : "w-full"
                    }`}
                >
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
                        className="w-1/2 ml-1"
                    />
                )}
            </Stack>
            <Stack direction="column" className="">
                <TextField
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    required
                    onChange={handleChange}
                    value={formEntryValues.description}
                />
                <Button
                    disableElevation
                    className="h-14 mt-2"
                    aria-label="submit"
                    type="submit"
                    sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                    }}
                >
                    <AddBox className="text-3xl text-gray-200" />
                </Button>
            </Stack>
        </form>
    );
}
