class Boomerang{
    constructor(holder){
        this.tag = "prop";
        this.position = holder.transform.pos.clone();
        this.transform = new Transform(this.position.clone());
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.holder = holder;
        this.holder_facing = holder.facing;
        this.updatable = true;
        ASSET_MANAGER.autoRepeat('./sounds/Boomerang.wav');

        this.in_air = new In_Air(120, 120, 120, 12);
        this.collider = new Collider(new Circle(this.transform.pos, 5.5), false, true, false);

        this.animations = [];
        this.loadAnimations();
        this.state = 0;
        this.stuck_items = [];
    }

    loadAnimations(){
        for (let i = 0; i < 3; i++){ // 4 directions
            this.animations.push([]);
        }

        // spinning
        this.animations[0] = new Animator(this.spritesheet, 32, 32, 16, 16, 4, 0.1, true);
        // spinning
        this.animations[1] = new Animator(this.spritesheet, 32, 32, 16, 16, 4, 0.1, true);
        // stopped
        this.animations[2] = new Animator(this.spritesheet, 32, 32, 16, 16, 1, 0.33, true);
        
    }

    update(){
        // Check what state we're in
        for(let stuck_item of this.stuck_items){
            stuck_item.transform.pos.x = this.transform.pos.x;
            stuck_item.transform.pos.y = this.transform.pos.y;
        }
        if(this.in_air.distance_remaining <= 0){
            if(this.state == 0){
                this.state = 1
                this.in_air.distance_remaining = this.in_air.air_distance * this.in_air.starting_percentage;
            }
            else{
                this.end();
            }
        }
        if(this.state == 0){
            in_air_jump(this);
            switch(this.holder_facing){
                case 0:
                    this.transform.velocity.x = this.in_air.air_speed;
                    this.transform.velocity.y = 0;
                    this.transform.pos.y = this.position.y - this.in_air.z;
                    break;
                case 1:
                    this.transform.velocity.x = -(this.in_air.air_speed);
                    this.transform.pos.y = this.position.y - this.in_air.z;
                    this.transform.velocity.y = 0;
                    break;
                case 2:
                    this.transform.velocity.y = -this.in_air.air_speed;
                    this.transform.velocity.x = 0;
                    this.transform.pos.x = this.position.x - this.in_air.z;
                    break;
                case 3:
                    this.transform.velocity.y = (this.in_air.air_speed);
                    this.transform.velocity.x = 0;
                    this.transform.pos.x = this.position.x + this.in_air.z;
                    break;   
            }
        }
        else if (this.state == 1){
            in_air_jump(this);
            switch(this.holder_facing){
                case 0:
                    this.transform.velocity.x = -this.in_air.air_speed;
                    this.transform.pos.y = this.position.y + this.in_air.z;
                    break;
                case 1:
                    this.transform.velocity.x = (this.in_air.air_speed)
                    this.transform.pos.y = this.position.y + this.in_air.z;
                    break;
                case 2:
                    this.transform.velocity.y = (this.in_air.air_speed);
                    this.transform.pos.x = this.position.x + this.in_air.z;   
                    break;
                case 3:
                    this.transform.velocity.y = -this.in_air.air_speed;
                    this.transform.pos.x = this.position.x - this.in_air.z;
                    break;   
            }   
        }
        
    }
    end(){
        this.removeFromWorld = true;
        ASSET_MANAGER.pauseAsset('./sounds/Boomerang.wav');
        create_item(item_enum.boomerang, this.transform.pos, 1, 1, true);
    }

    activate(entity){
        if(entity.tag == "player" && this.state == 1){
            entity.boomerang_respawn_time = undefined;
            this.end();
        }
    }
    stick(item){
        if(!this.stuck_items.includes(item)){
            item.animations[item.item].repeat = false;
                this.stuck_items.push(item);
        }
        
    }

    draw(ctx){
        this.animations[this.state].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
}