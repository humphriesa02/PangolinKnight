class pot{
    constructor(position){
        this.tag = "prop";
        this.transform = new Transform(new Vec2(position[0] * 16 + 8, position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 96, 16, 16, 16, 1, 1, true);
        this.picked_up = false;
        this.holder;
        this.thrown = false;
        this.direction;
        this.throw_speed = 53;
        this.throw_time = 100;
        this.throw_distance = 60;
        this.throw_height = 32;
        this.z = 0; // Give us the impression of a "fake" throw when in top down
        this.distance_remaining = this.throw_distance;
    }
    update(){
        if(this.picked_up){
            this.transform.pos = new Vec2(this.holder.transform.pos.x, this.holder.transform.pos.y - 16);
        }
        else if (this.thrown){
            this.in_air();
        }
        this.transform.prev_pos.x = this.transform.pos.x;
        this.transform.prev_pos.y = this.transform.pos.y
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y; 
    }
    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.z, 16, 16);
        draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 16, 16, false, true, 1);
    }

    activate(entity){
        if(entity.interacting != undefined && entity.interacting){
            if(this.picked_up){
                console.log("throw");
                // throw the pot
                entity.state = state_enum.throw;
                this.picked_up = false;
                this.thrown = true;
                this.direction = entity.facing;
            }
            else{
                // pick up the pot
                entity.state = state_enum.holding;
                this.picked_up = true;
                this.distance_remaining = this.throw_distance;
                this.holder = entity;
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
}