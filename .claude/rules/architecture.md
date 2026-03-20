# Architecture

## Stack

-   Next.js 15 (App Router)
-   React 19
-   TypeScript
-   Material-UI v6
-   Tailwind CSS
-   Supabase (PostgreSQL)

## Data model

Single `DiaryEntryType`:

```typescript
{
  noteId: string       // UUID used for all client/API ops
  type: string         // "note" | "person" | "place" | "important"
  name?: string | null // Required only for person/place types
  description: string
  created?: string     // Set by Supabase on insert
}
```

## API routes

`app/api/`:

-   `GET /api/notes` — fetch all entries ordered by `created` desc
-   `POST /api/note` — create entry
-   `DELETE /api/note/[id]` — delete by `noteId`
-   `PATCH /api/note/[id]` — update `type`, `name`, `description`

## State management

Lives entirely in `app/page.tsx` (client component). It owns the notes array and passes `updateNotes` down to child components for all mutations. Components call `updateNotes` with an action object; the page component handles the API call and updates state.

## Supabase client

Is created server-side in `utils/supabase/server.ts` using `@supabase/ssr` with cookie-based auth. All API routes import from there.

## Styling

MUI theme defined in `app/themeOptions.ts` (primary: `#6d3026` brown, secondary: `#26646d` teal). Both MUI and Tailwind are used — MUI for components, Tailwind for layout/spacing utilities.
