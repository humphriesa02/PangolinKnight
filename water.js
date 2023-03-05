class water{
    constructor(info){
    this.tag = "prop"
    this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_entities.png");
    this.collider = new Collider(new AABB(this.transform.pos, 2.5, 2.5), false, true, true);
    this.updatable = false;

    this.loadAnimation();
}
    loadAnimation(){
        this.animator = new Animator(this.spritesheet, 96, 48, 16, 16, 1, 1, true);
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
            if(entity.can_activate_pit && entity.state != state_enum.jumping){
                let our_pos = this.transform.pos.clone();
                entity.transform.pos.x = our_pos.x;
                entity.transform.pos.y = our_pos.y;
                entity.rolling = false;
                entity.state = state_enum.falling;
                entity.shadow.active = false;
                entity.can_activate_pit = false;
                switch(entity.facing){
                    case 0: // right
                        entity.fall_reset_pos = new Vec2(our_pos.x - 20, our_pos.y);
                        break;
                    case 1:
                        entity.fall_reset_pos = new Vec2(our_pos.x + 20, our_pos.y);
                        break;
                    case 2:
                        entity.fall_reset_pos = new Vec2(our_pos.x, our_pos.y + 20);
                        break;
                    case 3:
                        entity.fall_reset_pos = new Vec2(our_pos.x, our_pos.y - 20);
                        break;           
                }
            }
        }
    }
    reset(){

    }
}


class falsefloor{
    constructor(info){
        this.tag = "prop"
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 2.5, 2.5), false, true, true);
        this.updatable = false;
    
        this.animations = [];
        this.loadAnimation();
        this.state = 0;
        this.crumble_duration = 1;
        this.crumble_end;
    }
        loadAnimation(){
            for (let i = 0; i < 2; i++){ // 4 directions
                this.animations.push([]);
            }
    
            // floor
            this.animations[0] = new Animator(this.spritesheet, 64, 16, 16, 16, 1, 1, true);
    
            // water
            this.animations[1] = new Animator(this.spritesheet, 80, 16, 16, 16, 1, 1, true);
 
        }
        update(){
            if(this.state == 0 && gameEngine.timer.gameTime >= this.crumble_end){
                this.state = 1;
            }
        }
        draw(ctx){
            if(this.updatable){
                this.animations[this.state].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
            }
        }
    
        activate(entity){
            if(entity.tag == "player"){
                if(this.state == 0){ // crumble
                    this.crumble_end = gameEngine.timer.gameTime +  this.crumble_duration;
                }
                else if(this.state == 1 && entity.can_activate_pit && entity.state != state_enum.jumping){
                    let our_pos = this.transform.pos.clone();
                    entity.transform.pos.x = our_pos.x;
                    entity.transform.pos.y = our_pos.y;
                    entity.rolling = false;
                    entity.state = state_enum.falling;
                    entity.shadow.active = false;
                    entity.can_activate_pit = false;
                    switch(entity.facing){
                        case 0: // right
                            entity.fall_reset_pos = new Vec2(our_pos.x - 20, our_pos.y);
                            break;
                        case 1:
                            entity.fall_reset_pos = new Vec2(our_pos.x + 20, our_pos.y);
                            break;
                        case 2:
                            entity.fall_reset_pos = new Vec2(our_pos.x, our_pos.y + 20);
                            break;
                        case 3:
                            entity.fall_reset_pos = new Vec2(our_pos.x, our_pos.y - 20);
                            break;           
                    }
                }
            }
        }
        reset(){
    
        }

}