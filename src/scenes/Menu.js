class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');

        // 4 new explosion sound effects at random on impact
        this.load.audio('sfx_new_explosion1', './assets/new_explosion1.wav');
        this.load.audio('sfx_new_explosion2', './assets/new_explosion2.wav');
        this.load.audio('sfx_new_explosion3', './assets/new_explosion3.wav');
        this.load.audio('sfx_new_explosion4', './assets/new_explosion4.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '29px',
            backgroundColor: '#5775D3',
            color: '#CCD1D1',
            align: 'center',
            margin: {
              top: 10,
              bottom: 10,
            },
            fixedWidth: 525,
        }

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use mouse to move & click mouse to Fire', menuConfig).setOrigin(0.5);
        // menuConfig.backgroundColor = '#00FF00';
        menuConfig.backgroundColor = '#CCD1D1';
        // menuConfig.color = '#000';
        menuConfig.color = '#5775D3';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            // spaceship speed was orginally 3
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            // spaceship speed was orginally 3
            spaceshipSpeed: 5,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}