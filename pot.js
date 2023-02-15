class pot{
    constructor(info){
        this.tag = "prop";
        this.position = info.position;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");

        this.in_air = new In_Air(70, 100, 90, 26, 0.75);
        this.collider = new Collider(new Circle(this.transform.pos, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 48, 0, 16, 16, 1, 1, true);
        this.facing_correct_direction = false;
        this.requires_facing = true;
        this.picked_up = false;
        this.holder;
        this.thrown = false;
        this.direction;
        this.shadow = new Shadow(gameEngine, this.transform.pos);
        this.updatable = false;
    }
    update(){
        if(this.picked_up){
            if(this.holder.state == state_enum.holding && !this.holder.interacting){
                this.transform.pos.x = this.holder.transform.pos.x;
                this.transform.pos.y = this.holder.transform.pos.y;
                this.in_air.z = 15;
            }
            else if(this.holder.state == state_enum.holding && this.holder.interacting){
                // throw the pot
                this.picked_up = false;
                this.holder.idle_holding = false;
                this.holder.state = state_enum.throw;
                gameEngine.addEntity(this.shadow);
                this.thrown = true;
                this.direction = this.holder.facing;
            }
        }
        else if (this.thrown){
            in_air_jump(this, this.direction);
        }
        // set the pot down
        else if (!this.picked_up && !this.thrown && this.holder != undefined){
            switch(this.holder.facing){
                case 0: // right
                    this.transform.pos.x = this.holder.transform.pos.x + 15;
                    break;
                case 1: // left
                    this.transform.pos.x = this.holder.transform.pos.x - 15;
                    break;
                case 2: // up
                    this.transform.pos.y = this.holder.transform.pos.y - 15;
                    break;
                case 3: // down
                    this.transform.pos.y = this.holder.transform.pos.y + 15;
                    break;
            }
            this.collider.block_move = true;
            this.in_air.z = 0;
            this.holder = undefined;
        }
        
        if(this.in_air.distance_remaining <= 0){ // Break the pot
            this.thrown = false;
            this.removeFromWorld = true;
            this.shadow.removeFromWorld = true;
            this.transform.velocity.x = 0;
            this.transform.velocity.y = 0;
            this.holder = undefined;
            this.break_apart(4);
            create_item(item_enum.small_heart, this.transform.pos, 2, 0.4);
            create_item(item_enum.scale, this.transform.pos, 2, 0.3);
            create_item(item_enum.health_potion, this.transform.pos, 1, 0.15);
            create_item(item_enum.damage_potion, this.transform.pos, 1, 1);
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
            entity.held_entity = this;
            this.picked_up = true;
            this.holder = entity;
            this.collider.block_move = false;
            
        }
    }

    // Used to "split" the pot into pieces
    break_apart(count){
        for(let i = 0; i < count; i++){
            let temp_piece = new Pieces(this, i);
            gameEngine.addEntity(temp_piece);
        }
    }

    reset(){
        this.in_air.distance_remaining = this.in_air.air_distance * this.in_air.starting_percentage;
        this.transform.pos.x = this.position[0] * 16 + 8;
        this.transform.pos.y = this.position[1] * 16 + 8;
        this.picked_up = false;
        this.thrown = false;
        this.collider.block_move = true;
        if(this.removeFromWorld){
            this.removeFromWorld = false;
            gameEngine.addEntity(this);
        }
    }
}

class Pieces{
    constructor(parent, direction){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.transform = new Transform(parent.transform.pos.clone());
        this.in_air = new In_Air(53, 75, 50, 16);
        this.move_speed = 15;
        this.updatable = true;

        switch(direction){
            case 0://upper left
                this.animator = new Animator(this.spritesheet, 0, 48, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(-this.move_speed, -this.move_speed);
                break;
            case 1://upper right
                this.animator = new Animator(this.spritesheet, 8, 48, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(this.move_speed, -this.move_speed);
                break;
            case 2://lower left
                this.animator = new Animator(this.spritesheet, 0, 56, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(-this.move_speed, this.move_speed);
                break;
            case 3://lower right
                this.animator = new Animator(this.spritesheet, 8, 56, 8, 8, 1, 0.6, false);
                this.transform.velocity = new Vec2(this.move_speed, this.move_speed);
                break;
        }
    }

    update(){
        if(this.animator.done){
            this.removeFromWorld = true;
        }
        in_air_jump(this);
    }

    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 8, 8, false, true, 1);
        }
        console.log(this.in_air.z);
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.in_air.z, 8, 8);
    }
}