class room{
    constructor(info){
        this.tag = "room"
        this.position = info.position;
        this.doors = [];
        this.doors[0] = new door([this.position[0] * 17 + 8, this.position[1] * 13], info.doors.up);
        this.doors[1] = new door([this.position[0] * 17 + 16, this.position[1] * 13 + 6], info.doors.right);
        this.doors[2] = new door([this.position[0] * 17 + 8, this.position[1] * 13 + 12], info.doors.down);
        this.doors[3] = new door([this.position[0] * 17, this.position[1] * 13 + 6], info.doors.left);
        if(info.doors.up.button){
            gameEngine.addEntity(new button(info.doors.up.button, this.doors[0]))
        }
        if(info.doors.right.button){
            gameEngine.addEntity(new button(info.doors.right.button, this.doors[1]))
        }
        if(info.doors.down.button){
            gameEngine.addEntity(new button(info.doors.down.button, this.doors[2]))
        }
        if(info.doors.left.button){
            gameEngine.addEntity(new button(info.doors.left.button, this.doors[3]))
        }
        let open = [];
        for(let i = 0; i < 4; i++){
            if(this.doors[i].state == 1){
                open.push(this.doors[i]);
            }
        }
        if(info.doors.up.triggers){
            gameEngine.addEntity(new trigger(this, info.doors.up.triggers.enemies, 0, open, info.doors.up.triggers.reward))
        }
        if(info.doors.right.triggers){
            gameEngine.addEntity(new trigger(this, info.doors.right.triggers.enemies, 1, open, info.doors.right.triggers.reward))
        }
        if(info.doors.down.triggers){
            gameEngine.addEntity(new trigger(this, info.doors.down.triggers.enemies, 2, open, info.doors.down.triggers.reward))
        }
        if(info.doors.left.triggers){
            gameEngine.addEntity(new trigger(this, info.doors.left.triggers.enemies, 3, open, info.doors.left.triggers.reward))
        }
        gameEngine.addEntity(this.doors[0]);
        gameEngine.addEntity(this.doors[1]);
        gameEngine.addEntity(this.doors[2]);
        gameEngine.addEntity(this.doors[3]);
        this.entities = [];
        this.updatable = true;
        this.colliders = [];
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 64, this.position[1] * roomHeight + 8), 64, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 8, this.position[1] * roomHeight + 48), 8, 48), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + roomWidth - 8, this.position[1] * roomHeight + 48), 8, 48), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + (roomWidth/2) + 72, this.position[1] * roomHeight + 8), 64, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 64, this.position[1] * roomHeight + roomHeight - 8), 64, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 8, this.position[1] * roomHeight + (roomHeight/2) + 56), 8, 48), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + roomWidth - 64, this.position[1] * roomHeight + roomHeight - 8), 64, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + roomWidth - 8, this.position[1] * roomHeight + roomHeight - 48), 8, 48), true, true, false));
    }
    update(){
    }
    draw(ctx){
    }
    reset(){
        for(let i = 0; i < this.entities.length; i++){
            this.entities[i].reset();
            this.entities[i].updatable = false;
        }
    }
    addEntity(entitie){
        this.entities.push(entitie);
    }
    activate(){
        for(let i = 0; i < this.entities.length; i++){
            this.entities[i].updatable = true;
        }
    }
}

class trigger{
    constructor(room, enemies, state, doors, reward){
        this.rewardItem = reward.item;
        this.rewardPosition = new Transform(new Vec2(reward.position[0] * 16 + 8, reward.position[1] * 16 + 8))
        this.tag = "prop";
        this.updatable = true;
        this.room = room;
        this.doors = doors;
        this.enemies = enemies;
        this.loadCollider(state);
        this.actives = [];
        this.activated = false;
    }
    loadCollider(state){
        switch(state){
            case 0:
                this.position = [this.room.position[0] * 17 + 8, this.room.position[1] * 13 + 1]
                break;
            case 1:
                this.position = [this.room.position[0] * 17 + 15, this.room.position[1] * 13 + 6]
                break;
            case 2:
                this.position = [this.room.position[0] * 17 + 8, this.room.position[1] * 13 + 11]
                break;
            case 3:
                this.position = [this.room.position[0] * 17 + 1, this.room.position[1] * 13 + 6]
                break;
        }
        this.transform = new Transform(new Vec2(this.position[0] * 16 + 8, this.position[1] * 16 + 8));
        this.collider = new Collider(new AABB(this.transform.pos, .5, .5), false, true, false);
    }
    update(){
        for(let i = 0; i < this.actives.length; i++){
            if(this.actives[i].removeFromWorld){
                this.actives.splice(i, 1);
            }
        }
        if(this.activated && this.actives.length == 0){
            for(let i = 0; i < this.doors.length; i++){
                this.doors[i].state = 1;
            }
            create_item(this.rewardItem, this.rewardPosition.pos, 1, 1, false);
            this.removeFromWorld = true;
        }
    }
    draw(ctx){
        ctx.strokeRect((this.transform.pos.x - screenX() - 8) * params.scale, (this.transform.pos.y - screenY() - 8) * params.scale, 16 * params.scale, 16 * params.scale);    }
    activate(){
        if(!this.activated){
            for(let i = 0; i < this.doors.length; i++){
                this.doors[i].state = 2;
            }
            for(let i = 0; i < this.enemies.frogs.length; i++){
                this.actives.push(new Frog(this.enemies.frogs[i], gameEngine.player))
                this.actives[this.actives.length - 1].updatable = true;
            }
            for(let i = 0; i < this.actives.length; i++){
                gameEngine.addEntity(this.actives[i])
            }
            this.activated = true;
        }
    }
}