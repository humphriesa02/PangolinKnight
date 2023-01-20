class Pangolin{
    constructor(){
        // Game reference we pass in
        this.game = gameEngine;

        // Components
        this.transform = new Transform(new Vec2(16 * params.scale,32 * params.scale), new Vec2(0,0), 1, new Vec2(0,0));
        this.health = new Health(10, 10);
        this.collider;
        this.shadow = new Shadow(this.game, this.transform.pos);

        // Reference to our spritesheet
        this.walk_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sheet.png");
        this.slash_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_slash_sheet.png");

        // Some state variables
        this.facing = 0; // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = 1; // 0 = idle, 1 = roll-idle, 2 = walking, 3 = rolling, 4 = sword slash
        this.dead = false;

        // Some movement variables
        this.walk_speed = 50;
        this.roll_speed = 200;

        // Jump variables
        this.jump_speed = 300;
        this.jump_time = 4;
        this.jump_distance = 140;
        this.jump_height = 96;
        this.z = 0; // Give us the impression of a "fake" jump when in top down
        this.distance_remaining;

        // State change variables
        this.roll_cooldown_end = 0;
        this.attack_end_time = 0;
        this.jump_cooldown_end = 0;

        // Flag variables
        this.rolling = false;
        this.attacking = false;
        this.jumping = false;

        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 6; i++){ // 6 States, idle, roll-idle, walking, rolling, slashing, jumping
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


        //walking animation, state 2

        //facing right
        this.animations[2][0] = new Animator(this.walk_spritesheet, 0, 0, 16, 16, 2, 0.2, true);

        // facing left
        this.animations[2][1] = new Animator(this.walk_spritesheet, 0, 16, 16, 16, 2, 0.2, true);

        // facing up
        this.animations[2][2] = new Animator(this.walk_spritesheet, 0, 32, 16, 16, 2, 0.2, true);

        // facing down
        this.animations[2][3] = new Animator(this.walk_spritesheet, 0, 48, 16, 16, 2, 0.2, true);
        

        //Rolling animations, state 3

        //facing right
        this.animations[3][0] = new Animator(this.walk_spritesheet, 0, 64, 16, 16, 3, 0.1, true);

        //facing left
        this.animations[3][1] = new Animator(this.walk_spritesheet, 0, 80, 16, 16, 3, 0.1, true);

        //facing up
        this.animations[3][2] = new Animator(this.walk_spritesheet, 0, 96, 16, 16, 3, 0.1, true);

        //facing down
        this.animations[3][3] = new Animator(this.walk_spritesheet, 0, 112, 16, 16, 3, 0.1, true);


        // Sword slash animations, state 4

        //facing right
        this.animations[4][0] = new Animator(this.slash_spritesheet, 0, 32, 16, 16, 4, 0.065, false);

        //facing left
        this.animations[4][1] = new Animator(this.slash_spritesheet, 0, 48, 16, 16, 4, 0.065, false);

        //facing up
        this.animations[4][2] = new Animator(this.slash_spritesheet, 0, 16, 16, 16, 4, 0.065, false);

        //facing down
        this.animations[4][3] = new Animator(this.slash_spritesheet, 0, 0, 16, 16, 4, 0.065, false);


        // Jump animations, state 5

        //facing right
        this.animations[5][0] = new Animator(this.walk_spritesheet, 0, 128, 16, 16, 3, 0.2, false);

        //facing left
        this.animations[5][1] = new Animator(this.walk_spritesheet, 0, 144, 16, 16, 3, 0.2, false);

        //facing up
        this.animations[5][2] = new Animator(this.walk_spritesheet, 0, 160, 16, 16, 3, 0.2, false);

        //facing down
        this.animations[5][3] = new Animator(this.walk_spritesheet, 0, 176, 16, 16, 3, 0.2, false);
    }

    update(){
        // Reset velocity
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;

        // ----------- This section is dedicated for seeing if we have finished an animation ---- //
        // ----------- i.e., to check if we have finished sword slashing or jumping ------------- //
        
        // Check to see if the flag boolean state animation is done
        // if it is, reset all its animation and set the flag to false
        if(this.attacking && this.animations[this.state][this.facing].done){
            for(let i = 0; i < 4; i++){
                this.animations[4][i].elapsedTime = 0;
                this.animations[4][i].done = false;
            }
            this.attacking = false;
        }
        else if(this.attacking && !this.animations[this.state][this.facing].done){
            return;
        }
        else if(this.jumping && this.animations[this.state][this.facing].done){
            for(let i = 0; i < 4; i++){
                this.animations[5][i].elapsedTime = 0;
                this.animations[5][i].done = false;
            }
            this.z = 0;
            this.shadow.visible = false;
            this.jumping = false;
        }


        // ----------- This section is dedicated to checking for specific key presses in order to change states ---- //
        // -----------  we do not actually change states here, just set booleans. I.e. "attacking" ------------------ //

        // Rolling transition check
        if(this.game.keys["r"] && this.game.timer.gameTime >= this.roll_cooldown_end && !this.jumping){
            this.rolling = !this.rolling;
            this.roll_cooldown_end = this.game.timer.gameTime + this.animations[3][0].totalTime;
        }

        //Jump check
        if(this.game.keys[" "] && this.game.timer.gameTime >= this.jump_cooldown_end && !this.jumping){ //Pressing space
            this.jumping = true;
            this.shadow.visible = true;
            this.distance_remaining = this.jump_distance;
            this.jump_cooldown_end = this.game.timer.gameTime + this.animations[5][0].totalTime;
        }

        // Sword slash check
        if(this.game.click && this.game.timer.gameTime >= this.attack_end_time && !this.jumping){
            // Figure out which direction we are slashing in
            if(Math.abs(this.game.click.x-(this.transform.pos.x - screenX())) > Math.abs(this.game.click.y-(this.transform.pos.y-screenY()))){// X is farther
                if(this.game.click.x > this.transform.pos.x - screenX()){
                    this.facing = 0;
                }
                else if(this.game.click.x < this.transform.pos.x - screenX()){
                    this.facing = 1;
                }
            }
            else{
                if(this.game.click.y < this.transform.pos.y - screenY()){
                    this.facing = 2;
                }
                else if(this.game.click.y > this.transform.pos.y - screenY()){
                    this.facing = 3;
                }
            }

            // Initiate the sword slash
            this.attacking = true;
            let sword = new Sword(this.game, this.facing, this.transform.pos);
            this.game.addEntity(sword);
            this.attack_end_time = this.game.timer.gameTime + this.animations[4][0].totalTime;
        }



        // ----------- This section is dedicated to changing states. State changes are mainly determined by flag booleans ---- //
        // ----------- i.e., if we have the attacking flag set then our state is 4. ------------------------------------------ //
        //             possible fix here, every frame of say, the attack animation, we reset state to 4.
        //             May be faster to have a check somewhere saying "are we in state 4, then skip"

        if(this.attacking){
            this.state = 4;
        }
        else if (this.jumping){
            this.state = 5;
            this.jump();
        }
        else{
            // Set velocity
            if(!this.rolling){
                this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.walk_speed*this.game.clockTick);
                this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.walk_speed*this.game.clockTick);
            }
            else{
                this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.roll_speed*this.game.clockTick);
                this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.roll_speed*this.game.clockTick);
            }

            // Either idle, roll-idle, walking, or rolling states here
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


        // ----------- This section is dedicated determining which direction we are facing. --------- //
        // ----------- we will need to determine if our facing can change mid action, like jumping -- //
        
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


        
        // ---------- Finally, we will adjust where our actual game object is located in the world. -- //
        // ---------- This may or may not change depending on the state. Velocity won't change if
        // ---------- a state doesn't wish for it to change, so this set works fine no matter what. -- //

        // Adjust position from velocity
        this.transform.pos.x += this.transform.velocity.x;
        this.transform.pos.y += this.transform.velocity.y; 
    }

    draw(ctx){
        if(document.getElementById("debug").checked){
            ctx.strokeRect(this.transform.pos.x - screenX(), this.transform.pos.y - screenY(), 16 * params.scale, 16 * params.scale);
        }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.transform.pos.x - screenX(), (this.transform.pos.y - this.z) - screenY(), 16, 16)
    }


    jump(){
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
        this.distance_remaining = Math.max(0, this.distance_remaining - this.jump_time);
        this.z = Math.sin(((this.distance_remaining / this.jump_distance) * Math.PI)) * this.jump_height;
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
            this.animation.drawFrame(this.game.clockTick, ctx, this.player_pos.x - screenX(), this.player_pos.y - screenY(), 16, 16);
        }
        
    }

}