# RPG Notes
<p>
  <a href="https://github.com/serenainzani/rpg-notes-app/commits/main/"><img src="https://img.shields.io/github/last-commit/serenainzani/rpg-notes-app" /></a>
  <a href="https://rpg-notes-app.vercel.app/"><img src="https://img.shields.io/website?url=https%3A%2F%2Frpg-notes-app.vercel.app%2F" /></a>
  <img src="https://img.shields.io/github/languages/top/serenainzani/rpg-notes-app" />
  <a href="https://github.com/serenainzani/rpg-notes-app/issues"><img src="https://img.shields.io/github/issues/serenainzani/rpg-notes-app" /></a>
  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"><img src="https://img.shields.io/badge/license-GPLv3-orange" /></a>
  
</p>

<hr />

The minimalist web app for making notes during your RPG game. Check it out [here](https://rpg-notes-app.vercel.app/)!

<img width="600" alt="image" src="https://github.com/user-attachments/assets/5b7b478e-d86d-40cb-8750-e929cd7b8b73" />


## Tech Stack
This app uses:
- **Next.js** frontend
- **Next.js App Router** for the API
- **PostgreSQL** for the database (through Supabase)
- TypeScript & Tailwind

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
