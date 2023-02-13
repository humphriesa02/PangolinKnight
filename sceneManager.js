class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.player = new Pangolin(gameEngine);
        this.hud = new HUD(this.player);
        this.loadLevel(1);
        this.updatable = true;
    }
    loadLevel(level){
        this.player.removeFromWorld = false;
        this.removeFromWorld = false;
        this.level = levels[level];
        this.player.transform.pos.x = this.level.start[0] * tileSize + 8;
        this.player.transform.pos.y = this.level.start[1] * tileSize + 8;
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
        this.player.gravity = new Gravity();

        for(let i = 0; i < this.level.pits.length; i++){
            gameEngine.addEntity(new pit(this.level.pits[i]))
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
        gameEngine.addEntity(this.hud);
    }
    update(){

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
    draw(ctx){

    }
}