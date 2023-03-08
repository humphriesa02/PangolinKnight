class map{
    constructor(spritesheet, level){
        this.spriteSheet = ASSET_MANAGER.getAsset(spritesheet);
        this.updatable = true;
        this.load_map(level);
    }
    load_map(level){
        switch(level){
            case 1:
                this.x = 1360;
                this.y = 1040;
                break;
            case 1.5:
                this.x = 2720;
                this.y = 928;
                break;
            case 2:
                this.x = 1904;
                this.y = 1456;
                break;
        }
        this.animations = new Animator(this.spriteSheet, 0, 0, this.x, this.y, 1, 1, true);
    }
    update(){

    }
    draw(ctx){
        this.animations.drawFrame(gameEngine.clockTick,ctx, this.x/2,this.y/2,this.x,this.y);
    }
}