const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
let sass;
function resolveProjectSass(rootDir) {
  try {
    const projectSass = require(path.join(rootDir, 'node_modules', 'sass'));
    return projectSass;
  } catch (e) {
    return null;
  }
}
try { sass = require('sass'); } catch (e) { /* fallback to project sass at runtime */ }

function toPascalCase(base) {
  return base.split(/[-_]/g).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

function defaultExportNameFromPath(filePath) {
  const base = path.basename(filePath).replace('.styles.scss', '');
  return toPascalCase(base) + 'Styles';
}

function compileToLit(scssPath, outJsPath, exportName) {
  // Prefer sass from the project's node_modules if available
  if (!sass) {
    const projectSass = resolveProjectSass(process.cwd());
    if (projectSass) sass = projectSass;
  }
  if (!sass) throw new Error('sass not installed. Please install sass in your project or globally.');
  const result = sass.compile(scssPath, { style: 'expanded' });
  const css = result.css;
  const safe = css.replace(/`/g, '\\`').replace(/\$\{/g, '\${');
  const name = exportName || defaultExportNameFromPath(scssPath);
  const js = `import { css } from 'lit';\n\nexport const ${name} = css` + '`' + `\n${safe}\n` + '`' + `;\n`;
  const tmp = outJsPath + '.tmp';
  fs.writeFileSync(tmp, js, 'utf8');
  fs.renameSync(tmp, outJsPath);
  return outJsPath;
}

async function watchDir(rootDir) {
  const { default: chokidar } = await import('chokidar');
  const packagesDir = path.resolve(rootDir);
  function findFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) findFiles(full, files);
      else if (entry.isFile() && entry.name.endsWith('.styles.scss')) files.push(full);
    }
    return files;
  }

  const files = findFiles(packagesDir);
  if (!files.length) {
    console.log('No .styles.scss files found to watch in', packagesDir);
    return null;
  }

  const watcher = chokidar.watch(files, { awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 100 } });
  const timers = new Map();
  const schedule = (file) => {
    if (timers.has(file)) clearTimeout(timers.get(file));
    timers.set(file, setTimeout(() => {
      const out = file.replace(/\.scss$/, '.js');
      const exportName = defaultExportNameFromPath(file);
      try { compileToLit(file, out, exportName); console.log('Wrote', out); } catch (e) { console.error(e); }
      timers.delete(file);
    }, 120));
  };

  watcher.on('add', schedule);
  watcher.on('change', schedule);
  watcher.on('unlink', (f) => console.log('Removed', f));

  return watcher;
}

module.exports = { compileToLit, watchDir };
