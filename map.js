class map{
    constructor(spriteSheet){
        this.position = {x: 0,y: 0};
        this.spriteSheet = ASSET_MANAGER.getAsset(spriteSheet);
        this.animations = [];
        this.scale = params.scale;
        this.loadAnimations();
    }
    loadAnimations(){
        for(var i = 0; i < 3; i++) {//3 columns
            this.animations.push([]);
            for(var j = 0; j < 3; j++){//3 rows
                this.animations[i].push([]);
            }
        }

        this.animations[0][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[0][1] = new Animator(this.spriteSheet, 0, 128, 160, 128, 1, 1, true, this.scale);
        this.animations[0][2] = new Animator(this.spriteSheet, 0, 256, 160, 128, 1, 1, true, this.scale);

        this.animations[1][0] = new Animator(this.spriteSheet, 160, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[1][1] = new Animator(this.spriteSheet, 160, 128, 160, 128, 1, 1, true, this.scale);
        this.animations[1][2] = new Animator(this.spriteSheet, 160, 256, 160, 128, 1, 1, true, this.scale);

        this.animations[2][0] = new Animator(this.spriteSheet, 320, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[2][1] = new Animator(this.spriteSheet, 320, 128, 160, 128, 1, 1, true, this.scale);
        this.animations[2][2] = new Animator(this.spriteSheet, 320, 256, 160, 128, 1, 1, true, this.scale);
    }
    update(){

    }
    draw(ctx){
        this.animations[this.position.x][this.position.y].drawFrame(gameEngine.clockTick,ctx, 0,0,160,128);
    }
}