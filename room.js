class room{
    constructor(info){
        this.position = info.position;
        gameEngine.addEntity(new door([this.position[0] * 17, this.position[1] * 13 + 6], info.doors.left));
        gameEngine.addEntity(new door([this.position[0] * 17 + 8, this.position[1] * 13], info.doors.up));
        gameEngine.addEntity(new door([this.position[0] * 17 + 16, this.position[1] * 13 + 6], info.doors.right));
        gameEngine.addEntity(new door([this.position[0] * 17 + 8, this.position[1] * 13 + 12], info.doors.down));
    }
    update(){
        
    }
    draw(ctx){}
}