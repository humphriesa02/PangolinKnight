class Menu{ // If we are paused, let Menu decide what gets displayed
    constructor(){

        this.current_displayed = 0;
        this.inventory;
        this.settings;
        this.transition_cooldown_end = 0;
        this.transition_cooldown_duration = 0.5;
        this.reset_button = new menuButton(3, false, undefined);
    }

    update(){
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
            if(this.current_displayed == menu_enum.inventory){
                this.inventory.update();
            }
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
        if(this.reset_button.updatable != true && this.current_displayed == menu_enum.lose){
            this.reset_button.updatable = true;
        }
        this.reset_button.update();        
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
        ctx.font = '100px "VT323"';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.strokeText("Game", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 75 * params.scale);
        ctx.fillText("Game", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 - 75 * params.scale);
        ctx.strokeText("Over", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 55 * params.scale);
        ctx.fillText("Over", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 - 55 * params.scale);
        ctx.font = '30px "VT323"';
        ctx.strokeText("Continue?", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 + 60 * params.scale);
        ctx.fillText("Continue?", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 + 60 * params.scale);
        ctx.font = '100px "VT323"';
        ctx.strokeText("Continue?", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 * params.scale);
        ctx.fillText("Continue?", (roomWidth * params.scale) / 2, (roomHeight * params.scale) / 2 * params.scale);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/pangolin_play.png"), (this.reset_button.pos.x * params.scale) - ((64 * params.scale)/2), (this.reset_button.pos.y * params.scale)-((32 * params.scale)/2), 64 * params.scale, 32 * params.scale);
    }

    draw_win_menu(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/pangolin_win_screen.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);
        ctx.font = '70px "VT323"';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "white";
        ctx.lineWidth = 8;
        ctx.textAlign = "center";

        ctx.strokeText("Congratulations!", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 82 * params.scale);
        ctx.fillText("Congratulations!", (roomWidth * params.scale) /2, (roomHeight * params.scale) / 2 - 82 * params.scale);
        ctx.font = '40px "VT323"';
        ctx.strokeText("Pangolin Knight has defeated the tower,", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 - 62 * params.scale);
        ctx.fillText("Pangolin Knight has defeated the tower,", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 - 62 * params.scale);
        ctx.strokeText("and fulfilled his promise...", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 -50 * params.scale);
        ctx.fillText("and fulfilled his promise...", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 - 50 * params.scale);
        ctx.strokeText("To save his child!", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 - 38 * params.scale);
        ctx.fillText("To save his child!", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 - 38 * params.scale);
        ctx.strokeText("Huge thanks for playing from the devs:", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 - 14 * params.scale);
        ctx.fillText("Huge thanks for playing from the devs:", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 - 14 * params.scale);
        ctx.strokeText("Justin Goding", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 - 2 * params.scale);
        ctx.fillText("Justin Goding", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 - 2 * params.scale);
        ctx.strokeText("Alex Humphries", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 + 10 * params.scale);
        ctx.fillText("Alex Humphries", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 + 10 * params.scale);
        ctx.strokeText("Zac Moriarty", (roomWidth * params.scale) /2, ((roomHeight * params.scale)) / 2 + 22 * params.scale);
        ctx.fillText("Zac Moriarty", (roomWidth * params.scale) / 2, ((roomHeight * params.scale)) / 2 + 22 * params.scale);

        ctx.font = '16px "VT323"';
    

        ctx.strokeText("Disclaimer: this game was as an academic project, it uses some assets we do not legally own.", (roomWidth * params.scale) /2, (roomHeight * params.scale - 14 * params.scale));
        ctx.fillText("Disclaimer: this game was as an academic project, it uses some assets we do not legally own.", (roomWidth * params.scale) /2, (roomHeight * params.scale - 14 * params.scale));
        ctx.strokeText("All rights reserved to the original creators, contact the devs if you want the assets removed.", (roomWidth * params.scale) /2, (roomHeight * params.scale - 6 * params.scale));
        ctx.fillText("All rights reserved to the original creators, contact the devs if you want the assets removed.", (roomWidth * params.scale) /2, (roomHeight * params.scale - 6 * params.scale));
        //it contains copyright material and is not meant for selling
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
