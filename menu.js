class Menu{ // If we are paused, let Menu decide what gets displayed
    constructor(){

        this.current_displayed = 0;
        this.inventory;
        this.settings;
        this.transition_cooldown_end = 0;
        this.transition_cooldown_duration = 0.5;
    }

    update(){
        console.log(this.current_displayed);
        if(this.current_displayed == menu_enum.win || this.current_displayed == menu_enum.lose){
            if(gameEngine.keys["r"]){
                clearEntities();
		        ctx.canvas.width =  roomWidth * params.scale;
		        ctx.canvas.height = roomHeight * params.scale;
		        ctx.imageSmoothingEnabled = false;
		        manager.loadLevel(1);
            }
        }
        else{
            if(gameEngine.keys["Escape"] && gameEngine.timer.gameTime >= this.transition_cooldown_end){
                gameEngine.paused = false;
                this.transition_cooldown_end = gameEngine.timer.gameTime + this.transition_cooldown_duration;
            }
            else if(gameEngine.keys["i"] && gameEngine.timer.gameTime >= this.transition_cooldown_end){
                if(this.current_displayed != menu_enum.inventory){
                    this.current_displayed = menu_enum.inventory;
                }
                else{
                    gameEngine.paused = false;
                }
                this.transition_cooldown_end = gameEngine.timer.gameTime + this.transition_cooldown_duration;
            } 
        }
        
    }

    draw(ctx){
        switch(this.current_displayed){
            case 0:
                this.draw_main_menu(ctx);
                break;
            case 1: 
                this.inventory.draw(ctx);
                break;
            case 2:
                this.draw_win_menu(ctx);
                break;
            case 3:
                this.draw_lose_menu(ctx);
                break;
        }
    }


    draw_main_menu(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/PangolinPauseScreen.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);
        //console.log(roomWidth, roomHeight);
        ctx.font = '80px "VT323"';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.textAlign = "center";
        ctx.strokeText("Paused", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2);
        ctx.fillStyle = "white";
        ctx.fillText("Paused", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    draw_lose_menu(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/pangolin_lose_screen.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);
        //console.log(roomWidth, roomHeight);
        ctx.font = '100px "VT323"';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.strokeText("Game", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 65 * params.scale);
        ctx.fillText("Game", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 - 65 * params.scale);
        ctx.strokeText("Over", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 + 75 * params.scale);
        ctx.fillText("Over", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 + 75 * params.scale);
        ctx.font = '30px "VT323"';
        ctx.strokeText("Try again!", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 + 85 * params.scale);
        ctx.fillText("Try again!", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 + 85 * params.scale);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    draw_win_menu(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/PangolinPauseScreen.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);
        //console.log(roomWidth, roomHeight);
        ctx.font = '70px "VT323"';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "white";
        ctx.lineWidth = 8;
        ctx.textAlign = "center";

        ctx.strokeText("Congratulations!", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 25);
        ctx.fillText("Congratulations!", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 25);
        ctx.font = '40px "VT323"';
        ctx.strokeText("You have made it past level 1!", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 + 60);
        ctx.fillText("You have made it past level 1!", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 + 60);
        ctx.strokeText("Please keep an eye out for", (roomWidth * params.scale) /2, ((roomHeight * params.scale) / 2) + 100);
        ctx.fillText("Please keep an eye out for", (roomWidth * params.scale) /2, ((roomHeight * params.scale) / 2) + 100);
        ctx.strokeText("when future levels are released!", (roomWidth * params.scale) /2, ((roomHeight * params.scale) / 2) + 140);
        ctx.fillText("when future levels are released!", (roomWidth * params.scale) /2, ((roomHeight * params.scale) / 2) + 140);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

const menu_enum = {
    main: 0,
    inventory: 1,
    win: 2,
    lose: 3,
    settings: 4,

}