class Item{
    constructor(item_type, pos, removable){
        this.tag = "prop";
        this.removable = removable;
        this.transform = new Transform(pos.clone());
        this.in_air = new In_Air(0, 60, 50, 16);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.collider = new Collider(new Circle(this.transform.pos, 4), false, true, false);
        this.item = item_type;
        this.player;
        this.draw_size = new Vec2(16, 16);
        this.updatable = true;
        this.shadow = new Shadow(gameEngine, this.transform.pos, 8);
        gameEngine.addEntity(this.shadow);
        
        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 6; i++){ // an animation for each item
            this.animations.push([]);
        }
        /* Item 0, scale */
        this.animations[item_enum.scale] = new Animator(this.spritesheet, 0, 16, 16, 16, 1, 6, !this.removable);

        /* Item 1, small heart */
        this.animations[item_enum.small_heart] = new Animator(this.spritesheet, 64, 0, 16, 16, 1, 6, !this.removable);

        /* Item 2, small key */
        this.animations[item_enum.small_key] = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 6, !this.removable);

        /* Item 4, health potion */
        this.animations[item_enum.health_potion] = new Animator(this.spritesheet, 16, 0, 16, 16, 1, 6, !this.removable);

         /* Item 5, amage larvae */
         this.animations[item_enum.damage_potion] = new Animator(this.spritesheet, 32, 0, 16, 16, 1, 6, !this.removable);
    }

    update(){
        if(this.animations[this.item].done){
            this.shadow.removeFromWorld = true;
            this.removeFromWorld = true;
        }
        else if(this.player != undefined && this.picked_up){
            this.in_air.z = 0;
            this.transform.pos.x = this.player.transform.pos.x;
            this.transform.pos.y = this.player.transform.pos.y - 15;
        }
        else{
            in_air_jump(this);
        }
    }

    draw(ctx){
        if(document.getElementById("debug").checked){
            draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, 8, 8, false, true, 1);
        }
        if(this.item == item_enum.health_potion){ this.draw_size.x = 12; this.draw_size.y = 12;}
        this.animations[this.item].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.in_air.z, this.draw_size.x, this.draw_size.y);
    }

    activate(entity){
        switch(this.item){
            // by item_enum
            //scale
            case item_enum.scale: 
                entity.inventory.currency++;
                break;
            // small heart
            case item_enum.small_heart:
                if(entity.health.current < entity.health.max){
                    entity.health.current++;        
                }
                break;
            // small key
            case item_enum.small_key:
                entity.inventory.small_keys++;
                break;
            case item_enum.health_potion:
            case item_enum.damage_potion:
                entity.inventory.add_item(this);
                break;
        }
        this.animations[this.item].repeat = false;
        this.animations[this.item].elapsedTime = 0;
        this.animations[this.item].totalTime = 0.5;
        this.player = entity;
        this.picked_up = true;
        this.shadow.removeFromWorld = true;
    }

    use(entity){ // For items that are usable (items that have been added to inventory)
        switch(this.item){
            case item_enum.health_potion:
                if(entity.health.current < entity.health.max){
                    entity.health.current += 3;        
                }
                break;
            case item_enum.damage_potion:
                entity.damage = 3;
                break;
        }
        let inventory_item_index = entity.inventory.items.indexOf(this);
        entity.inventory.items.splice(inventory_item_index, 1);
        let inventory_hotbar_index = entity.inventory.hotbar.indexOf(this);
        if(inventory_hotbar_index != -1){
            entity.inventory.hotbar.splice(inventory_hotbar_index, 1);
        }
    }
}

const item_enum={
    scale: 0,
    small_heart: 1,
    small_key: 2,
    sword: 3,
    health_potion: 4,
    damage_potion: 5
}

/**
 * @param {Number} item_type - refer to item_enum
 * @param {Number} pos - Place to spawn the item
 * @param {Number} quantity - How many of the items to be spawned
 * @param {Number} chance - The percent chance to get an item
 * @returns Create an item in the world space
 */
function create_item(item_type, pos, quantity = 1, chance = 1, removable = true){
    for(let i = 0; i < quantity; i++){
        let chance_percent = Math.random()
        if(chance_percent <= chance){
            let random_modifier_x = (Math.random() * 16) - 8;
            let random_modifier_y = (Math.random() * 16) - 8;
            let temp_item = new Item(item_type, new Vec2(pos.x + random_modifier_x, pos.y + random_modifier_y), removable)
            gameEngine.addEntity(temp_item);
        }
        
    }
    
}