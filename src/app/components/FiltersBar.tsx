import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Face2, Map, PriorityHigh, TextSnippet } from "@mui/icons-material";

type FiltersBarType = {
    value: string;
    handleFilterChange: (event: React.SyntheticEvent, newValue: string) => void;
};

export default function FiltersBar({
    value,
    handleFilterChange,
}: FiltersBarType) {
    return (
        <BottomNavigation
            className="bg-white"
            value={value}
            onChange={handleFilterChange}
        >
            <BottomNavigationAction
                label="Notes"
                value="note"
                icon={<TextSnippet className="bg-white" />}
            />
            <BottomNavigationAction
                label="People"
                value="person"
                icon={<Face2 />}
            />
            <BottomNavigationAction
                label="Places"
                value="place"
                icon={<Map />}
            />
            <BottomNavigationAction
                label="Important"
                value="important"
                icon={<PriorityHigh />}
            />
        </BottomNavigation>
    );
}
