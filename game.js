
let gameOptions = {
    width : 400,
    height : 800,
    pixelArt : true
};
let game = null;
let SWIPE_THRESHOLD = 50;

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

        this.board = [
            [1,2,3],
            [4,5,1],
            [2,3,4]
        ];
    }
    make_graphics() {
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
        this.make_graphics();
        this.load.image("1", "3f4d63.png");
        this.load.image("2", "85a1c1.png");
        this.load.image("3","274b69.png");
        this.load.image("4","202022.png");
        this.load.image("5","c6ccd8.png");

        // player
        this.load.image("player", "202022_selected.png");
    }
    create() {
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
       
       this.sliders = this.add.group();

       let Y_OFF = 200;

       // top row
       tmp = this.add.image(0,Y_OFF+0,"1").setOrigin(0,0);
       this.sliders.add(tmp);
       tmp = this.add.image(132,Y_OFF+0,"2").setOrigin(0,0);
       this.sliders.add(tmp);
       tmp = this.add.image(132+132,Y_OFF+0,"3").setOrigin(0,0);
       this.sliders.add(tmp);
       // middle row
       tmp = this.add.image(0,Y_OFF+132,"4").setOrigin(0,0);
       this.sliders.add(tmp);
       tmp = this.add.image(132,Y_OFF+132,"player").setOrigin(0,0);
       this.sliders.add(tmp);
       tmp = this.add.image(132+132,Y_OFF+132,"1").setOrigin(0,0);
       this.sliders.add(tmp);
       // bottom row
       tmp = this.add.image(0,Y_OFF+132+132,"2").setOrigin(0,0);
       this.sliders.add(tmp);
       tmp = this.add.image(132,Y_OFF+132+132,"3").setOrigin(0,0);
       this.sliders.add(tmp);
       tmp = this.add.image(132+132,Y_OFF+132+132,"4").setOrigin(0,0);
       this.sliders.add(tmp);

       this.input.on("pointerdown", (ptr) => {
           this.downX = ptr.x;
           this.downY = ptr.y;
       });
       this.input.on("pointerup", (ptr) => {
            this.upX = ptr.x;
            this.upY = ptr.y;

            if (this.upX < this.downX - SWIPE_THRESHOLD){
                console.log("swipeleft");
            } else if (this.upX > this.downX + SWIPE_THRESHOLD) {
                console.log("swiperight");
            } else if (this.upY < this.downY - SWIPE_THRESHOLD) {
                console.log("swipeup");
            } else if (this.upY > this.downY + SWIPE_THRESHOLD) {
                console.log("swipedown");
            }
       });


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