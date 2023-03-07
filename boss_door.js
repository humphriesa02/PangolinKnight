class boss_door{
    constructor(info){
        this.tag = "prop";
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_entities.png");
        this.animator = new Animator(this.spritesheet, 80, 48, 16, 16, 1, 1, true);
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);
        this.player = gameEngine.camera.player;
        this.updatable = true;
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
    activate(entity){
        if(entity.interacting != undefined && entity.interacting && this.player.inventory.key_items.boss_key){
            this.player.inventory.boss_key = false;
            this.removeFromWorld = true;
        }
    }
}