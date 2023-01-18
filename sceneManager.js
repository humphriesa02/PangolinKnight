class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.roomWidth = 64 * 10;
        this.roomHeight = 64 * 8;

        this.loadLevel(1);
        this.game.addEntity(this)
    }
    loadLevel(level){
        this.level = levels[level];
        this.map = new map(this.level.mapSprite);
        gameEngine.addEntity(this.map);
        
        for(let i = 0; i < this.level.pots.length; i++){
            gameEngine.addEntity(new pot(this.level.pots[i], 4))
        }

        for(let i = 0; i < this.level.blocks.length; i++){
            gameEngine.addEntity(new block(this.level.blocks[i], 4))
        }

        for(let i = 0; i < this.level.chests.length; i++){
            gameEngine.addEntity(new chest(this.level.chests[i], 4))
        }

        for(let i = 0; i < this.level.doors.length; i++){
            gameEngine.addEntity(new door(this.level.doors[i], 4))
        }

        for(let i = 0; i < this.level.crystals.length; i++){
            gameEngine.addEntity(new crystal(this.level.crystals[i], 4))
        }

        for(let i = 0; i < this.level.statues.length; i++){
            gameEngine.addEntity(new statue(this.level.statues[i], 4))
        }

        this.player = new Pangolin(gameEngine);
        gameEngine.addEntity(this.player);
    }
    update(){
        if(this.x < Math.floor((this.player.transform.pos.x + 32)/this.roomWidth)){
            this.x++;
            this.map.position.x++;
        }
        else if(this.x > Math.floor((this.player.transform.pos.x + 32)/this.roomWidth)){
            this.x--;
            this.map.position.x--;
        }

        if(this.y < Math.floor((this.player.transform.pos.y + 32)/this.roomHeight)){
            this.y++;
            this.map.position.y++;
        }
        else if(this.y > Math.floor((this.player.transform.pos.y + 32)/this.roomHeight)){
            this.y--;
            this.map.position.y--;
        }
    }
    draw(ctx){

    }
}