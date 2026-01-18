const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
let chokidar;
try {
  // dynamic import for ESM-only chokidar
  chokidar = require('chokidar');
} catch (e) {
  // fallback to dynamic import
  (async () => {
    chokidar = (await import('chokidar')).default;
    startWatcher();
  })();
}

if (chokidar) startWatcher();

function startWatcher() {
  function findScssFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findScssFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.styles.scss')) {
      files.push(full);
    }
  }
  return files;
}

function toExportName(filePath) {
  const base = path.basename(filePath).replace('.styles.scss', '');
  // kebab-case to camelCase + Capitalize
  const parts = base.split('-');
  // Convert to PascalCase (capitalize every part) and append Styles
  const pascal = parts.map(p => p[0].toUpperCase() + p.slice(1)).join('');
  return pascal + 'Styles';
}

function compile(file) {
  const out = file.replace(/\.scss$/, '.js');
  const exportName = toExportName(file);
  console.log(`[styles-watch] Compiling ${file} -> ${out} (export ${exportName})`);
  const script = path.resolve(__dirname, 'compile-scss-to-lit.cjs');
  const child = spawn(process.execPath, [script, file, out, exportName], { stdio: 'inherit' });
  child.on('close', code => {
    if (code === 0) console.log(`[styles-watch] Compiled ${file}`);
    else console.error(`[styles-watch] Failed (${code}) compiling ${file}`);
  });
}

  const packagesDir = path.resolve(process.cwd(), 'packages');
  if (!fs.existsSync(packagesDir)) {
    console.error('No packages directory found at', packagesDir);
    process.exit(1);
  }

  const scssFiles = findScssFiles(packagesDir);
  if (!scssFiles.length) {
    console.log('No .styles.scss files found to watch.');
    return;
  }

  // Use awaitWriteFinish to avoid reacting to partial writes and debounce per-file changes
  const watcher = chokidar.watch(scssFiles, {
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100
    }
  });

  const debounceTimers = new Map();
  function scheduleCompile(file) {
    if (debounceTimers.has(file)) clearTimeout(debounceTimers.get(file));
    debounceTimers.set(file, setTimeout(() => {
      compile(file);
      debounceTimers.delete(file);
    }, 120));
  }

  watcher.on('add', file => {
    console.log('[styles-watch] Added', file);
    scheduleCompile(file);
  });
  watcher.on('change', file => {
    console.log('[styles-watch] Changed', file);
    scheduleCompile(file);
  });
  watcher.on('unlink', file => {
    console.log('[styles-watch] Removed', file);
  });
}

