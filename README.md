# Tic-Tac-Toe

A browser-based Tic Tac Toe game built as part of __The Odin Project – JavaScript curriculum.__
The goal of this project was to practice __JavaScript module patterns, state management, and separation of concerns__.

## Live Demo
[View on GitHub Pages](https://sai-eshwar-supreet.github.io/Tic-Tac-Toe/)

## Goals
This project focuses on:
- Encapsulating state using factories and IIFEs
- Minimizing global scope
- Separating:
    - Game logic
    - Board state
    - Display / DOM logic
- Implementing complete game rules:
    - Turn handling
    - Win / Tie conditions
    - Restart flow

The game logic was developed independently of the UI first, then connected to the DOM.

## Features
- __Two-player__ Tic Tac Toe (X vs O)
- Win detection for all __8 possible patterns__
- Tie detection when the board is full
- Visual highlight of winning cells
- Modal-based game-over screen
- Restart without page reload
- No global mutable state

## Technical Notes
The project is organized around a few core modules:
### Player
Represents a player in the game.
- Stores the player’s symbol (X or O)
- Designed to be extended with additional properties (e.g. name)

### Gameboard
Responsible for:
- Storing the board state internally
- Tracking available positions
- Validating and applying moves
- Exposing read-only access to board data

The board array is __not global__ and cannot be mutated directly from outside the module.

### Game Controller
Controls the flow of the game:
- Player turn switching
- Validating moves
- Win and tie detection
- Emitting a single terminal game-over state

### ScreenController
Handles all DOM-related responsibilities:
- Rendering the board based on game state
- Handling user interactions (clicks)
- Displaying turn information
- Showing the game-over modal

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Module pattern (IIFE)
- Factory functions
No frameworks or external libraries were used.

## Acknowledgements
- This project was completed as part of **[The Odin Project – JavaScript Course](https://www.theodinproject.com/)**