const _GRAVITY = 0.08;

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

function physics(entities) {
    let movement_map = update_pos();
    character_tile_collisions(movement_map);
    player_enemy_collisions(entities);
    sword_character_collisions(entities);
    player_prop_collisions(entities);
}


// Update the position of all entities and add them to the movement map if they moved
function update_pos() {
    let movement_map = new Map([]);
    
    for (entity of gameEngine.entities) {
        if (entity.transform !== undefined) {
            entity.transform.prev_pos = entity.transform.pos.clone();

            if (entity.gravity !== undefined) {
                if (gameEngine.gravity) {
                    entity.gravity.velocity += _GRAVITY;
                    entity.transform.velocity.add(entity.gravity.velocity);
                }
                else {
                    entity.gravity.velocity = 0.0;
                }
            }

            if (entity.transform.velocity.x != 0.0 || entity.transform.velocity.y != 0.0) {
                entity.transform.pos.add(entity.transform.velocity);
                
                if (entity.tag !== undefined) {
                    if (movement_map.get(entity.tag) === undefined) {
                        movement_map.set(entity.tag, [entity]);
                    }
                    else {
                        movement_map.get(entity.tag).push(entity);
                    }
                }
            }
        }
    }

    return movement_map;
}


// Checks for and handles collision between characters and tiles
function character_tile_collisions(entities) {

    let characters = [];
    if (entities.get("player") !== undefined) {
        characters = characters.concat(entities.get("player"));
    }
    if (entities.get("enemy") !== undefined) {
        characters = characters.concat(entities.get("enemy"));
    }

    for (character of characters) {
        if (character.collider !== undefined) {
            for (tile of gameEngine.entity_map.get("tile")) {
                if (tile.collider.block_move) {
                    prevent_overlap(character, tile);
                }
            }
        }
    }
}

function player_enemy_collisions(entities){
    for (player of entities.get("player")){
        for (enemy of entities.get("enemy")) {
            if (enemy.collider !== undefined) {
                if (test_overlap(player.collider.area, enemy.collider.area)) {
                    console.log("PLAYER HIT");
                    hit(player, enemy);
                }
            }
        }
    }
}

// Checks for and handles collision between swords and characters
function sword_character_collisions(entities) {

    let characters = [];
    if (entities.get("player") !== undefined) {
        characters = characters.concat(entities.get("player"));
    }
    if (entities.get("enemy") !== undefined) {
        characters = characters.concat(entities.get("enemy"));
    }

    for (sword of entities.get("sword")) {
        for (character of characters) {
            if (character != sword.owner) {
                if (character.collider !== undefined && test_overlap(sword.collider.area, character.collider.area)) {
                    // Attack goes here
                    if(character.health !== undefined){
                        hit(character, sword);
                    }
                }
            }
        }
    }
}

function player_prop_collisions(entities) {
    player = entities.get("player")[0];
    if (player == undefined || player.collider == undefined) { return; }
    props = entities.get("prop");

    for (prop of props) {
        if (test_overlap(player.collider.area, prop.collider.area)) {
            if (prop.collider.block_move) { prevent_overlap(player, prop); }
            prop.activate(player);
        }
    }
}

function test_overlap(a, b) {
    if (a instanceof AABB && b instanceof AABB) {
        return test_AABBs(a, b).test;
    }
    else if (a instanceof Circle && b instanceof Circle)
    {
        return test_Circles(a, b).test;
    }
    else {
        if (a instanceof Circle && b instanceof AABB) {
            return test_Circle_AABB(a, b).test;
        }
        else if (a instanceof AABB && b instanceof Circle) {
            return test_Circle_AABB(b, a).test;
        }
    }

    return false;
}


// Gets the overlap of two AABBs a and b
function test_AABBs(a, b, ac = a.center, bc = b.center) {
    let ox = a.half.x + b.half.x - Math.abs(ac.x - bc.x);
    let oy = a.half.y + b.half.y - Math.abs(ac.y - bc.y);
    return {test: (ox > 0 && oy > 0), overlap: {x: ox, y: oy}};
}

// Tests for overlap and returns distance vector of two Circles a and b
function test_Circles(a, b) {
    let distance = Vec2.diff(a.center, b.center);
    let distance_squared = distance.dot(distance);

    let radii_sum = a.radius + b.radius;
    return {test: distance_squared <= radii_sum * radii_sum, distance: distance};
}

