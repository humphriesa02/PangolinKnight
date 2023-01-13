class map{
    constructor(player){
        this.player = player;
        this.position = [0,0];
        this.spriteSheet = ASSET_MANAGER.getAsset("./sprites/map.png");
        this.animations = [];
        this.scale = 3;
        this.laodAnimations();
        this.addEntities();
    }
    laodAnimations(){
        for(var i = 0; i < 3; i++) {//3 columns
            this.animations.push([]);
            for(var j = 0; j < 3; j++){//3 rows
                this.animations[i].push([]);
            }
        }

        this.animations[0][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[0][1] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[0][2] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);

        this.animations[1][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[1][1] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[1][2] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);

        this.animations[2][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[2][1] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[2][2] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
    }
    addEntities(){
        let pass = ('room' + this.position[0]) + this.position[1];
        this.room = rooms[pass];
        for(let i = 0; i < this.room.pots.length; i++){
            gameEngine.addEntity(new pot(this.room.pots[i]));
        }
        for(let i = 0; i < this.room.blocks.length; i++){
            gameEngine.addEntity(new block(this.room.blocks[i]));
        }
    }
    update(){

    }
    draw(ctx){
        this.animations[this.position[0]][this.position[1]].drawFrame(gameEngine.clockTick,ctx, 0,0,160,128);
    }
}