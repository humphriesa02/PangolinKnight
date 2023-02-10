class block{
    constructor(info){
        this.tag = "tile"
        this.home = info.position;
        if(info.state == 1){
            this.pushable_base = true;
        }
        else{
            this.pushable_base = false;
        }
        this.pushable = this.pushable_base;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 32, 0, 16, 16, 1, 1, true);
        this.updatable = false;
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
    reset(){
        this.transform.pos.x = this.home[0] * 16 + 8;
        this.transform.pos.y = this.home[1] * 16 + 8;
        this.pushable = this.pushable_base;
    }
}
