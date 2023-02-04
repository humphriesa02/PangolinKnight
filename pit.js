class pit{
    constructor(info){
    this.tag = "tile"
    this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
    this.collider = new Collider(new AABB(this.transform.pos, 8, 8), false, true, true);

    this.loadAnimation(info.state)
}
loadAnimation(state){
    switch(state){
        case 0:
            this.animator = new Animator(this.spritesheet, 96, 64, 16, 16, 1, 1, true);
            break;
        case 1:
            this.animator = new Animator(this.spritesheet, 96, 80, 16, 16, 1, 1, true);
            break;
        case 2:
            this.animator = new Animator(this.spritesheet, 96, 96, 16, 16, 1, 1, true);
    }

}
update(){

}
draw(ctx){
    this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
}
}