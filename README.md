# Petualangan Laut Pokémon

Nineteen Pokémon mini-games for a five-year-old, each with five levels. It includes a full Pokédex of 1025 Pokémon from Kanto to Paldea with official artwork. This is a fan project and is not affiliated with Nintendo or The Pokémon Company.

[Bahasa Indonesia](README.id.md)

- Bilingual narrator in Indonesian and English, recorded with neural voices: Kokoro (voice "Heart") for English and Piper (`id_ID-news_tts`) for Indonesian.
- Theme music "Ombak Pelangi" played live by an in-game synthesizer (marimba, bass, pad, shaker). It gets quieter while the narrator speaks.
- Stars, levels and the collection are stored in the browser of each phone or tablet.
- Installable on iPhone and Android, and playable offline.

Play: https://ghivee.github.io/Beben-game/

Install on a phone: open the address in Safari (iPhone: Share, then Add to Home Screen) or Chrome (Android: tap the install button in the game, then Install).

## Contents

| Path | What it holds |
| --- | --- |
| `index.html`, `game.js` | Interface and game logic |
| `lines.js` | Every narrator line (id and en). The voice recordings are generated from this file |
| `dex.js` | Data for the 1025 Pokémon |
| `img/`, `hd/` | Pokémon images at 256 px and 512 px |
| `audio/id`, `audio/en` | Narrator recordings and an `index.json` per language |
| `sw.js`, `manifest.webmanifest`, `icons/` | App installation and offline mode |

The game is published to GitHub Pages by `.github/workflows/pages.yml` on every change to `main`.
