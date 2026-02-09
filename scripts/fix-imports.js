/**
 * Automated Import Path Refactoring Script
 * Converts relative imports to @/ alias paths
 *
 * Usage: node scripts/fix-imports.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

/**
 * Recursively get all JS/JSX files in a directory
 * @param {string} dir - Directory path
 * @param {string[]} files - Accumulated file list
 * @returns {string[]} List of file paths
 */
function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'build') {
        getAllFiles(fullPath, files);
      }
    } else if (entry.isFile() && /\.(js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Convert relative import to @/ alias import
 * @param {string} importPath - Relative import path
 * @param {string} currentFile - Current file path
 * @returns {string} Converted import path
 */
function convertToAliasPath(importPath, currentFile) {
  if (!importPath.startsWith('.')) {
    return importPath;
  }

  const currentDir = path.dirname(currentFile);
  const absolutePath = path.resolve(currentDir, importPath);
  const relativeToSrc = path.relative(SRC_DIR, absolutePath);

  // Normalize path separators to forward slashes
  const normalized = relativeToSrc.replace(/\\/g, '/');

  return `@/${normalized}`;
}

/**
 * Process a single file to fix imports
 * @param {string} filePath - Path to file
 * @returns {boolean} True if file was modified
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;

  const newLines = lines.map((line) => {
    // Match import statements with relative paths
    const importMatch = line.match(
      /^(import\s+.*from\s+['"])(\.\..*)(['"];?)$/
    );

    if (importMatch) {
      const [, prefix, importPath, suffix] = importMatch;
      const newPath = convertToAliasPath(importPath, filePath);

      if (newPath !== importPath && newPath.startsWith('@/')) {
        modified = true;
        return `${prefix}${newPath}${suffix}`;
      }
    }

    return line;
  });

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    return true;
  }

  return false;
}

/**
 * Main execution function
 */
function main() {
  const files = getAllFiles(SRC_DIR);
  let modifiedCount = 0;

  for (const file of files) {
    if (processFile(file)) {
      modifiedCount++;
    }
  }

  console.log(
    `\nRefactoring complete: ${modifiedCount} file(s) updated out of ${files.length} total files.`
  );
}

// Run the script
main();
