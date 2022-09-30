# Yagami Web

This repo contains all of the code for the web interface of the yagami app

## Developing

1. Install dependencies

```bash
pnpm install
```

2. Add env variables

```env
DATABASE_URL=""

PUBLIC_OSU_CLIENT_ID=""
OSU_CLIENT_SECRET=""

PUBLIC_DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""


PUBLIC_TWITCH_CLIENT_ID=""
TWITCH_CLIENT_SECRET=""
```

3. Run dev server

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

If you install the [Vite](https://marketplace.visualstudio.com/items?itemName=antfu.vite) extension for VSCode, the devserver step will be handled for you.

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.
