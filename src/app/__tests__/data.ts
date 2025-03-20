export type DiaryEntryType = {
    type: string;
    name?: string | null;
    description: string;
};

export const mockData: DiaryEntryType[] = [
    {
        type: "note",
        description: "it's sunny today with a light breeze",
    },
    {
        type: "person",
        name: "Captain O'Hara",
        description:
            "Short, young women with serious air. Owns the largest ship in the port. Hates smell of tomatoes.",
    },
    {
        type: "place",
        name: "Toadport",
        description:
            "Neutral ground for pirates and merchants alike to sell their wares",
    },
    {
        type: "note",
        description:
            "The portal in the woods randomly shoots out frogs every few minutes. Villager said a mage in the labyrinth may know why.",
    },
    {
        type: "note",
        description:
            "Stepped on a plate, floor collapsed. Now in a room with glowing symbols. Walls shifting. Something's in here. ",
    },
    {
        type: "important",
        description:
            "we got cursed, so whilst in this labyrinth we take an extra 1d4 of damage when attacked",
    },
    {
        type: "note",
        description:
            "Exiting the alchemy lab, we turned left, the right, then left, then straight ahead. We ended up at a metal door",
    },
].reverse();
