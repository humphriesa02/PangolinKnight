class room{
    constructor(info){
        this.tag = "room"
        this.position = info.position;
        this.doors = [];
        this.entities = [];
        this.updatable = true;
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
    addDoor(door){
        this.doors.push(door);
    }
    activate(){
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
        for(let i = 0; i < this.actives.length; i++){
            if(this.actives[i].removeFromWorld){
                this.actives.splice(i, 1);
            }
        }
        if(this.activated && this.actives.length == 0){
            if(this.boss){
                gameEngine.addEntity(new stair(gameEngine.camera.level.stairs))
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
                gameEngine.addEntity(this.actives[i])
            }
            this.activated = true;
        }
    }
}