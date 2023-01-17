class map{
    constructor(player){
        this.player = player;
        this.prev_pos = {x: 0, y: 0};
        this.room_position = {x: 0, y: 0};
        this.spriteSheet = ASSET_MANAGER.getAsset("./sprites/map.png");
        this.animations = [];
        this.scale = 4;
        this.ROOM_HEIGHT = 8 * 16 * this.scale;
        this.ROOM_WIDTH = 10 * 16 * this.scale;
        this.loadAnimations();
        this.addEntities();
    }
    loadAnimations(){
        for(var i = 0; i < 3; i++) {//3 columns
            this.animations.push([]);
            for(var j = 0; j < 3; j++){//3 rows
                this.animations[i].push([]);
            }
        }

        this.animations[0][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[0][1] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[0][2] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);

        this.animations[1][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[1][1] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[1][2] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);

        this.animations[2][0] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[2][1] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
        this.animations[2][2] = new Animator(this.spriteSheet, 0, 0, 160, 128, 1, 1, true, this.scale);
    }
    addEntities(){
        this.room = rooms["room00"];
        for(let i = 0; i < this.room.pots.length; i++){
            gameEngine.addEntity(new pot(this.room.pots[i]));
        }
        for(let i = 0; i < this.room.blocks.length; i++){
            gameEngine.addEntity(new block(this.room.blocks[i]));
        }
    }

    update(){
        this.player_room();
    }

    draw(ctx){
        this.animations[this.room_position.x][this.room_position.y].drawFrame(gameEngine.clockTick,ctx, 0,0,160,128);
    }

    player_room() {
        let room_x = Math.floor(this.player.transform.pos.x / this.ROOM_WIDTH);
        let room_y = Math.floor(this.player.transform.pos.y / this.ROOM_HEIGHT); 
        this.room_position = {x: room_x, y: room_y};
        if (this.room_position.x != this.prev_pos.x || this.room_position.y != this.prev_pos.y)
        {
            console.log("Room changed");
        }
        this.prev_pos = {x: this.room_position.x, y: this.room_position.y};
    }
}