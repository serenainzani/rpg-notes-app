"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DiaryEntryType } from "../__tests__/data";
import { DeleteForever, EditNote } from "@mui/icons-material";
import { Divider, IconButton } from "@mui/material";
import Description from "./Description";
import EntryIcon from "./EntryIcon";

type entryProps = {
    id: string;
    type: string;
    name?: string | null;
    description: string;
    updateNotes: (entry: DiaryEntryType, command: string) => void;
    handleCardClicked: () => void;
    isCardClicked: boolean;
};

export default function Entry({
    id,
    type,
    name,
    description,
    updateNotes,
    handleCardClicked,
    isCardClicked,
}: entryProps) {
    const handleDelete = () => {
        fetch(`/api/note/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete entry: ${id}`);
                }
                updateNotes({ id, type, name, description }, "DELETE");
            })
            .catch((error) => {
                console.error("Failed to delete entry:", error);
            });
    };

    const handleEdit = () => {};

    return (
        <Card
            variant="outlined"
            sx={{ maxWidth: 360 }}
            className={`mb-2 cursor-pointer ${
                isCardClicked && "border-amber-900 shadow-md"
            }`}
            onClick={handleCardClicked}
        >
            <Box sx={{ p: 2 }}>
                {name ? (
                    <>
                        <Stack
                            direction="row"
                            className="justify-between items-center"
                        >
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {name}
                            </Typography>
                            <EntryIcon type={type} />
                        </Stack>
                        <Description text={description} />
                    </>
                ) : (
                    <>
                        <Stack
                            direction="row"
                            className="justify-between items-top"
                        >
                            <Description text={description} />
                            <EntryIcon type={type} />
                        </Stack>
                    </>
                )}
                {isCardClicked && (
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
            </Box>
        </Card>
    );
}
