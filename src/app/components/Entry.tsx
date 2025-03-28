"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DiaryEntryType } from "../__tests__/data";
import {
    Face2,
    Map,
    PriorityHigh,
    TextSnippet,
    DeleteForever,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

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
    let icon;
    switch (type) {
        case "person":
            icon = <Face2 />;
            break;
        case "place":
            icon = <Map />;
            break;
        case "important":
            icon = <PriorityHigh />;
            break;
        default:
            icon = <TextSnippet />;
            break;
    }

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

    return (
        <Card
            variant="outlined"
            sx={{ maxWidth: 360 }}
            className={`mb-2 ${isCardClicked && "border-amber-900 shadow-md"}`}
            onClick={handleCardClicked}
        >
            <Box sx={{ p: 2 }}>
                {name ? (
                    <>
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {name}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                {icon}
                            </Typography>
                        </Stack>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                        >
                            {description}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                gutterBottom
                                component="div"
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                {description}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                {icon}
                            </Typography>
                        </Stack>
                    </>
                )}
                {isCardClicked && (
                    <Stack direction="row" className="w-full items-center">
                        <IconButton
                            aria-label="submit"
                            size="small"
                            type="button"
                            onClick={handleDelete}
                            className="ml-auto p-0"
                        >
                            <DeleteForever
                                fontSize="small"
                                className="fill-gray-800"
                            />
                        </IconButton>
                    </Stack>
                )}
            </Box>
        </Card>
    );
}
