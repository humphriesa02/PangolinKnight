class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.player = new Pangolin(gameEngine);
        this.loadLevel(3);
    }
    loadLevel(level){
    
        this.level = levels[level];
        this.player.transform.pos.x = this.level.start[0] * tileSize + 8;
        this.player.transform.pos.y = this.level.start[1] * tileSize + 8;
        this.map = new map(this.level.mapSprite);
        gameEngine.addEntity(this.map);
        
        for(let i = 0; i < this.level.pots.length; i++){
            gameEngine.addEntity(new pot(this.level.pots[i]))
        }

        for(let i = 0; i < this.level.blocks.length; i++){
            gameEngine.addEntity(new block(this.level.blocks[i]))
        }

        for(let i = 0; i < this.level.chests.length; i++){
            gameEngine.addEntity(new chest(this.level.chests[i]))
        }

        // for(let i = 0; i < this.level.doors.length; i++){
        //     gameEngine.addEntity(new door(this.level.doors[i]))
        // }

        for(let i = 0; i < this.level.rooms.length; i++){
                 gameEngine.addEntity(new room(this.level.rooms[i]))
        }

        for(let i = 0; i < this.level.crystals.length; i++){
            gameEngine.addEntity(new crystal(this.level.crystals[i]))
        }

        for(let i = 0; i < this.level.statues.length; i++){
            gameEngine.addEntity(new statue(this.level.statues[i]))
        }
        
        for(let i = 0; i < this.level.frogs.length; i++){
            gameEngine.addEntity(new Frog(this.level.frogs[i], this.player));
        }

        for(let i = 0; i < this.level.stairs.length; i++){
            gameEngine.addEntity(new stair(this.level.stairs[i]));
        }
        this.game.addEntity(this.player.shadow);
        gameEngine.addEntity(this.player);
        this.game.addEntity(this)
    }
    update(){
        if(this.x < Math.floor(this.player.transform.pos.x/roomWidth)){
            this.x++;
        }
        else if(this.x > Math.floor(this.player.transform.pos.x/roomWidth)){
            this.x--;
        }

        if(this.y < Math.floor(this.player.transform.pos.y/roomHeight)){
            this.y++;
        }
        else if(this.y > Math.floor(this.player.transform.pos.y/roomHeight)){
            this.y--;
        }
    }
    draw(ctx){

    }
}