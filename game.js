
let gameOptions = {
    width : 400,
    height : 800,
    pixelArt : true
};
let game = null;
let SWIPE_THRESHOLD = 50;
let Y_OFF = 200;

function resize(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    
    console.log("window width and height and ratio", windowWidth,
        windowHeight, windowRatio);
    let gameRatio = game.config.width / game.config.height;
    console.log("game ratio is", gameRatio);

    if(windowRatio < gameRatio){
        console.log("game ratio is bigger than window ratio");
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
        console.log("canvas style is set to",
        canvas.style.width, canvas.style.height);
    }
    else{
        console.log("window ratio was larger than game ratio");
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
        console.log("canvas style is set to", canvas.style.width, canvas.style.height );
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("game");
        this.igroup = null;
        this.upX = 0;
        this.upY = 0;
        this.downX = 0;
        this.downY = 0;

        this.board = null; // 2d array
        this.player = null;

    }
    make_debug_graphics() {
        let _this = this;
        function _gg(name,color) {
            let graphics = _this.add.graphics();
            graphics.lineStyle(8,color);
            graphics.moveTo(0,0);
            graphics.strokeRect(0,0,8,8);
            graphics.generateTexture(name,8,8);
            graphics.destroy();    
        }

        _gg("red",0xff0000);
        _gg("green",0x00ff00);
        _gg("blue",0x0000ff);
    }
    preload() {
        this.make_debug_graphics();
        this.load.image("1", "3f4d63.png");
        this.load.image("2", "85a1c1.png");
        this.load.image("3","274b69.png");
        this.load.image("4","202022.png");
        this.load.image("5","c6ccd8.png");

        // player
        this.load.image("player", "202022_selected.png");
    }
    handle_swipe(direction) {
        let r_off = 0;
        let c_off = 0;
        if (direction=="left") {
            c_off = -1;
            console.log("swipe left");
        }
        if (direction=="right") {
            c_off = 1;
            console.log("swipe right");
        }
        if (direction=="down") {
            r_off = +1;
            console.log("swipe down");
        }
        if (direction=="up") {
            r_off = -1;
            console.log("swipe up");
        }

        console.log("player before any moves:",this.player);
        let row = this.player.row;
        let col = this.player.col;
        let computed_x = (col*132) + (c_off*132);
        let computed_y = Y_OFF + (row*132) + (r_off*132);
        
        let tl = this.tweens.createTimeline();
        // turn off the sprite where we are going
        tl.add({
            targets: this.board[row+r_off][col+c_off].sprite,
            alpha: 0,
            duration: 1000,
            callbackScope: this,
            onComplete: function(){
                this.board[row+r_off][col+c_off].sprite.visible = false;
            }
        });
        // move the player sprite
        tl.add({
            targets : this.board[row][col].sprite,
            x : computed_x,
            y : computed_y,
            duration : 1000,
            callbackScope : this,
            onComplete : function() {
                this.player.row += r_off;
                this.player.col += c_off;
            }
        });
        
        // TODO: need to move other boxes
        // TODO: add a new random box on the side

        tl.play();
    }
    add_debug_boxes() {
        this.igroup = this.add.group();
        let tmp = this.add.image(0,0,"blue").setOrigin(0,0);
        this.igroup.add(tmp);
        tmp = this.add.image(gameOptions.width-8,0,"blue").setOrigin(0,0);
        this.igroup.add(tmp);
        tmp = this.add.image(gameOptions.width-8,gameOptions.height-8,"blue").setOrigin(0,0);
        this.igroup.add(tmp);
        tmp = this.add.image(0,gameOptions.height-8,"blue").setOrigin(0,0);
        this.igroup.add(tmp);
        /*
        // middle dot red
        tmp = this.add.image(gameOptions.width/2,
            gameOptions.height/2,"red");
        this.igroup.add(tmp);
        */
    }
    setup_input_handlers() {
        this.input.on("pointerdown", (ptr) => {
            this.downX = ptr.x;
            this.downY = ptr.y;
        });
        this.input.on("pointerup", (ptr) => {
             this.upX = ptr.x;
             this.upY = ptr.y;
 
             if (this.upX < this.downX - SWIPE_THRESHOLD){
                 this.handle_swipe("left");
             } else if (this.upX > this.downX + SWIPE_THRESHOLD) {
                 this.handle_swipe("right");
             } else if (this.upY < this.downY - SWIPE_THRESHOLD) {
                 this.handle_swipe("up");
             } else if (this.upY > this.downY + SWIPE_THRESHOLD) {
                 this.handle_swipe("down");
             }
        }); 
    }
    create() {
        this.add_debug_boxes();

        this.sliders = this.add.group();

        this.board = [];
        for(let i=0;i<3;i++) {
            let row = [];
            for (let j=0;j<3;j++) {
                // note:
                // j is the column value, so j is X
                // i is row value, so i is Y
                let tmp = this.add.image(j*132,Y_OFF + (i*132), Phaser.Math.Between(1,5)).setOrigin(0,0);
                this.sliders.add(tmp);
                row[j] = { sprite : tmp, row : i, col : j };
            }
            this.board[i] = row;
        }
        // setup the player as the middle one
        {
            let tmp = this.add.image(132,Y_OFF+132,"player").setOrigin(0,0);
            this.sliders.add(tmp);
            this.board[1][1] = { sprite : tmp, row: 1, col: 1 };
            this.player = this.board[1][1];
        }

        this.setup_input_handlers();
    }
}

function mainline() {
    game = new Phaser.Game(gameOptions);
    window.focus();
    resize();
    console.log(game);
    game.scene.add("game",GameScene,true);
    game.scene.start("game");
}

window.onload = mainline;