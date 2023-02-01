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

class Invincible{
    // Active = we are invincible
    constructor(invincibility_duration = 0.15, flicker_duration = 0.1, active = false, inverted = false){
        Object.assign(this, {invincibility_duration, flicker_duration, active, inverted});
        this.current_invincibility_duration = invincibility_duration;
        this.current_flicker_duration = flicker_duration;
    }

}


class Knockback{
    constructor(knockback_speed = 150, knockback_duration = 0.1, active = false){
        Object.assign(this, {knockback_speed, knockback_duration, active})
        this.current_knockback_duration = knockback_duration;
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
                    let explosion = new Explosion(entity);
                    gameEngine.addEntity(explosion);
                    entity.removeFromWorld = true;
                }
                entity.invincible.active = true;
                if(entity.knockback !== undefined){
                    entity.knockback.attacker = attacker;
                    entity.knockback.active = true;
                }
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

function knockback(entity){
    if(entity.knockback !== undefined){
        let knock = entity.knockback;
        if(knock.current_knockback_duration > 0){
            let direction = new Vec2();
            if(entity.tag == "sword"){
                direction = Vec2.diff(knock.attacker.owner.transform.pos, entity.transform.pos);
            }
            else{
                direction = Vec2.diff(knock.attacker.transform.pos, entity.transform.pos);
            }
            direction.normalize();
            direction =  Vec2.scale(direction, knock.knockback_speed * gameEngine.clockTick);
            entity.transform.velocity = new Vec2(-direction.x, -direction.y);
            console.log("Velocity", entity.transform.velocity);
            knock.current_knockback_duration -= gameEngine.clockTick;
        }
        else{
            knock.current_knockback_duration = knock.knockback_duration;
            knock.active = false;
        }
    }
}