"use client";

import { Paper, ThemeProvider, Typography } from "@mui/material";
import FiltersBar from "./components/FiltersBar";
import NewEntryForm from "./components/NewEntryForm";
import Entry from "./components/Entry";
import AuthButton from "./components/AuthButton";
import { useState, useEffect, useMemo } from "react";
import { DiaryEntryType } from "./__tests__/data";
import { theme } from "./themeOptions";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";

export default function Home() {
    const [value, setValue] = useState("");
    const [notes, setNotes] = useState<DiaryEntryType[]>([]);
    const [cardClicked, setCardClicked] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    );

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                setUser(null);
                return;
            }
            setUser(user);
            fetch("/api/notes")
                .then((res) => {
                    if (res.status === 401) {
                        setUser(null);
                        return null;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) setNotes(data);
                })
                .catch((error) => console.error("Fetch error:", error));
        });
    }, [supabase]);

    const handleSignIn = () => {
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setNotes([]);
    };

    const updateNotes = (entry: DiaryEntryType, method: string) => {
        switch (method) {
            case "POST":
                console.log("new entry", entry);
                setNotes((prevNotes) => {
                    const updatedNotes = [entry, ...prevNotes];
                    return updatedNotes;
                });
                break;
            case "DELETE":
                const removedNotes = notes.filter(
                    (note) => entry.noteId !== note.noteId
                );
                setNotes(removedNotes);
                break;
            case "PATCH":
                const modifiedNotes = notes.map((existingNote) =>
                    existingNote.noteId === entry.noteId ? entry : existingNote
                );
                setNotes(modifiedNotes);
                break;
        }
    };

    const handleFilterChange = (_: React.SyntheticEvent, newValue: string) => {
        newValue !== value ? setValue(newValue) : setValue("");
    };

    const handleCardClick = (id: string) => {
        cardClicked !== id ? setCardClicked(id) : setCardClicked("");
    };

    const filteredNotes = value
        ? notes.filter((entry) => entry.type === value)
        : notes;

    return (
        <ThemeProvider theme={theme}>
            <div className="mx-2">
                <Typography
                    variant="h2"
                    component="h1"
                    className="text-center py-5"
                    color="primary"
                >
                    RPG Notes
                </Typography>

                {user === null ? (
                    <AuthButton
                        onClick={handleSignIn}
                        message="Sign in with Google"
                    />
                ) : (
                    <>
                        <NewEntryForm updateNotes={updateNotes} />
                        <Paper elevation={3} className="mb-3">
                            <FiltersBar
                                value={value}
                                handleFilterChange={handleFilterChange}
                            />
                        </Paper>

                        {filteredNotes.map((entry, index) => (
                            <Entry
                                key={entry.noteId || index}
                                noteId={entry.noteId}
                                type={entry.type}
                                name={entry.name}
                                description={entry.description}
                                updateNotes={updateNotes}
                                handleCardClicked={handleCardClick}
                                isCardClicked={cardClicked === entry.noteId}
                            />
                        ))}
                        <AuthButton
                            onClick={handleSignOut}
                            message="Sign out"
                        />
                    </>
                )}
            </div>
        </ThemeProvider>
    );
}
