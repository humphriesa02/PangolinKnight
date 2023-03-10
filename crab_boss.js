class CrabBoss{
    constructor(info, player){
        this.tag = "enemy";
        this.home = info.position;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8), 1, new Vec2(0,0));
        this.health = new Health(15, 15);
        this.invincible = new Invincible(0.05);
        this.collider = new Collider(new AABB(this.transform.pos, 16, 16), true, true, false);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_boss.png");
        this.facing = 0;
        this.move_speed = 20;
        this.move_time = 3;
        this.delay_time = 3;
        this.player = player;
        this.updatable = false;
        this.total_bubbles = 50;
        this.overlap_damage = true;

        this.claw = new Claw(gameEngine, this.transform.pos, this);

        this.state = 0;
        this.phase = 0;
        this.damage = 2;
        this.attack_start;
        this.attack_on_cooldown = false;
        this.claw_attacking = false;
        this.moved_into_water_pool_center = false;

        this._WIND_UP_TIME = .7;
        this._SLASH_TIME = .48;
        this._COOLDOWN_TIME = this._WIND_UP_TIME + this._SLASH_TIME + 1.52;

        this.animations = [];
        this.loadAnimations();
        this.water_pool = 0;
        this.water_pool_map = { 0: new Vec2(864, 48),
                            1: new Vec2(1040, 48),
                            2: new Vec2(864, 160),
                            3: new Vec2(1040, 160)};
    }

    loadAnimations(){
        for (let i = 0; i < 7; i++){ // 7 states
            this.animations.push([]);
        }

        // Walking
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 48, 16, 3, 0.33, true);

        // Wind up
        this.animations[1] = new Animator(this.spritesheet, 0, 48, 48, 21, 1, 1, true);

        // Attack
        this.animations[2] = new Animator(this.spritesheet, 0, 0, 48, 16, 1, 0.33, true);

        // Going Underwater
        this.animations[3] = new Animator(this.spritesheet, 0, 80, 32, 32, 5, 0.33, false);

        // Coming up from water
        this.animations[4] = new Animator(this.spritesheet, 0, 112, 32, 32, 5, 0.33, false);

        // Water attack start
        this.animations[5] = new Animator(this.spritesheet, 0, 16, 32, 32, 4, 0.33, false);

        // Water attack shooting 
        this.animations[6] = new Animator(this.spritesheet, 96, 16, 32, 32, 1, 0.33, true);
    }
    

    update(){
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        
        if(this.invincible.active){
            invulnerability_active(this);  
        }
        switch(this.phase){
            case 0: // walking around and attacking
            if (this.winding) {
                this.wind_up();
            }
            else if (this.claw_attacking) {
                this.slash();
            }
            else if (sq_distance(this.transform.pos, this.player.transform.pos) <= 1000) {
                if (!this.attack_on_cooldown) {
                    this.attack_start = gameEngine.timer.gameTime;
                    this.attack_on_cooldown = true;
                    this.winding = true;
                    this.transform.velocity = new Vec2();   
                    this.animations[2].elapsedTime = 0;
                    this.animations[2].done = false;
                    this.claw.animations[2].elapsedTime = 0;
                    this.claw.animations[2].done = false;
                }
                else if (gameEngine.timer.gameTime >= this.attack_start + this._COOLDOWN_TIME) {
                    this.attack_on_cooldown = false;
                }
            }
            else {
                this.movement();
            }
                break;
            case 1: // Finding water to dive into
                move_to_position(this, this.water_pool_map[this.water_pool]);
                break;
            case 2: // In the water swimming around
                if(this.state == 3 && !this.animations[3].done && !this.moved_into_water_pool_center){ // We are initially entering the water pool / haven't hit center
                    move_to_position(this, this.water_pool_map[this.water_pool]);
                }
                else if(this.state == 3 && (this.animations[3].done || this.moved_into_water_pool_center)){ // We haven't popped up yet
                    this.moved_into_water_pool_center = true;
                    let random_percent = Math.random();
                    if(random_percent <= 0.5){ // We pop up here
                        this.animations[3].done = false;
                        this.animations[3].elapsedTime = 0;
                        this.state = 4;
                    }
                    else{ // We move to a random pool
                        let random_pool = randomInt(4);
                        this.transform.pos.x = this.water_pool_map[random_pool].x;
                        this.transform.pos.y = this.water_pool_map[random_pool].y;
                        this.state = 4;
                    }
                }
                else if(this.state == 4){
                    if(this.animations[4].done){
                        this.animations[4].elapsedTime = 0;
                        this.animations[4].done = false;

                        let random_percent = Math.random();
                        if(random_percent >= 0.5){
                            this.state = 5;
                            this.phase = 3;
                        }
                        else{
                            this.state = 3;
                        }
                    }
                }
                break;
            case 3: // shooting bubbles
                if(this.state == 5){
                    if(this.animations[5].done){
                        this.animations[5].elapsedTime = 0;
                        this.animations[5].done = false;
                        this.state = 6;
                    }
                }
                else if(this.state == 6){
                        for(let i = 0; i < 5; i++){
                            let bubble = new Bubble(this.transform.pos, this.player.transform.pos);
                            gameEngine.camera.rooms[Math.floor(bubble.transform.pos.x/roomWidth)][Math.floor(bubble.transform.pos.y/roomHeight)].addEntity(bubble);
                            this.total_bubbles--;
                        }
                        if(this.total_bubbles <= 0){
                            this.total_bubbles = 50;
                            this.phase = 2;
                            this.state = 3;
                        }
                }
                break;
        }
        this.animation();
    }

    wind_up() {
        this.state = 1;
        this.claw.wind_up();
        if (gameEngine.timer.gameTime >= this.attack_start + this._WIND_UP_TIME) {
            this.winding = false;
            this.claw_attacking = true;  
        }
    }

    slash() {
        this.state = 2;
        this.claw.attack();
        if (gameEngine.timer.gameTime >= this.attack_start + this._WIND_UP_TIME + this._SLASH_TIME) {
            this.claw_attacking = false;
            this.claw.state = 0;
        }
    }

    movement() {
        // Reset velocity
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        if (this.transform.pos.x - 6 < this.player.transform.pos.x && this.move_time > 0){
            this.transform.velocity.x += this.move_speed;
            this.move_time -= gameEngine.clockTick;
        }
        else if (this.transform.pos.x > this.player.transform.pos.x && this.move_time > 0){
            this.transform.velocity.x -= this.move_speed;
            this.move_time -= gameEngine.clockTick;
        }
        if (this.transform.pos.y < this.player.transform.pos.y && this.move_time > 0){
            this.transform.velocity.y += this.move_speed;
            this.move_time -= gameEngine.clockTick;
        }
        else if (this.transform.pos.y > this.player.transform.pos.y){
            this.transform.velocity.y -= this.move_speed * 2;
            this.move_time -= gameEngine.clockTick;
        }
        else if(this.delay_time <= 0){
            this.move_time = Math.random() * 4;
            this.delay_time = Math.random() * 2;
        }
        else{
            this.delay_time-=gameEngine.clockTick;
        }
    }


    animation() {
        if(this.phase == 0){
            if (this.transform.velocity.x > 0 || this.transform.velocity.y > 0) {
                this.state = 0;
            }
            if (this.winding) {
                this.state = 1;
            }
            else if (this.claw_attacking) {
                this.state = 2;
            }
        }
        

        // Figure out the direction for animation
        if (this.state == 0) {
            if (Math.abs(this.player.transform.pos.x - this.transform.pos.x) > 8) {
                if( this.player.transform.pos.x > this.transform.pos.x ) {
                    this.facing = 0;
                }
                else {
                    this.facing = 1;
                }
            }
        }
    }

    reset(){
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        this.transform.pos.x = this.home[0] * 16 + 8;
        this.transform.pos.y = this.home[1] * 16 + 8;
        this.health.current = this.health.max;
        this.invincible.active = false;
        if(this.removeFromWorld){
            this.removeFromWorld = false;
            gameEngine.addEntity(this);
        }
    }

    draw(ctx){
        switch(this.state){
            case 0:
            case 2:
                this.animations[this.state].drawFrame(gameEngine.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 72, 24, this.invincible.inverted);
                break;
            case 1:
                this.animations[this.state].drawFrame(gameEngine.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 72, 32, this.invincible.inverted);
                break;
            case 3:
            case 4:
            case 5:
            case 6:
                this.animations[this.state].drawFrame(gameEngine.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 48, 48, this.invincible.inverted);
                break;
        }
        
    }

    die(){
        let explosion = new Explosion(this);
        gameEngine.camera.rooms[Math.floor(explosion.transform.pos.x/roomWidth)][Math.floor(explosion.transform.pos.y/roomHeight)].addEntity(explosion);
        this.removeFromWorld = true;
        this.claw.removeFromWorld = true;
        create_item(item_enum.scale, this.transform.pos, 3, 1);
    }
}

