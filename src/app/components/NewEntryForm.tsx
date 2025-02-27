"use client";

import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { AddBox } from "@mui/icons-material";

export default function NewEntryForm() {
    const [entryType, setEntryType] = useState("");
    const handleEntryTypeInputChange = (event: SelectChangeEvent) => {
        setEntryType(event.target.value as string);
    };

    // TODO TRY FORMIK
    function handleSubmit(event: any) {
        event.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white">
            <Stack direction="row" className="w-96">
                <FormControl className="w-48">
                    <InputLabel id="entry-type-label">Entry Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
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
                    <TextField id="name" label="Name" required />
                )}
            </Stack>
            <TextField
                id="description"
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
