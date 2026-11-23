# Petualangan Laut Pokémon

A collection of 19 Pokémon mini-games made for a five-year-old, each with 5 levels, so there is a long runway of difficulty to grow into rather than something that gets boring after an afternoon. It ships with a complete Pokédex of all 1025 Pokémon from Kanto through Paldea with official-style artwork, works offline once installed, and runs as an installable Progressive Web App on both iPhone and Android. This is a personal fan project made for a specific child and is not affiliated with Nintendo or The Pokémon Company.

[Baca dalam Bahasa Indonesia di bawah](#bahasa-indonesia)

## What makes it work for a young child

- **A bilingual narrator**, so the game can be played in Indonesian or English, recorded as actual neural voice audio rather than the browser's built-in text-to-speech: Kokoro (the "Heart" voice) for English, and Piper (`id_ID-news_tts`) for Indonesian. Every line the narrator can say lives in `lines.js`, and the audio files in `audio/id` and `audio/en` are generated from that single source of truth, so the two languages can never drift out of sync with each other.
- **Live theme music**, "Ombak Pelangi" ("Rainbow Waves"), played by an in-game synthesizer (marimba, bass, pad and shaker) rather than a looping audio file, and it automatically turns down while the narrator is speaking so the two never compete for attention.
- **Per-device progress**: stars, unlocked levels, and the Pokémon collection are saved in the browser of whichever phone or tablet is being used, with no account and no login screen to get in the way.
- **Installable and offline-capable**, so it can be added to a home screen and played anywhere, including without an internet connection once it has been opened once.

Play it here: https://ghivee.github.io/Beben-game/

To install on a phone: open that address in Safari on iPhone (Share, then Add to Home Screen) or in Chrome on Android (tap the in-game install button, then Install).

## Contents

| Path | What it holds |
| --- | --- |
| `index.html`, `game.js` | The interface and the game logic for all 19 mini-games |
| `lines.js` | Every narrator line, in both Indonesian and English; the voice recordings are generated from this one file |
| `dex.js` | The data for all 1025 Pokémon: name, type, and evolution method |
| `img/`, `hd/` | Pokémon artwork at 256px and 512px |
| `audio/id`, `audio/en` | The narrator's recorded voice lines, with an `index.json` per language mapping line IDs to audio files |
| `sw.js`, `manifest.webmanifest`, `icons/` | What makes the game installable and able to run offline |

The game is published to GitHub Pages automatically by `.github/workflows/pages.yml` on every push to `main`, so a change is live within a couple of minutes without a manual deploy step.

---

## Bahasa Indonesia

Kumpulan 19 mini-game Pokémon yang dibuat untuk anak usia 5 tahun, masing-masing punya 5 level, sehingga tersedia jalur kesulitan yang panjang untuk terus dipelajari, bukan sesuatu yang membosankan setelah satu sore. Game ini membawa Pokédex lengkap 1025 Pokémon dari Kanto sampai Paldea dengan gambar bergaya resmi, bisa dimainkan offline setelah terpasang, dan berjalan sebagai Progressive Web App yang bisa dipasang di iPhone maupun Android. Ini proyek fan pribadi yang dibuat untuk seorang anak tertentu dan tidak berafiliasi dengan Nintendo atau The Pokémon Company.

### Yang membuatnya pas untuk anak kecil

- **Narator dua bahasa**, sehingga game bisa dimainkan dalam Indonesia atau Inggris, direkam sebagai audio suara neural sungguhan, bukan text-to-speech bawaan peramban: Kokoro (suara "Heart") untuk Inggris, dan Piper (`id_ID-news_tts`) untuk Indonesia. Setiap kalimat yang bisa diucapkan narator tersimpan di `lines.js`, dan berkas audio di `audio/id` dan `audio/en` dibuat dari satu sumber itu, sehingga kedua bahasa tidak pernah bisa tidak sinkron satu sama lain.
- **Musik tema langsung**, "Ombak Pelangi", dimainkan oleh synthesizer di dalam game (marimba, bas, pad, dan shaker), bukan berkas audio yang diputar berulang, dan otomatis mengecil saat narator bicara sehingga keduanya tidak pernah bersaing menarik perhatian.
- **Progres per perangkat**: bintang, level yang terbuka, dan koleksi Pokémon tersimpan di peramban HP atau tablet yang dipakai, tanpa akun dan tanpa layar login yang menghalangi.
- **Bisa dipasang dan berjalan offline**, sehingga bisa ditambahkan ke layar utama dan dimainkan di mana saja, termasuk tanpa koneksi internet setelah pernah dibuka sekali.

Main di sini: https://ghivee.github.io/Beben-game/

Pasang di HP: buka alamat di atas di Safari pada iPhone (Bagikan, lalu Tambah ke Layar Utama) atau Chrome pada Android (ketuk tombol pasang di dalam game, lalu Instal).

### Isi

| Path | Isi |
| --- | --- |
| `index.html`, `game.js` | Tampilan dan logika permainan untuk semua 19 mini-game |
| `lines.js` | Semua kalimat narator, dalam bahasa Indonesia dan Inggris; rekaman suara dibuat dari berkas tunggal ini |
| `dex.js` | Data seluruh 1025 Pokémon: nama, tipe, dan cara evolusi |
| `img/`, `hd/` | Gambar Pokémon pada ukuran 256px dan 512px |
| `audio/id`, `audio/en` | Rekaman suara narator, dengan `index.json` per bahasa yang memetakan ID kalimat ke berkas audio |
| `sw.js`, `manifest.webmanifest`, `icons/` | Yang membuat game bisa dipasang dan berjalan offline |

Game ini diterbitkan ke GitHub Pages secara otomatis oleh `.github/workflows/pages.yml` setiap ada push ke `main`, sehingga perubahan langsung tayang dalam beberapa menit tanpa langkah deploy manual.
