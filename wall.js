class wall{
    constructor(info){
        this.tag = "wall"
        this.updatable = true;
        this.transform = new Transform(new Vec2(info.position[0] * 16 + info.width, info.position[1] * 16 + info.height));
        this.collider = new Collider(new AABB(this.transform.pos, info.width, info.height), true, true, true);
    }
    update(){

    }
    draw(ctx){}
}