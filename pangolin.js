class Pangolin{
    constructor(){
        // Game reference we pass in
        this.game = gameEngine;

        // Components
        this.tag = "player";
        this.transform = new Transform(new Vec2(16, 32), new Vec2(0,0), 1, new Vec2(0,0));
        this.health = new Health(3, 3);
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);
        this.knockback = new Knockback();
        this.invincible = new Invincible();
        this.gravity = new Gravity();
        this.shadow = new Shadow(this.game, this.transform.pos);

        // Reference to our spritesheet
        this.walk_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sheet.png");
        this.slash_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_slash_sheet.png");

        // Some state variables
        this.facing = 0; // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = state_enum.idle; // 0 = idle, 1 = roll-idle, 2 = walking, 3 = rolling, 4 = sword slash
        this.dead = false;

        // Some movement variables
        this.walk_speed = 12.5;
        this.roll_speed = 50;

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
        this.attack_end_time = 0;
        this.jump_cooldown_end = 0;

        // Flag variables
        
        this.rolling = false;

        // Animations
        this.animations = [];
        this.loadAnimations();

        // Taking damage
        this.invulnerable = false;
        this.inverted = false;
        this.invulnerable_time = 0.15;
        this.switch_time = 0.1;
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 6; i++){ // 4 States, idle, walking, slashing, jumping
            this.animations.push([]);
            for (let j = 0; j < 4; j++){ // 4 directions
                this.animations[i].push([]);
                for(let k = 0; k < 2; k++){ // Swapping between rolling and not rolling
                    this.animations[i][j].push([]);
                }
            }
        }

        // idle animation, state 0

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


        //Moving animation, state 2

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


        // Sword slash animations, state 4

        //facing right
        this.animations[2][0][0] = new Animator(this.slash_spritesheet, 0, 32, 16, 16, 4, 0.065, false);

        //facing left
        this.animations[2][1][0] = new Animator(this.slash_spritesheet, 0, 48, 16, 16, 4, 0.065, false);

        //facing up
        this.animations[2][2][0] = new Animator(this.slash_spritesheet, 0, 16, 16, 16, 4, 0.065, false);

        //facing down
        this.animations[2][3][0] = new Animator(this.slash_spritesheet, 0, 0, 16, 16, 4, 0.065, false);

        // rolling
        //facing right
        this.animations[2][0][1] = new Animator(this.slash_spritesheet, 0, 32, 16, 16, 4, 0.065, false);

        //facing left
        this.animations[2][1][1] = new Animator(this.slash_spritesheet, 0, 48, 16, 16, 4, 0.065, false);

        //facing up
        this.animations[2][2][1] = new Animator(this.slash_spritesheet, 0, 16, 16, 16, 4, 0.065, false);

        //facing down
        this.animations[2][3][1] = new Animator(this.slash_spritesheet, 0, 0, 16, 16, 4, 0.065, false);


        // Jump animations, state 5

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
        this.animations[3][0][1] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 3, 0.1, true);

        //facing left
        this.animations[3][1][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 3, 0.1, true);

        //facing up
        this.animations[3][2][1] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 3, 0.1, true);

        //facing down
        this.animations[3][3][1] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 3, 0.1, true);
    }

    update(){
    
        console.log(this.state);

        if(this.invincible.active){
            invulnerability_active(this);
        }
        this.check_input();
        this.check_animation_end();
        this.movement();
        // top down jump
        if(!gameEngine.gravity && this.state == state_enum.jumping){
            this.jump_path();
        }
    }

    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 16, 16, false, true, 1);
        }
        this.animations[this.state][this.facing][this.rolling ? 1 : 0].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y - this.z, 16, 16, this.invincible.inverted);
    }

    jump(){
        this.state = state_enum.jumping;
        if(gameEngine.gravity){
            this.gravity.velocity = -2;
            this.grounded = false;
        }
    }

    jump_path(){
        console.log("We jumped");
        switch(this.facing){
            case 0:
                this.transform.velocity.x = this.jump_speed * this.game.clockTick;
                break;
            case 1:
                this.transform.velocity.x = -(this.jump_speed * this.game.clockTick)
                break;
            case 2:
                this.transform.velocity.y = -this.jump_speed * this.game.clockTick;
                break;
            case 3:
                this.transform.velocity.y = (this.jump_speed * this.game.clockTick)
                break;
                    
        }
        this.distance_remaining = Math.max(0, this.distance_remaining - this.jump_time * gameEngine.clockTick);
        this.z = Math.sin(((this.distance_remaining / this.jump_distance) * Math.PI)) * this.jump_height;
        console.log("z", this.z);   
    }

    // ----------- This section is dedicated to checking for specific key presses in order to change states ---- //
    // -----------  we do not actually change states here, just set booleans. I.e. "attacking" ------------------ //
    check_input(){
        // Rolling transition check
        if(this.game.keys["r"] && this.game.timer.gameTime >= this.roll_cooldown_end){
            this.rolling = !this.rolling;
            this.roll_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.walking][0][this.rolling ? 1 : 0].totalTime;
        }

        //Jump check
        if(this.game.keys[" "] && this.game.timer.gameTime >= this.jump_cooldown_end && this.state != state_enum.jumping){ //Pressing space
            this.jump();
            this.shadow.visible = true;
            this.distance_remaining = this.jump_distance;
            this.jump_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.jumping][0][this.rolling ? 1 : 0].totalTime;
        }

        

        // Sword slash check
        if(this.game.click && this.game.timer.gameTime >= this.attack_end_time){
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
            this.attack_end_time = this.game.timer.gameTime + this.animations[state_enum.slashing][0][this.rolling ? 1 : 0].totalTime;
        }
    }

    // ----------- This section is dedicated for seeing if we have finished an animation ---- //
    // ----------- i.e., to check if we have finished sword slashing or jumping ------------- //
    check_animation_end(){
        // Check to see if the flag boolean state animation is done
        // if it is, reset all its animation and set the flag to false
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

    }

    movement(){
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;

        if(this.state !== state_enum.slashing && !this.knockback.active){
            this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * (this.rolling ? this.roll_speed : this.walk_speed) *this.game.clockTick);
            this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * (this.rolling ? this.roll_speed : this.walk_speed)*this.game.clockTick);
        }
        else if (this.knockback.active){
            knockback(this);
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

        if(this.state != state_enum.jumping && this.state != state_enum.slashing){
            if (this.transform.velocity.x == 0 && this.transform.velocity.y == 0){
                this.state = state_enum.idle; // idle state
            }
            else{ // moving
                this.state = state_enum.walking; // moving state
            }
        }

        // Adjust where our actual game object is located in the world. -- //

        this.transform.velocity.y += this.gravity.velocity;
        // Adjust position from velocity
        this.transform.prev_pos.x = this.transform.pos.x;
        this.transform.prev_pos.y = this.transform.pos.y
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y; 
        
    }
}

// simple class to draw shadow below player feet
class Shadow{
    constructor(game, player_pos){
        Object.assign(this, {game, player_pos});

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_shadow.png");

        this.animation = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 0.3, true);

        this.visible = false;
    }

    update(){ }

    draw(ctx){
        if(this.visible){
            this.animation.drawFrame(this.game.clockTick, ctx, this.player_pos.x, this.player_pos.y, 16, 16);
        }
        
    }

}