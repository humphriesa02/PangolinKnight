class Pangolin{
    constructor(game){
        // Game reference we pass in
        this.game = game;

        // Components
        this.transform = new Transform(new Vec2(100,100), new Vec2(0,0), 1, new Vec2(0,0));
        this.health = new Health(10, 10);
        this.collider;

        // Reference to our spritesheet
        this.walk_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sheet.png");
        this.slash_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_slash_sheet.png");

        // Some state variables
        this.facing = 0; // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = 1; // 0 = idle, 1 = roll-idle, 2 = walking, 3 = rolling, 4 = sword slash
        this.dead = false;

        // Some movement variables
        this.walk_speed = 50;
        this.roll_speed = 150;

        // State change variables
        this.roll_cooldown_end = 0;
        this.attack_end_time = 0;
        this.rolling = false;
        this.attacking = false;

        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 5; i++){ // 4 States right now, idle, walking, rolling, slashing
        this.animations.push([]);
            for (let j = 0; j < 4; j++){ // 4 directions
                this.animations[i].push([]);
            }
        }

        // idle animation, state 0

        // facing right
        this.animations[0][0] = new Animator(this.walk_spritesheet, 0, 0, 16, 16, 1, 0.33, true);

        // facing left
        this.animations[0][1] = new Animator(this.walk_spritesheet, 0, 16, 16, 16, 1, 0.33, true);

        // facing up
        this.animations[0][2] = new Animator(this.walk_spritesheet, 0, 32, 16, 16, 1, 0.33, true);

        // facing down
        this.animations[0][3] = new Animator(this.walk_spritesheet, 0, 48, 16, 16, 1, 0.33, true);

        // idle-roll animation, state 1

        //facing right
        this.animations[1][0] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 1, 0.1, true);

        //facing left
        this.animations[1][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 1, 0.1, true);

        //facing up
        this.animations[1][2] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 1, 0.1, true);

        //facing down
        this.animations[1][3] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 1, 0.1, true);

        //walking animation, state 1

        //facing right
        this.animations[2][0] = new Animator(this.walk_spritesheet, 0, 0, 16, 16, 2, 0.2, true);

        // facing left
        this.animations[2][1] = new Animator(this.walk_spritesheet, 0, 16, 16, 16, 2, 0.2, true);

        // facing up
        this.animations[2][2] = new Animator(this.walk_spritesheet, 0, 32, 16, 16, 2, 0.2, true);

        // facing down
        this.animations[2][3] = new Animator(this.walk_spritesheet, 0, 48, 16, 16, 2, 0.2, true);

        //Rolling animations, state 2

        //facing right
        this.animations[3][0] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 3, 0.1, true);

        //facing left
        this.animations[3][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 3, 0.1, true);

        //facing up
        this.animations[3][2] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 3, 0.1, true);

        //facing down
        this.animations[3][3] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 3, 0.1, true);


        // Sword slash animations, state 3

        //facing right
        this.animations[4][0] = new Animator(this.slash_spritesheet, 0, 32, 16, 16, 3, 0.07, false);

        //facing left
        this.animations[4][1] = new Animator(this.slash_spritesheet, 0, 48, 16, 16, 3, 0.07, false);

        //facing up
        this.animations[4][2] = new Animator(this.slash_spritesheet, 0, 16, 16, 16, 3, 0.07, false);

        //facing down
        this.animations[4][3] = new Animator(this.slash_spritesheet, 0, 0, 16, 16, 3, 0.07, false);
    }

    update(){
        // Reset velocity
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;

        
        // Check to see if the attack animation is done
        // if it is, reset all its animation and set attacking to false
        if(this.attacking && this.animations[this.state][this.facing].done){
            for(let i = 0; i < 4; i++){
                this.animations[4][i].elapsedTime = 0;
                this.animations[4][i].done = false;
            }
            this.attacking = false;
        }

        // Rolling transition check
        if(this.game.keys["r"] && this.game.timer.gameTime >= this.roll_cooldown_end){
            this.rolling = !this.rolling;
            this.roll_cooldown_end = this.game.timer.gameTime + this.animations[3][0].totalTime;
        }

        // Sword slash check
        if(this.game.click && this.game.timer.gameTime >= this.attack_end_time){
            // Figure out which direction we are slashing in
            if(Math.abs(this.game.click.x-this.transform.pos.x) > Math.abs(this.game.click.y-this.transform.pos.y)){// X is farther
                if(this.game.click.x > this.transform.pos.x){
                    this.facing = 0;
                }
                else if(this.game.click.x < this.transform.pos.x){
                    this.facing = 1;
                }
            }
            else{
                if(this.game.click.y < this.transform.pos.y){
                    this.facing = 2;
                }
                else if(this.game.click.y > this.transform.pos.y){
                    this.facing = 3;
                }
            }

            // Initiate the sword slash
            this.attacking = true;
            let sword = new Sword(this.game, this.facing, this.transform.pos);
            this.game.addEntity(sword);
            sword.draw(this.game.ctx);
            this.attack_end_time = this.game.timer.gameTime + this.animations[3][0].totalTime;
        }

        if(this.attacking){ // If we are attacking
            this.state = 4;
        }
        else{
            // Compute direction from keypresses
            if(!this.rolling){
                this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.walk_speed*this.game.clockTick);
                this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.walk_speed*this.game.clockTick);
            }
            else{
                this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.roll_speed*this.game.clockTick);
                this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.roll_speed*this.game.clockTick);
            }

            // Figure out the state for animation
            if (this.transform.velocity.x == 0 && this.transform.velocity.y == 0){ // holding still
                if(this.rolling){ // idle rolling state
                    this.state = 1;
                }
                else
                    this.state = 0; // idle walking state
            }
            else{ // moving
                if(this.rolling){ // moving rolling state
                    this.state = 3;
                }
                else
                    this.state = 2; // moving walking state
            }
        }
        
        // Figure out the direction for animation
        if(this.transform.velocity.x > 0){ // Facing right
            this.facing = 0;
        }
        else if (this.transform.velocity.x < 0){ // Facing left
            this.facing = 1;
        }
        if (this.transform.velocity.y < 0){ // Facing up
            this.facing = 2;
        }
        else if (this.transform.velocity.y > 0){ // Facing down
            this.facing = 3;
        }
       
        // Adjust position from velocity
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y;
        
    }

    draw(ctx){
        console.log("state: ", this.state, " facing: ", this.facing);
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 64, 64)
    }
}