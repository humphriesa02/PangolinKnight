class block{
    constructor(info){
        this.tag = "tile"
        this.home = info.position;
        if(info.state == 1){
            this.tag = "prop";
        }
        else{
            this.tag = "tile";
        }

        this.pushable = true;
        this.last_push;
        this.pushed_start;
        this.moving = false;
        this.destination;
        this.distance_traveled = 0;

        this._SPEED = 12;
        this._PUSH_TIME = 1;

        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Entities.png");
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.animator = new Animator(this.spritesheet, 32, 0, 16, 16, 1, 1, true);
        this.updatable = false;
    }
    update(){
        if (this.moving) {
            if (this.distance_traveled + (12 * gameEngine.clockTick) >= 16) {
                this.transform.pos = this.destination.clone();
                this.transform.velocity = new Vec2(0, 0);
                this.moving = false;
            }
            this.distance_traveled += 12 * gameEngine.clockTick;
        }
    }

    activate(entity) {
        if (this.pushable) {
            // If pushing is on consecutive frames
            if(gameEngine.timer.gameTime <= this.last_push + gameEngine.clockTick) {
                // If the required duration of pushing is met
                if (gameEngine.timer.gameTime >= this.pushed_start + this._PUSH_TIME) {
                    this.moving = true;
                    this.pushable = false;

                    if (entity.facing == 0) {       // Right
                        this.destination = new Vec2(this.transform.pos.x + 16, this.transform.pos.y);
                        this.transform.velocity.x = this._SPEED;
                    }
                    else if (entity.facing == 1) {  // Left
                        this.destination = new Vec2(this.transform.pos.x - 16, this.transform.pos.y);
                        this.transform.velocity.x = -this._SPEED;
                    }
                    else if (entity.facing == 2) {  // Up
                        this.destination = new Vec2(this.transform.pos.x, this.transform.pos.y - 16);
                        this.transform.velocity.y = -this._SPEED;
                    }
                    else if (entity.facing == 3) {  // Down
                        this.destination = new Vec2(this.transform.pos.x, this.transform.pos.y + 16);
                        this.transform.velocity.y = this._SPEED;
                    }
                }
            }
            // Not consecutive, pushing timer restarts
            else { 
                this.pushed_start = gameEngine.timer.gameTime;
            }
            this.last_push = gameEngine.timer.gameTime;
        }
    }

    draw(ctx){
        this.animator.drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
    }
    reset(){
        this.transform.pos.x = this.home[0] * 16 + 8;
        this.transform.pos.y = this.home[1] * 16 + 8;
        this.pushable = this.pushable_base;
    }
}
