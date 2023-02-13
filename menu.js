class Menu{ // If we are paused, let Menu decide what gets displayed
    constructor(){

        this.current_displayed = 0;
        this.inventory;
        this.settings;
    }

    update(){
        if(gameEngine.keys["Escape"]){
            gameEngine.paused = false;
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
                break;
        }
    }


    draw_main_menu(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/PangolinPauseScreen.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);
        console.log(roomWidth, roomHeight);
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
}

const menu_enum = {
    main: 0,
    inventory: 1,
    settings: 2
}