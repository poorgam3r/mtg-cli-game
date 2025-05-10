# MTG CLI Game

![License](https://img.shields.io/github/license/poorgam3r/mtg-cli-game)
![Issues](https://img.shields.io/github/issues/poorgam3r/mtg-cli-game)
![Pull Requests](https://img.shields.io/github/issues-pr/poorgam3r/mtg-cli-game)
![Last Commit](https://img.shields.io/github/last-commit/poorgam3r/mtg-cli-game)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![ESLint](https://img.shields.io/badge/linting-ESLint-blue)

A command-line Magic: The Gathering deck builder using Node.js, Supabase, AWS Secrets Manager, and Scryfall API.

## Features

✅ Search MTG cards from Scryfall  
✅ Build, view, and manage a deck  
✅ Save decks securely to Supabase via AWS Secrets Manager  
✅ Runs cleanly in GitHub Codespaces

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mtg-cli-game.git
cd mtg-cli-game
```

### 2. Install dependencies

```bash
npm install
```

### 3. Prepare AWS Secrets Manager

In AWS Secrets Manager, create a secret named:

```
mtg-cli-secrets
```

With these key-value pairs:

- `SUPABASE_URL` → your Supabase project URL (e.g., https://xyz.supabase.co)
- `SUPABASE_ANON_KEY` → your Supabase anon key

### 4. Configure AWS CLI in Codespaces

```bash
aws configure
```

Input:

- Access key ID
- Secret access key
- Region (`ap-southeast-1`)
- Leave default output blank

### 5. Run the app

```bash
npm start
```

## Development Notes

- Runs on Node.js 20+
- Uses:
  - Inquirer → CLI menu
  - Axios → Scryfall API
  - Supabase JS → backend storage
  - AWS SDK → Secrets Manager

## Codespaces Setup

We include a `.devcontainer` that:

- Installs Node.js
- Installs AWS CLI
- Automatically runs `npm install`

To rebuild the container in Codespaces:

```
GitHub → Codespaces → Rebuild container
```
