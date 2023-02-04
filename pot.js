class pot{
    constructor(info){
        this.tag = "prop";
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");

        this.in_air = new In_Air(70, 100, 90, 26, 0.75);
        this.collider = new Collider(new Circle(this.transform.pos, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 96, 16, 16, 16, 1, 1, true);
        this.facing_correct_direction = false;
        this.requires_facing = true;
        this.picked_up = false;
        this.holder;
        this.thrown = false;
        this.direction;
        this.shadow = new Shadow(gameEngine, this.transform.pos);
    }
    update(){
        if(this.picked_up){
            if(this.holder.state == state_enum.holding && !this.holder.interacting){
                this.transform.pos.x = this.holder.transform.pos.x;
                this.transform.pos.y = this.holder.transform.pos.y;
                this.z = 15;
            }
            else if(this.holder.state == state_enum.holding && this.holder.interacting){
                // throw the pot
                this.picked_up = false;
                this.holder.idle_holding = false;
                this.holder.state = state_enum.throw;
                gameEngine.addEntity(this.shadow);
                this.shadow.visible = true;
                this.thrown = true;
                this.direction = this.holder.facing;
            }
        }
        else if (this.thrown){
            in_air_jump(this, this.direction);
        }
        if(this.in_air.distance_remaining <= 0){ // Break the pot
            this.thrown = false;
            this.removeFromWorld = true;
            this.shadow.removeFromWorld = true;
            this.break_apart(4);
            create_item(item_enum.small_heart, this.transform.pos, 2, 0.3);
            return;
        }
        this.transform.prev_pos.x = this.transform.pos.x;
        this.transform.prev_pos.y = this.transform.pos.y
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y; 
    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y-this.in_air.z, 16, 16);
    }

    activate(entity){
        if(entity.interacting != undefined && entity.interacting && 
            entity.state != state_enum.pickup && entity.state != state_enum.throw &&
            entity.state != state_enum.holding && !entity.rolling){
            
            entity.state = state_enum.pickup;
            this.picked_up = true;
            this.distance_remaining = this.throw_distance * 0.75;
            this.holder = entity;
            this.collider.block_move = false;
            
        }
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
        this.transform = new Transform(parent.transform.pos.clone());
        this.lifespan = new Lifespan(0.1, gameEngine.timer.gameTime);
        this.in_air = new In_Air(53, 75, 50, 16);
        this.move_speed = 15;

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
        in_air_jump(this, -1);
    }

    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 8, 8, false, true, 1);
        }
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.in_air.z, 8, 8);
    }
}