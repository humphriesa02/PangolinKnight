class Item{
    constructor(item_type, pos){
        this.tag = "prop";
        this.transform = new Transform(pos.clone());
        this.in_air = new In_Air(0, 60, 50, 16);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.collider = new Collider(new Circle(this.transform.pos, 4), false, true, false);
        this.item = item_type;
        this.player;
        this.shadow = new Shadow(gameEngine, this.transform.pos, 8);
        gameEngine.addEntity(this.shadow);
        
        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 3; i++){ // an animation for each item
            this.animations.push([]);
        }
        /* Item 0, scale */
        this.animations[item_enum.scale] = new Animator(this.spritesheet, 0, 16, 16, 16, 1, 8, false);

        /* Item 1, small heart */
        this.animations[item_enum.small_heart] = new Animator(this.spritesheet, 64, 0, 16, 16, 1, 8, false);

        /* Item 2, small key */
        this.animations[item_enum.small_key] = new Animator(this.spritesheet, 0, 0, 16, 16, 1, 8, false);
    }

    update(){
        if(this.animations[this.item].done){
            this.shadow.removeFromWorld = true;
            this.removeFromWorld = true;
        }
        else if(this.player != undefined){
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
        this.animations[this.item].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y - this.in_air.z, 16, 16);
    }

    activate(entity){
        switch(this.item){
            // by item_enum
            //scale
            case 0: 
                entity.inventory.currency++;
                break;
            // small heart
            case 1:
                if(entity.health.current < entity.health.max){
                    entity.health.current++;        
                }
                break;
            // small key
            case 2:
                entity.inventory.small_keys++;
                break;
        }
        this.animations[this.item].elapsedTime = 0;
        this.animations[this.item].totalTime = 0.5;
        this.player = entity;
        this.picked_up = true;
        this.shadow.removeFromWorld = true;
    }
}

const item_enum={
    scale: 0,
    small_heart: 1,
    small_key: 2,
    sword: 3,
    health_potion: 4
}


function create_item(item_type, pos, quantity = 1, chance = 1){
    for(let i = 0; i < quantity; i++){
        let chance_percent = Math.random()
        if(chance_percent <= chance){
            let random_modifier_x = (Math.random() * 16) - 8;
            let random_modifier_y = (Math.random() * 16) - 8;
            let temp_item = new Item(item_type, new Vec2(pos.x + random_modifier_x, pos.y + random_modifier_y))
            gameEngine.addEntity(temp_item);
        }
        
    }
    
}