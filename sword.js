class Sword{
    constructor(game, facing, player_pos, player, damage, render = false, duration = 0.2){
        this.tag = "sword";
        Object.assign(this, {game, facing, player_pos});
        // Components
        let sword_pos = Object.assign({},player_pos);

        this.owner = player;
        // Decide where the sword will initially start
        switch(this.facing){
            case 0:
                this.transform = new Transform(new Vec2(sword_pos.x, sword_pos.y - 16));
                break;
            case 1:
                this.transform = new Transform(new Vec2(sword_pos.x, sword_pos.y - 16));
                break;
            case 2:
                this.transform = new Transform(new Vec2(sword_pos.x + 16, sword_pos.y));
                break;
            case 3:
                this.transform = new Transform(new Vec2(sword_pos.x - 16, sword_pos.y));
                break;
        }
        
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sword_anim.png");

        // Animations
        this.animations = [];
        this.loadAnimations();
        this.updatable = true;
        this.render = render;
        this.starttime = gameEngine.timer.gameTime;
        this.endtime = gameEngine.timer.gameTime + duration;
    }

     // Set up our animations variable
     loadAnimations(){
        for (let i = 0; i < 4; i++){ // 4 directions, right, left, up, down
            this.animations.push([]);
        }

        // Sword slash animations

        // Damage = 1
        // facing right
        this.animations[0] = new Animator(this.spritesheet, 0, 48, 16, 16, 4, 0.05, false);

        // facing left
        this.animations[1] = new Animator(this.spritesheet, 0, 32, 16, 16, 4, 0.05, false);

        // facing up
        this.animations[2] = new Animator(this.spritesheet, 0, 16, 16, 16, 4, 0.05, false);

        // facing down
        this.animations[3] = new Animator(this.spritesheet, 0, 0, 16, 16, 4, 0.05, false);

    }

    update(){
        switch(this.facing){
            case 0: // facing right
                if(this.animations[0].currentFrame() == 0){
                    this.transform.pos.y = this.player_pos.y - (16);
                } 
                else if(this.animations[0].currentFrame() == 1){
                    this.transform.pos.x = this.player_pos.x + (12.5);
                }
                else if(this.animations[0].currentFrame() == 2){
                    this.transform.pos.y = this.player_pos.y;  
                    this.transform.pos.x = this.player_pos.x + (16);
                }
                break;

                case 1: // facing left
                if(this.animations[1].currentFrame() == 0){
                    this.transform.pos.y = this.player_pos.y - (16);
                } 
                else if(this.animations[1].currentFrame() == 1){
                    this.transform.pos.x = this.player_pos.x - (12.5);
                }
                else if(this.animations[1].currentFrame() == 2){
                    this.transform.pos.y = this.player_pos.y;
                    this.transform.pos.x = this.player_pos.x - (16);
                }
                break;

                case 2: // facing up
                if(this.animations[2].currentFrame() == 0){
                    this.transform.pos.x = this.player_pos.x + (16);
                } 
                else if(this.animations[2].currentFrame() == 1){
                    this.transform.pos.y = this.player_pos.y - (12.5);
                    this.transform.pos.x = this.player_pos.x + (12.5);
                }
                else if(this.animations[2].currentFrame() == 2){
                    this.transform.pos.x = this.player_pos.x;
                    this.transform.pos.y = this.player_pos.y - (16)
                }
                break;

                case 3: // facing down
                if(this.animations[3].currentFrame() == 0){
                    this.transform.pos.x = this.player_pos.x - (16);
                } 
                else if(this.animations[3].currentFrame() == 1){
                    this.transform.pos.y = this.player_pos.y + (12.5);
                    this.transform.pos.x = this.player_pos.x - (12.5);
                }
                else if(this.animations[3].currentFrame() == 2){
                    this.transform.pos.x = this.player_pos.x;
                    this.transform.pos.y = this.player_pos.y + (16);
                }
                break;
        }

        if(this.animations[this.facing].done == true || gameEngine.timer.gameTime >= this.endtime){
            this.removeFromWorld = true;
        }
    }

    draw(ctx){
        if (this.render) {
            this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.transform.pos.x, this.transform.pos.y, 16, 16)
        }
    }
}

class Skelly_Sword{
    constructor(game, facing, skelly_pos, skelly, damage, duration = 0.2){
        this.tag = "sword";
        Object.assign(this, {game, facing, skelly_pos: skelly_pos});
        // Components
        let sword_pos = Object.assign({},skelly_pos);

        this.owner = skelly;
        // Decide where the sword will initially start
        switch(this.facing){
            case 0:
                this.transform = new Transform(new Vec2(sword_pos.x - 8, sword_pos.y - 16));
                break;
            case 1:
                this.transform = new Transform(new Vec2(sword_pos.x + 8, sword_pos.y - 16));
                break;
        }
        
        this.collider = new Collider(new AABB(this.transform.pos, 8, 8), true, true, false);

        this.updatable = true;

        this.starttime = gameEngine.timer.gameTime;
        this.endtime = gameEngine.timer.gameTime + duration;
        this.interval = duration / 3;
    }

    update(){
        switch(this.facing){
            case 0: // facing right
                if(gameEngine.timer.gameTime < this.starttime + this.interval){
                    this.collider.area.half.x = 12;
                    this.transform.pos.y = this.skelly_pos.y - 24;
                    this.transform.pos.x = this.skelly_pos.x + 16;
                } 
                else if(gameEngine.timer.gameTime < this.starttime + this.interval * 2){
                    this.collider.area.half.x = 8;
                    this.collider.area.half.y = 20;
                    this.transform.pos.y = this.skelly_pos.y;
                    this.transform.pos.x = this.skelly_pos.x + 24;
                }
                else if(gameEngine.timer.gameTime < this.starttime + this.interval * 3){
                    this.collider.area.half.x = 20;
                    this.collider.area.half.y = 8;
                    this.transform.pos.y = this.skelly_pos.y + 28;
                    this.transform.pos.x = this.skelly_pos.x;
                }
                break;

            case 1: // facing left
                if(gameEngine.timer.gameTime < this.starttime + this.interval){
                    this.collider.area.half.x = 12;
                    this.transform.pos.y = this.skelly_pos.y - 24;
                    this.transform.pos.x = this.skelly_pos.x - 16;
                } 
                else if(gameEngine.timer.gameTime < this.starttime + this.interval * 2){
                    this.collider.area.half.x = 8;
                    this.collider.area.half.y = 20;
                    this.transform.pos.y = this.skelly_pos.y;
                    this.transform.pos.x = this.skelly_pos.x - 24;
                }
                else if(gameEngine.timer.gameTime < this.starttime + this.interval * 3){
                    this.collider.area.half.x = 20;
                    this.collider.area.half.y = 8;
                    this.transform.pos.y = this.skelly_pos.y + 28;
                    this.transform.pos.x = this.skelly_pos.x;
                }
                break;
        }

        if(gameEngine.timer.gameTime >= this.endtime){
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {}
}