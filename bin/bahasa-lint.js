#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { lintText } = require('../src/lint');

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help') || args.length === 0) {
  console.log(`bahasa-lint - linter bahasa Indonesia untuk Markdown

Pemakaian: bahasa-lint [opsi] <berkas-atau-folder...>

Opsi:
  --no-info   sembunyikan saran bertingkat info
  --json      keluaran JSON
  -h, --help  bantuan

Konfigurasi opsional: .bahasalintrc.json
  { "ignore": ["file"], "disable": ["istilah-inggris"] }

Kode keluar 1 jika ada peringatan (warning).`);
  process.exit(0);
}

const noInfo = args.includes('--no-info');
const asJson = args.includes('--json');
const targets = args.filter((a) => !a.startsWith('--') && a !== '-h');

let config = {};
const rc = path.resolve('.bahasalintrc.json');
if (fs.existsSync(rc)) config = JSON.parse(fs.readFileSync(rc, 'utf8'));

const EXT = new Set(['.md', '.mdx', '.markdown', '.txt']);
function collect(p, out = []) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(p)) {
      if (name === 'node_modules' || name === '.git') continue;
      collect(path.join(p, name), out);
    }
  } else if (EXT.has(path.extname(p).toLowerCase())) out.push(p);
  return out;
}

const files = targets.flatMap((t) => collect(t));
const report = [];
let warnings = 0;
for (const f of files) {
  let hits = lintText(fs.readFileSync(f, 'utf8'), config);
  if (noInfo) hits = hits.filter((h) => h.severity !== 'info');
  warnings += hits.filter((h) => h.severity === 'warning').length;
  for (const h of hits) report.push({ file: f, ...h });
}

if (asJson) console.log(JSON.stringify(report, null, 2));
else {
  for (const r of report) console.log(`${r.file}:${r.line}:${r.col}  ${r.severity.padEnd(7)} ${r.message}  (${r.rule})`);
  console.log(`\n${files.length} berkas diperiksa, ${report.length} temuan, ${warnings} peringatan.`);
}
process.exit(warnings > 0 ? 1 : 0);