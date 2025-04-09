import { Typography } from "@mui/material";
import { Face2, Map, PriorityHigh, TextSnippet } from "@mui/icons-material";

type EntryIconProps = {
    type: string;
};

export default function EntryIcon({ type }: EntryIconProps) {
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
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {icon}
        </Typography>
    );
}
