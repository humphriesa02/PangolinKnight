class Pangolin{
    constructor(game){
        // Game reference we pass in
        this.game = game;

        // Components
        this.transform = new Transform(new Vec2(0,0), new Vec2(0,0), 1, new Vec2(0,0));
        this.health;
        this.collider;

        // Reference to our spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sheet.png");

        // Some state variables
        this.facing = 0; // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = 1; // 0 = idle, 1 = walking
        this.dead = false;

        // Some movement variables
        this.rolling = false;
        this.walk_speed = 0.5;
        this.roll_speed = 3;

        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 3; i++){ // 2 States right now, idle and walking
        this.animations.push([]);
            for (let j = 0; j < 4; j++){ // 4 directions
                this.animations[i].push([]);
            }
        }

        // idle animation, state 0

        // facing right
        this.animations[0][0] = new Animator(this.spritesheet, 0, 96, 48, 48, 1, 0.33, true);

        // facing left
        this.animations[0][1] = new Animator(this.spritesheet, 0, 144, 48, 48, 1, 0.33, true);

        // facing up
        this.animations[0][2] = new Animator(this.spritesheet, 0, 48, 48, 48, 1, 0.33, true);

        // facing down
        this.animations[0][3] = new Animator(this.spritesheet, 0, 0, 48, 48, 1, 0.33, true);


        //walking animation, state 1

        //facing right
        this.animations[1][0] = new Animator(this.spritesheet, 0, 96, 48.25, 48, 2, 0.25, true);

        // facing left
        this.animations[1][1] = new Animator(this.spritesheet, 0, 144, 48.25, 48, 2, 0.25, true);

        // facing up
        this.animations[1][2] = new Animator(this.spritesheet, 0, 48, 48, 48, 2, 0.25, true);

        // facing down
        this.animations[1][3] = new Animator(this.spritesheet, 0, 0, 48, 48, 2, 0.25, true);

        //Rolling animations, state 2
        this.animations[2][0] = new Animator(this.spritesheet, 0, 192, 48, 48, 3, 0.1, true);

        this.animations[2][1] = new Animator(this.spritesheet, 0, 192, 48, 48, 3, 0.1, true);

        this.animations[2][2] = new Animator(this.spritesheet, 0, 192, 48, 48, 3, 0.1, true);

        this.animations[2][3] = new Animator(this.spritesheet, 0, 192, 48, 48, 3, 0.1, true);


    }

    update(){
        if(this.game.keys["r"]){
            this.rolling = !this.rolling;
        }
        // Reset velocity
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;

        // Compute direction from keypresses
        if(!this.rolling){
            this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.walk_speed);
            this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.walk_speed);
        }
        else{
            this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.roll_speed);
            this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.roll_speed);
        }
        

        // Figure out the state for animation
        if (this.transform.velocity.x == 0 && this.transform.velocity.y == 0){ // holding still
            if(this.rolling){
                this.state = 2;
            }
            else
                this.state = 0;
        }
        else{ // moving
            if(this.rolling){
                this.state = 2;
            }
            else
                this.state = 1;
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
        
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y;
    }

    draw(ctx){
        console.log("state: ", this.state, " facing: ", this.facing);
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y)
    }

    register_input(){

    }
}