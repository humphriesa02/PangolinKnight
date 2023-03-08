class Inventory{
    constructor(player){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.currency = 0;
        this.small_keys = 1;
        this.bomb_count = 0;
        this.key_items = {
            sword: true,
            bomb:false,
            boomerang:false,
            bow:false,
            boss_key: true
        }
        this.active = false;
        this.updatable = true;
        this.player = player;

        this.item_buttons = [];
        this.total_item_count = 0;
        this.primary_item = item_enum.sword;
        this.hotbar = [];
        this.selected = 0;
        this.secondary_item = this.hotbar[this.selected];
        this.swap_queue = []; // for swapping items

        

        // must have an image for each item
        this.animations = [];
        this.loadAnimations();
        this.init_buttons();
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

        // bombs
        this.animations[item_enum.bomb] = new Animator(this.spritesheet, 48, 48, 16, 16, 1, 1, true);

        // booomerang
        this.animations[item_enum.boomerang] = new Animator(this.spritesheet, 32, 32, 16, 16, 1, 1, true);

        // boss key
        this.animations[item_enum.boss_key] = new Animator(this.spritesheet, 80, 0, 16, 16, 1, 1, true);
    }

    init_buttons(){
        let k = 0;
        for(let row = 0; row < 4; row++){
            for(let col = 0; col < 4; col++){
                let button = new InventoryButton(k, new Vec2((16 * params.scale ) + col * (36 * params.scale), (8 * params.scale ) + row * (29 * params.scale)),
                new Vec2(19  + (col * 36), 11 + (row * 29)), this.swap_queue, this);
                this.item_buttons.push(button);
                k++;
            }
        }
    }

    update(){
        for(let i = 0; i < this.item_buttons.length; i++){
            this.item_buttons[i].update();
        }
        for(let i = 0; i < 3; i++){
            this.hotbar[i] = this.item_buttons[i].item_held;
        }
    }

    draw(ctx){
        // Background
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/pangolin_inventory.png"), 0, 0, roomWidth * params.scale, roomHeight * params.scale);

        for(let i = 0; i < this.item_buttons.length; i++){
            this.item_buttons[i].draw(ctx);
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
        ctx.drawImage(this.spritesheet, 16, 32, 16, 16, 227 * params.scale, 132 * params.scale, 24 * params.scale, 24 * params.scale);

        ctx.drawImage(this.spritesheet, 0, 32, 16, 32, 217.5 * params.scale, 151 * params.scale, 12 * params.scale, 24 * params.scale);
        // Horizontal hotbar
        ctx.drawImage(this.spritesheet, 16, 48, 16, 16, 188 * params.scale, 175 * params.scale, 24 * params.scale, 24 * params.scale);
        ctx.drawImage(this.spritesheet, 16, 48, 16, 16, 211 * params.scale, 175 * params.scale, 24 * params.scale, 24 * params.scale);
        ctx.drawImage(this.spritesheet, 16, 48, 16, 16, 234 * params.scale, 175 * params.scale, 24 * params.scale, 24 * params.scale);
        for(let i = 0; i < this.hotbar.length; i++){
            if(this.hotbar[i] != undefined){
                this.hotbar[i].animations[this.hotbar[i].item].drawHUD(gameEngine.clockTick, ctx, 190 + (i * 23), 177, 20, 20, false);
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
        if(this.item_buttons[this.total_item_count].item_held == undefined){
            this.item_buttons[this.total_item_count].item_held = item;
        }
        else{
            while(this.item_buttons[this.total_item_count].item_held != undefined){
                this.total_item_count++;
            }
            this.item_buttons[this.total_item_count].item_held = item;
        }
        
        
        if(this.hotbar.length < 3){
            this.hotbar.push(item);
        }
        for(let i = 0; i < this.hotbar.length; i++){
            if(this.hotbar[i] == undefined){
                this.hotbar[i] = item;
            }
        }
    }

    remove_item(item){
        for(let i = 0; i < this.item_buttons.length; i++){
            if(this.item_buttons[i].item_held == item){
                this.item_buttons[i].item_held = undefined;
                this.total_item_count = 0;
                this.update();
            }
        }
    }

    reset(){
        if(this.currency - 20 > 0){
            this.currency -= 20;
        }
        else{
            this.currency = 0;
        }
        this.bomb_count = 0;
        
        for(let i = 0; i < this.item_buttons.length; i++){
            if(this.item_buttons[i].item_held != undefined && this.item_buttons[i].item_held.item != 3 && 
                this.item_buttons[i].item_held.item != 6 &&
                this.item_buttons[i].item_held.item != 7){
                    this.item_buttons[i].item_held = undefined;
                }
        }
    }
}

class InventoryButton{
    constructor(count, screen_pos, item_pos, swap_queue, inventory){
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png"); // Just need this for the box image
        this.item_held;
        this.screen_pos = screen_pos;
        this.aabb = new AABB(this.screen_pos, 8, 8);
        this.updatable = true;
        this.item_pos = item_pos;
        this.half_height = 28 * params.scale;
        this.half_width = 28 * params.scale;
        this.swap_queue_ref = swap_queue;
        this.highlighted = false;
        this.count = count;
        this.inventory = inventory;
    }
    update(){
        if(gameEngine.click){
            if(gameEngine.click.x > this.screen_pos.x && gameEngine.click.x < this.screen_pos.x + this.half_width &&
                gameEngine.click.y > this.screen_pos.y && gameEngine.click.y < this.screen_pos.y + this.half_height){
                    if(this.swap_queue_ref.length == 0){ // add to queue
                        if(this.item_held != undefined){
                            this.swap_queue_ref.push(this);
                            this.highlighted = true;
                        }
                    }
                    else if (this.swap_queue_ref.length == 1){ // swap
                        if(this.item_held != undefined){
                            let temp_button_item = this.swap_queue_ref[0].item_held;
                            this.swap_queue_ref[0].item_held = this.item_held;
                            this.item_held = temp_button_item;
                            this.highlighted = false;
                            this.swap_queue_ref[0].highlighted = false;
                            this.swap_queue_ref.splice(0, this.swap_queue_ref.length);
                        }
                        else{
                            this.swap_queue_ref[0].highlighted = false;
                            this.swap_queue_ref.splice(0, this.swap_queue_ref.length);
                        }
                    }
                    else{
                        // error
                    }
                }
        } 
    }

    draw(ctx){
        if(this.count == 0 || this.count == 1 || this.count == 2){
            ctx.drawImage(this.spritesheet, 16, 48, 16, 16, this.screen_pos.x, this.screen_pos.y, 28 * params.scale, 28 * params.scale);
        }
        else{
            ctx.drawImage(this.spritesheet, 48, 64, 16, 16, this.screen_pos.x, this.screen_pos.y, 28 * params.scale, 28 * params.scale);
        }
        if(this.item_held != undefined){
            this.item_held.animations[this.item_held.item].drawHUD(gameEngine.clockTick, ctx, this.item_pos.x, this.item_pos.y, 22, 22, false);
            if(this.item_held.item == item_enum.bomb){
                ctx.font = '32px "VT323"';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 6;
                ctx.strokeText(this.inventory.bomb_count, (this.screen_pos.x + this.half_width) - 6 * params.scale, (this.screen_pos.y + this.half_height) - 3 * params.scale);
                if(this.inventory.bomb_count == 20){
                    ctx.fillStyle = 'green'
                }
                else{
                    ctx.fillStyle = "white";
                }
                ctx.fillText(this.inventory.bomb_count, (this.screen_pos.x + this.half_width) - 6 * params.scale, (this.screen_pos.y + this.half_height) - 3 * params.scale);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        if(this.highlighted){
            draw_hud_rect(ctx, this.item_pos.x-1, this.item_pos.y-1, 24, 24, false, "yellow", 2);
        }
    }
}