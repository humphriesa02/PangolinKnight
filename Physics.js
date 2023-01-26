function physics_test_init() {
    let units = [];
    let pos_x = 0.0;
    let pos_y = 0.0;
    for (i = 0; i < 1500; i++) {
        pos_x = (Math.random() * 256) + 256;
        pos_y = (Math.random() * 25) + 25;

        let particle = new Particle(true);
        particle.v_pos = new Vec2(pos_x, pos_y);
        particle.f_radius = Math.random() * 10;
        units.push(particle);
    }
    for (i = 0; i < 10; i++)
    {
        pos_x = (Math.random() * 512) + 256;
        pos_y = (Math.random() * 384) + 192;

        let particle = new Particle(false);
        particle.v_pos = new Vec2(pos_x, pos_y);
        particle.v_prev_pos = particle.v_pos;
        particle.f_radius = 50;
        particle.f_mass = 100;
        particle.color = "gray";
        units.push(particle);
    }

    return units;
}

// Returns whether two collider areas a and b are overlapping
function testAABBAABB(a, b) {
    if (Math.abs(a.center.x - b.center.x) > (a.half.x + b.half.x)) { return false; }
    if (Math.abs(a.center.y - b.center.y) > (a.half.y + b.half.y)) { return false; }
    return true;
}

// Gets the overlap of two collider areas a and b
function get_AABBAABB_overlap(a, b, ac = a.center, bc = b.center) {
    let ox = a.half.x + b.half.x - Math.abs(ac.x - bc.x);
    let oy = a.half.y + b.half.y - Math.abs(ac.y - bc.y);
    return {x: ox, y: oy};
}

// Prevents overlap between two entities a and b if both should prevent overlap
function prevent_overlap(a, b) {
    // Checks b has colliders, blocks movement, if a or b has moved since the last frame,
    // and if they are overlapping, if any of those conditions are false it exits early
    if (b.collider === undefined || !b.collider.block_move) return;
    if (a.transform.pos == a.transform.prev_pos &&
        b.transform.pos == b.transform.prev_pos) return;
    
    let overlap = get_AABBAABB_overlap(a.collider.area, b.collider.area)
    if (overlap.x <= 0 || overlap.y <= 0) return;

    // Gets the overlap between a and b on the previous time step
    let prev_overlap = get_AABBAABB_overlap(a.collider.area, b.collider.area, a.transform.prev_pos, b.transform.prev_pos);

    // If the overlap is horizontal
    if (prev_overlap.y > 0.0001) {
        // If a is on the left push a to the left and b to the right
        if (a.transform.pos.x < b.transform.pos.x) {
            a.transform.pos.x -= overlap.x;
        }
        // If a is on the right push a to the right and b to the left
        else {
            a.transform.pos.x += overlap.x;
        }
    }
    // If the overlap is vertical
    else if (prev_overlap.x > 0.0001) {
        // If a is above, push a up and b down
        if (a.transform.pos.y < b.transform.pos.y) {
            a.transform.pos.y -= overlap.y;
            if (gameEngine.gravity && a.gravity !== undefined) {
                a.gravity.velocity = 0.0;
                a.grounded = true;
                a.jumping = false;
            }
        }
        // If a below, push a down and b up
        else {
            a.transform.pos.y += overlap.y;
        }
    }
    // If the overlap is perfectly diagonal
    else {
        let relative_velocity = Vec2.diff(a.transform.velocity, b.transform.velocity);
        // If the relative velocity is greater in the horizontal component then favor
        // pushing the objects out in the vertical direction
        if (Math.abs(relative_velocity.x) > Math.abs(relative_velocity.y)) {
            if (a.transform.pos.y < b.transform.pos.y) {
                a.transform.pos.y -= overlap.y;
            }
            else {
                a.transform.pos.y += overlap.y;
            }
        }
        // If the speed is greater in the vertical then favor pushing in the horizontal
        else {
            if (a.transform.pos.x < b.transform.pos.x) {
                a.transform.pos.x -= overlap.x;
            }
            else {
                a.transform.pos.x += overlap.x;
            }
        }
    }
}

// Checks for and handles collision between characters and tiles
function character_tile_collisions(entities) {

    let characters = entities.get("player").concat(entities.get("enemy"));

    for (character of characters) {
        if (character.collider !== undefined && character.collider.block_move) {
            for (tile of entities.get("tile")) {
                prevent_overlap(character, tile);
            }
        }
    }
}

function player_enemy_collisions(entities){
    
    let characters = entities.get("player").concat(entities.get("enemy"));

    for (player of entities.get("player")){
        for (character of characters){
            if(character.tag != "player"){
                if (character.collider !== undefined && testAABBAABB(player.collider.area, character.collider.area)) {
                    console.log("PLAYER HIT");
                    hit(player, character);
                }
            }
        }
    }
}

// Checks for and handles collision between swords and characters
function sword_character_collisions(entities) {

    let characters = entities.get("player").concat(entities.get("enemy"));

    for (sword of entities.get("sword")) {
        for (character of characters) {
            if (character != sword.owner) {
                if (character.collider !== undefined && testAABBAABB(sword.collider.area, character.collider.area)) {
                    // Attack goes here
                    if(character.health !== undefined){
                        hit(character, sword);
                    }
                }
            }
        }
    }
}

function physics(entities) {
    character_tile_collisions(entities);
    player_enemy_collisions(entities);
    sword_character_collisions(entities);

    
    for (entity of gameEngine.entities) {
        if (entity.gravity !== undefined) {
            if (gameEngine.gravity) {
                entity.gravity.velocity += .08;
            }
            else {
                entity.gravity.velocity = 0.0;
            }
        }
    }
    
}

class Test_Block {
    constructor(x, y, x_width, y_width) {
        this.tag = "tile";
        this.transform = new Transform(new Vec2(x, y));
        this.transform.prev_pos = this.transform.pos;
        this.collider = new Collider(new AABB(this.transform.pos, x_width, y_width), true, true, false);
    }

    update() {}

    draw(ctx) {
        draw_rect(ctx, this.transform.pos.x, this.transform.pos.y, this.collider.area.half.x * 2, this.collider.area.half.y * 2, false, true, 1);
    }

}