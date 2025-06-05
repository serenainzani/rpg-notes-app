"use client";

import { ChangeEvent, MouseEvent, useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DiaryEntryType } from "../__tests__/data";
import { Close, DeleteForever, Done, EditNote } from "@mui/icons-material";
import {
    Divider,
    IconButton,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import Description from "./Description";
import EntryIcon from "./EntryIcon";

type entryProps = {
    noteId: string;
    type: string;
    name?: string | null;
    description: string;
    updateNotes: (entry: DiaryEntryType, command: string) => void;
    handleCardClicked: (id: string) => void;
    isCardClicked: boolean;
};

export default function Entry({
    noteId,
    type,
    name,
    description,
    updateNotes,
    handleCardClicked,
    isCardClicked,
}: entryProps) {
    const [editing, setEditing] = useState(false);
    const [editFormValues, setEditFormValues] = useState({ name, description });

    const handleDelete = () => {
        fetch(`/api/note/${noteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete entry: ${noteId}`);
                }
                updateNotes({ noteId, type, name, description }, "DELETE");
            })
            .catch((error) => {
                console.error("Failed to delete entry:", error);
            });
    };

    const handlePatch = () => {
        fetch(`/api/note/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify({ ...editFormValues, type, noteId }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to amend entry: ${noteId}`);
                }
                updateNotes({ ...editFormValues, type, noteId }, "PATCH");
                setEditing(false);
            })
            .catch((error) => {
                console.error("Failed to amend entry:", error);
            });
    };

    const handleEdit = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEditing(!editing);
    };

    const handleChange = (
        event:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>
    ) => {
        event.stopPropagation();
        setEditFormValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };

    const cardContent = () => {
        if (editing) {
            if (name) {
                return (
                    <form>
                        <Stack
                            direction="row"
                            className="justify-between items-center"
                        >
                            <TextField
                                id="name"
                                placeholder="name"
                                value={editFormValues.name}
                                onChange={handleChange}
                                variant="standard"
                                name="name"
                                color="secondary" //todo change to brown somehow
                            />
                            <EntryIcon type={type} />
                        </Stack>
                        <TextField
                            id="description"
                            placeholder="description"
                            value={editFormValues.description}
                            onChange={handleChange}
                            variant="standard"
                            name="description"
                            multiline
                            rows={3}
                            className="w-full"
                            color="secondary" //todo change to brown somehow
                        />
                    </form>
                );
            } else {
                return (
                    <form>
                        <Stack
                            direction="row"
                            className="justify-between items-top"
                        >
                            <TextField
                                id="description"
                                placeholder="description"
                                value={editFormValues.description}
                                onChange={handleChange}
                                variant="standard"
                                name="description"
                                multiline
                                rows={3}
                                className="w-full"
                            />
                            <EntryIcon type={type} />
                        </Stack>
                    </form>
                );
            }
        } else if (name) {
            return (
                <>
                    <Stack
                        direction="row"
                        className="justify-between items-center"
                    >
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                        <EntryIcon type={type} />
                    </Stack>
                    <Description text={description} />
                </>
            );
        } else if (!name) {
            return (
                <Stack direction="row" className="justify-between items-top">
                    <Description text={description} />
                    <EntryIcon type={type} />
                </Stack>
            );
        }
    };

    return (
        <Card
            variant="outlined"
            sx={{ maxWidth: 360 }}
            className={`mb-2 cursor-pointer ${
                isCardClicked && "border-amber-900 shadow-md"
            }`}
            onClick={() => handleCardClicked(noteId)}
        >
            <Box sx={{ p: 2 }}>
                {cardContent()}
                {isCardClicked && !editing && (
                    <>
                        <Divider className="mt-3" />
                        <Stack
                            direction="row"
                            className="w-full mt-5 justify-evenly items-center"
                        >
                            <IconButton
                                aria-label="submit"
                                size="small"
                                type="button"
                                onClick={handleEdit}
                                className="p-0"
                            >
                                <EditNote
                                    fontSize="small"
                                    className="fill-gray-800"
                                />
                            </IconButton>
                            <IconButton
                                aria-label="submit"
                                size="small"
                                type="button"
                                onClick={handleDelete}
                                className="p-0"
                            >
                                <DeleteForever
                                    fontSize="small"
                                    className="fill-gray-800"
                                />
                            </IconButton>
                        </Stack>
                    </>
                )}
                {editing && (
                    <>
                        <Divider className="mt-3" />
                        <Stack
                            direction="row"
                            className="w-full mt-5 justify-evenly items-center"
                        >
                            <IconButton
                                aria-label="submit"
                                size="small"
                                type="button"
                                onClick={handlePatch}
                                className="p-0"
                            >
                                <Done
                                    fontSize="small"
                                    className="fill-gray-800"
                                />
                            </IconButton>
                            <IconButton
                                aria-label="submit"
                                size="small"
                                type="button"
                                onClick={handleEdit}
                                className="p-0"
                            >
                                <Close
                                    fontSize="small"
                                    className="fill-gray-800"
                                />
                            </IconButton>
                        </Stack>
                    </>
                )}
            </Box>
        </Card>
    );
}
