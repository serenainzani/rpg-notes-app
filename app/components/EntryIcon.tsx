import { Typography } from "@mui/material";
import { Face2, Map, PriorityHigh, TextSnippet } from "@mui/icons-material";

type EntryIconProps = {
    type: string;
};

export default function EntryIcon({ type }: EntryIconProps) {
    let icon;
    switch (type) {
        case "person":
            icon = <Face2 color="secondary" />;
            break;
        case "place":
            icon = <Map color="success" />;
            break;
        case "important":
            icon = <PriorityHigh color="error" />;
            break;
        default:
            icon = <TextSnippet color="primary" />;
            break;
    }

    return (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {icon}
        </Typography>
    );
}
