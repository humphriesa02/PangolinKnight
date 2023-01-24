class Transform {
    constructor(pos, prev_pos = pos, scale = 1, velocity = new Vec2(0, 0),
     acceleration  = new Vec2(0, 0), facing = new Vec2(0, 0), angle = 0) {
        this.pos = pos;
        this.prev_pos = prev_pos;
        this.scale = scale;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.facing = facing;
        this.angle = angle;
    }
}

class Lifespan {
    constructor(lifespan, frame_created) {
        this.lifespan = lifespan;
        this.frame_created = frame_created;
    }
}

class Health {
    constructor(max, current) {
        this.max = max;
        this.current = current;
    }
}

class Input {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.attack = false;
    }
}

class Collider {
    constructor(body, block_move, block_vision, block_jump) {
        this.body = body;
        this.block_move = block_move;
        this.block_vision = block_vision;
        this.block_jump = block_jump;
    }
}

class Patrol_AI {
    constructor(patrol_points, current_position) {
        this.patrol_points = patrol_points;
        this.current_position = current_position;
    }
}


