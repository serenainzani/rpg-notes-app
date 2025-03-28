import { Typography } from "@mui/material";

type DescriptionProps = {
    text: string;
};

export default function Description({ text }: DescriptionProps) {
    return (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {text}
        </Typography>
    );
}
