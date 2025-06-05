import { createClient } from "@/utils/supabase/server";
export default async function Instruments() {
    const supabase = await createClient();
    const { data: rpgNotes } = await supabase.from("rpg-notes").select();
    return <pre>{JSON.stringify(rpgNotes, null, 2)}</pre>;
}
