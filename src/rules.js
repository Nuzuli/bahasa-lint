'use strict';
const data = require('../data/kata.json');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function dictRule(id, severity, label, map) {
  const compiled = Object.entries(map).map(([salah, benar]) => ({
    benar,
    re: new RegExp(`(?<![\\p{L}\\p{N}_])${esc(salah)}(?![\\p{L}\\p{N}_])`, 'giu'),
  }));
  return {
    id, severity,
    check(line) {
      const out = [];
      for (const { re, benar } of compiled) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line))) {
          out.push({ col: m.index + 1, found: m[0], message: `${label}: "${m[0]}", gunakan "${benar}"` });
        }
      }
      return out;
    },
  };
}

const kataUlangAngka = {
  id: 'kata-ulang-angka', severity: 'warning',
  check(line) {
    const out = [];
    const re = /(?<![\p{L}\p{N}_])(\p{L}{3,})2(?![\p{L}\p{N}_])/gu;
    let m;
    while ((m = re.exec(line))) {
      out.push({ col: m.index + 1, found: m[0], message: `Kata ulang tidak ditulis dengan angka 2: "${m[0]}", tulis "${m[1]}-${m[1]}"` });
    }
    return out;
  },
};

const spasiGanda = {
  id: 'spasi-ganda', severity: 'warning',
  check(line) {
    const out = [];
    const re = /\S( {2,})(?=\S)/g;
    let m;
    while ((m = re.exec(line))) {
      out.push({ col: m.index + 2, found: m[1], message: 'Spasi ganda di tengah kalimat' });
    }
    return out;
  },
};

module.exports = [
  dictRule('kata-tidak-baku', 'warning', 'Kata tidak baku', data['tidak-baku']),
  dictRule('bahasa-informal', 'warning', 'Bahasa informal', data['informal']),
  dictRule('istilah-inggris', 'info', 'Ada padanan Indonesia', data['istilah-inggris']),
  kataUlangAngka,
  spasiGanda,
];