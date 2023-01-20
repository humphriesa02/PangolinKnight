class Frog{
    constructor(info, scale, player){
        this.transform = new Transform(new Vec2(info[0][0] * 16 * scale, info[0][1] * 16 * scale), new Vec2(0,0), 1, new Vec2(0,0));
        this.health = new Health(10, 10);
        this.collider;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/frog_enemy.png");
        this.facing = 0;
        this.dead = false;
        this.move_speed = 18.75 * scale;
        this.move_time = 3;
        this.delay_time = 3;
        this.player = player;
        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations(){
        for (let i = 0; i < 4; i++){ // 4 directions
            this.animations.push([]);
        }

        // facing right
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 16, 16, 2, 0.33, true);

        // facing left
        this.animations[1] = new Animator(this.spritesheet, 0, 16, 16, 16, 2, 0.33, true);

        // facing up
        this.animations[2] = new Animator(this.spritesheet, 0, 32, 16, 16, 2, 0.33, true);

        // facing down
        this.animations[3] = new Animator(this.spritesheet, 0, 48, 16, 16, 2, 0.33, true);
    }
    

    update(){
        // Reset velocity
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        
        if (this.transform.pos.x < this.player.transform.pos.x && this.move_time > 0){
            this.transform.velocity.x += this.move_speed * gameEngine.clockTick;
            this.move_time -= gameEngine.clockTick;
        }
        else if (this.transform.pos.x > this.player.transform.pos.x && this.move_time > 0){
            this.transform.velocity.x -= this.move_speed * gameEngine.clockTick;
            this.move_time -= gameEngine.clockTick;
        }
        if (this.transform.pos.y < this.player.transform.pos.y && this.move_time > 0){
            this.transform.velocity.y += this.move_speed * gameEngine.clockTick;
            this.move_time -= gameEngine.clockTick;
        }
        else if (this.transform.pos.y > this.player.transform.pos.y && this.move_time > 0){
            this.transform.velocity.y -= this.move_speed * gameEngine.clockTick;
            this.move_time -= gameEngine.clockTick;
        }
        else if(this.delay_time <= 0){
            this.move_time = Math.random() * 3;
            this.delay_time = Math.random() * 3;
        }
        else{
            this.delay_time-=gameEngine.clockTick;
        }


        // Figure out the direction for animation
        if(Math.abs(this.player.transform.pos.x-(this.transform.pos.x)) > Math.abs(this.player.transform.pos.y-(this.transform.pos.y))){// X is farther
            if(this.transform.velocity.x > 0){
                this.facing = 0;
            }
            else if(this.transform.velocity.x < 0){
                this.facing = 1;
            }
        }
        else{
            if(this.transform.velocity.y < 0){
                this.facing = 2;
            }
            else if(this.transform.velocity.y > 0){
                this.facing = 3;
            }
        }

         // Adjust position from velocity
         this.transform.pos.x += this.transform.velocity.x;
         this.transform.pos.y += this.transform.velocity.y; 
    }

    draw(ctx){
        this.animations[this.facing].drawFrame(gameEngine.clockTick, ctx, this.transform.pos.x - screenX(), this.transform.pos.y - screenY(), 16 * scale, 16 * scale);
    }

}