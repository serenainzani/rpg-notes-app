"use client";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import AuthButton from "./components/AuthButton";
import { useState, useEffect } from "react";
import { CampaignType } from "./__tests__/data";
import { theme } from "./themeOptions";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Home() {
    const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                setUser(null);
                return;
            }
            setUser(user);
            fetch("/api/campaigns")
                .then((res) => {
                    if (res.status === 401) {
                        setUser(null);
                        return null;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) setCampaigns(data);
                })
                .catch((error) => console.error("Fetch error:", error));
        });
    }, []);

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
        setCampaigns([]);
    };

    const handleCreateCampaign = async () => {
        const response = await fetch("/api/campaigns", {
            method: "POST",
            body: JSON.stringify({
                title: newTitle,
                description: newDescription,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const campaign = await response.json();
        setCampaigns((prev) => [campaign, ...prev]);
        setNewTitle("");
        setNewDescription("");
        setDialogOpen(false);
    };

    const formatLastNote = (lastNote: string | null) => {
        if (!lastNote) return "No notes yet";
        return new Date(lastNote).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="mx-2 flex flex-col items-center">
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
                        <Typography variant="h4" component="h2" color="primary">
                            Campaigns
                        </Typography>
                        <List>
                            {campaigns.map((campaign) => (
                                <ListItemButton
                                    key={campaign.id}
                                    component={Link}
                                    href={`/campaigns/${campaign.id}`}
                                    divider
                                >
                                    <ListItemText
                                        primary={campaign.title}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    color: theme.palette
                                                        .secondary.main,
                                                },
                                            },
                                        }}
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    display="block"
                                                >
                                                    {campaign.description}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Last note:{" "}
                                                    {formatLastNote(
                                                        campaign.last_note
                                                    )}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>

                        <nav className="flex justify-evenly w-96">
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={() => setDialogOpen(true)}
                                className="flex justify-center mt-4"
                                color="primary"
                            >
                                New Campaign
                            </Button>
                            <AuthButton
                                onClick={handleSignOut}
                                message="Sign out"
                            />
                        </nav>

                        <Dialog
                            open={dialogOpen}
                            onClose={() => setDialogOpen(false)}
                            fullWidth
                        >
                            <DialogTitle>New Campaign</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    label="Title"
                                    fullWidth
                                    margin="dense"
                                    value={newTitle}
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                />
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    margin="dense"
                                    value={newDescription}
                                    onChange={(e) =>
                                        setNewDescription(e.target.value)
                                    }
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateCampaign}
                                    disabled={!newTitle.trim()}
                                    variant="contained"
                                    disableElevation
                                    color="primary"
                                >
                                    Create
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </div>
        </ThemeProvider>
    );
}
