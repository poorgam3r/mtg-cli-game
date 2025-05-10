#!/usr/bin/env node

const inquirer = require('inquirer').default;
const axios = require('axios');
const chalk = require('chalk').default;
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
const { createClient } = require('@supabase/supabase-js');

let deck = [];
let supabase;

async function getSecret(secretName) {
  const client = new SecretsManagerClient({ region: 'ap-southeast-1' });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await client.send(command);
  return JSON.parse(data.SecretString);
}

async function mainMenu() {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'Search for a card',
      'View deck',
      'Remove card from deck',
      'Submit deck',
      'Exit',
    ],
  });

  switch (action) {
    case 'Search for a card':
      return searchCard();
    case 'View deck':
      return viewDeck();
    case 'Remove card from deck':
      return removeCard();
    case 'Submit deck':
      return submitDeck();
    case 'Exit':
      console.log(chalk.green('Goodbye!'));
      process.exit();
  }
}

async function searchCard() {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter card name:',
  });

  try {
    const res = await axios.get(
      `https://api.scryfall.com/cards/named?fuzzy=${name}`
    );
    const card = res.data;
    console.log(chalk.yellow(`${card.name} (${card.type_line})`));
    console.log(chalk.gray(card.oracle_text));

    const { add } = await inquirer.prompt({
      type: 'confirm',
      name: 'add',
      message: 'Add this card to your deck?',
    });

    if (add) {
      deck.push({ id: card.id, name: card.name });
      console.log(chalk.green('Card added to deck!'));
    }
  } catch (err) {
    console.error(err);
    console.log(chalk.red('Card not found.'));
  }

  mainMenu();
}

function viewDeck() {
  if (deck.length === 0) {
    console.log(chalk.gray('Your deck is empty.'));
  } else {
    console.log(chalk.blue('Your deck:'));
    deck.forEach((card, index) => console.log(`${index + 1}. ${card.name}`));
  }
  mainMenu();
}

async function removeCard() {
  if (deck.length === 0) {
    console.log(chalk.gray('Your deck is empty.'));
    return mainMenu();
  }

  const { index } = await inquirer.prompt({
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

  mainMenu();
}

async function submitDeck() {
  if (!supabase) {
    console.log(chalk.red('Supabase client not initialized.'));
    return mainMenu();
  }

  const { deckName } = await inquirer.prompt({
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
  } catch (err) {
    console.log(chalk.red('Failed to submit deck:'), err.message);
  }

  mainMenu();
}

// 🚀 Start the app with secrets and Supabase setup
(async () => {
  try {
    const secret = await getSecret('mtg-cli-secrets');
    const supabaseUrl = secret.supabaseUrl;
    const supabaseKey = secret.supabaseKey;

    console.log('✅ Supabase loaded:', supabaseUrl);

    supabase = createClient(supabaseUrl, supabaseKey);
    mainMenu();
  } catch (err) {
    console.error(chalk.red('Failed to initialize app:'), err.message);
  }
})();
