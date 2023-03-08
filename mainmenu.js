class mainmenu{
    constructor(){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/title_screen.png");
        this.animator = new Animator(this.spritesheet, 0,0, 272,208,1,1,true);
        this.startbutton = new menuButton(0, true, this);
        this.levelselect = new menuButton(1, false, this);
        this.updatable = true;
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
    removeMenu(){
        this.removeFromWorld = true;
        this.startbutton.removeFromWorld = true;
        this.levelselect.removeFromWorld = true;
    }
}
class menuButton{
    constructor(state, updatable, menu){
        this.updatable = updatable;
        this.state = state;
        this.menu = menu;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_play.png");
        if(this.state == 0){//start
            this.animator = new Animator(this.spritesheet, 0,0, 64, 32,1,1,true);
            this.pos = {x : 208, y : 32};
        }else if(this.state == 1){//level Select
            this.animator = new Animator(this.spritesheet, 0,0, 64, 32,1,1,true);
            this.pos = {x : 208, y : 80};
        }else{
            this.animator = new Animator(this.spritesheet, 0,0, 64, 32,1,1,true);
            this.pos = {x : roomWidth / 2, y : (roomHeight/2) + 80};
        }
    }
    update(){
        if(gameEngine.click && gameEngine.click.y < (this.pos.y + 16) * params.scale && gameEngine.click.y > (this.pos.y - 16) * params.scale){
            if(gameEngine.click.x < (this.pos.x + 32) * params.scale && gameEngine.click.x > (this.pos.x - 32) * params.scale){
                if(this.state != 3){
                    this.menu.removeMenu();
                    gameEngine.camera.loadLevel(2);
                }else{
                    this.updatable = false;
                    gameEngine.paused = false;
                }
                
            }
        }
    }
    draw(ctx){
        if(this.updatable){
            this.animator.drawFrame(gameEngine.clockTick,ctx,this.pos.x ,this.pos.y , 64, 32);
        }
    }
}