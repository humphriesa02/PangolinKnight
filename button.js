class button{
    constructor(info, door){
        this.tag = "prop";
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.collider = new Collider(new Circle(this.transform.pos, 4), false, true, false);
        this.state = 0;
        this.door = door;
        this.animator = [];
        this.animator[0] = new Animator(this.spritesheet, 48, 32, 16, 16, 1,1,true);
        this.animator[1] = new Animator(this.spritesheet, 64, 32, 16, 16, 1,1,true);
    }
    update(){

    }
    draw(ctx){
        this.animator[this.state].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
    activate(){
        this.state = 1;
        this.door.state = 1;
    }
}