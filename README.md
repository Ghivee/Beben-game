# Petualangan Laut Pokémon

19 mini-game Pokémon untuk anak 5 tahun, masing-masing dengan 5 level. Koleksinya berisi Pokédex lengkap: 1025 Pokémon dari Kanto sampai Paldea, dengan gambar resmi beresolusi tinggi dan gerakan halus.

- **Narator dua bahasa:** Indonesia dan Inggris, berupa rekaman suara neural. Inggris memakai Kokoro (suara "Heart"), Indonesia memakai Piper (`id_ID-news_tts`). Kalau ada rekaman yang belum tersedia, game memakai suara perangkat.
- **Musik tema "Ombak Pelangi":** dimainkan langsung oleh synthesizer di dalam game, dengan marimba, bas, pad, dan shaker. Volumenya mengecil saat narator bicara.
- **Data per perangkat:** bintang, level, dan koleksi tersimpan di browser HP atau tablet masing-masing.
- Bisa dipasang di iPhone dan Android, dan bisa dimainkan tanpa internet.

Main: https://ghivee.github.io/Beben-game/

Pasang di HP: buka alamat di atas di Safari (iPhone: Bagikan → Tambah ke Layar Utama) atau Chrome (Android: ketuk **📲 Pasang di HP** → Instal).

## Isi folder

| Path | Isi |
|---|---|
| `index.html`, `game.js` | Tampilan dan logika game |
| `lines.js` | Semua kalimat narator (id/en). Rekaman suara dibuat dari file ini |
| `dex.js` | Data 1025 Pokémon |
| `img/`, `hd/` | Gambar Pokémon 256 px dan 512 px |
| `audio/id`, `audio/en` | Rekaman narator, beserta `index.json` per bahasa |
| `sw.js`, `manifest.webmanifest`, `icons/` | Pemasangan aplikasi dan mode offline |

Game diterbitkan otomatis ke GitHub Pages lewat `.github/workflows/pages.yml` setiap ada perubahan di `main`.