class Claw{
    constructor(game, player_pos, player, render = false, duration = 0.2){
        this.tag = "sword";
        Object.assign(this, {game, player_pos});
        // Components
        let sword_pos = Object.assign({},player_pos);

        this.owner = player;
        // Decide where the sword will initially start
        this.transform = new Transform(new Vec2(sword_pos.x-8, sword_pos.y+10));
        this.invincible = new Invincible(0.05);
        
        
        this.collider = new Collider(new AABB(this.transform.pos, 10, 10), true, true, false);

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_boss.png");
        this.state = 0;
        this.health = new Health(5, 5);

        // Animations
        this.animations = [];
        this.loadAnimations();
        this.updatable = true;
        this.render = render;
        this.starttime = gameEngine.timer.gameTime;
        this.endtime = gameEngine.timer.gameTime + duration;
        this.active = true;
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 2; i++){ // 4 directions, right, left, up, down
            this.animations.push([]);
        }

        // Sword slash animations

        // idle
        this.animations[0] = new Animator(this.spritesheet, 48, 48, 16, 16, 2, 0.33, true);

        // raised up
        this.animations[1] = new Animator(this.spritesheet, 48, 64, 16, 16, 1, 0.33, true);

        // attack
        this.animations[2] = new Animator(this.spritesheet, 48, 64, 16, 16, 3, 0.03, false);



    }

    update(){
        if(this.invincible.active){
            invulnerability_active(this);  
        }
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        console.log(this.invincible.active);
        if(this.state == 0){
            this.transform.pos.x = this.owner.transform.pos.x-8 
            this.transform.pos.y = this.owner.transform.pos.y+12;
        }
    }

    draw(ctx){
        if(this.updatable){
            this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 20, 20, this.invincible.inverted);
        }
    }

    wind_up(){
        this.state = 1;
        this.transform.pos.y = this.owner.transform.pos.y - (16);
    }

    attack(){
        if(this.state != 2){
            this.state = 2;
        }

        if(this.animations[2].currentFrame() == 0){
            this.transform.pos.x = this.owner.transform.pos.x-8 
            this.transform.pos.y = this.owner.transform.pos.y - (16);
        } 
        else if(this.animations[2].currentFrame() == 1){
            this.transform.pos.x = this.owner.transform.pos.x-24;
            this.transform.pos.y = this.owner.transform.pos.y;
        }
        else if (this.animations[2].currentFrame() == 2){
            this.transform.pos.x = this.owner.transform.pos.x-8 
            this.transform.pos.y = this.owner.transform.pos.y+16;
            this.state = 0;
        }
    }

    die(){
        let explosion = new Explosion(this);
        gameEngine.camera.rooms[Math.floor(explosion.transform.pos.x/roomWidth)][Math.floor(explosion.transform.pos.y/roomHeight)].addEntity(explosion);
        //this.removeFromWorld = true;
        this.updatable = false;
        create_item(item_enum.small_heart, this.transform.pos, 2, 1);
        hit(this.owner, this, 2); // we lost the claw, initiate phase 1
        this.health.current = this.health.max;
        if(this.owner.phase != 1){
            this.owner.phase = 1;
            this.owner.water_pool = randomInt(4);
        }
    }

}

