class room{
    constructor(info){
        this.tag = "room"
        this.position = info.position;
        this.doors = [];
        this.entities = [];
        this.deads = [];
        this.entity_map = new Map([
            ["player", []],
            ["enemy", []],
            ["sword", []],
            ["prop", []],
            ["tile", []]
        ]);
        this.updatable = true;
        this.active = false;
        this.false_floor_room = info.false_floor_room;
        if(this.false_floor_room){
            this.total_false_floors = info.false_floor_total;
            this.broken_false_floors = [];
        }
        
    }
    update(){
        if(this.active){
            if(!this.paused){
                for (let i = 0; i < this.entities.length; i++) {
                    let entity = this.entities[i];
        
                    if (!entity.removeFromWorld && entity.updatable) {
                        entity.update();
                    }
                }
        
                for (let i = this.entities.length - 1; i >= 0; --i) {
                    if (this.entities[i].removeFromWorld) {
                        if(this.entities[i].tag != undefined){
                            let index = this.entity_map.get(this.entities[i].tag).indexOf(this.entities[i]);
                            this.entity_map.get(this.entities[i].tag).splice(index, 1);
                        }
                        if(!(this.entities[i] instanceof trigger || this.entities[i] instanceof Sword || this.entities[i] instanceof Bomb)){
                            this.deads.push(this.entities[i]);
                        }
                        this.entities.splice(i, 1);
                    }
                }
    
                physics(this.entities, this.entity_map);
            }
            if(this.false_floor_room){
                let props = this.entity_map.get("prop");
                for(let prop of props){
                    if(prop instanceof falsefloor && prop.state == 1){
                        if(!this.broken_false_floors.includes(prop)){this.broken_false_floors.push(prop);}
                        if(this.broken_false_floors.length >= this.total_false_floors){
                            for(let door of this.doors){
                                door.state = 1;
                            }
                        }
                    }
                }
            }
        }
    }
    draw(ctx){
        if(this.active){
            // Draw latest things first
            for (let i =  0; i < this.entities.length; i++) {
                this.entities[i].draw(ctx, this);
                if(document.getElementById("debug").checked){
                    if (this.entities[i].collider !== undefined) {
                        if (this.entities[i].collider.area instanceof AABB) {
                            draw_rect(ctx, this.entities[i].transform.pos.x, this.entities[i].transform.pos.y, 
                                this.entities[i].collider.area.half.x * 2, this.entities[i].collider.area.half.y * 2, false, true, 1);
                        }
                        else if (this.entities[i].collider.area instanceof Circle) {
                            draw_circle(ctx, this.entities[i].transform.pos.x, this.entities[i].transform.pos.y,
                                this.entities[i].collider.area.radius, false, true, 1);
                        }
                    }
                    if (this.entities[i].colliders !== undefined) {
                        for (let collider of this.entities[i].colliders) {
                            if (collider.area instanceof AABB) {
                                draw_rect(ctx, collider.area.center.x, collider.area.center.y, 
                                    collider.area.half.x * 2, collider.area.half.y * 2, false, true, 1);
                            }
                            else if (collider.area instanceof Circle) {
                                draw_circle(ctx, collider.area.center.x, collider.area.center.y,
                                    collider.area.radius, false, true, 1);
                            }
                        }
                    }
                }
            }
        }
        
    }
    reset(){
        this.active = false;
        for(let i = this.deads.length - 1; i >= 0; --i){
            this.addEntity(this.deads[i]);
            this.deads.splice(i,1);
        }
        for(let i = 0; i < this.entities.length; i++){
            if('reset' in this.entities[i]){
                this.entities[i].reset();
            } 
            this.entities[i].updatable = false;
        }
    }
    addEntity(entity){
        this.entities.push(entity);
        if (entity.tag !== undefined) {
            if (this.entity_map.get(entity.tag) === undefined) {
                this.entity_map.set(entity.tag, [entity]);
            }
            else {
                this.entity_map.get(entity.tag).push(entity);
            }
        }
    }
    addDoor(door){
        this.doors.push(door);
    }
    activate(){
        this.active = true;
        for(let i = 0; i < this.entities.length; i++){
            this.entities[i].updatable = true;
        }
    }
}

class trigger{
    constructor(info, room){
        if(!info.boss){
            this.rewardItem = info.reward.item;
            this.rewardPosition = new Transform(new Vec2(info.reward.position[0] * 16 + 8, info.reward.position[1] * 16 + 8))
        }
        this.tag = "prop";
        this.updatable = true;
        this.room = room;
        this.doors = room.doors;
        this.enemies = info.enemies;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + 8, info.position[1] * 16 + 8));
        this.collider = new Collider(new AABB(this.transform.pos, .5, .5), false, true, false);
        this.actives = [];
        this.activated = false;
        this.boss = info.boss;
    }
    update(){
        for(let i = this.actives.length -1; i >= 0; i--){
            if(this.actives[i].removeFromWorld){
                if(this.room.deads.indexOf(this.actives[i]) > -1){
                    this.room.deads.splice(this.room.deads.indexOf(this.actives[i]),1)
                    this.actives.splice(i, 1);
                }
               
            }
        }
        if(this.activated && this.actives.length == 0){
            if(this.boss){
                this.room.addEntity(new stair(gameEngine.camera.level.stairs))
            }
            else{
                for(let i = 0; i < this.doors.length; i++){
                    this.doors[i].state = 1;
                }
                if(this.rewardItem){
                    create_item(this.rewardItem, this.rewardPosition.pos, 1, 1, false);
                }
            }
            this.removeFromWorld = true;
        }
    }
    draw(ctx){}
    activate(){
        if(!this.activated){
            for(let i = 0; i < this.doors.length; i++){
                this.doors[i].state = 2;
            }
            if(this.enemies.frogs){
                for(let i = 0; i < this.enemies.frogs.length; i++){
                    this.actives.push(new Frog(this.enemies.frogs[i], gameEngine.player))
                    this.actives[this.actives.length - 1].updatable = true;
                }
            }
            if(this.enemies.skellys){
                for(let i = 0; i < this.enemies.skellys.length; i++){
                    this.actives.push(new Skelly(this.enemies.skellys[i], gameEngine.player))
                    this.actives[this.actives.length - 1].updatable = true;
                }
            }
            for(let i = 0; i < this.actives.length; i++){
                this.room.addEntity(this.actives[i])
            }
            this.activated = true;
        }
    }
    reset(){
        this.activated = false;
        for(let i = this.actives.length-1; i >= 0; i--){
            this.actives[i].removeFromWorld = true;
        }
        for(let i = 0; i < this.doors.length; i++){
            this.doors[i].state = 1;
        }
        this.room.active = true;
        this.room.update();
        this.room.active = false;
        this.update();
    }
}