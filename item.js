class Item{
    constructor(item_type, pos){
        this.tag = "prop";
        let item_pos = Object.assign({},pos);
        this.transform = new Transform(item_pos);
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
        this.animations[0] = new Animator(this.spritesheet, 0, 16, 16, 16, 1, 5, false);

        /* Item 1, small heart */
        this.animations[1] = new Animator(this.spritesheet, 64, 0, 16, 16, 1, 5, false);
    }

    update(){
        if(this.animations[this.item].done){
            this.removeFromWorld = true;
        }
    }

    draw(ctx){
        this.animations[this.item].drawFrame(gameEngine.clockTick,ctx,this.transform.pos.x, this.transform.pos.y, 16, 16);
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


function create_item(item_type, pos, quantity = 1){
    for(let i = 0; i < quantity; i++){
        let random_modifier = (Math.random() * 2.5) - 1.5;
        let temp_item = new Item(item_type, new Vec2(pos.x + random_modifier, pos.y + random_modifier))
        gameEngine.addEntity(temp_item);
    }
    
}