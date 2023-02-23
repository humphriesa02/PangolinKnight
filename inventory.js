class Inventory{
    constructor(player){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.currency = 0;
        this.small_keys = 0;
        this.key_items = {
            sword: true,
            bomb:false,
            boomerang:false,
            bow:false
        }
        this.active = false;
        this.updatable = true;
        this.player = player;

        this.items = [];
        this.primary_item = item_enum.sword;
        this.hotbar = [];
        this.selected = 0;
        this.secondary_item = this.hotbar[this.selected];

        // must have an image for each item
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 5; i++){ // animation for each item that will be visible by inventory
            this.animations.push([]);
        }

        // Scales
        this.animations[item_enum.scale] = new Animator(this.spritesheet, 16, 16, 16, 16, 1, 1, true);

        // Small heart
        this.animations[item_enum.small_heart] = new Animator(this.spritesheet, 64, 0, 16, 16, 1, 1, true);

        // Keys
        this.animations[item_enum.small_key] = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 1, true);

        // sword
        this.animations[item_enum.sword] = new Animator(this.spritesheet, 32, 16, 16, 16, 1, 1, true);

        // Healing potion
        this.animations[item_enum.health_potion] = new Animator(this.spritesheet, 16, 0, 16, 16, 1, 1, true);

        // damage potion
        this.animations[item_enum.damage_potion] = new Animator(this.spritesheet, 32, 0, 16, 16, 1, 1, true);
    }

    update(){
        
    }

    draw(ctx){
        // Background
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/pangolin_inventory.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);

        // Inventory items area
        let k = 0;
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                ctx.drawImage(this.spritesheet, 48, 64, 16, 16, (16 * params.scale ) + j * (36 * params.scale), (8 * params.scale ) + i * (29 * params.scale), 28 * params.scale, 28 * params.scale);
                if(this.items[k] != undefined){
                    this.items[k].animations[this.items[k].item].drawHUD(gameEngine.clockTick, ctx, 19  + (j * 36), 11 + (i * 29), 22, 22, false)
                    for(let l = 0; l < this.hotbar.length; l++){
                        if(this.hotbar[l] === this.items[k]){
                            draw_hud_rect(ctx, 18 + (j * 36), 10 + (i * 29), 24, 24, false, "yellow", 2);
                        }
                    }
                    
                }
                k++;
            }
        }

        // Map area
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/Pangolin_upclose.png"), 187 * params.scale, 8 * params.scale, 65 * params.scale, 65 * params.scale);
        ctx.font = '30px "VT323"';
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 6;
        ctx.strokeText("No map yet sorry!", 187 * params.scale, 75 * params.scale);
        ctx.fillStyle = "white";
        ctx.fillText("No map yet sorry!", 187 * params.scale, 75 * params.scale);

        // Stats area
        // Scales
        ctx.drawImage(this.spritesheet, 16, 16, 16, 16, 170 * params.scale, 105 * params.scale, 24 * params.scale, 24 * params.scale);
        // Keys
        ctx.drawImage(this.spritesheet, 0, 0, 16, 16, 170 * params.scale, 80 * params.scale, 24 * params.scale, 24 * params.scale);
        
        let scales = this.currency;
        let keys = this.small_keys;
        let scales_text = scales.toString();
        let keys_text = keys.toString();

        ctx.font = '50px "VT323"';
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 6;
        ctx.strokeText(scales_text, 195 * params.scale, 120 * params.scale);
        ctx.strokeText(keys_text, 195 * params.scale, 100 * params.scale);
        ctx.fillStyle = "white";
        ctx.fillText(scales_text, 195 * params.scale, 120 * params.scale);
        ctx.fillText(keys_text, 195 * params.scale, 100 * params.scale);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw mouse items and hotbar
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 195 * params.scale, 132 * params.scale, 24 * params.scale, 24 * params.scale);
        this.animations[this.primary_item].drawHUD(gameEngine.clockTick, ctx, 197, 135, 20, 20, false);
        // Roll image
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 227 * params.scale, 132 * params.scale, 24 * params.scale, 24 * params.scale);

        ctx.drawImage(this.spritesheet, 0, 32, 16, 32, 217.5 * params.scale, 151 * params.scale, 12 * params.scale, 24 * params.scale);
        // Horizontal hotbar
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 188 * params.scale, 175 * params.scale, 24 * params.scale, 24 * params.scale);
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 211 * params.scale, 175 * params.scale, 24 * params.scale, 24 * params.scale);
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 234 * params.scale, 175 * params.scale, 24 * params.scale, 24 * params.scale);
        for(let i = 0; i < this.hotbar.length; i++){
            this.animations[this.hotbar[i].item].drawHUD(gameEngine.clockTick, ctx, 190 + (i * 23), 177, 20, 20, false);
            if(i == this.selected){
                draw_hud_rect(ctx, 190 + (i * 23), 177, 20, 20, false, "yellow", 2);
            }
        }

        // Draw current usable item
        if(this.player.held_entity != undefined){
            this.player.held_entity.animator.drawHUD(gameEngine.clockTick, ctx, 65, 168, 8, 8, false);
        }
        else if(this.player.inventory.secondary_item != undefined){
            this.animations[this.secondary_item.item].drawHUD(gameEngine.clockTick, ctx, 65.5, 168, 8, 8, false);
        }
    }

    add_item(item){
        this.items.push(item);
        if(this.hotbar.length < 3){
            this.hotbar.push(item);
        }
    }
}