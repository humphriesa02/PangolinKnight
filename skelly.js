class Skelly{
    constructor(info, player){
        this.tag = "enemy";
        this.home = info.position;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8), 1, new Vec2(0,0));
        this.health = new Health(8, 8);
        this.invincible = new Invincible(0.05);
        this.collider = new Collider(new AABB(this.transform.pos, 16, 16), true, true, false);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/skelly.png");
        this.facing = 0;
        this.move_speed = 18.75;
        this.move_time = 3;
        this.delay_time = 3;
        this.player = player;
        this.updatable = false;

        this.state = 0
        this.damage = 2;
        this.attack_start;
        this.attack_on_cooldown = false;
        this.attacking = false;

        this._WIND_UP_TIME = .7;
        this._SLASH_TIME = .48;
        this._COOLDOWN_TIME = this._WIND_UP_TIME + this._SLASH_TIME + 1.52;

        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations(){
        for (let i = 0; i < 4; i++){ // 4 directions
            this.animations.push([]);
        }

        // Walking right
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 48, 78, 2, 0.33, true);
        // Walking left
        this.animations[0][1] = new Animator(this.spritesheet, 96, 0, 48, 78, 2, 0.33, true);

        // Wind up right
        this.animations[1][0] = new Animator(this.spritesheet, 192, 0, 48, 78, 1, 1, true);
        // Wind up left
        this.animations[1][1] = new Animator(this.spritesheet, 240, 0, 48, 78, 1, 1, true);

        // Attack right
        this.animations[2][0] = new Animator(this.spritesheet, 288, 0, 48, 78, 3, this._SLASH_TIME / 3, true);
        // Attack left
        this.animations[2][1] = new Animator(this.spritesheet, 432, 0, 48, 78, 3, this._SLASH_TIME / 3, true);
    }
    

    update(){
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        
        if(this.invincible.active){
            invulnerability_active(this);  
        }
        
        if (this.winding) {
            this.wind_up();
        }
        else if (this.attacking) {
            this.slash();
        }
        else if (sq_distance(this.transform.pos, this.player.transform.pos) <= 1600) {
            if (!this.attack_on_cooldown) {
                this.attack_start = gameEngine.timer.gameTime;
                this.attack_on_cooldown = true;
                this.winding = true;
                this.transform.velocity = new Vec2();   
                this.animations[2][0].elapsedTime = 0;
                this.animations[2][0].done = false;
                this.animations[2][1].elapsedTime = 0;
                this.animations[2][1].done = false;
            }
            else if (gameEngine.timer.gameTime >= this.attack_start + this._COOLDOWN_TIME) {
                this.attack_on_cooldown = false;
            }
        }
        else {
            this.movement();
        }

        this.animation();
    }

    wind_up() {
        if (gameEngine.timer.gameTime >= this.attack_start + this._WIND_UP_TIME) {
            this.winding = false;
            this.attacking = true;

            let sword = new Skelly_Sword(gameEngine, this.facing, this.transform.pos, this, this.damage, this._SLASH_TIME);
            gameEngine.addEntity(sword);
        }
    }

    slash() {
        if (gameEngine.timer.gameTime >= this.attack_start + this._WIND_UP_TIME + this._SLASH_TIME) {
            this.attacking = false;
        }
    }

    movement() {
        // Reset velocity
        this.transform.velocity.x = 0;
        this.transform.velocity.y = 0;
        if (this.transform.pos.x < this.player.transform.pos.x && this.move_time > 0){
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
        else if (this.transform.pos.y > this.player.transform.pos.y && this.move_time > 0){
            this.transform.velocity.y -= this.move_speed;
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
        this.state = 0;
        this.idle = false;
        if (this.transform.velocity.x > 0 || this.transform.velocity.y > 0) {
            this.state = 0;
        }
        else {
            this.idle = true;
        }
        if (this.winding) {
            this.state = 1;
        }
        else if (this.attacking) {
            this.state = 2;
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
        let animation = this.animations[this.state][this.facing];
        animation.drawFrame(gameEngine.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, animation.width, animation.height, this.invincible.inverted);
        if (this.state == 0 && this.idle)
        {
            animation.elapsedTime -= gameEngine.clockTick;
        }
    }

    die(){
        let explosion = new Explosion(this);
        gameEngine.addEntity(explosion);
        this.removeFromWorld = true;
        create_item(item_enum.small_heart, this.transform.pos, 1, 0.6);
    }
}