# Development

This guide outlines the steps required to set up and run the project in a local environment.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [bun](https://bun.sh/)
- [Git](https://git-scm.com/)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/chef0111/cheffolio.git
cd cheffolio
```

### 2. Install Portless

Documentation: [portless.sh](https://portless.sh)

```bash
bun add -g portless
```

### 3. Install dependencies

```bash
bun install
```

### 4. Configure Environment Variables

Create an `apps/web/.env.local` file based on `apps/web/.env.example`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then, update the necessary environment variables inside `apps/web/.env.local`.

### 5. Run the development server

```bash
bun run dev
```

The application should now be available at https://cheffolio.localhost. `bun run dev` runs `turbo run dev --filter=web`. The public origin stays `https://cheffolio.localhost`.

## Building for Production

```bash
bun run build
```

After building, start the application with:

```bash
NODE_ENV=production bun run start
```

## Screenshots

The site screenshots are captured locally, then published to Cloudflare R2.

Start the app first:

```bash
bun run dev
```

The app is at https://cheffolio.localhost. Then:

```bash
bun run capture       # Capture screenshots into .cheffolio/screenshots
bun run capture:sync  # Upload the folder to Cloudflare R2
```

Set the `R2_*` credentials from `apps/web/.env.example` before running `capture:sync`. The command uploads `.cheffolio/screenshots` to the bucket root (skips dotfiles), replaces keys that already exist, and leaves other remote objects untouched.
