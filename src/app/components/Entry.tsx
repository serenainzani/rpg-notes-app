import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DiaryEntryType } from "../__tests__/data";
import { Face2, Map, PriorityHigh, TextSnippet } from "@mui/icons-material";

export default function Entry({ type, name, description }: DiaryEntryType) {
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

    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }} className="mb-2">
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
            </Box>
        </Card>
    );
}
