class pot{
    constructor(info){
        this.tag = "prop";
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 96, 16, 16, 16, 1, 1, true);
        this.can_be_picked_up = false;
        this.picked_up = false;
        this.holder;
        this.thrown = false;
        this.direction;
        this.throw_speed = 70;
        this.throw_time = 100;
        this.throw_distance = 90;
        this.throw_height = 26;
        this.z = 0; // Give us the impression of a "fake" throw when in top down
        this.distance_remaining;
        this.shadow = new Shadow(gameEngine, this.transform.pos);
    }
    update(){
        if(this.picked_up){
            if(this.holder.state == state_enum.holding){
                this.transform.pos = new Vec2(this.holder.transform.pos.x, this.holder.transform.pos.y);
                this.z = 15;
            }  
        }
        else if (this.thrown){
            this.in_air();
        }
        if(this.distance_remaining <= 0){ // Break the pot
            this.thrown = false;
            this.removeFromWorld = true;
            this.shadow.removeFromWorld = true;
            this.break_apart(4);
            return;
        }
        this.transform.prev_pos.x = this.transform.pos.x;
        this.transform.prev_pos.y = this.transform.pos.y
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y; 
    }
    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 16, 16, false, true, 1);
        }
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y-this.z, 16, 16);
    }

    activate(entity){
        if(entity.interacting != undefined && entity.interacting){
            
            if(this.picked_up && entity.state == state_enum.holding){
                // throw the pot
                entity.idle_holding = false;
                entity.state = state_enum.throw;
                gameEngine.addEntity(this.shadow);
                this.shadow.visible = true;
                this.thrown = true;
                this.direction = entity.facing;
                this.picked_up = false;
            }
            else{
                // Only pick up if the player is facing the pot
                let facing = entity.facing;
                switch(facing){
                    // right
                    case 0: if(this.transform.pos.x > entity.transform.pos.x) {this.can_be_picked_up = true;}
                        break;
                    // left
                    case 1: if(this.transform.pos.x < entity.transform.pos.x) {this.can_be_picked_up = true;}
                        break;
                    // up
                    case 2: if(this.transform.pos.y < entity.transform.pos.y) {this.can_be_picked_up = true;}
                        break;
                    // down
                    case 3: if(this.transform.pos.y > entity.transform.pos.y) {this.can_be_picked_up = true;}
                        break;
                }
                // pick up the pot
                if(this.can_be_picked_up && entity.rolling != undefined && !entity.rolling && entity.state != state_enum.pickup){
                    entity.state = state_enum.pickup;
                    this.picked_up = true;
                    this.distance_remaining = this.throw_distance * 0.75;
                    this.holder = entity;
                }
                
            }
        }
    }

    in_air(){
        switch(this.direction){
            case 0:
                this.transform.velocity.x = this.throw_speed * gameEngine.clockTick;
                break;
            case 1:
                this.transform.velocity.x = -(this.throw_speed * gameEngine.clockTick)
                break;
            case 2:
                this.transform.velocity.y = -this.throw_speed * gameEngine.clockTick;
                break;
            case 3:
                this.transform.velocity.y = (this.throw_speed * gameEngine.clockTick)
                break;
                    
        }
        this.distance_remaining = Math.max(0, this.distance_remaining - this.throw_time * gameEngine.clockTick);
        this.z = Math.sin(((this.distance_remaining / this.throw_distance) * Math.PI)) * this.throw_height;
    }

    break_apart(count){
        for(let i = 0; i < count; i++){
            let temp_piece = new Pieces(this, i);
            gameEngine.addEntity(temp_piece);
        }
    }
}

class Pieces{
    constructor(parent, direction){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        let piece_pos = Object.assign({},parent.transform.pos);
        this.transform = new Transform(piece_pos);
        this.lifespan = new Lifespan(0.1, gameEngine.timer.gameTime);
        this.move_speed = 15;

        this.throw_speed = 53;
        this.throw_time = 75;
        this.throw_distance = 50;
        this.throw_height = 16;
        this.z = 0; // Give us the impression of a "fake" throw when in top down
        this.distance_remaining = this.throw_distance;
        switch(direction){
            case 0://upper left
                this.animator = new Animator(this.spritesheet, 0, 96, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(-this.move_speed, -this.move_speed);
                break;
            case 1://upper right
                this.animator = new Animator(this.spritesheet, 8, 96, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(this.move_speed, -this.move_speed);
                break;
            case 2://lower left
                this.animator = new Animator(this.spritesheet, 0, 104, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(-this.move_speed, this.move_speed);
                break;
            case 3://lower right
                this.animator = new Animator(this.spritesheet, 8, 104, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(this.move_speed, this.move_speed);
                break;
        }
    }

    update(){
        if(this.animator.done){
            this.removeFromWorld = true;
        }
        this.in_air();
        this.transform.prev_pos.x = this.transform.pos.x;
        this.transform.prev_pos.y = this.transform.pos.y
        this.transform.pos.x += this.transform.velocity.x * gameEngine.clockTick;
        this.transform.pos.y += this.transform.velocity.y * gameEngine.clockTick;
    }

    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 8, 8, false, true, 1);
        }
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.z, 8, 8);
    }

    in_air(){
        switch(this.direction){
            case 0:
                this.transform.velocity.x = this.throw_speed * gameEngine.clockTick;
                break;
            case 1:
                this.transform.velocity.x = -(this.throw_speed * gameEngine.clockTick)
                break;
            case 2:
                this.transform.velocity.y = -this.throw_speed * gameEngine.clockTick;
                break;
            case 3:
                this.transform.velocity.y = (this.throw_speed * gameEngine.clockTick)
                break;
                    
        }
        this.distance_remaining = Math.max(0, this.distance_remaining - this.throw_time * gameEngine.clockTick);
        this.z = Math.sin(((this.distance_remaining / this.throw_distance) * Math.PI)) * this.throw_height;
    }
}