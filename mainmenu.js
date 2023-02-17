class mainmenu{
    constructor(){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/title_screen.png");
        this.animator = new this.animator(this.spritesheet, 0,0, 272,208,1,1,true);
        this.startbutton = new menuButton(0, true);
        this.levelselect = new menuButton(1, false);
    }
    update(){
        if(document.getElementById("debug").checked){
            this.levelselect.updatable = true;
        }else{
            this.levelselect.updatable = false;
        }
    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,136,104, 272, 208);
    }
}
class menuButton{
    constructor(state, updatable){
        this.updatable = updatable;
        this.state = state;
        this.spritesheet = ASSET_MANAGER.getAsset("");
        if(this.state == 0){//start
            this.animator = new this.animator(this.spritesheet, 0,0, 5, 5,1,1,true);
        }else{//level Select
            this.animator = new this.animator(this.spritesheet, 0,0, 5, 5,1,1,true);
        }
    }
    update(){
        
    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,pos.x,pos.y, x, y);
    }
}