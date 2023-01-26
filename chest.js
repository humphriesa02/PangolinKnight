class chest{
    constructor(position,scale){
        this.position = position;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.scale = scale;
        this.animator = new Animator(this.spritesheet, 112, 16, 16, 16, 1, 1, true, this.scale);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 16, this.position[1] * 16, 16, 16);
    }
}