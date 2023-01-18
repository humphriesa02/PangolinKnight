class statue{
    constructor(position,scale){
        this.position = position;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.scale = scale;
        this.animator = new Animator(this.spritesheet, 96, 32, 16, 16, 1, 1, true, 4);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 16 * this.scale - screenX(), this.position[1] * 16 * this.scale - screenY(), 16, 16);
    }
}