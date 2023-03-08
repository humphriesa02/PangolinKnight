class pit{
    constructor(info){
    this.tag = "prop"
    this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
    if(gameEngine.gravity){
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), false, true, true);
        this.updatable = true;
    }
    else{
        this.collider = new Collider(new AABB(this.transform.pos, 2.5, 2.5), false, true, true);
        this.updatable = false;
    }
    

    this.loadAnimation(info.state)
}
    loadAnimation(state){
        switch(state){
            case 0:
                this.animator = new Animator(this.spritesheet, 96, 0, 16, 16, 1, 1, true);
                break;
            case 1:
                this.animator = new Animator(this.spritesheet, 96, 16, 16, 16, 1, 1, true);
                break;
            case 2:
                this.animator = new Animator(this.spritesheet, 96, 32, 16, 16, 1, 1, true);
        }

    }
    update(){

    }
    draw(ctx){
        if(this.updatable){
            this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
        }
    }

    activate(entity){
        if(entity.tag == "player"){
            if(entity.can_activate_pit){
                if(gameEngine.gravity || entity.state != state_enum.jumping){
                    ASSET_MANAGER.playAsset("./sounds/Fall.wav")
                    let our_pos = this.transform.pos.clone();
                    if(gameEngine.gravity && entity.fall_reset_pos == undefined){
                        entity.fall_reset_pos = new Vec2(gameEngine.camera.level.start[0] * 16 + 8, gameEngine.camera.level.start[1] * 16 + 8);
                    }
                    else{
                        if(Math.abs( entity.transform.pos.x - this.transform.pos.x) > Math.abs( entity.transform.pos.y - this.transform.pos.y )){// X is farther
                            if( entity.transform.pos.x < this.transform.pos.x){
                                entity.fall_reset_pos = new Vec2(our_pos.x - 17, our_pos.y);
                            }
                            else if(entity.transform.pos.x > this.transform.pos.x){
                                entity.fall_reset_pos = new Vec2(our_pos.x + 17, our_pos.y);
                            }
                        }
                        else{
                            if( entity.transform.pos.y > this.transform.pos.y){
                                entity.fall_reset_pos = new Vec2(our_pos.x, our_pos.y + 17);
                            }
                            else if( entity.transform.pos.y < this.transform.pos.y){
                                entity.fall_reset_pos = new Vec2(our_pos.x, our_pos.y - 17);
                            }
                        }
                    }
                    entity.transform.pos.x = our_pos.x;
                    entity.transform.pos.y = our_pos.y;
                    entity.rolling = false;
                    entity.state = state_enum.falling;
                    entity.shadow.active = false;
                    entity.can_activate_pit = false;
                } 
            }
        }
    }

    reset(){

    }
}