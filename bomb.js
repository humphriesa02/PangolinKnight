class Bomb{
    constructor(holder){
        this.tag = "prop";
        this.transform = new Transform(new Vec2(0, 0), 1, new Vec2(0,0));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        ASSET_MANAGER.autoRepeat('./sounds/Fuse.mp3');

        this.in_air = new In_Air(120, 100, 90, 26, 0.75);
        this.collider = new Collider(new Circle(this.transform.pos, 8), false, true, false);

        this.state = 0; // States- 0: normal, 1: close to explode
        this.animations = [];
        this.loadAnimations();
        this.picked_up = true;
        this.holder = holder;
        this.thrown = false;
        this.direction;
        this.shadow = new Shadow(gameEngine, this.transform.pos);
        this.updatable = true;
        this.total_time = gameEngine.timer.gameTime + 5;
        this.normal_time = gameEngine.timer.gameTime + 2.5;
    }
    loadAnimations(){
        for (let i = 0; i < 2; i++){ // 4 directions
            this.animations.push([]);
        }

        // normal
        this.animations[0] = new Animator(this.spritesheet, 48, 48, 16, 16, 1, 0.33, true);
        // close to explode
        this.animations[1] = new Animator(this.spritesheet, 48, 48, 16, 16, 2, 0.33, true);
    }
    update(){
        if(gameEngine.timer.gameTime >= this.normal_time && gameEngine.timer.gameTime < this.total_time){
            this.state = 1;
        }
        else if(gameEngine.timer.gameTime >= this.total_time){
            ASSET_MANAGER.playAsset('./sounds/Bomb_Explode.wav');
            ASSET_MANAGER.pauseAsset('./sounds/Fuse.mp3');
            this.explode();
        }
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
                this.holder.held_entity = undefined;
                this.holder.state = state_enum.throw;
                if(gameEngine.gravity){
                    gameEngine.addEntity(this.shadow);
                }else{
                    gameEngine.camera.rooms[Math.floor(this.transform.pos.x/roomWidth)][Math.floor(this.transform.pos.y/roomHeight)].addEntity(this.shadow);
                }
                this.thrown = true;
                this.direction = this.holder.facing;
            }
        }
        else if (this.thrown){
            in_air_jump(this, this.direction);
        }
        // set the pot down
        else if (!this.picked_up && !this.thrown && this.holder != undefined){
            this.move_off_holder();
            this.in_air.z = 0;
            this.holder = undefined;
        } 
        if(this.in_air.distance_remaining <= 0){ // stop moving
            this.stop();
            return;
        }  
    }

    stop(){
        this.thrown = false;
        this.shadow.removeFromWorld = true;
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        this.holder = undefined;
    }

    explode(){
        let explosion = new Explosion(this, this.in_air.z, true);
        if(gameEngine.gravity){
            gameEngine.addEntity(explosion);
        }else{
            gameEngine.camera.rooms[Math.floor(explosion.transform.pos.x/roomWidth)][Math.floor(explosion.transform.pos.y/roomHeight)].addEntity(explosion);
        }
        if(this.picked_up){
            this.picked_up = false;
            this.holder.idle_holding = false;
            this.holder.held_entity = undefined;
            this.holder.state = state_enum.idle;
        }
        this.stop();
        this.removeFromWorld = true;
    }
    activate(){

    }
    move_off_holder() {
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
    }
    draw(ctx){
        this.animations[this.state].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y-this.in_air.z, 16, 16);
    }
}