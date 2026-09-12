import fs from 'fs';
import path from 'path';

function removeComments(code) {
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

  // Clean up excessive blank lines
  return out.split('\n').filter((line, idx, arr) => {
    if (line.trim() === '' && arr[idx - 1]?.trim() === '') return false;
    return true;
  }).join('\n');
}

const testCode = `
// Este es un comentario
import React from 'react';
const url = "https://supabase.com/test"; // Comentario al final
/* Comentario multilínea
   de varias líneas */
export const Hello = () => <div>{\/* Comentario JSX *\/}Hello</div>;
`;

console.log("Original:");
console.log(testCode);
console.log("Procesado:");
console.log(removeComments(testCode));
