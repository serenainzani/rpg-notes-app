import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        white: string;
    }
    interface PaletteOptions {
        white?: string;
    }
}

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6d3026",
        },
        secondary: {
            main: "#26646d",
        },
        success: {
            main: "#266d30",
        },
        error: {
            main: "#bc3653",
        },
    },
});
