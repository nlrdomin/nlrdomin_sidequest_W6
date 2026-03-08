# 🎣 Fishing Game

A p5.js fishing game using the [Kenney Fish Pack](https://kenney.nl).

## How to run

Open `index.html` in a browser — or use the VS Code **Live Server** extension for hot reload.

> ⚠️ The spritesheet is loaded via a relative path, so you **must** serve the files (Live Server, `npx serve`, etc.). Opening `index.html` directly as a `file://` URL will block the image load.

## Controls

| Action | Input |
|---|---|
| Cast line | Click anywhere on the water |
| Reel in | Click while waiting or hooked |
| Avoid snap | Don't click too fast — watch the tension bar |

## Project structure

```
fishing-game/
├── index.html              # Entry point — loads scripts in order
├── style.css               # Layout & canvas styles
├── assets/
│   └── spritesheet/
│       ├── spritesheet.png # Kenney Fish Pack atlas
│       └── spritesheet.xml # Atlas metadata (for reference)
└── src/
    ├── constants.js        # All tunable values (speeds, rarities, sizes…)
    ├── sprites.js          # Atlas map + drawSprite() helper
    ├── fish.js             # Fish spawning, AI, drawing
    ├── decorations.js      # Seaweed, rocks, background elements
    ├── effects.js          # Bubbles + floating score text
    ├── ui.js               # HUD panel + message overlay
    └── sketch.js           # p5 setup/draw, hook physics, input
```

## Fish rarities

| Rarity | Glow | Value |
|---|---|---|
| Common | — | 10–20 |
| Uncommon | — | 25–35 |
| Rare | Purple | 50–75 |
| Legendary | Gold | 100 |

## Credits

Sprites: [Kenney Fish Pack](https://kenney.nl/assets/fish-pack) (CC0)
