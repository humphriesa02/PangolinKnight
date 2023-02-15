class rock{
    constructor(info){
        this.tag = "prop";
        this.position = info.position;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");

        this.in_air = new In_Air(70, 100, 90, 26, 0.75);
        this.collider = new Collider(new Circle(this.transform.pos, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 32, 48, 16, 16, 1, 1, true);
        this.facing_correct_direction = false;
        this.requires_facing = true;
        this.picked_up = false;
        this.holder;
        this.thrown = false;
        this.direction;
        this.shadow = new Shadow(gameEngine, this.transform.pos);
        this.updatable = true;
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
        if(this.in_air.distance_remaining <= 0){ // Break the pot
            this.thrown = false;
            this.shadow.removeFromWorld = true;
            this.transform.velocity.x = 0;
            this.transform.velocity.y = 0;
            this.holder = undefined;
            this.collider.block_move = true;
            this.in_air.distance_remaining = this.in_air.air_distance;
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