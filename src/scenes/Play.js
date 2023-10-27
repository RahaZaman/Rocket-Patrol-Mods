class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('modified-spaceship', './assets/modified-spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'modified-spaceship', 0, 20).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'modified-spaceship', 0, 15).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // define mouse movement/control
        mouse = this.input.mousePointer;

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '29px',
            backgroundColor: '#5775D3',
            color: '#CCD1D1',
            align: 'right',
            margin: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 60,
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // setting timer value
        this.gameSeconds = game.settings.gameTimer / 1000;

        // Setting up the timer event 
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1000 milliseconds = 1 second
            callback: updateGameTimer,
            callbackScope: this,
            loop: true,
        });

        function updateGameTimer() {
            // Decrement the game timer by 1 second (1000 milliseconds)
            this.gameSeconds -= 1000 / 1000;
            
            // Updating the displayed timer text
            this.gameDisplay.setText(this.gameSeconds);
            
            if (this.gameSeconds <= 0) {
                this.gameOver = true; 
                this.time.removeEvent(this.timerEvent);
            }
        }

        // timer configuration when displaying on Play scene
        let timerConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '29px',
            backgroundColor: '#5775D3',
            color: '#CCD1D1',
            align: 'center',
            margin: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 60,
        }

        // displaying the timer
        this.gameDisplay = this.add.text(borderUISize + borderPadding*47, borderUISize + borderPadding*2, this.gameSeconds, timerConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
             this.ship01.update();              // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }

        // Speed increases after 30 seconds in the game
        if (this.gameSeconds < 30) {
            this.moveSpeed = this.moveSpeed * 3;
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 

        // randomly selects explosion sound on impact
        this.sound.play(Phaser.Math.RND.pick(['sfx_explosion', 'sfx_new_explosion1', 'sfx_new_explosion2', 'sfx_new_explosion3', 'sfx_new_explosion4']))
      }
}