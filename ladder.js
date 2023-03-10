class ladder{
    constructor(info){
        this.tag = "tile"
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_one_to_two_tileset.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), false, true, false);

        this.animator = new Animator(this.spritesheet, 16, 48, 16, 16, 1, 1, true);
        this.updatable = true;
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
}