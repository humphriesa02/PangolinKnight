class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.player = new Pangolin(gameEngine);
        this.hud = new HUD(this.player);
        this.loadLevel(1);
    }
    loadLevel(level){
        this.player.removeFromWorld = false;
        this.removeFromWorld = false;
        this.level = levels[level];
        this.player.transform.pos.x = this.level.start[0] * tileSize + 8;
        this.player.transform.pos.y = this.level.start[1] * tileSize + 8;
        this.map = new map(this.level.mapSprite);
        gameEngine.addEntity(this.map);
        
        gameEngine.gravity = this.level.gravity;
        this.player.gravity = new Gravity();

        for(let i = 0; i < this.level.pots.length; i++){
            gameEngine.addEntity(new pot(this.level.pots[i]))
        }
        
        for(let i = 0; i < this.level.pits.length; i++){
            gameEngine.addEntity(new pit(this.level.pits[i]))
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
        gameEngine.addEntity(new stair(this.level.stairs));
        this.game.addEntity(this.player.shadow);
        gameEngine.player = this.player;
        gameEngine.addEntity(this.player);
        gameEngine.addEntity(this.hud);
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