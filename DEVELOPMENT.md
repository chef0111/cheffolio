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

Documentation: [port1355.dev](https://port1355.dev)

```bash
bun add -g portless
```

### 3. Install dependencies

```bash
bun install
```

### 4. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Then, update the necessary environment variables inside `.env.local`.

### 5. Run the development server

```bash
bun run dev
```

The application should now be available at https://cheffolio.localhost

## Building for Production

```bash
bun run build
```

After building, start the application with:

```bash
NODE_ENV=production bun run start
```
