import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

// Move src/supabase.ts to src/lib/supabase.ts if it exists
const oldSupabasePath = path.join(rootDir, 'src', 'supabase.ts');
const newSupabasePath = path.join(rootDir, 'src', 'lib', 'supabase.ts');

if (fs.existsSync(oldSupabasePath)) {
  fs.renameSync(oldSupabasePath, newSupabasePath);
  console.log('Movido src/supabase.ts -> src/lib/supabase.ts');
}

// Remove redundant Dockerfile.api if exists
const dockerfileApi = path.join(rootDir, 'Dockerfile.api');
if (fs.existsSync(dockerfileApi)) {
  fs.unlinkSync(dockerfileApi);
  console.log('Eliminado Dockerfile.api obsoleto.');
}

// Function to remove comments from code safely
function removeComments(code) {
  // 1. Remove JSX comments: {/* ... */}
  code = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  let inString = false;
  let stringChar = '';
  let inSingleComment = false;
  let inMultiComment = false;
  let out = '';

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1];

    if (inSingleComment) {
      if (char === '\n') {
        inSingleComment = false;
        out += char;
      }
      continue;
    }

    if (inMultiComment) {
      if (char === '*' && next === '/') {
        inMultiComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      out += char;
      if (char === '\\') {
        out += next || '';
        i++;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      out += char;
      continue;
    }

    if (char === '/' && next === '/') {
      inSingleComment = true;
      i++;
      continue;
    }

    if (char === '/' && next === '*') {
      inMultiComment = true;
      i++;
      continue;
    }

    out += char;
  }

  // Update import paths for supabase if needed
  // e.g. import { supabase } from '../supabase' -> import { supabase } from '../lib/supabase'
  // e.g. import { supabase } from './supabase' -> import { supabase } from './lib/supabase'

  // Clean lines: trim trailing whitespace and remove multiple empty lines
  const lines = out.split('\n');
  const cleanedLines = [];
  let emptyCount = 0;

  for (const line of lines) {
    const trimmedRight = line.trimEnd();
    if (trimmedRight.trim() === '') {
      emptyCount++;
      if (emptyCount <= 1) {
        cleanedLines.push('');
      }
    } else {
      emptyCount = 0;
      cleanedLines.push(trimmedRight);
    }
  }

  return cleanedLines.join('\n').trim() + '\n';
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Adjust relative imports of supabase if needed
      if (fullPath.includes(path.join('src', 'screens'))) {
        content = content.replace(/from\s+['"]\.\.\/supabase['"]/g, "from '../lib/supabase'");
      } else if (fullPath.includes(path.join('src', 'components'))) {
        content = content.replace(/from\s+['"]\.\.\/supabase['"]/g, "from '../lib/supabase'");
      } else if (fullPath.endsWith(path.join('src', 'App.tsx'))) {
        content = content.replace(/from\s+['"]\.\/supabase['"]/g, "from './lib/supabase'");
      }

      const cleaned = removeComments(content);
      fs.writeFileSync(fullPath, cleaned, 'utf8');
      console.log(`Procesado: ${path.relative(rootDir, fullPath)}`);
    }
  }
}

console.log('Iniciando limpieza de comentarios y reorganización...');
processDirectory(path.join(rootDir, 'src'));
processDirectory(path.join(rootDir, 'server'));

if (fs.existsSync(path.join(rootDir, 'vite.config.ts'))) {
  const content = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  fs.writeFileSync(path.join(rootDir, 'vite.config.ts'), removeComments(content), 'utf8');
  console.log('Procesado: vite.config.ts');
}

console.log('¡Limpieza completada exitosamente!');
