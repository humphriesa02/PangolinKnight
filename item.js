class Item{
    constructor(item_type, pos){
        this.tag = "prop";
        this.transform = new Transform(pos.clone());
        this.in_air = new In_Air(0, 60, 50, 16);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Items.png");
        this.collider = new Collider(new AABB(this.transform.pos, 4, 4), true, true, false);
        // default item is scale
        this.item = item_type;
        
        // Animations
        this.animations = [];
        this.loadAnimations();
    }

    // Set up our animations variable
    loadAnimations(){
        for (let i = 0; i < 2; i++){ // an animation for each item
            this.animations.push([]);
        }
        /* Item 0, scale */
        this.animations[0] = new Animator(this.spritesheet, 0, 16, 16, 16, 1, 8, false);

        /* Item 1, small heart */
        this.animations[1] = new Animator(this.spritesheet, 64, 0, 16, 16, 1, 8, false);
    }

    update(){
        if(this.animations[this.item].done){
            this.removeFromWorld = true;
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
                break;
            // small heart
            case 1:
                entity.health.current++;
                break;
        }
        this.removeFromWorld = true;
    }
}

const item_enum={
    scale: 0,
    small_heart: 1,
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