#!/usr/bin/env node

import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types and interfaces
interface Card {
  id: string;
  name: string;
  type_line: string;
  oracle_text: string;
  raw_json: object;
}

interface Secret {
  supabaseUrl: string;
  supabaseKey: string;
}

interface DeckCard {
  id: string;
  name: string;
}

let deck: DeckCard[] = [];
let supabase: SupabaseClient | null = null;

// ⏰ Helper function for delay
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch secrets from AWS Secrets Manager
export async function getSecret(secretName: string): Promise<Secret> {
  const client = new SecretsManagerClient({ region: 'ap-southeast-1' });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await client.send(command);
  return JSON.parse(data.SecretString || '{}') as Secret;
}

// Main menu function
async function mainMenu(): Promise<void> {
  const { action } = await inquirer.prompt<{ action: string }>({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'Search for a card',
      'View deck',
      'Remove card from deck',
      'Submit deck',
      'Help / About',
      'Exit',
    ],
  });

  switch (action) {
    case 'Search for a card':
      return searchCardPrompt();
    case 'View deck':
      return viewDeckPrompt();
    case 'Remove card from deck':
      return removeCardPrompt();
    case 'Submit deck':
      return submitDeck();
    case 'Help / About':
      return showHelp();
    case 'Exit':
      console.log(chalk.green('Goodbye!'));
      process.exit();
  }
}

// Search for a card
export async function searchCard(name: string): Promise<Card> {
  const response = await axios.get<Card>(
    `https://api.scryfall.com/cards/named?fuzzy=${name}`
  );
  return response.data;
}

async function searchCardPrompt(): Promise<void> {
  const { name } = await inquirer.prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: 'Enter card name:',
  });

  try {
    const card = await searchCard(name);
    console.log(chalk.yellow(`${card.name} (${card.type_line})`));
    console.log(chalk.gray(card.oracle_text));

    // 💾 Save to cached_cards in Supabase
    if (supabase) {
      const { error } = await supabase.from('cached_cards').upsert({
        id: card.id,
        name: card.name,
        type_line: card.type_line,
        oracle_text: card.oracle_text,
        raw_json: card,
        last_updated: new Date().toISOString(),
      });

      if (error) {
        console.log(
          chalk.red('Failed to save card to database:'),
          error.message
        );
      } else {
        console.log(chalk.green('✅ Card saved to database.'));
      }
    }

    const { add } = await inquirer.prompt<{ add: boolean }>({
      type: 'confirm',
      name: 'add',
      message: 'Add this card to your deck?',
    });

    if (add) {
      deck.push({ id: card.id, name: card.name });
      console.log(chalk.green('Card added to deck!'));
    }
  } catch {
    console.log(chalk.red('Card not found.'));
  }

  await wait(100); // ⏰ Respect Scryfall API rate limits
  mainMenu();
}

// View the deck
export function viewDeck(deck: DeckCard[]): void {
  if (deck.length === 0) {
    console.log('Your deck is empty.');
  } else {
    console.log('Your deck:');
    deck.forEach((card, index) => console.log(`${index + 1}. ${card.name}`));
  }
}

function viewDeckPrompt(): void {
  if (deck.length === 0) {
    console.log(chalk.gray('Your deck is empty.'));
  } else {
    console.log(chalk.blue('Your deck:'));
    deck.forEach((card, index) => console.log(`${index + 1}. ${card.name}`));
  }
  mainMenu();
}

// Remove a card from the deck
export async function removeCard(deck: DeckCard[]): Promise<void> {
  if (deck.length === 0) {
    console.log(chalk.gray('Your deck is empty.'));
    return;
  }

  const { index } = await inquirer.prompt<{ index: string }>({
    type: 'input',
    name: 'index',
    message: 'Enter card number to remove:',
  });

  const idx = parseInt(index) - 1;
  if (idx >= 0 && idx < deck.length) {
    const removed = deck.splice(idx, 1);
    console.log(chalk.green(`Removed ${removed[0].name} from deck.`));
  } else {
    console.log(chalk.red('Invalid index.'));
  }
}

async function removeCardPrompt(): Promise<void> {
  await removeCard(deck);
  mainMenu();
}

// Submit the deck
async function submitDeck(): Promise<void> {
  if (!supabase) {
    console.log(chalk.red('Supabase client not initialized.'));
    return mainMenu();
  }

  const { deckName } = await inquirer.prompt<{ deckName: string }>({
    type: 'input',
    name: 'deckName',
    message: 'Enter deck name:',
  });

  try {
    const response = await supabase
      .from('player_decks')
      .insert([
        { deck_name: deckName, card_scryfall_ids: deck.map((c) => c.id) },
      ]);

    if (response.error) {
      throw response.error;
    }

    console.log(
      chalk.green(`Deck "${deckName}" submitted with ${deck.length} cards!`)
    );
    deck = []; // clear local deck
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }

  mainMenu();
}

// Show help menu
function showHelp(): void {
  console.log(`
=== MTG CLI Game Help ===

Commands:
- Search for a card → Find and add cards from Scryfall
- View deck → Show your current deck
- Remove card from deck → Delete a card from your deck
- Submit deck → Save deck to Supabase
- Help / About → Show this help menu
- Exit → Quit the app

=== Credits ===
- Created by: poorgam3r
- Repository: https://github.com/poorgam3r/mtg-cli-game
- Powered by: Scryfall API (https://scryfall.com/docs/api)
- Special thanks to the open-source community ❤️

Happy brewing!
  `);
  mainMenu();
}

// 🚀 Start the app with secrets and Supabase setup
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      const secret = await getSecret('mtg-cli-secrets');
      const supabaseUrl = secret.supabaseUrl;
      const supabaseKey = secret.supabaseKey;

      console.log('✅ Supabase loaded:', supabaseUrl);

      supabase = createClient(supabaseUrl, supabaseKey);
      mainMenu();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(chalk.red('Failed to initialize app:'), err.message);
      }
    }
  })();
}
