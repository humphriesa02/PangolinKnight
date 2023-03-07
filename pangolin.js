class Pangolin{
    constructor(){
        // Game reference we pass in
        this.game = gameEngine;

        //updatable
        this.updatable = true;

        // Components
        this.tag = "player";

        this.transform = new Transform(new Vec2(24, 40), 1, new Vec2(0,0));
        this.health = new Health(5, 5);
        this.in_air = new In_Air(53, 100, 60, 30, true);
        this.collider = new Collider(new Circle(this.transform.pos, 7.5), true, true, false);
        this.invincible = new Invincible();
        this.gravity = true;
        this.shadow = new Shadow(this.game, this.transform.pos);
        this.damage = 1;

        //Inventory
        this.inventory = new Inventory(this);
        gameEngine.menu.inventory = this.inventory;

        // Reference to our spritesheet
        this.walk_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sheet.png");
        this.slash_spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_slash_sheet.png");

        // Some state variables
        this.facing = 2; // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = state_enum.idle; // 0 = idle, 1= walking, 2 = sword slash,
                                      // 3 = jumping, 4 = picking up, 5 = holding, 6 = throwing, 7 = use_item
                                      // 8 = falling

        // Some movement variables
        this.walk_speed = 35;
        this.roll_acceleration = 220;
        this.acceleration_vector = new Vec2(1, 0);
        this.centripetal_vector = new Vec2(0, 1);
        this.rolling_friction = 100;
        this.max_roll_speed_sqr = 12000;
        this.min_roll_speed_sqr = 0.9;
        this.cr = 0;

        // To reset boomerang
        this.boomerang_respawn_delay = 15;
        this.boomerang_respawn_time;

        // Jump variable
        this.grounded = true;
        this.traction_loss_timer = 0;

        // If we pick up an item reference it here
        this.held_entity;

        // Position to reset the player to after they fall
        this.fall_reset_pos;

        // State change variables
        this.roll_cooldown_end = 0;
        this.attack_cooldown_end = 0;
        this.jump_cooldown_end = 0;
        this.interaction_cooldown_end = 0;
        this.interaction_end = 0;
        this.extra_damage_total_time = 15;
        this.leave_pit_buffer_time = 0.1;

        // Flag variables
        this.rolling = false;
        this.idle_holding = false;
        this.can_activate_pit = true;
        this.animation_modifier = 0; // Used for extra modifications to animations we don't want to make states for.
                                     // Factor in rolling here, as well as holding idle
        this.interacting = false; // Used for collision based interactions with other entities
        this.interaction_cooldown_duration = 0.5;
        this.interaction_duration = 0.01;
        this.extra_damage_duration = this.extra_damage_total_time;
        this.leave_pit_buffer_duration = this.leave_pit_buffer_time;

        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 11; i++){ 
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

        /* State 7, using item */
        //facing right
        this.animations[7][0][0] = new Animator(this.slash_spritesheet, 16, 32, 16, 16, 1, 0.3, false);

        //facing left
        this.animations[7][1][0] = new Animator(this.slash_spritesheet, 16, 48, 16, 16, 1, 0.3, false);

        //facing up
        this.animations[7][2][0] = new Animator(this.slash_spritesheet, 16, 16, 16, 16, 1, 0.3, false);

        //facing down
        this.animations[7][3][0] = new Animator(this.slash_spritesheet, 16, 0, 16, 16, 1, 0.3, false);

        // Rolling
        //facing right
        this.animations[7][0][1] = new Animator(this.slash_spritesheet, 16, 32, 16, 16, 1, 0.3, false);

        //facing left
        this.animations[7][1][1] = new Animator(this.slash_spritesheet, 16, 48, 16, 16, 1, 0.3, false);

        //facing up
        this.animations[7][2][1] = new Animator(this.slash_spritesheet, 16, 16, 16, 16, 1, 0.3, false);

        //facing down
        this.animations[7][3][1] = new Animator(this.slash_spritesheet, 16, 0, 16, 16, 1, 0.3, false);


        /* State 8, falling */
        //facing right
        this.animations[8][0][0] = new Animator(this.walk_spritesheet, 0, 192, 16, 16, 3, 0.3, false);

        //facing left
        this.animations[8][1][0] = new Animator(this.walk_spritesheet, 0, 192, 16, 16, 3, 0.3, false);

        //facing up
        this.animations[8][2][0] = new Animator(this.walk_spritesheet, 0, 192, 16, 16, 3, 0.3, false);

        //facing down
        this.animations[8][3][0] = new Animator(this.walk_spritesheet, 0, 192, 16, 16, 3, 0.3, false);

        /* State 9, pushing */
        //facing right
        this.animations[9][0][0] = new Animator(this.walk_spritesheet, 0, 272, 16, 16, 2, 0.3,true);

        //facing left
        this.animations[9][1][0] = new Animator(this.walk_spritesheet, 0, 288, 16, 16, 2, 0.3, true);

        //facing up
        this.animations[9][2][0] = new Animator(this.walk_spritesheet, 0, 304, 16, 16, 2, 0.3, true);

        //facing down
        this.animations[9][3][0] = new Animator(this.walk_spritesheet, 0, 320, 16, 16, 2, 0.3, true);

        /* State 10, dead */
        //facing right
        this.animations[10][0][0] = new Animator(this.walk_spritesheet, 0, 336, 16, 16, 5, 0.3, false);

        //facing left
        this.animations[10][1][0] = new Animator(this.walk_spritesheet, 0, 336, 16, 16, 5, 0.3, false);

        //facing up
        this.animations[10][2][0] = new Animator(this.walk_spritesheet, 0, 336, 16, 16, 5, 0.3, false);

        //facing down
        this.animations[10][3][0] = new Animator(this.walk_spritesheet, 0, 336, 16, 16, 5, 0.3, false);
        
    }

    update(){
        if(document.getElementById("debug").checked){
            this.health.max = 20;
            this.health.current = 20;
        }
        
            if(this.invincible.active){
                invulnerability_active(this);
            }
            this.check_ability();
            this.check_state_end();
        if(this.state != state_enum.dead){
            this.input();
            this.movement();
            // top down jump
            if(!gameEngine.gravity){
                in_air_jump(this);
            }
            else if(this.state != state_enum.jumping){
                this.in_air.z = 0;
            }
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
        this.animations[this.state][this.facing][this.animation_modifier].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y - this.in_air.z, 16, 16, this.invincible.inverted);
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
        // check if using items is done
        else if(this.state == state_enum.use_item && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.use_item][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.use_item][i][this.rolling ? 1 : 0].done = false;
            }
            this.state = state_enum.idle;
        }
        else if(this.state == state_enum.use_item && !this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            return;
        }
        // Check if jump end
        else if(this.state == state_enum.jumping){
            if((!gameEngine.gravity && this.in_air.distance_remaining <= 1) || (gameEngine.gravity && this.grounded)){
                for(let i = 0; i < 4; i++){
                    this.animations[state_enum.jumping][i][this.rolling ? 1 : 0].elapsedTime = 0;
                    this.animations[state_enum.jumping][i][this.rolling ? 1 : 0].done = false;
                }
                this.state = state_enum.idle;
            }
        }
        // Pickup end
        else if (this.state == state_enum.pickup && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            this.state = state_enum.holding;
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.pickup][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.pickup][i][this.rolling ? 1 : 0].done = false;
            }
        }
        // Throw end
        else if (this.state == state_enum.throw && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            this.state = state_enum.idle;
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.throw][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.throw][i][this.rolling ? 1 : 0].done = false;
            }
        }
        else if (this.state == state_enum.falling && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){
            hit(this);
            this.transform.pos.x = this.fall_reset_pos.x;
            this.transform.pos.y = this.fall_reset_pos.y;
            this.shadow.active = true;
            this.fall_reset_pos = undefined;
            if(this.health.current <= 0){
                this.die();
            }else{
                this.state = state_enum.idle;
            }
            
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.falling][i][this.rolling ? 1 : 0].elapsedTime = 0;
                this.animations[state_enum.falling][i][this.rolling ? 1 : 0].done = false;
            }
        }
        else if (!this.can_activate_pit && this.fall_reset_pos == undefined ){
            if(this.leave_pit_buffer_duration > 0){
                this.leave_pit_buffer_duration -= this.game.clockTick;
            }
            else{
                this.can_activate_pit = true;
                this.leave_pit_buffer_duration = this.leave_pit_buffer_time;
            }
        }
        else if(this.state == state_enum.dead && this.animations[this.state][this.facing][this.rolling ? 1 : 0].done){ // end the game
            let explosion = new Explosion(this);
            this.game.camera.rooms[Math.floor(explosion.transform.pos.x/roomWidth)][Math.floor(explosion.transform.pos.y/roomHeight)].addEntity(explosion);
            this.game.paused = true;
            this.game.menu.current_displayed = menu_enum.lose;
            this.health.current = this.health.max;
            this.inventory.reset();
            this.transform.pos.x = gameEngine.camera.level.start[0] * tileSize + 8;
            this.transform.pos.y = gameEngine.camera.level.start[1] * tileSize + 8;
            for(let i = 0; i < 4; i++){
                this.animations[state_enum.dead][i][0].elapsedTime = 0;
                this.animations[state_enum.dead][i][0].done = false;
            }
            this.state = state_enum.idle;
        }

        if(this.boomerang_respawn_time && gameEngine.timer.gameTime >= this.boomerang_respawn_time){
            this.boomerang_respawn_time = undefined;
            create_item(item_enum.boomerang, this.transform.pos, 1, 1, false);
        }
    }

    // Get input
    input(){
        if(gameEngine.keys["Escape"] && this.game.timer.gameTime >= this.game.menu.transition_cooldown_end){
            this.game.paused = true;
            this.game.menu.current_displayed = menu_enum.main;
            this.game.menu.transition_cooldown_end = gameEngine.timer.gameTime +  this.game.menu.transition_cooldown_duration;
        } 

        if(this.game.keys["e"] && !this.interacting && this.game.timer.gameTime >= this.interaction_cooldown_end){
            this.interacting = true;
            this.interaction_cooldown_end = this.game.timer.gameTime + this.interaction_cooldown_duration;
        }else if (this.interacting && this.game.timer.gameTime >= this.interaction_end){
            this.interacting = false;
            this.interaction_end = this.game.timer.gameTime + this.interaction_duration;
        }

        if(this.game.keys["i"] && this.game.timer.gameTime >= this.game.menu.transition_cooldown_end){
            this.game.paused = true;
            this.game.menu.current_displayed = menu_enum.inventory;
            this.game.menu.transition_cooldown_end = gameEngine.timer.gameTime +  this.game.menu.transition_cooldown_duration;
        }

        // Rolling transition check
        if((this.game.rightclick || this.game.keys["r"] || this.game.keys["ArrowRight"]) && this.game.timer.gameTime >= this.roll_cooldown_end && this.state != state_enum.holding){
            if (this.rolling) {
                this.collider.area.radius = 7.5;
                this.rolling = false;
                this.cr = 0;
            }
            else if (!this.rolling) {
                this.collider.area.radius = 5.5;
                this.rolling = true;
                this.cr = 0.5;
            }
            this.roll_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.walking][0][this.rolling ? 1 : 0].totalTime;
        }

        //Jump check
        if(this.game.keys[" "] && this.game.timer.gameTime >= this.jump_cooldown_end && this.state != state_enum.jumping && this.state != state_enum.holding && this.state != state_enum.falling){ //Pressing space
            this.jump();
            // TODO, make this reset in the component
            this.in_air.distance_remaining = this.in_air.air_distance;
            this.jump_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.jumping][0][this.rolling ? 1 : 0].totalTime;
        }


        // Sword slash check
        if(this.game.click && this.game.timer.gameTime >= this.attack_cooldown_end && this.state != state_enum.holding && this.state != state_enum.falling){
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
            this.rolling = false;
            this.collider.area.radius = 7.5;
            this.cr = 0;
            this.state = state_enum.slashing;
            let sword = new Sword(this.game, this.facing, this.transform.pos, this, this.damage, true);
            this.game.camera.rooms[Math.floor(sword.transform.pos.x/roomWidth)][Math.floor(sword.transform.pos.y/roomHeight)].addEntity(sword);
            this.attack_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.slashing][0][this.rolling ? 1 : 0].totalTime;
        }
        else if (this.game.keys["ArrowLeft"] && this.game.timer.gameTime >= this.attack_cooldown_end && this.state != state_enum.jumping && this.state != state_enum.holding && this.state != state_enum.falling){
            // Initiate the sword slash
            this.rolling = false;
            this.collider.area.radius = 7.5;
            this.cr = 0;
            this.state = state_enum.slashing;
            let sword = new Sword(this.game, this.facing, this.transform.pos, this, this.damage, true);
            this.game.addEntity(sword);
            this.attack_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.slashing][0][this.rolling ? 1 : 0].totalTime;
        }

        // Use our offhand item
        if(this.game.keys["f"] && this.game.timer.gameTime >= this.attack_cooldown_end && this.state != state_enum.jumping && this.state != state_enum.falling){
            // Put down held item
            if(this.state == state_enum.holding){
                this.held_entity.picked_up = false;
                this.held_entity = undefined;
                this.idle_holding = false;
                this.state = state_enum.throw;
            }
            else if(this.inventory.secondary_item != null){
                // Initiate using item
                if(this.inventory.secondary_item.item == item_enum.bomb){
                    if(this.inventory.bomb_count > 0){
                        this.state = state_enum.holding;
                        let bomb = new Bomb(this);
                        this.game.camera.rooms[Math.floor(this.transform.pos.x/roomWidth)][Math.floor(this.transform.pos.y/roomHeight)].addEntity(bomb);
                        this.held_entity = bomb;
                    }
                }
                else{
                    if(this.inventory.secondary_item.item == item_enum.boomerang){
                        let boomerang = new Boomerang(this);
                        this.game.camera.rooms[Math.floor(this.transform.pos.x/roomWidth)][Math.floor(this.transform.pos.y/roomHeight)].addEntity(boomerang);
                        this.boomerang_respawn_time = this.game.timer.gameTime + this.boomerang_respawn_delay;
                    }
                    this.state = state_enum.use_item;
                }
                this.inventory.secondary_item.use(this); 
            }
            this.rolling = false;
            this.attack_cooldown_end = this.game.timer.gameTime + this.animations[state_enum.use_item][0][this.rolling ? 1 : 0].totalTime;
        }
        
    }

    // Move player
    movement(){

        // If theres gravity, track how longer the player is in the air
        // If the player is in the air for long enough, reset the momentum 
        if (gameEngine.gravity) {
            if (!this.grounded) {
                if (this.traction_loss_timer != null) {
                    this.traction_loss_timer += gameEngine.clockTick;
                }
            }
            else {
                this.can_jump = true;
                this.traction_loss_timer = 0;
            }

            if (this.traction_loss_timer > 0.05 || !this.rolling) {

                if (this.traction_loss_timer > 0.05 ) {
                    let centripetal_component = this.transform.velocity.dot(this.centripetal_vector);
                    if (centripetal_component > 0) {
                        this.transform.velocity.minus(Vec2.scale(this.centripetal_vector, centripetal_component));
                    }
                }
                this.acceleration_vector = new Vec2(1, 0);
                this.centripetal_vector = new Vec2(0, 1);
                this.traction_loss_timer = null;
            }
            if (this.traction_loss_timer > 0.04) {
                this.can_jump = false;
            }
        }
        

        // If knockback, check knockback end
        if (this.knockback !== undefined){
            if(gameEngine.timer.gameTime >= this.knockback.knockback_end_time){
                this.knockback = undefined;
            }
        } // If not able to move, set velocity to 0
        else if(this.state == state_enum.pickup || this.state == state_enum.throw ||
             this.state == state_enum.falling){this.transform.velocity.x = 0; this.transform.velocity.y = 0;}
        else{ // If ot rolling, set velocity to match input
            if (!this.rolling) {
                this.transform.velocity.x = ((-(this.game.keys["a"] ? 1: 0) + (this.game.keys["d"] ? 1: 0)) * this.walk_speed);
                if (!gameEngine.gravity) {
                    this.transform.velocity.y = ((-(this.game.keys["w"] ? 1: 0) + (this.game.keys["s"] ? 1: 0)) * this.walk_speed);
                }
            }
            else { // If rolling and theres not gravity, set acceleration to match input
                let sqr_speed = this.transform.velocity.dot(this.transform.velocity);

                if (!gameEngine.gravity) {
                    if (this.game.keys['a']) {
                        this.transform.velocity.x -= this.roll_acceleration * gameEngine.clockTick;
                    }
                    else if (this.game.keys["d"]) {
                        this.transform.velocity.x += this.roll_acceleration * gameEngine.clockTick;
                    }
                    else {
                        this.transform.velocity.x -= Math.sign(this.transform.velocity.x) * this.rolling_friction * gameEngine.clockTick;
                    }

                    if (this.game.keys["w"]) {
                        this.transform.velocity.y -= this.roll_acceleration * gameEngine.clockTick;
                    }
                    else if (this.game.keys["s"]) {
                        this.transform.velocity.y += this.roll_acceleration * gameEngine.clockTick;
                    }
                    else {
                        this.transform.velocity.y -= Math.sign(this.transform.velocity.y) * this.rolling_friction * gameEngine.clockTick;
                    }
                } // If theres gravity set acceralation to match input along the acceleration vector
                else {
                    if (this.game.keys['a']) {
                        if (sqr_speed < this.max_roll_speed_sqr) {
                            let delta_velocity = Vec2.scale(this.acceleration_vector, this.roll_acceleration * gameEngine.clockTick);
                            this.transform.velocity.minus(delta_velocity);
                        }
                        this.centripetal_vector = new Vec2(-this.acceleration_vector.y, this.acceleration_vector.x);
                    }
                    if (this.game.keys["d"]) {
                        if (sqr_speed < this.max_roll_speed_sqr) {
                            let delta_velocity = Vec2.scale(this.acceleration_vector, this.roll_acceleration * gameEngine.clockTick);
                            this.transform.velocity.add(delta_velocity);
                        }
                        this.centripetal_vector = new Vec2(-this.acceleration_vector.y, this.acceleration_vector.x);
                    }
                    else if (!this.game.keys['a'] && this.grounded) {
                        this.apply_friction();
                    }

                    if (Math.abs(this.transform.velocity.dot(Vec2.scale(this.acceleration_vector, -1))) < 8) {
                        this.acceleration_vector = new Vec2(1, 0);
                        this.centripetal_vector = new Vec2(0, 1);
                    }
                }


                sqr_speed = this.transform.velocity.dot(this.transform.velocity);
                if (sqr_speed > this.max_roll_speed_sqr && (this.grounded || !gameEngine.gravity)) {
                    this.transform.velocity.multiply(this.max_roll_speed_sqr / sqr_speed);
                }
                else if (sqr_speed < this.min_roll_speed_sqr) {
                    this.acceleration_vector = new Vec2(1, 0);
                    this.centripetal_vector = new Vec2(0, 1);
                    this.transform.velocity.x = 0;
                    this.transform.velocity.y = 0;
                }
            }
            if(this.state != state_enum.slashing){
                if(Math.abs(this.transform.velocity.x) > Math.abs(this.transform.velocity.y)){
                    if(this.transform.velocity.x > 0){ // Facing right
                        this.facing = 0;
                    }
                    else if (this.transform.velocity.x < 0){ // Facing left
                        this.facing = 1;
                    }
                }
                else{
                    if (this.transform.velocity.y < 0){ // Facing up
                        this.facing = 2;
                    }
                    else if (this.transform.velocity.y > 0){ // Facing down
                        this.facing = 3;
                    }
                }
            }
            // Figure out the direction for animation
            
            if(this.state != state_enum.jumping && this.state != state_enum.slashing &&
                this.state != state_enum.holding && this.state != state_enum.use_item &&
                 this.state != state_enum.falling){

                if (Math.abs(this.transform.velocity.x) < 5 && Math.abs(this.transform.velocity.y) < 5){
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

    apply_friction() {
        let direction_vector = this.transform.velocity.clone();
        let magnitude = direction_vector.normalize();

        let friction_over_time = this.rolling_friction * gameEngine.clockTick;

        if (magnitude - friction_over_time < 0) {
            this.transform.velocity = new Vec2(0, 0);
        }
        else {
            this.transform.velocity.minus(Vec2.scale(direction_vector, friction_over_time));
        }
    }

    // Initiate jump - called once. All that's needed for platformer
    jump(){
        this.state = state_enum.jumping;
        if(gameEngine.gravity && this.grounded){
            // Remove all velocity in the direction of jumping
            let centripetal_component = this.transform.velocity.dot(this.centripetal_vector);
            this.transform.velocity.minus(Vec2.scale(this.centripetal_vector, centripetal_component));
            
            // Add 120 to the direction of jumping
            this.transform.velocity.add(Vec2.scale(this.centripetal_vector, -120));
            this.grounded = false;
        }
    }

    die(){
        this.rolling = false;
        this.idle_holding = false;
        this.state = state_enum.dead;
    }

    // Intent is to have a method that can check when we have inflated stats and reset them
    // For now just checks sword damage
    check_ability(){
        if(this.damage > 1 && this.extra_damage_duration > 0){
            this.extra_damage_duration -= this.game.clockTick;      
        }
        else{
            this.damage = 1;
            this.extra_damage_duration = this.extra_damage_total_time;
        }
    }
}

// simple class to draw shadow below player feet
class Shadow{
    constructor(game, player_pos, size = 16){
        Object.assign(this, {game, player_pos, size});

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_shadow.png");

        this.animation = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 0.3, true);
        this.active = true;
    }

    update(){ }

    draw(ctx){
        if(this.active){
            this.animation.drawFrame(this.game.clockTick, ctx, this.player_pos.x, this.player_pos.y, this.size, this.size);
        }
    }

}