<!-- todo shields -->
# RPG Notes
The minimalist web app for making notes during your RPG game

## Tech Stack
This app uses:
- **Next.js** frontend with **App Router** for the API
- **TypeScript** as the main
- **SQLite** for the database

## Using the App
You can submit 4 types of entries: note, person, place, and important.

I picked these as it what I log the most during my game.

## Dev Setup

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The main page of the app is in `app/page.tsx`. 

## API

There are two endpoints:
- /api/notes - GET - returns all of the entries
- /api/note - POST - creates a new entry

End points planned for the future:
- /api/note/{id} - DELETE - remove an entry
- /api/note/{id} - PUT - update an entry

<br />Swagger tbc
