class Explosion{
    constructor(parent_entity, z=0, is_bomb=false){
        this.parent_entity = parent_entity;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/explosion.png");
        this.animator = new Animator(this.spritesheet, 0, 0, 16, 16, 6, 0.07, false);
        this.updatable = true;
        this.z = z;
        this.is_bomb = is_bomb;
    }
    update(){
        if(this.animator.done){
            this.removeFromWorld = true;
        }
    }
    draw(ctx){
        if(this.is_bomb){
            this.animator.drawFrame(gameEngine.clockTick,ctx,this.parent_entity.transform.pos.x, this.parent_entity.transform.pos.y - this.z, 24, 24);

        }
        else{
            this.animator.drawFrame(gameEngine.clockTick,ctx,this.parent_entity.transform.pos.x, this.parent_entity.transform.pos.y - this.z, 16, 16);
        }
    }
}