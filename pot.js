class pot{
    constructor(position){
        this.tag = "tile";
        this.transform = new Transform(new Vec2(position[0] * 16 + 8, position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 96, 16, 16, 16, 1, 1, true);
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
        draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 16, 16, false, true, 1);
    }
}