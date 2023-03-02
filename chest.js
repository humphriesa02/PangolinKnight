class chest{
    constructor(info){
        this.tag = "prop"
        this.requires_facing = true;
        this.item = info.item;
        this.state = info.state;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.animator = [];
        this.animator[0] = new Animator(this.spritesheet, 48, 16, 16, 16, 1, 1, true);
        this.animator[1] = new Animator(this.spritesheet, 64, 16, 16, 16, 1, 1, true);
        this.updatable = true;
    }
    update(){

    }
    draw(ctx){
        this.animator[this.state].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
    activate(entity){
        if(entity.interacting != undefined && entity.interacting && this.state != 1){
            this.state = 1;
            if(this.item == item_enum.scale){create_item(this.item, gameEngine.camera.player.transform.pos, 50, 1);}
            else{create_item(this.item, gameEngine.camera.player.transform.pos, 1, 1);}
        } 
    }
}