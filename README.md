# bahasa-lint

Linter ejaan dan gaya bahasa Indonesia untuk dokumentasi Markdown. Tanpa dependensi, cocok dipasang di CI.

## Pemakaian

```bash
node bin/bahasa-lint.js docs README.md
node bin/bahasa-lint.js --no-info docs
node bin/bahasa-lint.js --json docs
```

Blok kode, kode inline, URL, dan komentar HTML otomatis diabaikan.

## Aturan

| ID | Tingkat | Contoh |
|----|---------|--------|
| kata-tidak-baku | warning | silahkan → silakan |
| bahasa-informal | warning | gak → tidak |
| kata-ulang-angka | warning | anak2 → anak-anak |
| spasi-ganda | warning | spasi ganda di tengah kalimat |
| istilah-inggris | info | download → unduh |

Kode keluar 1 jika ada warning.

## Konfigurasi

Buat `.bahasalintrc.json`:

```json
{ "ignore": ["file", "link"], "disable": ["istilah-inggris"] }
```

## Kontribusi

Tambah kata di `data/kata.json`, lalu tambah tes di `test/lint.test.js`. Jalankan `npm test`.

## Lisensi

MIT