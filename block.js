class block{
    constructor(position){
        this.position = position;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.animator = new Animator(this.spritesheet, 32, 0, 16, 16, 1, 1, true);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 16 + 8, this.position[1] * 16 + 8, 16, 16);
    }
}
