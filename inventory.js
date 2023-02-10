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
        this.displayed = false;

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
        if(this.displayed){

        }
    }

    add_to_hotbar(){
        
    }
}