# MTG CLI Game

[![License](https://img.shields.io/github/license/poorgam3r/mtg-cli-game.svg)](LICENSE)
[![Contributors](https://img.shields.io/github/contributors/poorgam3r/mtg-cli-game.svg)](https://github.com/poorgam3r/mtg-cli-game/graphs/contributors)
[![CI](https://github.com/poorgam3r/mtg-cli-game/actions/workflows/ci.yml/badge.svg)](https://github.com/poorgam3r/mtg-cli-game/actions)
![Issues](https://img.shields.io/github/issues/poorgam3r/mtg-cli-game)
![Pull Requests](https://img.shields.io/github/issues-pr/poorgam3r/mtg-cli-game)
![Last Commit](https://img.shields.io/github/last-commit/poorgam3r/mtg-cli-game)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![ESLint](https://img.shields.io/badge/linting-ESLint-blue)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)

A command-line Magic: The Gathering deck builder using Node.js, Supabase, AWS Secrets Manager, and Scryfall API.

## Features

✅ Search MTG cards from Scryfall  
✅ Build, view, and manage a deck  
✅ Save decks securely to Supabase via AWS Secrets Manager  
✅ Runs cleanly in GitHub Codespaces  
✅ Written in TypeScript for type safety and maintainability

---

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
- Written in TypeScript
- Uses:
  - Inquirer → CLI menu
  - Axios → Scryfall API
  - Supabase JS → backend storage
  - AWS SDK → Secrets Manager

## Development Scripts

- Start in development mode

```bash
npm run dev
```

This uses `ts-node` to run the app without compiling.

- Build the app:

```bash
npm run build
```

Compiles TypeScript files into JavaScript in the `dist` directory.

- Clean the build directory:

```bash
npm run clean
```

- Lint and format code:

```bash
npm run lint
npm run format
```

## Codespaces Setup

We include a `.devcontainer` that:

- Installs Node.js
- Installs AWS CLI
- Automatically runs `npm install`

To rebuild the container in Codespaces:

```
GitHub → Codespaces → Rebuild container
```

## Example Usage

Here's an example of how the CLI works:

```bash
$ npm start
✅ Supabase loaded: https://xyz.supabase.co
What would you like to do?
> Search for a card
```

When you select "Search for a card," you can enter the name of a Magic: The Gathering card. The app will fetch the card details from the Scryfall API and display them. You can then choose to add the card to your deck.

```bash
Enter card name: Black Lotus
Black Lotus (Artifact)
{T}: Add three mana of any one color.
Add this card to your deck? (y/n)
> y
Card added to deck!
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-name).
3. Commit your changes (git commit -m "Add feature").
4. Push to the branch (git push origin feature-name).
5. Open a pull request.

Please ensure your code adheres to the existing style guidelines by running:

```bash
npm run lint
npm run format
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
