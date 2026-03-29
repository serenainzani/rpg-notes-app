export type DiaryEntryType = {
    id?: number;
    noteId: string;
    type: string;
    name?: string | null;
    description: string;
    created?: string;
    campaign_id?: string | null;
};

export type CampaignType = {
    id: string;
    created_at: string;
    last_note: string | null;
    description: string;
    user_id: string;
    title: string;
};
