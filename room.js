class room{
    constructor(info){
        this.position = info.position;
        gameEngine.addEntity(new door([this.position[0] * 10, this.position[1] * 8 + 3.5], info.doors.left));
        gameEngine.addEntity(new door([this.position[0] * 10 + 4.5, this.position[1] * 8], info.doors.up));
        gameEngine.addEntity(new door([this.position[0] * 10 + 9, this.position[1] * 8 + 3.5], info.doors.right));
        gameEngine.addEntity(new door([this.position[0] * 10 + 4.5, this.position[1] * 8 + 7], info.doors.down));
    }
    update(){
        
    }
    draw(ctx){}
}