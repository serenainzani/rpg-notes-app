"use client";

import { Button, Paper, ThemeProvider, Typography } from "@mui/material";
import FiltersBar from "@/app/components/FiltersBar";
import NewEntryForm from "@/app/components/NewEntryForm";
import Entry from "@/app/components/Entry";
import AuthButton from "@/app/components/AuthButton";
import { useState, useEffect } from "react";
import { DiaryEntryType } from "@/app/__tests__/data";
import { theme } from "@/app/themeOptions";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

export default function CampaignNotes() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [value, setValue] = useState("");
    const [notes, setNotes] = useState<DiaryEntryType[]>([]);
    const [cardClicked, setCardClicked] = useState("");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                setUser(null);
                return;
            }
            setUser(user);
            fetch(`/api/notes?campaign_id=${id}`)
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
    }, [id]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setNotes([]);
        router.push("/");
    };

    const updateNotes = (entry: DiaryEntryType, method: string) => {
        switch (method) {
            case "POST":
                setNotes((prevNotes) => [entry, ...prevNotes]);
                break;
            case "DELETE":
                setNotes(notes.filter((note) => entry.noteId !== note.noteId));
                break;
            case "PATCH":
                setNotes(
                    notes.map((existingNote) =>
                        existingNote.noteId === entry.noteId
                            ? entry
                            : existingNote
                    )
                );
                break;
        }
    };

    const handleFilterChange = (_: React.SyntheticEvent, newValue: string) => {
        newValue !== value ? setValue(newValue) : setValue("");
    };

    const handleCardClick = (id: string) => {
        setCardClicked((prev) => (prev !== id ? id : ""));
    };

    const filteredNotes = value
        ? notes.filter((entry) => entry.type === value)
        : notes;

    return (
        <ThemeProvider theme={theme}>
            <div className="mx-2 pb-28">
                <Typography
                    variant="h2"
                    component="h1"
                    className="text-center py-5"
                    color="primary"
                >
                    RPG Notes
                </Typography>

                {user === null ? (
                    <Typography color="text.secondary">Loading...</Typography>
                ) : (
                    <>
                        <NewEntryForm
                            updateNotes={updateNotes}
                            campaignId={id}
                        />
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

                        <div className="flex justify-center">
                            <div className="flex justify-center mt-4 mr-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => router.push("/")}
                                >
                                    Campaigns
                                </Button>
                            </div>
                            <AuthButton
                                onClick={handleSignOut}
                                message="Sign out"
                            />
                        </div>
                    </>
                )}
            </div>
        </ThemeProvider>
    );
}
