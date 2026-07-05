# Zaney Logic

Zaney Logic is a mobile-first logic grid mystery game for Vercel hosting. Every case is generated from a deterministic seed and checked by the solver before play.

## What is included

- Daily mystery route with shareable case links.
- Ten mystery packs: museum robbery, haunted mansion, space station, pirates, school mystery, lost treasure, fantasy kingdom, spy mission, wildlife reserve, and detective agency.
- Interactive notebook: evidence, witnesses, timeline, suspects, maps, and auto-notes.
- Logic grid marking for yes/no/unknown.
- Final deduction validation.
- AI Detective Assistant nudges that do not reveal the answer.
- Rank progression: Rookie, Detective, Inspector, Chief Inspector, Legend.
- Generator page for deterministic pack/seed cases.
- Google AdSense-ready ad slots.
- Pack-specific black-and-white case evidence photos.

## Local run

```bash
npm run dev
```

Open `http://localhost:4173`.

## Puzzle guarantee

Run the catalog audit before deployment:

```bash
npm test
```

The test validates the first 5,000 generated cases across every pack and fails if any case has zero solutions or multiple solutions.

## Vercel

This is a static app. Connect the Git repo to Vercel and keep the build command as:

```bash
npm run build
```

The build command runs the 5,000-puzzle audit across every pack, then writes the deployable static site to `public/`. Set Vercel's Output Directory to `public`.

## Ads

The UI has two ad placements marked as Google AdSense slots. After AdSense approval, replace those placeholders with your publisher script and `ins` tags from Google. Keep the first viewport readable on mobile and avoid placing ads between the clue list and the grid.
