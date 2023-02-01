class Explosion{
    constructor(parent_entity){
        this.parent_entity = parent_entity;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/explosion.png");
        this.animator = new Animator(this.spritesheet, 0, 0, 16, 16, 6, 0.07, false);
    }
    update(){
        if(this.animator.done){
            this.removeFromWorld = true;
        }
    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.parent_entity.transform.pos.x, this.parent_entity.transform.pos.y, 16, 16);
    }
}