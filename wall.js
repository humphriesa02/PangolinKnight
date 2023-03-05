class wall{
    constructor(info){
        this.tag = "wall"
        this.updatable = true;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + info.width, info.position[1] * 16 + info.height));
        this.collider = new Collider(new AABB(this.transform.pos, info.width, info.height), true, true, true);
    }
    update(){

    }
    draw(ctx){}
}

class falsewall{
    constructor(info){
        this.tag = "wall"
        this.updatable = true;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, true);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_entities.png");
        this.facing = info.facing; // 0 = up, 1 = right, 2 = down, 3 = left
        this.loadAnimations(this.facing);
        this.updatable = false;
    }
    loadAnimations(facing){
        this.animator;
        switch(facing){
            case 0: //up
                this.animator = new Animator(this.spritesheet, 48, 96, 16, 16, 1, 1, true);
                break;
            case 1: //right
                this.animator = new Animator(this.spritesheet, 16, 96, 16, 16, 1, 1, true);
                
                break;
            case 2: //down
                this.animator = new Animator(this.spritesheet, 32, 96, 16, 16, 1, 1, true);
                
                break;
            case 3: //left
                this.animator = new Animator(this.spritesheet, 0, 96, 16, 16, 1, 1, true);
                break;
            default:
                this.animator = new Animator(this.spritesheet, 48, 96, 16, 16, 1, 1, true);
                break;
        }
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }

    reset(){}
}