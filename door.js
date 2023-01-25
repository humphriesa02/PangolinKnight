class door{
    constructor(position, info){
        this.tag = "tile"
        this.state = info.state; // left = 0, up = 1, right = 2, down = 3, invisable = 4, open = 5
        this.transform = new Transform(new Vec2(position[0] * 16 + 8, position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        if(this.state != 5){
            this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);
        }
        this.loadAnimations(this.state);
    }
    loadAnimations(state){
        switch(state){
            case 0:
                this.animator = new Animator(this.spritesheet, 64, 0, 16, 16, 1, 1, true);
                break;
            case 1:
                this.animator = new Animator(this.spritesheet, 80, 0, 16, 16, 1, 1, true);
                break;
            case 2:
                this.animator = new Animator(this.spritesheet, 96, 0, 16, 16, 1, 1, true);
                break;
            case 3:
                this.animator = new Animator(this.spritesheet, 112, 0, 16, 16, 1, 1, true);
                break;
            case 4:
                this.animator = new Animator(this.spritesheet, 112, 48, 16, 16, 1, 1, true);
                break;
            case 5:
                this.animator = new Animator(this.spritesheet, 112, 48, 16, 16, 1, 1, true);
                break;
        }
    }
    update(){

    }
    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 16, 16, false, true, 1);
        }
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
}