// Tests for overlap and returns distance vector and square distance between a Circle c and AABB b
function test_Circle_AABB(c, b) {
    let distance = Vec2.diff(c.center, b.center);
    let distance_squared = sqdist_point_AABB(c.center, b);

    return {test: (distance_squared < c.radius * c.radius), 
        distance_v: distance, 
        sqdist: distance_squared};
}

// Prevents overlap between two Entities a and b
function prevent_overlap(a, b) {
    let test;
    if (a.collider.area instanceof AABB && b.collider.area instanceof AABB) {
        test = test_AABBs(a.collider.area, b.collider.area);
        if(test.test) {
            prevent_overlap_AABBs(a, b, test.overlap);
        }
    }
    else if (a.collider.area instanceof Circle && b.collider.area instanceof Circle)
    {
        test = test_Circles(a.collider.area, b.collider.area);
        if (test.test) {
            prevent_overlap_circles(a, b, test.distance);
        }
    }
    else {
        let circle;
        let box;
        if (a.collider.area instanceof Circle && b.collider.area instanceof AABB) {
            circle = a;
            box = b;
        }
        else if (a.collider.area instanceof AABB && b.collider.area instanceof Circle) {
            circle = b;
            box = a;
        }

        test = test_Circle_AABB(circle.collider.area, box.collider.area);
        if (test.test) {
            prevent_overlap_circle_AABB(circle, box, test.distance_v, test.sqdist);
        }
    }
}

// Prevents overlap between two entities a and b if both should prevent overlap
function prevent_overlap_AABBs(a, b, overlap) {
    // Gets the overlap between a and b on the previous time step
    let prev_overlap = test_AABBs(a.collider.area, b.collider.area, a.transform.prev_pos, b.transform.prev_pos).overlap;

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

function prevent_overlap_circles(a, b, distance_vector) {
    let circle_a = a.collider.area;
    let circle_b = b.collider.area;

    let distance = distance_vector.compute_magnitude();
    let overlap = circle_a.radius + circle_b.radius - distance;

    let speed_a = a.transform !== undefined ? a.transform.velocity.dot(a.transform.velocity) : new Vec2(0, 0);
    let speed_b = b.transform !== undefined ? b.transform.velocity.dot(b.transform.velocity) : new Vec2(0, 0);

    if (speed_a == 0 && speed_b == 0) {
        return;
    }
    let ratio_a = speed_a / (speed_a + speed_b);
    let ratio_b = speed_b / (speed_a + speed_b);

    let normal = distance_vector;
    normal.normalize();
    circle_a.center.add(Vec2.scale(normal, overlap * ratio_a));
    circle_b.center.minus(Vec2.scale(normal, overlap * ratio_b));
}

function prevent_overlap_circle_AABB(c, b, distance_vector, sq_dist) {
    let circle = c.collider.area;
    let box = b.collider.area;
    let overlap = circle.radius - Math.sqrt(sq_dist);

    let speed_c = c.transform !== undefined ? c.transform.velocity.dot(c.transform.velocity) : new Vec2(0, 0);
    let speed_b = b.transform !== undefined ? b.transform.velocity.dot(b.transform.velocity) : new Vec2(0, 0);

    if (speed_c == 0 && speed_b == 0) {
        return;
    }

    let ratio_c = speed_c / (speed_c + speed_b);
    let ratio_b = speed_b / (speed_c + speed_b);

    let normal = distance_vector;
    normal.normalize();
    circle.center.add(Vec2.scale(normal, overlap * ratio_c));
    box.center.minus(Vec2.scale(normal, overlap * ratio_b));
}

// Computes the square distance between a point p and an AABB b
function sqdist_point_AABB(p, b) {
    // For each axis count any excess distance outside box extents
    let b_min = new Vec2(b.center.x - b.half.x, b.center.y - b.half.y);
    let b_max = new Vec2(b.center.x + b.half.x, b.center.y + b.half.y);

    let sqdist = 0.0;
    if (p.x < b_min.x) { sqdist += (b_min.x - p.x) * (b_min.x - p.x); }
    if (p.x > b_max.x) { sqdist += (p.x - b_max.x) * (p.x - b_max.x); }

    if (p.y < b_min.y) { sqdist += (b_min.y - p.y) * (b_min.y - p.y); }
    if (p.y > b_max.y) { sqdist += (p.y - b_max.y) * (p.y - b_max.y); }

    return sqdist;
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