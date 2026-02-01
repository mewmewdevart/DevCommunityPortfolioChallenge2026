
const fs = require('fs');
const path = require('path');

const projectRoot = '/home/mew/Desktop/DevPortfolioChallenge2026/client';
const enPath = path.join(projectRoot, 'public/locales/en.json');
const ptPath = path.join(projectRoot, 'public/locales/pt-BR.json');
const srcPath = path.join(projectRoot, 'src');

// Read JSONs
const enKeys = Object.keys(JSON.parse(fs.readFileSync(enPath, 'utf8')));
const ptKeys = Object.keys(JSON.parse(fs.readFileSync(ptPath, 'utf8')));

// Compare Keys
const missingInPt = enKeys.filter(k => !ptKeys.includes(k));
const missingInEn = ptKeys.filter(k => !enKeys.includes(k));

console.log('--- Key Discrepancies ---');
if (missingInPt.length) console.log('Missing in pt-BR:', missingInPt);
if (missingInEn.length) console.log('Missing in en:', missingInEn);
if (!missingInPt.length && !missingInEn.length) console.log('Keys match perfectly.');

// Scan files
function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(srcPath);
const allContent = allFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

// Check Unused Keys
const unusedKeys = enKeys.filter(key => {
    // Basic check: look for the key string in quotes
    // This might have false positives if key is a common word, but keys like 'game_keyboard_hint' are specific.
    // We look for 'key' or "key"
    const regex = new RegExp(`['"\`]${key}['"\`]`, 'g');
    return !regex.test(allContent);
});

console.log('\n--- Unused Keys (Potential) ---');
if (unusedKeys.length) {
    console.log(unusedKeys);
} else {
    console.log('No unused keys found.');
}

// Check Hardcoded Strings (Heuristic)
// specific regex to find text between > and < tags that is not empty and doesn't look like {curly}
console.log('\n--- Potential Hardcoded Strings ---');
// Regex explanation:
// > : starts after tag close
// ([^<>{}\n]+) : content that is not tag start, curly brace, or newline (simplified)
// < : ends before tag open
// This detects: <div>Status</div>
// Ignores: <div>{status}</div>
const hardcodedParams = [];
allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // Simple heuristic: Text between > and < that contains letters
        const matches = line.match(/>([^<>{}]*[a-zA-Z]+[^<>{}]*)</);
        if (matches) {
            // Filter out common false positives like " & " or simple symbols
            const text = matches[1].trim();
            if (text.length > 1 && !text.includes('data-') && !text.startsWith('http')) {
                console.log(`${file.split('client/')[1]}:${idx + 1}: "${text}"`);
            }
        }
        // Check for aria-label="Something" or title="Something" or alt="Something"
        const attrMatches = line.match(/(aria-label|title|alt)=["']([^"'{}]*[a-zA-Z]+[^"'{}]*)["']/);
        if (attrMatches) {
            console.log(`${file.split('client/')[1]}:${idx + 1} [Attr]: ${attrMatches[0]}`);
        }
    });
});
