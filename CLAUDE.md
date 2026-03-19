# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint via Next.js
npm run test         # Run Jest tests
npm run test:watch   # Jest in watch mode
npm run db:create    # Initialize Supabase DB schema
```

## Architecture

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Material-UI v6, Tailwind CSS, Supabase (PostgreSQL)

**Data model** — single `DiaryEntryType`:

```typescript
{
  noteId: string       // UUID used for all client/API ops
  type: string         // "note" | "person" | "place" | "important"
  name?: string | null // Required only for person/place types
  description: string
  created?: string     // Set by Supabase on insert
}
```

**API routes** (`app/api/`):

-   `GET /api/notes` — fetch all entries ordered by `created` desc
-   `POST /api/note` — create entry
-   `DELETE /api/note/[id]` — delete by `noteId`
-   `PATCH /api/note/[id]` — update `type`, `name`, `description`

**State management** lives entirely in `app/page.tsx` (client component). It owns the notes array and passes `updateNotes` down to child components for all mutations. Components call `updateNotes` with an action object; the page component handles the API call and updates state.

**Supabase client** is created server-side in `utils/supabase/server.ts` using `@supabase/ssr` with cookie-based auth. All API routes import from there.

**Styling:** MUI theme defined in `app/themeOptions.ts` (primary: `#6d3026` brown, secondary: `#26646d` teal). Both MUI and Tailwind are used — MUI for components, Tailwind for layout/spacing utilities.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Both are public (exposed to client). Required in `.env.local` for local development.

## Testing

Tests live in `app/__tests__/`. Jest is configured with `jsdom` environment and `@/components/*` path aliases. Run a single test file: `npm test -- path/to/test.ts`.

## Commit structure

-   commit messages should follow the conversional commit message patterns e.g. feat/fix/chore: \<commit description\>
-   do not commit changes without asking me.
