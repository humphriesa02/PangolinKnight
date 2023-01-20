class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.roomWidth = 16 * params.scale * 10;
        this.roomHeight = 16 * params.scale * 8;

        this.player = new Pangolin(gameEngine);
        this.loadLevel(1);
    }
    loadLevel(level){
        this.level = levels[level];
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

        for(let i = 0; i < this.level.doors.length; i++){
            gameEngine.addEntity(new door(this.level.doors[i]))
        }

        for(let i = 0; i < this.level.crystals.length; i++){
            gameEngine.addEntity(new crystal(this.level.crystals[i]))
        }

        for(let i = 0; i < this.level.statues.length; i++){
            gameEngine.addEntity(new statue(this.level.statues[i]))
        }

        gameEngine.addEntity(this.player);
        this.game.addEntity(this)
    }
    update(){
        if(this.x < Math.floor((this.player.transform.pos.x + (8 * params.scale))/this.roomWidth)){
            this.x++;
            this.map.position.x++;
        }
        else if(this.x > Math.floor((this.player.transform.pos.x + (8 * params.scale))/this.roomWidth)){
            this.x--;
            this.map.position.x--;
        }

        if(this.y < Math.floor((this.player.transform.pos.y + (8 * params.scale))/this.roomHeight)){
            this.y++;
            this.map.position.y++;
        }
        else if(this.y > Math.floor((this.player.transform.pos.y + (8 * params.scale))/this.roomHeight)){
            this.y--;
            this.map.position.y--;
        }
    }
    draw(ctx){

    }
}