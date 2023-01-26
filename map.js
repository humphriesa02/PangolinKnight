class map{
    constructor(spritesheet){
        this.spriteSheet = ASSET_MANAGER.getAsset(spritesheet);
        this.animations = new Animator(this.spriteSheet, 0, 0, 480, 384, 1, 1, true);
    }
    update(){

    }
    draw(ctx){
        this.animations.drawFrame(gameEngine.clockTick,ctx, 240,192,480,384);
    }
}