'use strict';
const rules = require('./rules');

// Ganti bagian yang tidak perlu dicek (kode, URL, komentar) dengan karakter
// pengganti, supaya nomor baris dan kolom tetap akurat.
function maskMarkdown(text) {
  const blank = (m) => m.replace(/[^\n]/g, '\u0001');
  return text
    .replace(/```[\s\S]*?(```|$)/g, blank)
    .replace(/~~~[\s\S]*?(~~~|$)/g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/`[^`\n]*`/g, blank)
    .replace(/https?:\/\/[^\s)>\]]+/g, blank)
    .replace(/\]\([^)\n]*\)/g, blank);
}

function lintText(text, config = {}) {
  const ignore = new Set((config.ignore || []).map((w) => w.toLowerCase()));
  const disable = new Set(config.disable || []);
  const lines = maskMarkdown(text).split('\n');
  const results = [];
  lines.forEach((line, i) => {
    for (const rule of rules) {
      if (disable.has(rule.id)) continue;
      for (const hit of rule.check(line)) {
        if (ignore.has(hit.found.toLowerCase())) continue;
        results.push({ line: i + 1, col: hit.col, severity: rule.severity, rule: rule.id, message: hit.message });
      }
    }
  });
  return results.sort((a, b) => a.line - b.line || a.col - b.col);
}

module.exports = { lintText, maskMarkdown };