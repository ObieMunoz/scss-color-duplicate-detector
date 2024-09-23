#!/usr/bin/env node

const fs = require('fs');

function parseScssColors(filename) {
  const colorVars = {};
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split('\n');
  const pattern = /\$([\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/;

  lines.forEach((line) => {
    const match = line.match(pattern);
    if (match) {
      const varName = match[1];
      const hexCode = match[2];
      colorVars[varName] = hexCode;
    }
  });

  return colorVars;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  // Expand shorthand form (e.g., "03F") to full form (e.g., "0033FF")
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

function colorDistance(rgb1, rgb2) {
  const distance = Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
  return distance;
}

function findSimilarColors(colorVars, threshold = 10) {
  const rgbVars = {};
  for (const [varName, hexCode] of Object.entries(colorVars)) {
    rgbVars[varName] = hexToRgb(hexCode);
  }

  const varNames = Object.keys(rgbVars);
  const similarPairs = [];

  for (let i = 0; i < varNames.length; i++) {
    for (let j = i + 1; j < varNames.length; j++) {
      const var1 = varNames[i];
      const var2 = varNames[j];
      const rgb1 = rgbVars[var1];
      const rgb2 = rgbVars[var2];
      const dist = colorDistance(rgb1, rgb2);

      if (dist < threshold) {
        similarPairs.push({ var1, var2, dist });
      }
    }
  }

  return similarPairs;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: scss-color-similarity <file> [options]');
    console.log('\nOptions:');
    console.log('  -t, --threshold <number>  Threshold for color similarity (default: 10)');
    process.exit(0);
  }

  const filename = args[0];
  let threshold = 10;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '-t' || args[i] === '--threshold') {
      threshold = parseFloat(args[++i]);
    }
  }

  if (!fs.existsSync(filename)) {
    console.error(`File not found: ${filename}`);
    process.exit(1);
  }

  const colorVars = parseScssColors(filename);
  const similarPairs = findSimilarColors(colorVars, threshold);

  if (similarPairs.length > 0) {
    console.log('Colors that are nearly identical:');
    similarPairs.forEach(({ var1, var2, dist }) => {
      console.log(`${var1} and ${var2} (distance: ${dist.toFixed(2)})`);
    });
  } else {
    console.log('No nearly identical colors found.');
  }
}

module.exports = {
  parseScssColors,
  hexToRgb,
  colorDistance,
  findSimilarColors,
};

if (require.main === module) {
  main();
}

