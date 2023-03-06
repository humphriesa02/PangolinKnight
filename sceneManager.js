class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.player = new Pangolin(gameEngine);
        this.hud = new HUD(this.player);
        //this.loadLevel(1);
        this.updatable = true;
    }
    loadLevel(level){
        this.player.removeFromWorld = false;
        this.hud.removeFromWorld = false;
        this.removeFromWorld = false;
        this.level = levels[level];
        this.player.transform.pos.x = this.level.start[0] * tileSize + 8;
        this.player.transform.pos.y = this.level.start[1] * tileSize + 8;
        this.x = Math.floor(this.player.transform.pos.x / roomWidth);
        this.y = Math.floor(this.player.transform.pos.y/roomHeight);
        this.map = new map(this.level.mapSprite);
        gameEngine.addEntity(this.map);

        this.rooms = []
        for(let i = 0; i < this.level.rooms.length; i++){
            if(this.rooms[this.level.rooms[i].position[0]] == undefined){
                this.rooms[this.level.rooms[i].position[0]] = [];
            }
            this.rooms[this.level.rooms[i].position[0]][this.level.rooms[i].position[1]] = new room(this.level.rooms[i]);
            gameEngine.addEntity(this.rooms[this.level.rooms[i].position[0]][this.level.rooms[i].position[1]]);
        }
        
        gameEngine.gravity = this.level.gravity;

        for(let i = 0; i < this.level.pits.length; i++){
            gameEngine.addEntity(new pit(this.level.pits[i]))
        }

        for(let i = 0; i < this.level.locks.length; i++){
            gameEngine.addEntity(new lock(this.level.locks[i]))
        }

        for(let i = 0; i < this.level.blocks.length; i++){
            let ablock = new block(this.level.blocks[i]);
            this.rooms[Math.floor(ablock.transform.pos.x/roomWidth)][Math.floor(ablock.transform.pos.y/roomHeight)].addEntity(ablock)
            gameEngine.addEntity(ablock)
        }

        for(let i = 0; i < this.level.chests.length; i++){
            gameEngine.addEntity(new chest(this.level.chests[i]))
        }


        for(let i = 0; i < this.level.crystals.length; i++){
            gameEngine.addEntity(new crystal(this.level.crystals[i]))
        }

        for(let i = 0; i < this.level.statues.length; i++){
            gameEngine.addEntity(new statue(this.level.statues[i]))
        }
        
        for(let i = 0; i < this.level.frogs.length; i++){
            let enemy = new Frog(this.level.frogs[i], this.player);
            this.rooms[Math.floor(enemy.transform.pos.x/roomWidth)][Math.floor(enemy.transform.pos.y/roomHeight)].addEntity(enemy);
            gameEngine.addEntity(enemy);

        }
        for(let i = 0; i < this.level.skellys.length; i++){
            let enemy = new Skelly(this.level.skellys[i], this.player);
            this.rooms[Math.floor(enemy.transform.pos.x/roomWidth)][Math.floor(enemy.transform.pos.y/roomHeight)].addEntity(enemy);
            gameEngine.addEntity(enemy);

        }
        for(let i = 0; i < this.level.slimes.length; i++){
            let enemy = new Slime(this.level.slimes[i], this.player);
            this.rooms[Math.floor(enemy.transform.pos.x/roomWidth)][Math.floor(enemy.transform.pos.y/roomHeight)].addEntity(enemy);
            gameEngine.addEntity(enemy);

        } 

        gameEngine.addEntity(new stair(this.level.stairs));
        this.game.addEntity(this.player.shadow);
        gameEngine.player = this.player;
        gameEngine.addEntity(this.player);
        this.game.addEntity(this)

        for(let i = 0; i < this.level.pots.length; i++){
            let apot = new pot(this.level.pots[i]);
            this.rooms[Math.floor(apot.transform.pos.x/roomWidth)][Math.floor(apot.transform.pos.y/roomHeight)].addEntity(apot);
            gameEngine.addEntity(apot);
        }
        this.hud.removeFromWorld = false;
        this.rooms[this.x][this.y].activate();
        gameEngine.addEntity(this.hud);
    }
    update(){

        if (!gameEngine.gravity) { // Camera behavior for top-down
            if(this.x < Math.floor(this.player.transform.pos.x/roomWidth)){
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].reset();
                }
                this.x++;
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].activate();
                }
            }
            else if(this.x > Math.floor(this.player.transform.pos.x/roomWidth)){
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].reset();
                }
                this.x--;
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].activate();
                }
            }

            if(this.y < Math.floor(this.player.transform.pos.y/roomHeight)){
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].reset();
                }
                this.y++;
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].activate();
                }
            }
            else if(this.y > Math.floor(this.player.transform.pos.y/roomHeight)){
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].reset();
                }
                this.y--;
                if(this.rooms[this.x][this.y]){
                    this.rooms[this.x][this.y].activate();
                }
            }
        }
        else { // Camera behavior for side-scroller
            let player_pos = this.player.transform.pos;
            let x = this.x * roomWidth + roomWidth / 2;
            let y = this.y * roomHeight + roomHeight / 2;
            let width_threshold = roomWidth / 8;

            if (player_pos.x > x + width_threshold) {
                x = player_pos.x - width_threshold;
            }
            else if (player_pos.x < x - width_threshold) {
                x = player_pos.x + width_threshold;
            }

            let height_threshold = roomHeight / 3.5;

            if (player_pos.y < y - height_threshold && this.y_destination == undefined) {
                this.y_destination = player_pos.y - height_threshold;
            } 
            else if (this.y_destination !== undefined) {
                y = this.camera_move_to(y);
            }

            if (player_pos.y > y + height_threshold) {
                this.y_destination = undefined;
                y = player_pos.y - height_threshold;
            }

            this.x = (x - roomWidth / 2) / roomWidth;
            this.y = (y - roomHeight / 2) / roomHeight;
        }

    }
    draw(ctx){

    }

    camera_move_to(y) {
        if (y > this.y_destination) {
            return y - 70 * gameEngine.clockTick;
        }
        else {
            let new_y = this.y_destination;
            this.y_destination = undefined;
            return new_y;
        }
    }
}