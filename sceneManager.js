class sceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.roomWidth =tileSize * 10;
        this.roomHeight =tileSize * 8;

        this.player = new Pangolin(gameEngine);
        this.loadLevel(1);
    }
    loadLevel(level){
    
        this.level = levels[level];
        
        this.map = new map(this.level.mapSprite);
        gameEngine.addEntity(this.map);
        
        for(let i = 0; i < this.level.pots.length; i++){
            gameEngine.addEntity(new pot(grid_to_mid_pixel(this.level.pots[i])))
        }

        for(let i = 0; i < this.level.blocks.length; i++){
            gameEngine.addEntity(new block(grid_to_mid_pixel(this.level.blocks[i])))
        }

        for(let i = 0; i < this.level.chests.length; i++){
            gameEngine.addEntity(new chest(grid_to_mid_pixel(this.level.chests[i])))
        }

        for(let i = 0; i < this.level.doors.length; i++){
            this.level.doors[i][0] = grid_to_mid_pixel(this.level.doors[i][0])
            gameEngine.addEntity(new door(this.level.doors[i]))
        }

        for(let i = 0; i < this.level.crystals.length; i++){
            gameEngine.addEntity(new crystal(grid_to_mid_pixel(this.level.crystals[i])))
        }

        for(let i = 0; i < this.level.statues.length; i++){
            gameEngine.addEntity(new statue(grid_to_mid_pixel(this.level.statues[i])))
        }
        
        for(let i = 0; i < this.level.frogs.length; i++){
            this.level.frogs[i][0] = grid_to_mid_pixel(this.level.frogs[i][0])
            gameEngine.addEntity(new Frog(this.level.frogs[i], this.player));
        }
        gameEngine.addEntity(new Test_Block(60, 60, 8, 8));
        gameEngine.addEntity(new Test_Block(80, 120, 80, 8));
        this.game.addEntity(this.player.shadow);
        gameEngine.addEntity(this.player);
        this.game.addEntity(this)
    }
    update(){
        if(this.x < Math.floor((this.player.transform.pos.x + (8))/this.roomWidth)){
            this.x++;
        }
        else if(this.x > Math.floor((this.player.transform.pos.x + (8))/this.roomWidth)){
            this.x--;
        }

        if(this.y < Math.floor((this.player.transform.pos.y + (8))/this.roomHeight)){
            this.y++;
        }
        else if(this.y > Math.floor((this.player.transform.pos.y + (8))/this.roomHeight)){
            this.y--;
        }
    }
    draw(ctx){

    }
}