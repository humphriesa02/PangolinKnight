class Sword{
    constructor(game, facing, player_pos){
        Object.assign(this, {game, facing, player_pos});
        // Components
        let sword_pos = Object.assign({},player_pos);

        // Decide where the sword will initially start
        switch(this.facing){
            case 0:
                this.transform = new Transform(new Vec2(sword_pos.x, sword_pos.y - 64));
                break;
            case 1:
                this.transform = new Transform(new Vec2(sword_pos.x, sword_pos.y - 64));
                break;
            case 2:
                this.transform = new Transform(new Vec2(sword_pos.x + 64, sword_pos.y));
                break;
            case 3:
                this.transform = new Transform(new Vec2(sword_pos.x - 64, sword_pos.y));
        }
        
        this.collider;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/pangolin_sword_anim.png");

        // Animations
        this.animations = [];
        this.loadAnimations();

    }

     // Set up our animations variable
     loadAnimations(){
        for (let i = 0; i < 4; i++){ // 4 directions, right, left, up, down
        this.animations.push([]);
        }

        // Sword slash animations

        // facing right
        this.animations[0] = new Animator(this.spritesheet, 0, 48, 16, 16, 3, 0.07, false);

        // facing left
        this.animations[1] = new Animator(this.spritesheet, 0, 32, 16, 16, 3, 0.07, false);

        // facing up
        this.animations[2] = new Animator(this.spritesheet, 0, 16, 16, 16, 3, 0.07, false);

        // facing down
        this.animations[3] = new Animator(this.spritesheet, 0, 0, 16, 16, 3, 0.07, false);
    }

    update(){
        switch(this.facing){
            
            case 0: // facing right
                if(this.getAccurateFrame(0) == 0){
                    this.transform.pos.y = this.player_pos.y - 64;
                } 
                else if(this.getAccurateFrame(0) == 1){
                    this.transform.pos.x = this.player_pos.x + 64;
                }
                else if(this.getAccurateFrame(0) == 2){
                    this.transform.pos.y = this.player_pos.y;
                }
                break;

                case 1: // facing left
                if(this.getAccurateFrame(1) == 0){
                    this.transform.pos.y = this.player_pos.y - 64;
                } 
                else if(this.getAccurateFrame(1) == 1){
                    this.transform.pos.x = this.player_pos.x - 64;
                }
                else if(this.getAccurateFrame(1) == 2){
                    this.transform.pos.y = this.player_pos.y;
                }
                break;

                case 2: // facing up
                if(this.getAccurateFrame(2) == 0){
                    this.transform.pos.x = this.player_pos.x + 64;
                } 
                else if(this.getAccurateFrame(2) == 1){
                    this.transform.pos.y = this.player_pos.y - 64;
                }
                else if(this.getAccurateFrame(2) == 2){
                    this.transform.pos.x = this.player_pos.x;
                }
                break;

                case 3: // facing down
                if(this.getAccurateFrame(3) == 0){
                    this.transform.pos.x = this.player_pos.x - 64;
                } 
                else if(this.getAccurateFrame(3) == 1){
                    this.transform.pos.y = this.player_pos.y + 64;
                }
                else if(this.getAccurateFrame(3) == 2){
                    this.transform.pos.x = this.player_pos.x;
                }
                break;
        }

        if(this.animations[this.facing].done == true){
            this.removeFromWorld = true;
        }
      

    }

    // Since calling "getFrame" in update will be late
    // (the frame we have in update will be one frame behind what is drawn)
    // We can instead ask for what frame we will have in the next game tick
    getAccurateFrame(direction){
        return Math.floor((this.animations[direction].elapsedTime + this.game.clockTick)/ this.animations[direction].frameDuration)
    }

    draw(ctx){
        this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.transform.pos.x - (gameEngine.camera.x * gameEngine.camera.roomWidth), this.transform.pos.y - (gameEngine.camera.y * gameEngine.camera.roomHeight), 64, 64)
    }
}