class door{
    constructor(info){
        this.position = info[0];
        this.state = info[1]; // 0 = left, 1 = up, 2 = right, 3 = down
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.loadAnimations();
    }
    loadAnimations(){
        switch(this.state){
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
        }
    }
    update(){

    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.position[0] * 16, this.position[1] * 16, 16, 16);
    }
}