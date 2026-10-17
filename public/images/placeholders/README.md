# Adding photos to the site

Every image on the site is registered in [`lib/images.ts`](../../../lib/images.ts)
with what it shows and whether it may be published. Two commands keep this safe.

## Add a photo

1. **Put the camera original in `media-originals/`** at the project root. That
   folder is git-ignored: originals carry GPS location and full-size faces, so
   they never go in the repo. Keep your own copy somewhere private too (phone,
   private Drive folder).
2. **Process it:**

   ```bash
   npm run photos:add -- media-originals/IMG_1234.jpg village/path
   ```

   This turns it upright, strips **all** hidden metadata (GPS, camera,
   timestamps), resizes it to 2000px on the long edge, compresses it under
   650 KB and saves it to `public/images/village/path.jpg`. It prints an entry
   to paste into `lib/images.ts`.

3. **Fill in the entry honestly:** an `alt` that says exactly what is in the
   photo, then `people` and `consent`:

   | `people`       | Meaning                                 | `consent`                          |
   | -------------- | --------------------------------------- | ---------------------------------- |
   | `none`         | No people                               | `not-needed`                       |
   | `incidental`   | People too small or turned away to know | `not-needed`                       |
   | `identifiable` | Someone could be recognised             | `pending`, `cleared` or `withheld` |

   Set `children: true` whenever a child appears.

4. **Check it:** `npm run photos:check`

## What the check enforces

`npm run photos:check` fails if:

- any image under `public/` still carries hidden metadata (where GPS lives)
- any site photo is over 700 KB or over 2400px (a raw original slipped in)
- a camera original (`IMG*.jpg`, `.heic`) is tracked in git, or anything in
  `media-originals/` is
- an entry points at a missing file, or `people` and `consent` contradict each
  other

It warns, on every run, about identifiable photos still `pending` a consent
decision, and about files nothing points at.

On the live site, `<Figure>` never shows a photo marked `withheld`; the slot
falls back to a branded placeholder. Previews still show it, labelled, so it
can be reviewed.

## Rules for every photo

- **Consent first.** Identifiable people, above all children, wounded or
  vulnerable people, need informed agreement (for children, their family's).
  When in doubt, `withheld`.
- **Dignity over pity.** Agency, community and everyday life, never suffering
  as spectacle.
- **Never locate the village.** No signs, boards or landmarks that name or
  pin down the village. The metadata is stripped automatically; what is
  _in_ the picture is up to you.

## Folder map

| Folder      | Used by                                    |
| ----------- | ------------------------------------------ |
| `village/`  | Home photo strip, page heroes, field notes |
| `founder/`  | Home and About                             |
| `the-need/` | The Need page                              |
| `programs/` | Programs, About, Founder                   |
