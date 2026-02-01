
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const KEYS_FILE = path.join(ROOT_DIR, 'src', 'utils', 'translationsKeys.ts');
const LOCALES_DIR = path.join(ROOT_DIR, 'public', 'locales');

// Colors for console
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function extractKeysFromTS(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys = [];
    const regex = /\|\s*'([\w_]+)'/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        keys.push(match[1]);
    }
    return keys;
}

function validateLocale(locale, definedKeys) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
        console.error(`${RED}Missing locale file: ${filePath}${RESET}`);
        return false;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);
        const jsonKeys = new Set(Object.keys(json));
        const definedKeysSet = new Set(definedKeys);

        let hasErrors = false;

        // Check for missing keys in JSON
        definedKeys.forEach(key => {
            if (!jsonKeys.has(key)) {
                console.error(`${RED}[${locale}] Missing translation for key: '${key}'${RESET}`);
                hasErrors = true;
            }
        });

        // Check for extra keys in JSON (optional, but good for cleanup)
        jsonKeys.forEach(key => {
            if (!definedKeysSet.has(key)) {
                console.warn(`\x1b[33m[${locale}] Warning: Extra key '${key}' found in JSON but not in TS definition.${RESET}`);
            }
        });

        return !hasErrors;
    } catch (e) {
        console.error(`${RED}Error parsing ${filePath}: ${e.message}${RESET}`);
        return false;
    }
}

function main() {
    console.log('Starting translation validation...');

    if (!fs.existsSync(KEYS_FILE)) {
        console.error(`${RED}Keys file not found at ${KEYS_FILE}${RESET}`);
        process.exit(1);
    }

    const definedKeys = extractKeysFromTS(KEYS_FILE);
    console.log(`Found ${definedKeys.length} keys definition.`);

    const locales = ['en', 'pt-BR'];
    let success = true;

    locales.forEach(locale => {
        if (!validateLocale(locale, definedKeys)) {
            success = false;
        }
    });

    if (success) {
        console.log(`${GREEN}All translations are valid!${RESET}`);
        process.exit(0);
    } else {
        console.log(`${RED}Translation validation failed.${RESET}`);
        process.exit(1);
    }
}

main();
