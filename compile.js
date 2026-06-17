const fs = require('fs');
const path = require('path');

const CHAPTERS = [];

for (let i = 1; i <= 15; i++) {
  const filepath = path.resolve(__dirname, 'chapters_data', `ch${i}.js`);
  if (!fs.existsSync(filepath)) {
    console.error(`Error: ch${i}.js does not exist in chapters_data/`);
    process.exit(1);
  }
  const ch = require(filepath);
  CHAPTERS.push(ch);
}

// Convert to JS string defining global variable
const outputContent = `// ============================================================
// Combined Data File - Generated automatically by compile.js
// ============================================================
const CHAPTERS = ${JSON.stringify(CHAPTERS, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, 'data.js'), outputContent, 'utf8');
console.log('Successfully compiled all 15 chapters into data.js!');
