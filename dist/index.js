#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = wait;
exports.getSecret = getSecret;
exports.searchCard = searchCard;
exports.viewDeck = viewDeck;
exports.removeCard = removeCard;
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const supabase_js_1 = require("@supabase/supabase-js");
let deck = [];
let supabase = null;
// ⏰ Helper function for delay
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Fetch secrets from AWS Secrets Manager
function getSecret(secretName) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_secrets_manager_1.SecretsManagerClient({ region: 'ap-southeast-1' });
        const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretName });
        const data = yield client.send(command);
        return JSON.parse(data.SecretString || '{}');
    });
}
// Main menu function
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const { action } = yield inquirer_1.default.prompt({
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
                console.log(chalk_1.default.green('Goodbye!'));
                process.exit();
        }
    });
}
// Search for a card
function searchCard(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`https://api.scryfall.com/cards/named?fuzzy=${name}`);
        return response.data;
    });
}
function searchCardPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = yield inquirer_1.default.prompt({
            type: 'input',
            name: 'name',
            message: 'Enter card name:',
        });
        try {
            const card = yield searchCard(name);
            console.log(chalk_1.default.yellow(`${card.name} (${card.type_line})`));
            console.log(chalk_1.default.gray(card.oracle_text));
            // 💾 Save to cached_cards in Supabase
            if (supabase) {
                const { error } = yield supabase.from('cached_cards').upsert({
                    id: card.id,
                    name: card.name,
                    type_line: card.type_line,
                    oracle_text: card.oracle_text,
                    raw_json: card,
                    last_updated: new Date().toISOString(),
                });
                if (error) {
                    console.log(chalk_1.default.red('Failed to save card to database:'), error.message);
                }
                else {
                    console.log(chalk_1.default.green('✅ Card saved to database.'));
                }
            }
            const { add } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'add',
                message: 'Add this card to your deck?',
            });
            if (add) {
                deck.push({ id: card.id, name: card.name });
                console.log(chalk_1.default.green('Card added to deck!'));
            }
        }
        catch (_a) {
            console.log(chalk_1.default.red('Card not found.'));
        }
        yield wait(100); // ⏰ Respect Scryfall API rate limits
        mainMenu();
    });
}
// View the deck
function viewDeck(deck) {
    if (deck.length === 0) {
        console.log('Your deck is empty.');
    }
    else {
        console.log('Your deck:');
        deck.forEach((card, index) => console.log(`${index + 1}. ${card.name}`));
    }
}
function viewDeckPrompt() {
    if (deck.length === 0) {
        console.log(chalk_1.default.gray('Your deck is empty.'));
    }
    else {
        console.log(chalk_1.default.blue('Your deck:'));
        deck.forEach((card, index) => console.log(`${index + 1}. ${card.name}`));
    }
    mainMenu();
}
// Remove a card from the deck
function removeCard(deck) {
    return __awaiter(this, void 0, void 0, function* () {
        if (deck.length === 0) {
            console.log(chalk_1.default.gray('Your deck is empty.'));
            return;
        }
        const { index } = yield inquirer_1.default.prompt({
            type: 'input',
            name: 'index',
            message: 'Enter card number to remove:',
        });
        const idx = parseInt(index) - 1;
        if (idx >= 0 && idx < deck.length) {
            const removed = deck.splice(idx, 1);
            console.log(chalk_1.default.green(`Removed ${removed[0].name} from deck.`));
        }
        else {
            console.log(chalk_1.default.red('Invalid index.'));
        }
    });
}
function removeCardPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        yield removeCard(deck);
        mainMenu();
    });
}
// Submit the deck
function submitDeck() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!supabase) {
            console.log(chalk_1.default.red('Supabase client not initialized.'));
            return mainMenu();
        }
        const { deckName } = yield inquirer_1.default.prompt({
            type: 'input',
            name: 'deckName',
            message: 'Enter deck name:',
        });
        try {
            const response = yield supabase
                .from('player_decks')
                .insert([
                { deck_name: deckName, card_scryfall_ids: deck.map((c) => c.id) },
            ]);
            if (response.error) {
                throw response.error;
            }
            console.log(chalk_1.default.green(`Deck "${deckName}" submitted with ${deck.length} cards!`));
            deck = []; // clear local deck
        }
        catch (err) {
            console.log(chalk_1.default.red('Failed to submit deck:'), err.message);
        }
        mainMenu();
    });
}
// Show help menu
function showHelp() {
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
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const secret = yield getSecret('mtg-cli-secrets');
            const supabaseUrl = secret.supabaseUrl;
            const supabaseKey = secret.supabaseKey;
            console.log('✅ Supabase loaded:', supabaseUrl);
            supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
            mainMenu();
        }
        catch (err) {
            console.error(chalk_1.default.red('Failed to initialize app:'), err.message);
        }
    }))();
}
