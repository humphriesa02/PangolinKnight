class stair{
    constructor(info){
        this.position = info.position;
        this.transform = new Transform(new Vec2(this.position[0] * 16, this.position[1] * 16), new Vec2(0,0), 1, new Vec2(0,0));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.animator = new Animator(this.spritesheet, 80, 32, 16, 16, 1, 1, true);
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 16, this.position[1] * 16, 16, 16);
    }
}