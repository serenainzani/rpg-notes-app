export type DiaryEntryType = {
    id?: number;
    noteId: string;
    type: string;
    name?: string | null;
    description: string;
    created?: string;
};
