class map{
    constructor(spritesheet){
        this.spriteSheet = ASSET_MANAGER.getAsset(spritesheet);
        this.animations = new Animator(this.spriteSheet, 0, 0, 1360, 1040, 1, 1, true);
    }
    update(){

    }
    draw(ctx){
        this.animations.drawFrame(gameEngine.clockTick,ctx, 680,520,1360,1040);
    }
}