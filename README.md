# Pi Photo Frame

A wifi-connected digital photo frame that displays photos from a shared Google
Drive folder. Family members drop photos into the folder from their phones, and
they appear on the frame automatically — zero technical steps for the person it's
gifted to. That shared folder _is_ the feature: it turns a photo frame into a
living, collaborative one.

Built to run on a **Raspberry Pi Zero 2 W** in Chromium kiosk mode, pointed at a
**React app hosted on Vercel**.

---

## How it works

The frame is deliberately "dumb." The Pi holds **no application code** — it boots
straight into Chromium pointed at the Vercel URL. To update the frame, you
`git push`; Vercel redeploys, and the frame picks up the new version on its next
load. After the one-time setup, you never touch the Pi again — which matters when
it's mounted on a wall on another continent.

Two separate actors talk to Google Drive, and they authenticate completely
differently. This distinction is the heart of the project:

1. **The serverless function** (`/api/images`) authenticates as a Google
   **service account** using a private key, lists the photo folder, and returns a
   JSON array of pre-sized thumbnail URLs.
2. **The Pi's browser** then fetches each image _directly_ from Google's thumbnail
   endpoint — with **no authentication at all**.

```
Browser ──GET /api/images──▶  Vercel function ──authenticated──▶  Google Drive
   │                          (service account key)               (lists folder)
   │
   └──fetches each image directly, unauthenticated──▶  Google Drive thumbnail
```

