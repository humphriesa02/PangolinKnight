class Pangolin{
    constructor(){
        // Game reference we pass in
        this.game = gameEngine;

        // Components
        this.tag = "player";

        this.transform = new Transform(new Vec2(24, 40), 1, new Vec2(0,0));
        this.health = new Health(10, 10);
        this.collider = new Collider(new Circle(this.transform.pos, 7.5), true, true, false);
        this.invincible = new Invincible();
        this.gravity = new Gravity();
        this.shadow = new Shadow(this.game, this.transform.pos);

        // Reference to our spritesheet
        this.walk_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sheet.png");
        this.slash_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_slash_sheet.png");

        // Some state variables
        this.facing = 0; // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = state_enum.idle; // 0 = idle, 1= walking, 2 = sword slash,
                                      // 3 = jumping, 4 = picking up, 5 = holding, 6 = throwing, 7 = hold-idle

        // Some movement variables
        this.walk_speed = 35;
        this.roll_speed = 75;

        // Jump variables
        this.jump_speed = 53;
        this.jump_time = 100;
        this.jump_distance = 60;
        this.jump_height = 30;
        this.z = 0; // Give us the impression of a "fake" jump when in top down
        this.distance_remaining;
        this.grounded = true;

        // State change variables
        this.roll_cooldown_end = 0;
        this.attack_cooldown_end = 0;
        this.jump_cooldown_end = 0;
        this.interaction_cooldown_end = 0;
        this.interaction_end = 0;

        // Flag variables
        this.rolling = false;
        this.idle_holding = false;
        this.animation_modifier = 0; // Used for extra modifications to animations we don't want to make states for.
                                     // Factor in rolling here, as well as holding idle
        this.interacting = false; // Used for collision based interactions with other entities
        this.interaction_cooldown_duration = 0.5;
        this.interaction_duration = 0.01;

        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 8; i++){ // 4 States, idle, moving, slashing, jumping
            this.animations.push([]);
            for (let j = 0; j < 4; j++){ // 4 directions
                this.animations[i].push([]);
                for(let k = 0; k < 2; k++){ // Swapping between rolling and not rolling
                    this.animations[i][j].push([]);
                }
            }
        }

        /* State 0, idle animation */

        // Non-rolling
        // facing right
        this.animations[0][0][0] = new Animator(this.walk_spritesheet, 0, 0, 16, 16, 1, 0.33, true);

        // facing left
        this.animations[0][1][0] = new Animator(this.walk_spritesheet, 0, 16, 16, 16, 1, 0.33, true);

        // facing up
        this.animations[0][2][0] = new Animator(this.walk_spritesheet, 0, 32, 16, 16, 1, 0.33, true);

        // facing down
        this.animations[0][3][0] = new Animator(this.walk_spritesheet, 0, 48, 16, 16, 1, 0.33, true);

        //Rolling
        //facing right
        this.animations[0][0][1] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 1, 1, true);

        //facing left
        this.animations[0][1][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 1, 1, true);

        //facing up
        this.animations[0][2][1] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 1, 1, true);

        //facing down
        this.animations[0][3][1] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 1, 1, true);


        /* State 1, Moving animation */

        //Non-rolling
        //facing right
        this.animations[1][0][0] = new Animator(this.walk_spritesheet, 0, 0, 16, 16, 2, 0.2, true);

        // facing left
        this.animations[1][1][0] = new Animator(this.walk_spritesheet, 0, 16, 16, 16, 2, 0.2, true);

        // facing up
        this.animations[1][2][0] = new Animator(this.walk_spritesheet, 0, 32, 16, 16, 2, 0.2, true);

        // facing down
        this.animations[1][3][0] = new Animator(this.walk_spritesheet, 0, 48, 16, 16, 2, 0.2, true);
        
        //Rolling
        //facing right
        this.animations[1][0][1] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 3, 0.1, true);

        //facing left
        this.animations[1][1][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 3, 0.1, true);

        //facing up
        this.animations[1][2][1] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 3, 0.1, true);

        //facing down
        this.animations[1][3][1] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 3, 0.1, true);


        /* State 2, Sword slash animations */

        //facing right
        this.animations[2][0][0] = new Animator(this.slash_spritesheet, 0, 32, 16, 16, 4, 0.05, false);

        //facing left
        this.animations[2][1][0] = new Animator(this.slash_spritesheet, 0, 48, 16, 16, 4, 0.05, false);

        //facing up
        this.animations[2][2][0] = new Animator(this.slash_spritesheet, 0, 16, 16, 16, 4, 0.05, false);

        //facing down
        this.animations[2][3][0] = new Animator(this.slash_spritesheet, 0, 0, 16, 16, 4, 0.05, false);

        // rolling
        //facing right
        this.animations[2][0][1] = new Animator(this.slash_spritesheet, 0, 32, 16, 16, 4, 0.05, false);

        //facing left
        this.animations[2][1][1] = new Animator(this.slash_spritesheet, 0, 48, 16, 16, 4, 0.05, false);

        //facing up
        this.animations[2][2][1] = new Animator(this.slash_spritesheet, 0, 16, 16, 16, 4, 0.05, false);

        //facing down
        this.animations[2][3][1] = new Animator(this.slash_spritesheet, 0, 0, 16, 16, 4, 0.05, false);


        /* State 3, Jump animations */

        //non-rolling
        //facing right
        this.animations[3][0][0] = new Animator(this.walk_spritesheet, 0, 128, 16, 16, 3, 0.2, true);

        //facing left
        this.animations[3][1][0] = new Animator(this.walk_spritesheet, 0, 144, 16, 16, 3, 0.2, true);

        //facing up
        this.animations[3][2][0] = new Animator(this.walk_spritesheet, 0, 160, 16, 16, 3, 0.2, true);

        //facing down
        this.animations[3][3][0] = new Animator(this.walk_spritesheet, 0, 176, 16, 16, 3, 0.2, true);

        //rolling
        //facing right
        this.animations[3][0][1] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 3, 0.1, true);

        //facing left
        this.animations[3][1][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 3, 0.1, true);

        //facing up
        this.animations[3][2][1] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 3, 0.1, true);

        //facing down
        this.animations[3][3][1] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 3, 0.1, true);

        /* State 4, picking up */
        this.animations[4][0][0] = new Animator(this.walk_spritesheet, 0, 208, 16, 16, 2, 0.2, false);

        //facing left
        this.animations[4][1][0] = new Animator(this.walk_spritesheet, 0, 224, 16, 16, 2, 0.2, false);

        //facing up
        this.animations[4][2][0] = new Animator(this.walk_spritesheet, 0, 240, 16, 16, 2, 0.2, false);

        //facing down
        this.animations[4][3][0] = new Animator(this.walk_spritesheet, 0, 256, 16, 16, 2, 0.2, false);

        /* State 5, holding */
        this.animations[5][0][0] = new Animator(this.walk_spritesheet, 32, 208, 16, 16, 2, 0.2, true);

        //facing left
        this.animations[5][1][0] = new Animator(this.walk_spritesheet, 32, 224, 16, 16, 2, 0.2, true);

        //facing up
        this.animations[5][2][0] = new Animator(this.walk_spritesheet, 16, 240, 16, 16, 2, 0.2, true);

        //facing down
        this.animations[5][3][0] = new Animator(this.walk_spritesheet, 16, 256, 16, 16, 2, 0.2, true);

        /* State 5, holding - idle */
        this.animations[5][0][2] = new Animator(this.walk_spritesheet, 32, 208, 16, 16, 1, 0.2, true);

        //facing left
        this.animations[5][1][2] = new Animator(this.walk_spritesheet, 32, 224, 16, 16, 1, 0.2, true);

        //facing up
        this.animations[5][2][2] = new Animator(this.walk_spritesheet, 16, 240, 16, 16, 1, 0.2, true);

        //facing down
        this.animations[5][3][2] = new Animator(this.walk_spritesheet, 16, 256, 16, 16, 1, 0.2, true);

        /* State 6, throwing */
        //facing right
        this.animations[6][0][0] = new Animator(this.slash_spritesheet, 16, 32, 16, 16, 1, 0.3, false);

        //facing left
        this.animations[6][1][0] = new Animator(this.slash_spritesheet, 16, 48, 16, 16, 1, 0.3, false);

        //facing up
        this.animations[6][2][0] = new Animator(this.slash_spritesheet, 16, 16, 16, 16, 1, 0.3, false);

        //facing down
        this.animations[6][3][0] = new Animator(this.slash_spritesheet, 16, 0, 16, 16, 1, 0.3, false);
        
    }

    update(){
        if(this.invincible.active){
            invulnerability_active(this);
        }
        this.check_state_end();
        this.input();
        this.movement();
        // top down jump
        if(!gameEngine.gravity && this.state == state_enum.jumping){
            this.jump_path();
        }
    }

    draw(ctx){
        // Determine if we have modifiers
        if(this.rolling){
            this.animation_modifier = 1;
        }
        else if (this.idle_holding){
            this.animation_modifier = 2;
        }
        else{
            this.animation_modifier = 0;
        }
        this.animations[this.state][this.facing][this.animation_modifier].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y - this.z, 16, 16, this.invincible.inverted);
    }

    // Check for state end
    check_state_end(){
        // Check if slashing is done
        if(this.state == state_enum.slashing && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.slashing][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.slashing][i][this.rolling ? 1 : 0].done = false;
            }
            this.state = state_enum.idle;
        }
        else if(this.state == state_enum.slashing && !this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            return;
        }
        // Check if jump end
        else if(this.state == state_enum.jumping){
            if((!gameEngine.gravity && this.distance_remaining <= 1) || (gameEngine.gravity && this.grounded)){
                for(let i = 0; i < 4; i++){
                    this.animations[state_enum.jumping][i][this.rolling ? 1 : 0].elapsedTime = 0;
                    this.animations[state_enum.jumping][i][this.rolling ? 1 : 0].done = false;
                }
                //this.z = 0;
                this.shadow.visible = false;
                this.state = state_enum.idle;
            }
        }
        else if (this.state == state_enum.pickup && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            this.state = state_enum.holding;
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.pickup][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.pickup][i][this.rolling ? 1 : 0].done = false;
            }
        }
        else if (this.state == state_enum.throw && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            this.state = state_enum.idle;
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.throw][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.throw][i][this.rolling ? 1 : 0].done = false;
            }
        }
    }

    // Get input
    input(){
        if(this.game.keys["e"] && !this.interacting && this.game.timer.gameTime >= this.interaction_cooldown_end){
            this.interacting = true;
            this.interaction_cooldown_end = this.game.timer.gameTime + this.interaction_cooldown_duration;
        }else if (this.interacting && this.game.timer.gameTime >= this.interaction_end){
            this.interacting = false;
            this.interaction_end = this.game.timer.gameTime + this.interaction_duration;
        }

        // Rolling transition check
        if(this.game.keys["r"] && this.game.timer.gameTime >= this.roll_cooldown_end && this.state != state_enum.holding){
            this.rolling = !this.rolling;
            this.roll_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.walking][0][this.rolling ? 1 : 0].totalTime;
        }

        //Jump check
        if(this.game.keys[" "] && this.game.timer.gameTime >= this.jump_cooldown_end && this.state != state_enum.jumping && this.state != state_enum.holding){ //Pressing space
            this.jump();
            this.shadow.visible = true;
            this.distance_remaining = this.jump_distance;
            this.jump_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.jumping][0][this.rolling ? 1 : 0].totalTime;
        }

        

        // Sword slash check
        if(this.game.click && this.game.timer.gameTime >= this.attack_cooldown_end && this.state != state_enum.jumping && this.state != state_enum.holding){
            // Figure out which direction we are slashing in
            if(Math.abs( this.game.click.x - convertToScreenPos(this.transform.pos.x, 0).x ) > Math.abs( this.game.click.y - convertToScreenPos(0, this.transform.pos.y).y )){// X is farther
                if( this.game.click.x > convertToScreenPos(this.transform.pos.x, 0).x){
                    this.facing = 0;
                }
                else if( this.game.click.x < convertToScreenPos(this.transform.pos.x, 0).x){
                    this.facing = 1;
                }
            }
            else{
                if( this.game.click.y < convertToScreenPos(0, this.transform.pos.y).y ){
                    this.facing = 2;
                }
                else if( this.game.click.y > convertToScreenPos(0, this.transform.pos.y).y){
                    this.facing = 3;
                }
            }

            // Initiate the sword slash
            this.state = state_enum.slashing;
            this.rolling = false;
            let sword = new Sword(this.game, this.facing, this.transform.pos, this);
            this.game.addEntity(sword);
            this.attack_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.slashing][0][this.rolling ? 1 : 0].totalTime;
        }
    }

    // Move player
    movement(){
        if (this.knockback !== undefined){
            if(gameEngine.timer.gameTime >= this.knockback.knockback_end_time){
                this.knockback = undefined;
            }
        }
        else if(this.state == state_enum.pickup || this.state == state_enum.throw){this.transform.velocity.x = 0; this.transform.velocity.y = 0;}
        else{
            this.transform.velocity.x = 0;
            this.transform.velocity.y = 0;
            if(this.state !== state_enum.slashing){
                this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * (this.rolling ? this.roll_speed : this.walk_speed));
                this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * (this.rolling ? this.roll_speed : this.walk_speed));
           
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
            }
          
            if(this.state != state_enum.jumping && this.state != state_enum.slashing && this.state != state_enum.holding){
                if (this.transform.velocity.x == 0 && this.transform.velocity.y == 0){
                    this.state = state_enum.idle; // idle state
                }
                else{ // moving
                    this.state = state_enum.walking; // moving state
                }
            }
            else if (this.state == state_enum.holding){
                if(this.transform.velocity.x == 0 && this.transform.velocity.y == 0) {this.idle_holding = true;}
                else{ this.idle_holding = false }
            }
        }
    }

    // Initiate jump - called once. All that's needed for platformer
    jump(){
        this.state = state_enum.jumping;
        if(gameEngine.gravity){
            this.gravity.velocity = -2;
            this.grounded = false;
        }
    }

    // Jump animation, called for top down view every frame
    jump_path(){
        this.distance_remaining = Math.max(0, this.distance_remaining - this.jump_time * gameEngine.clockTick);
        this.z = Math.sin(((this.distance_remaining / this.jump_distance) * Math.PI)) * this.jump_height;
    }
}

// simple class to draw shadow below player feet
class Shadow{
    constructor(game, player_pos, size = 16){
        Object.assign(this, {game, player_pos, size});

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_shadow.png");

        this.animation = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 0.3, true);

        this.visible = false;
    }

    update(){ }

    draw(ctx){
        if(this.visible){
            this.animation.drawFrame(this.game.clockTick, ctx, this.player_pos.x, this.player_pos.y, this.size, this.size);
        }
        
    }

}