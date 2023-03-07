class Explosion{
    constructor(parent_entity, z=0, is_bomb=false){
        this.parent_entity = parent_entity;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/explosion.png");
        this.animator = new Animator(this.spritesheet, 0, 0, 16, 16, 6, 0.07, false);
        this.pos = parent_entity.transform.pos.clone();
        this.transform = new Transform(this.pos, 1, new Vec2(0,0));
        this.updatable = true;
        this.z = z;
        this.is_bomb = is_bomb;
        if(this.is_bomb){
            this.tag = "explosion";
            this.collider = new Collider(new Circle(this.transform.pos, 12), false, true, false);
        }
    }
    update(){
        if(this.animator.done){
            this.removeFromWorld = true;
        }
    }
    draw(ctx){
        if(this.is_bomb){
            this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.z, 24, 24);

        }
        else{
            this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.z, 16, 16);
        }
    }
}