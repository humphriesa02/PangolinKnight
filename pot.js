class pot{
    constructor(position){
        this.position = position;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");

        this.animator = new Animator(this.spritesheet, 96, 16, 16, 16, 1, 1, true, 3);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 48, this.position[1] * 48, 16, 16);
    }
}