class crystal{
    constructor(position, scale){
        this.position = position;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.scale = scale;
        this.animator = new Animator(this.spritesheet, 80, 48, 16, 16, 1, 1, true, this.scale);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 16 * this.scale - screenX(), this.position[1] * 16 * this.scale - screenY(), 16, 16);
    }
}