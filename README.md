# Qaphsiel (Formerly AQ Bible Search)

A hyperstitional, browser-based research tool for searching the King James Bible via Alphanumeric Qabbala (AQ) and other mathematical games derived from the Cybernetic Culture Research Unit (CCRU) and Nick Land.

## Core Esoteric Features

*   **Alphanumeric Qabbala (AQ):** A base-36 mapping where A-Z = 10-35, and 0-9 retain their value. Discover "Lexical Twins" (disparate words that share exact numeric vibrations).
*   **The Pandemonium Matrix:** Every search dynamically generates an interactive SVG of the CCRU Numogram. It calculates the digital root to determine the reigning "Zone Demon" (e.g., *Uttunul*, *Oddubb*), displays its 9-sum Syzygy Twin, and plots its "Time-Circuit" alignment.
*   **Hyperprime Resonance (Barker Filter):** Expanding search parameters to treat numbers as prime coordinates. Finding a word with an AQ of 3 simultaneously searches the Bible for words equaling 5 (the 3rd prime) and 2 (since 3 is the 2nd prime), revealing deep Tic-System connections.
*   **Xenotation Compiler:** Translates standard numbers into Dr. D.C. Barker's Tic Xenotation (TX)—a baseless numeral system mapped entirely via prime factorization and implexion (e.g., `((•))(•)`). Includes a reverse-compiler to type raw Xenotation strings and search the Bible for them.
*   **I Ching Transcompiler:** Maps AQ values to the 64 Hexagrams of the I Ching, visualizing the Yin/Yang lines as binary logic gates plotted into Lemurian time sorcery.
*   **Sigil Generator:** Maps a word across a 6x6 alphanumeric grid and draws an SVG sigil path based on its character values. Includes a dynamic cursor-fade popup.

## Accessing the Application

Qaphsiel is hosted live and is available to use right now at:
**[http://qaphsiel.com](http://qaphsiel.com)**

Simply open the link in your browser, wait a few seconds for the underlying `kjv.txt` Holy Text to load into your browser's memory, and then input text, numbers, or Xenotation strings to begin mapping the matrix.

## Local Development

If you wish to run the app locally or modify the code, you must use a local web server (due to browser security restrictions when loading local `.txt` files).

### Option 1: Python (Recommended)

If you have Python installed, open a terminal in this folder and run:

```bash
# Python 3
python -m http.server 8000
```
Then open your browser and go to: `http://localhost:8000`

### Option 2: Node.js
```bash
npx http-server -p 8000
```
Then open: `http://localhost:8000`
