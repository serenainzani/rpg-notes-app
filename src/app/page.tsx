"use client";

import { Box, Paper, Typography } from "@mui/material";
import FiltersBar from "./components/FiltersBar";
import NewEntryForm from "./components/NewEntryForm";
import { mockData } from "./__tests__/data";
import Entry from "./components/Entry";
import { useState, useEffect } from "react";

export default function Home() {
    const [value, setValue] = useState("");

    useEffect(() => {
        console.log(value);
    }, [value]);

    const handleFilterChange = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        newValue !== value ? setValue(newValue) : setValue("");
    };

    return (
        <div>
            <div className="pb-64">
                <Typography variant="h1" gutterBottom>
                    RPG Notes
                </Typography>
                {value
                    ? mockData
                          .filter((entry) => entry.type === value)
                          .map((entry, index) => (
                              <Entry
                                  key={index}
                                  type={entry.type}
                                  name={entry.name}
                                  description={entry.description}
                              />
                          ))
                    : mockData.map((entry, index) => (
                          <Entry
                              key={index}
                              type={entry.type}
                              name={entry.name}
                              description={entry.description}
                          />
                      ))}
            </div>
            <Box className="bg-green-200" sx={{ position: "fixed", bottom: 0 }}>
                <NewEntryForm />
                <Paper elevation={3}>
                    <FiltersBar
                        value={value}
                        handleFilterChange={handleFilterChange}
                    />
                </Paper>
            </Box>
        </div>
    );
}