Because the unauthenticated browser is the one loading the actual pixels, the
Drive folder needs **two** sharing grants (see [Drive setup](#google-cloud--drive-setup)):
the service account as a Viewer (so the function can list files), **and** "Anyone
with the link → Viewer" (so the browser can fetch the images). Share it only with
the service account and the API works perfectly while the frame shows nothing but
broken icons.

Image URLs use Google's thumbnail endpoint, pre-sized server-side:

```
https://drive.google.com/thumbnail?id=FILE_ID&sz=w1920-h1080
```

This does double duty: it keeps memory low on the Pi (images arrive already
downscaled), and it **transcodes HEIC to JPEG** on Google's side — so iPhone
photos render in Chromium even though a raw `.HEIC` would not.

---

## Tech stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Vercel serverless functions (Node)
- **Data:** Google Drive API via `googleapis`, using a service-account credential
- **Hosting:** Vercel (auto-deploys on `git push`)
- **Device:** Raspberry Pi Zero 2 W running Raspberry Pi OS Bookworm Lite, Chromium in kiosk mode

---

## Features

**Built**

- Pulls photos from a shared Google Drive folder, auto-updating as photos are added
- Filters to images only, skips trashed files
- Full-screen slideshow on a timer
- Crossfade dissolve between photos (mount-keyed CSS animation)
- Background preloading of the upcoming photo (smooth transitions over slow wifi)
- Blurred-fill backdrop so portrait/odd-ratio photos show in full with no dead black bars
- Memory-bounded: at most a few `<img>` elements in the DOM regardless of folder size

**Planned**

- Ken Burns slow pan-and-zoom on each photo
- Subtle clock / date overlay (optionally weather)
- "On This Day" — surface photos taken on today's date in past years (uses captured EXIF date, already collected as `takenAt`)
- Overnight screen-off scheduling

---

## Project structure

```
pi-photo-frame/
├── api/
│   └── images.ts        # serverless function: lists Drive folder, returns image URLs
├── src/
│   ├── Frame.tsx        # the slideshow component
│   ├── Frame.css        # crossfade, blurred backdrop, layout
│   ├── App.tsx
│   └── main.tsx
├── setup-kiosk.sh       # one-time Pi kiosk setup script
├── .env                 # local secrets — NOT committed
└── README.md
```

---

## Prerequisites

- Node.js and npm
- A Google account (to own the Drive folder and Cloud project)
- A free Vercel account
- For the device: a Raspberry Pi Zero 2 W, microSD card, and a compatible HDMI screen

---

## Getting started (local)

```bash
git clone <your-repo-url>
cd pi-photo-frame
npm install
```

Create a `.env` file in the project root (see [Environment variables](#environment-variables)),
then run the dev server **with the Vercel CLI**, not `npm run dev` — plain Vite
only serves the frontend and won't run the `/api` function:

```bash
npm i -g vercel
vercel dev
```

Open `http://localhost:3000` for the frame, or `http://localhost:3000/api/images`
to see the raw JSON the function returns.

---

## Google Cloud & Drive setup

This is the part that's easy to get subtly wrong. Two distinct things, in two
different places.

### 1. Create a service account (Google Cloud Console)

A service account — **not** an OAuth client. OAuth is for logging in a human; this
frame has no human to log in. A service account is an identity your _server_ owns.

1. Create a project, then enable the **Google Drive API** (APIs & Services → Library).
2. Go to **IAM & Admin → Service Accounts → Create service account**. Name it
   (e.g. `drive-reader`) and click **Done** — skip the optional project roles; they
   govern Cloud resources, not Drive access.
3. Open the new account → **Keys → Add key → Create new key → JSON**. The key
   downloads once and cannot be re-downloaded. Keep it safe and **never commit it**.

### 2. Share the Drive folder (Google Drive — two grants)

Drive access is granted through Drive's own sharing dialog, _not_ Cloud IAM roles.
On your photo folder → **Share**:

1. Add the service account's email (`…@….iam.gserviceaccount.com`, found in the
   JSON key) as a **Viewer**. This lets the function list the folder.
2. Set **General access → Anyone with the link → Viewer**. This lets the Pi's
   unauthenticated browser fetch the images, and keeps the "family can drop photos
   in" feature working.

**Verify:** paste a `https://drive.google.com/thumbnail?id=FILE_ID` URL into a
logged-out / incognito window. If the image loads, link sharing is correct. If you
hit a sign-in wall, it isn't.

---

## Environment variables

| Variable              | Where it comes from                        | Notes                                                                            |
| --------------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_EMAIL` | `client_email` in the service-account JSON | the `…iam.gserviceaccount.com` address                                           |
| `GOOGLE_PRIVATE_KEY`  | `private_key` in the service-account JSON  | keep the literal `\n` sequences; wrap the whole value in double quotes in `.env` |
| `DRIVE_FOLDER_ID`     | the folder's URL slug                      | from `drive.google.com/drive/folders/THIS_PART`                                  |

Example `.env`:

```
GOOGLE_CLIENT_EMAIL=drive-reader@pi-photo-frame.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
DRIVE_FOLDER_ID=1AbC2dEf...
```

**The `\n` matters.** A `.env` file stores `\n` as two literal characters
(backslash + n), but a PEM key requires real line breaks. The function repairs this
at runtime with `process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")`, so store the
key in the `\n` form **everywhere** — locally and in Vercel — and the same code
works in both.

---

## Deploying to Vercel

1. Add all three variables in **Vercel → your project → Settings → Environment
   Variables**, applied to **Production, Preview, and Development**. The fastest,
   least error-prone way is **Import .env** — hand-pasting the long private key is
   the classic way to truncate it and get a silent auth failure.
2. Connect the GitHub repo under **Settings → Git**. From then on, every push to
   `main` auto-deploys to production; pushes to other branches get preview URLs.
   (Or deploy manually any time with `vercel --prod`.)
3. **Verify production:** open `https://your-url.vercel.app/api/images`. Photos as
   JSON means production auth works. An empty array or error almost always means a
   missing/mistyped env var, not a code bug.

---

## Raspberry Pi setup (one-time)

1. Flash **Raspberry Pi OS Bookworm Lite** with Raspberry Pi Imager. In the
   Imager's advanced settings, set the wifi name + password and enable SSH. (Lite,
   not the full desktop — it preserves the Zero 2 W's 512MB RAM.)
2. Boot the Pi; it joins wifi on its own. SSH in from your laptop.
3. Edit `FRAME_URL` at the top of `setup-kiosk.sh` to your Vercel URL, then run:
   ```bash
   bash setup-kiosk.sh
   ```
4. Connect the screen and reboot — it boots straight into the frame.

> **Hardware note:** the Pi Zero 2 W uses **mini-HDMI**. The Waveshare 7" screen
> kit ships a **micro-HDMI** adapter (for the Pi 4/5), so a separate
> mini-HDMI-to-HDMI adapter is required.

---

## Security

- **Never commit `.env` or the service-account `.json` key.** Both are in
  `.gitignore`; the key is your credential in the clear, and bots scrape public
  repos for exactly these within minutes of a push.
- Secrets live in the Vercel dashboard for production and in local `.env` for dev —
  never in the repo.
- The service account is scoped to **`drive.readonly`**: least privilege, so a
  leaked key could at worst read an already-link-public folder, never write or delete.
- If a key is ever exposed, delete it in the Cloud Console and create a fresh one —
  a service account can hold several keys.

---

## Roadmap (v2 ideas)

- Touch interactions: tap to pause, swipe to skip, favourite a photo, switch albums
- PIR motion sensor to wake/sleep the screen with room presence
- Local `rclone` sync fallback so the frame survives a wifi drop
- Wifi resilience: Comitup captive portal (so a non-technical user can reconnect it)
  - Tailscale (for remote SSH from anywhere)
