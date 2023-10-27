// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx
    }

    update() {
        if(!this.isFiring) {
            // keyboard input - left & right
            // if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            //     this.x -= this.moveSpeed;
            // } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            //     this.x += this.moveSpeed;
            // }

            // mouse input
            if(game.input.mousePointer.x < this.x && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (game.input.mousePointer.x > this.x && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // keyboard input F - Fire 
        // if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
        //     this.isFiring = true;
        //     this.sfxRocket.play();
        // }
        
        // mouse is down - Fire
        if(mouse.isDown && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
