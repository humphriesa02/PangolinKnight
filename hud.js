class HUD{
    constructor(player){
        this.player = player;
        this.item_spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.updatable = true;
    }


    update(){
        this.player.inventory.secondary_item = this.player.inventory.hotbar[this.player.inventory.selected];
        if(((gameEngine.wheel && gameEngine.wheel.deltaY > 0) || gameEngine.keys["ArrowUp"]) && this.player.inventory.selected > 0){
            this.player.inventory.selected--;
            gameEngine.keys["ArrowUp"] = false;
        }
        else if(((gameEngine.wheel && gameEngine.wheel.deltaY < 0) || gameEngine.keys["ArrowDown"]) && this.player.inventory.selected < this.player.inventory.hotbar.length-1){
            this.player.inventory.selected++;
            gameEngine.keys["ArrowDown"] = false;
        }
    }


    draw(ctx){
        // Health
        for(let i = 0; i < this.player.health.max; i++){
            if(i < this.player.health.current){ // full heart
                if(i >= 10){ // Second row
                    ctx.drawImage(this.item_spritesheet, 0, 64, 16, 16, (12 * params.scale ) + (i-10) * (10 * params.scale), 38, 11 * params.scale, 10 * params.scale);
                }
                else{
                    ctx.drawImage(this.item_spritesheet, 0, 64, 16, 16, (12 * params.scale ) + i * (10 * params.scale), 10, 11 * params.scale, 10 * params.scale);
                }
                
            }
            else{ //empty heart
                if(i >= 10){ //Second row
                    ctx.drawImage(this.item_spritesheet, 32, 64, 16, 16, (12 * params.scale) + (i-10) * (10 * params.scale), 38, 11 * params.scale, 10 * params.scale);
                }
                else{
                    ctx.drawImage(this.item_spritesheet, 32, 64, 16, 16, (12 * params.scale) + i * (10 * params.scale), 10, 11 * params.scale, 10 * params.scale);
                }
            }
        }

        // Draw hotbar
        ctx.drawImage(this.item_spritesheet, 48, 64, 16, 16, 14 * params.scale, 180 * params.scale, 24 * params.scale, 24 * params.scale);
        this.player.inventory.animations[this.player.inventory.primary_item].drawHUD(gameEngine.clockTick, ctx, 16.5, 182, 20, 20, false);

        ctx.drawImage(this.item_spritesheet, 48, 64, 16, 16, 40 * params.scale, 180 * params.scale, 24 * params.scale, 24 * params.scale);
        if(this.player.held_entity != undefined){
            this.player.held_entity.animator.drawHUD(gameEngine.clockTick, ctx, 42, 182, 20, 20, false);
        }
        else if(this.player.inventory.secondary_item != undefined){
            this.player.inventory.animations[this.player.inventory.secondary_item.item].drawHUD(gameEngine.clockTick, ctx, 42, 182, 20, 20, false);
        }
        
        ctx.drawImage(this.item_spritesheet, 64, 64, 16, 16, 60 * params.scale, 182 * params.scale, 20 * params.scale, 20 * params.scale);


        // Scales
        ctx.drawImage(this.item_spritesheet, 16, 16, 16, 16, 230 * params.scale, 188 * params.scale, 18 * params.scale, 18 * params.scale);
        // Keys
        ctx.drawImage(this.item_spritesheet, 0, 0, 16, 16, 230 * params.scale, 172 * params.scale, 18 * params.scale, 18 * params.scale);
        
        let scales = this.player.inventory.currency;
        let keys = this.player.inventory.small_keys;
        let scales_text = scales.toString();
        let keys_text = keys.toString();

        ctx.font = '42px "VT323"';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.textAlign = "start";
        ctx.strokeText(scales_text, 246 * params.scale, 200 * params.scale);
        ctx.strokeText(keys_text, 246 * params.scale, 186 * params.scale);
        ctx.fillStyle = "white";
        ctx.fillText(scales_text, 246 * params.scale, 200 * params.scale);
        ctx.fillText(keys_text, 246 * params.scale, 186 * params.scale);
        ctx.lineWidth = 2;
        ctx.stroke();

    }
}