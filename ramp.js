class ramps{
    constructor(info){
        this.tag = "tile"
        this.updatable = true;
        this.transform = new Transform(new Vec2(info.position[0] * 16, info.position[1] * 16 ));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_one_to_two_tileset.png");
        if(info.state ==0){
            this.collider = new Collider(new Qtr_Pipe(this.transform.pos, 0), true, true, false);
            this.animator = new Animator(this.spritesheet, 0, 80, 16, 16, 1, 1, true);
        }
        else if(info.state == 1){
            this.collider = new Collider(new Qtr_Pipe(this.transform.pos, 3), true, true, false);
            this.animator = new Animator(this.spritesheet, 16, 80, 16, 16, 1, 1, true);
        }
        else if (info.state == 2){
            this.collider = new Collider(new Ramp(new Vec2(this.transform.pos.x, this.transform.pos.y + 12), new Vec2(this.transform.pos.x + 16, this.transform.pos.y+4)), true, true, false);
            this.animator = new Animator(this.spritesheet, 0, 80, 16, 16, 1, 1, true);
        }
        else if(info.state == 3){
            this.collider = new Collider(new Qtr_Pipe(this.transform.pos, 0), true, true, false);
            this.animator = new Animator(this.spritesheet, 0, 80, 16, 16, 1, 1, true);
        }
        
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x+8, this.transform.pos.y+8, 16, 16);
    }
}