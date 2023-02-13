class Transform {
    constructor(pos, scale = 1, velocity = new Vec2(0, 0),
     acceleration  = new Vec2(0, 0), facing = new Vec2(0, 0), angle = 0) {
        this.pos = pos;
        this.prev_pos = pos.clone();
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
    constructor(area, block_move, block_vision, block_jump) {
        this.area = area;
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

class Gravity {
    constructor() {
        this.velocity = 0.0;
    }
}

class In_Air{
    constructor(air_speed, air_time, air_distance, air_height, starting_percentage = 1){
        Object.assign(this, {air_speed, air_time, air_distance, air_height, starting_percentage});
        this.z = 0;
        this.distance_remaining = air_distance * starting_percentage;
    }
}
// The entity we want to jump, the direction they are jumping
// not entering a direction will leave jump velocity to the entity
function in_air_jump(entity, direction = -1){
    if(entity.in_air != undefined){
        switch(direction){
            case 0:
                entity.transform.velocity.x = entity.in_air.air_speed * gameEngine.clockTick;
                break;
            case 1:
                entity.transform.velocity.x = -(entity.in_air.air_speed * gameEngine.clockTick)
                break;
            case 2:
                entity.transform.velocity.y = -entity.in_air.air_speed * gameEngine.clockTick;
                break;
            case 3:
                entity.transform.velocity.y = (entity.in_air.air_speed * gameEngine.clockTick)
                break;           
        }
        entity.in_air.distance_remaining = Math.max(0, entity.in_air.distance_remaining - entity.in_air.air_time * gameEngine.clockTick);
        entity.in_air.z = Math.sin(((entity.in_air.distance_remaining / entity.in_air.air_distance) * Math.PI)) * entity.in_air.air_height;
    }
    
}

class Invincible{
    // Active = we are invincible
    constructor(invincibility_duration = 0.15, flicker_duration = 0.1, active = false, inverted = false){
        Object.assign(this, {invincibility_duration, flicker_duration, active, inverted});
        this.current_invincibility_duration = invincibility_duration;
        this.current_flicker_duration = flicker_duration;
    }

}


class Knockback{
    constructor(target, source_pos, knockback_speed = 100, knockback_duration = 0.2){
        let vector = Vec2.diff(target.transform.pos, source_pos);
        vector.normalize();
        vector = Vec2.scale(vector, knockback_speed);
        target.transform.velocity = vector;
        this.knockback_end_time = gameEngine.timer.gameTime + knockback_duration;
    }
}


// When an entity is hit by an attack.
// Decrement health, and other things depending on what
// components they have
function hit(entity,attacker,damage = 1){
    if(entity.health !== undefined){
        // Entity contains invincible
        // Check if we are invincible before taking damage
        if(entity.invincible !== undefined){
            // We aren't invincible, take damage
            if(!entity.invincible.active){
                entity.health.current -= damage;
                if(entity.health.current <= 0){
                    entity.die();
                }
                entity.invincible.active = true;
                entity.knockback = new Knockback(entity, attacker.transform.pos);
            }
        }
        // No invinsibility, but we do have health
        // decrement health
        else{
            entity.health.current -= damage;
        }
    } 
}

// Trigger invulerability. Must have an "if(active)" check
function invulnerability_active(entity){
    if(entity.invincible !== undefined){
        let inv = entity.invincible;
        if(inv.current_flicker_duration <= 0){
            if(inv.current_invincibility_duration <= 0){
                inv.active = false;
                inv.inverted = false;
                inv.current_invincibility_duration = inv.invincibility_duration;
            }
            else{
                inv.inverted = !inv.inverted;
                inv.current_flicker_duration = inv.flicker_duration;
                inv.current_invincibility_duration -= gameEngine.clockTick;
            }
            
        }
        if (inv.current_flicker_duration > 0) {inv.current_flicker_duration -= gameEngine.clockTick;} 
    }
    
}