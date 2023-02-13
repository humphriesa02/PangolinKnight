class room{
    constructor(info){
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
        gameEngine.addEntity(this.doors[0]);
        gameEngine.addEntity(this.doors[1]);
        gameEngine.addEntity(this.doors[2]);
        gameEngine.addEntity(this.doors[3]);
        this.entities = [];
        this.updatable = true;
        this.colliders = [];
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + 64, this.position[1] * roomHeight + 8], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + 8, this.position[1] * roomHeight + 48], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + roomWidth - 8, this.position[1] * roomHeight + 48], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + (roomWidth/2) + 72, this.position[1] * roomHeight + 8], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + 64, this.position[1] * roomHeight + roomHeight - 8], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + 8, this.position[1] * roomHeight + (roomHeight/2) + 56], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + roomWidth - 64, this.position[1] * roomHeight + roomHeight - 8], 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB([this.position[0] * roomWidth + roomWidth - 8, this.position[1] * roomHeight + roomHeight - 48], 8, 8), true, true, false));
    }
    update(){
    }
    draw(ctx){
        for(let i = 0; i < this.colliders.length; i++){
            ctx.strokeRect((this.colliders[i].area.center[0] - screenX() - 8) * params.scale, (this.colliders[i].area.center[1] - screenY() - 8) * params.scale, 16 * params.scale, 16 * params.scale)
        }
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