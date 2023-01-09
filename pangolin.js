class Pangolin{
    constructor(game){
        // Game reference we pass in
        this.game = game;

        // Components
        this.transform = new Transform(new Vec2(0,0), new Vec2(0,0), 1, new Vec2(0,0));
        this.lifespan;
        this.health;
        this.input;
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
        this.min_walk = 0.1;
        this.max_walk = 0.5;

        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations(){
        for (let i = 0; i < 2; i++){ // 2 States right now, idle and walking
        this.animations.push([]);
            for (let j = 0; j < 4; j++){ // 4 directions
                this.animations[i].push([]);
            }
        }

        // idle animation, state 0

        // facing right
        this.animations[0][0] = new Animator(this.spritesheet, 0, 48, 48, 48, 1, 0.33, true);

        // facing left
        this.animations[0][1] = new Animator(this.spritesheet, 0, 96, 48, 48, 1, 0.33, true);

        // facing up
        this.animations[0][2] = new Animator(this.spritesheet, 0, 144, 48, 48, 1, 0.33, true);

        // facing down
        this.animations[0][3] = new Animator(this.spritesheet, 0, 0, 48, 48, 1, 0.33, true);

        //walking animation, state 1

        //facing right
        this.animations[1][0] = new Animator(this.spritesheet, 0, 48, 48, 48, 2, 0.25, true);


        // facing left
        this.animations[1][1] = new Animator(this.spritesheet, 0, 96, 48, 48, 2, 0.1, true);

        // facing up
        this.animations[1][2] = new Animator(this.spritesheet, 0, 144, 48, 48, 2, 0.1, true);

        // facing down
        this.animations[1][3] = new Animator(this.spritesheet, 0, 0, 48, 48, 2, 0.1, true);


    }

    update(){
        if(Math.abs(this.transform.velocity.x) < this.min_walk && Math.abs(this.transform.velocity.y) < this.min_walk){ //
            this.state = 0;
        }
        else{
            this.state = 1;
        }
        console.log(this.state);
        // When the left key is pressed
        if(this.game.keys["ArrowLeft"]){ // left
            if(this.state == 1){ // walking
                this.transform.velocity.x -= this.walk_speed;
            } 
            else{
                this.transform.velocity.x -= this.roll_speed;
            }        
        }

        // When the right key is pressed
        if(this.game.keys["ArrowRight"]){ //Right
            if(this.state == 1){ // walking
                this.transform.velocity.x += this.walk_speed;
            } 
            else{
                this.transform.velocity.x += this.roll_speed;
            }     
        } 

        // When the down key is pressed
        if(this.game.keys["ArrowDown"]){ // down
            if(this.rolling) this.state == 1;
            else this.state == 2;
            if(this.state == 1){ // walking
                this.transform.velocity.y += this.walk_speed;
            } 
            else{
                this.transform.velocity.y += this.roll_speed;
            }        
        }

        // When the up key is pressed
        if(this.game.keys["ArrowUp"]){ // up
            if(this.rolling) this.state == 1;
            else this.state == 2;
            if(this.state == 1){ // walking
                this.transform.velocity.y -= this.walk_speed;
            } 
            else{
                this.transform.velocity.y -= this.roll_speed;
            }        
        }


        if(this.transform.velocity.x >= this.max_walk) this.transform.velocity.x = this.max_walk;
        if(this.transform.velocity.x <= -this.max_walk) this.transform.velocity.x = -this.max_walk;
        if(this.transform.velocity.y >= this.max_walk) this.transform.velocity.y = this.max_walk;
        if(this.transform.velocity.y <= -this.max_walk) this.transform.velocity.y = -this.max_walk;

        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y;
    }

    draw(ctx){
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y)
    }

    register_input(){

    }
}