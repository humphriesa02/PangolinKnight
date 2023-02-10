class room{
    constructor(info){
        this.tag = "room"
        this.position = info.position;
        gameEngine.addEntity(new door([this.position[0] * 17, this.position[1] * 13 + 6], info.doors.left));
        gameEngine.addEntity(new door([this.position[0] * 17 + 8, this.position[1] * 13], info.doors.up));
        gameEngine.addEntity(new door([this.position[0] * 17 + 16, this.position[1] * 13 + 6], info.doors.right));
        gameEngine.addEntity(new door([this.position[0] * 17 + 8, this.position[1] * 13 + 12], info.doors.down));
        this.entities = [];
        this.updatable = true;
        this.colliders = [];
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 64, this.position[1] * roomHeight + 8), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 8, this.position[1] * roomHeight + 48), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + roomWidth - 8, this.position[1] * roomHeight + 48), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + (roomWidth/2) + 72, this.position[1] * roomHeight + 8), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 64, this.position[1] * roomHeight + roomHeight - 8), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + 8, this.position[1] * roomHeight + (roomHeight/2) + 56), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + roomWidth - 64, this.position[1] * roomHeight + roomHeight - 8), 8, 8), true, true, false));
        this.colliders.push(new Collider(new AABB(new Vec2(this.position[0] * roomWidth + roomWidth - 8, this.position[1] * roomHeight + roomHeight - 48), 8, 8), true, true, false));
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