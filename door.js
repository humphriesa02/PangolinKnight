class door{
    constructor(info){
        this.tag = "tile"
        this.state = info.state; // invisable = 0, open = 1, close = 2
        this.facing = info.facing; // 0 = up, 1 = right, 2 = down, 3 = left
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);
        this.loadAnimations(this.facing);
        this.updatable = true;
    }
    loadAnimations(facing){
        this.animator= [];
        switch(facing){
            case 0: //up
                this.animator[0] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[1] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[2] = new Animator(this.spritesheet, 16, 16, 16, 16, 1, 1, true);
                break;
            case 1: //right
                this.animator[0] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[1] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[2] = new Animator(this.spritesheet, 16, 0, 16, 16, 1, 1, true);
                break;
            case 2: //down
                this.animator[0] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[1] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[2] = new Animator(this.spritesheet, 0, 16, 16, 16, 1, 1, true);
                break;
            case 3: //left
                this.animator[0] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[1] = new Animator(this.spritesheet, 0, 64, 16, 16, 1, 1, true);
                this.animator[2] = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 1, true);
                break;
        }
    }
    update(){
        if(this.state == 1){
            this.collider.block_move = false;
        }
        else{
            this.collider.block_move = true;
        }
    }
    draw(ctx){
        this.animator[this.state].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
}