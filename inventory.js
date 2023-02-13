class Inventory{
    constructor(){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.currency = 999;
        this.small_keys = 0;
        this.key_items = {
            sword: true,
            bomb:false,
            boomerang:false,
            bow:false
        }
        this.active = false;
        this.updatable = true;

        this.primary_item = item_enum.sword;
        this.hotbar = [item_enum.health_potion, item_enum.scale, item_enum.small_key];
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
    }

    update(){
        this.secondary_item = this.hotbar[this.selected];
        if(gameEngine.wheel && gameEngine.wheel.deltaY > 0 && this.selected > 0){
            this.selected--;
        }
        else if(gameEngine.wheel && gameEngine.wheel.deltaY < 0 && this.selected < this.hotbar.length-1){
            this.selected++;
        }
    }

    draw(ctx){
        // Background
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/pangolin_inventory.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);

        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                ctx.drawImage(this.spritesheet, 48, 64, 16, 16, (16 * params.scale ) + i * (36 * params.scale), (8 * params.scale ) + j * (29 * params.scale), 28 * params.scale, 28 * params.scale);
            }
        }

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

        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 195 * params.scale, 132 * params.scale, 24 * params.scale, 24 * params.scale);
        this.animations[this.primary_item].drawHUD(gameEngine.clockTick, ctx, 197, 135, 20, 20, false);

        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 227 * params.scale, 132 * params.scale, 24 * params.scale, 24 * params.scale);
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 227 * params.scale, 156 * params.scale, 24 * params.scale, 24 * params.scale);
        ctx.drawImage(this.spritesheet, 48, 64, 16, 16, 227 * params.scale, 180 * params.scale, 24 * params.scale, 24 * params.scale);
        for(let i = 0; i < 3; i++){
            this.animations[this.hotbar[i]].drawHUD(gameEngine.clockTick, ctx, 229, 134 + (i * 24), 20, 20, false)
        }
    }

    add_to_hotbar(){
        
    }
}