class Bubble{
    constructor(start_pos, target_pos){
        this.tag = "enemy";
        let random_modifier_x = (Math.random() * 16) - 8;
        let random_modifier_y = (Math.random() * 16) - 8;
        this.start_pos = start_pos.clone();
        this.target_pos = target_pos.clone();
        this.transform = new Transform(new Vec2(start_pos.x + random_modifier_x, start_pos.y + random_modifier_y), 1, new Vec2(0,0));
        this.move_speed = randomRange(45, 55);
        let velocity = Vec2.diff(new Vec2(target_pos.x + random_modifier_x, target_pos.y + random_modifier_y), this.start_pos);
        velocity.normalize()
        velocity.multiply(this.move_speed);
        this.transform.velocity = velocity
        this.target_pos = target_pos.clone();
        this.collider = new Collider(new Circle(this.transform.pos, 3), true, true, false);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level_two_boss.png");
        
        this.animator = new Animator(this.spritesheet, 96, 48, 6, 6, 1, 5, false);
        this.updatable = true;
        this.overlap_damage = true;
    }
    update(){
        if(this.animator.done){
            this.removeFromWorld = true;
        }
        else{
            //move_to_position(this, this.target_pos);
        }
       
    }

    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 6, 6);
    }
}

function move_to_position(entity, pos){
    // Reset velocity
    entity.transform.velocity.x = 0;
    entity.transform.velocity.y = 0;
    if (entity.transform.pos.x < pos.x){
        entity.transform.velocity.x += entity.move_speed;
    }
    else if (entity.transform.pos.x > pos.x){
        entity.transform.velocity.x -= entity.move_speed;
    }
    if (entity.transform.pos.y < pos.y){
        entity.transform.velocity.y += entity.move_speed;
    }
    else if (entity.transform.pos.y > pos.y){
        entity.transform.velocity.y -= entity.move_speed;
    }
}