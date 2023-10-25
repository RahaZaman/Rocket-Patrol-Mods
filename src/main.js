/*

Rahamat Zaman

Rocket Patrol Transmutations

Approximate time to complete project: 

Mods Chosen: 
New enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5 points)
Mouse control for player movement and mouse click to fire (5 points)
New title screen (e.g., new artwork, typography, layout) (3 points)
Displaying the time remaining (in seconds) on the screen (3 points)
4 new explosion sound effects at random on impact (3 points)
Speed increase that happens after 30 seconds in the original game (1 points)

Citations:

*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

// reserved mouse variable
let mouse;