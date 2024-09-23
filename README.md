# SCSS Color Similarity

A tool to identify nearly identical color variables in SCSS files.

## Installation

You can install this package globally to use it as a command-line tool or include it in your project as a dependency.

### Global Installation

```bash
npm install -g scss-color-similarity
```

### Local Installation

```bash
npm install scss-color-similarity
```

## Usage

### Command-Line Interface (CLI)

After installing globally, you can use the `scss-color-similarity` command.

```bash
scss-color-similarity <file> [options]
```

#### Options

- `-t`, `--threshold <number>`: Threshold for color similarity (default is `10`)

#### Example

```bash
scss-color-similarity colors.scss --threshold 5
```

This command will analyze `colors.scss` and report any color variables that are nearly identical within a distance of `5`.

### As a Library

You can also use this package in your Node.js projects.

#### Example Usage

```javascript
const {
  parseScssColors,
  findSimilarColors,
} = require('scss-color-similarity');

const colorVars = parseScssColors('path/to/colors.scss');
const threshold = 10; // Adjust as needed
const similarPairs = findSimilarColors(colorVars, threshold);

console.log('Similar colors:', similarPairs);
```

## How It Works

- **Parsing SCSS File**: The tool reads your SCSS file and extracts all color variable declarations in the format `$variable-name: #hexcode;`.
- **Converting Hex to RGB**: Hex color codes are converted to RGB values for numerical comparison.
- **Calculating Color Distance**: Computes the Euclidean distance between all pairs of colors.
- **Identifying Similar Colors**: Reports pairs of colors where the distance is less than the specified threshold.

## Functions

- `parseScssColors(filename)`: Parses the SCSS file and returns an object of color variables and their hex codes.
- `hexToRgb(hexCode)`: Converts a hex color code to an RGB array.
- `colorDistance(rgb1, rgb2)`: Calculates the Euclidean distance between two RGB colors.
- `findSimilarColors(colorVars, threshold)`: Finds and returns pairs of color variables that are similar within the given threshold.

## Example SCSS File

```scss
$blue: #036ad4;
$science_blue: #036ad8;
$royal_green: #1f641d;
```

## Example Output

When running the CLI tool:

```bash
scss-color-similarity colors.scss --threshold 10
```

Output:

```
Colors that are nearly identical:
blue and science_blue (distance: 4.00)
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Obie Munoz
