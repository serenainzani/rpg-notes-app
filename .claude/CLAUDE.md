# CLAUDE.md

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint via Next.js
npm run test         # Run Jest tests
npm run test:watch   # Jest in watch mode
npm run db:create    # Initialize Supabase DB schema
```

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

## Coding Style

- reduce code duplication where possible when generating new code or making new code changes
