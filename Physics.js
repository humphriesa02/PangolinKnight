const _GRAVITY = 280;

function physics_test_init() {
    let units = [];
    let pos_x = 0.0;
    let pos_y = 0.0;
    for (let i = 0; i < 1500; i++) {
        pos_x = (Math.random() * 256) + 256;
        pos_y = (Math.random() * 25) + 25;

        let particle = new Particle(true);
        particle.v_pos = new Vec2(pos_x, pos_y);
        particle.f_radius = Math.random() * 10;
        units.push(particle);
    }
    for (let i = 0; i < 10; i++)
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

function physics(entities,entity_map) {
    let movement_map = update_pos(entities);
    character_tile_collisions(movement_map, entity_map);
    character_room_collisions(movement_map, entity_map);
    character_explosion_collisions(entity_map)
    player_enemy_collisions(entity_map);
    sword_character_collisions(entity_map);
    prop_collisions(entity_map);
    room_explosion_collisions(entity_map);
}


// Update the position of all entities and add them to the movement map if they moved
function update_pos(entities) {
    let movement_map = new Map([]);
    
    for (let entity of entities) {
        if (entity.transform !== undefined) {
            entity.transform.prev_pos = entity.transform.pos.clone();

            if (entity.tag == "player") {
                console.log("here");
            }
            if (gameEngine.gravity) {
                if (entity.gravity == true) {
                    if (entity.rolling) {
                        entity.transform.velocity.add(Vec2.scale(entity.centripetal_vector, _GRAVITY * gameEngine.clockTick)); 
                    }
                    else {
                        entity.transform.velocity.y += _GRAVITY * gameEngine.clockTick;
                    }
                }
            }

            if (entity.transform.velocity.x != 0.0 || entity.transform.velocity.y != 0.0) {
                let displacement = Vec2.scale(entity.transform.velocity, gameEngine.clockTick);
                entity.transform.pos.add(displacement);
                
                if (entity.tag !== undefined) {
                    if (movement_map.get(entity.tag) === undefined) {
                        movement_map.set(entity.tag, [entity]);
                    }
                    else {
                        movement_map.get(entity.tag).push(entity);
                    }
                }
            }

            if (entity.grounded !== undefined) {
                entity.grounded = false;
            }
        }
    }

    return movement_map;
}


// Checks for and handles collision between characters and tiles
function character_tile_collisions(moving_entities, entity_map) {

    let characters = [];
    if (moving_entities.get("player") !== undefined) {
        characters = characters.concat(moving_entities.get("player"));
    }
    if (moving_entities.get("enemy") !== undefined) {
        characters = characters.concat(moving_entities.get("enemy"));
    }

    for (let character of characters) {
        if (character.collider !== undefined) {
            for (let tile of entity_map.get("tile")) {
                if (tile.collider.block_move) {
                    prevent_overlap(character, tile);
                }
            }
        }
    }
}


function character_room_collisions(moving_entities, entity_map) {
    let characters = [];
    if (moving_entities.get("player") !== undefined) {
        characters = characters.concat(moving_entities.get("player"));
    }
    if (moving_entities.get("enemy") !== undefined) {
        characters = characters.concat(moving_entities.get("enemy"));
    }

    for (let character of characters) {
        if (character.collider !== undefined) {
            for (let wall of entity_map.get("wall")) {
                prevent_overlap(character, wall);
            }
        }
    }
}

function character_explosion_collisions(entity_map){
    let characters = [];
    if (entity_map.get("player") !== undefined) {
        characters = characters.concat(entity_map.get("player"));
    }
    if (entity_map.get("enemy") !== undefined) {
        characters = characters.concat(entity_map.get("enemy"));
    }
    let explosions = entity_map.get("explosion");
    if(explosions == undefined) {return;}

    for (let character of characters) {
        if (character.collider !== undefined) {
            for (let explosion of explosions) {
                if (test_overlap(character.collider.area, explosion.collider.area)) {
                    hit(character, explosion, 3);
                }
            }
        }
    }
}

function room_explosion_collisions(entity_map){
   
    let explosions = entity_map.get("explosion");
    if(explosions == undefined) {return;}

    for (let wall of entity_map.get("wall")) {
        if(wall instanceof falsewall){
            for (let explosion of explosions) {
                if (test_overlap(wall.collider.area, explosion.collider.area)) {
                    wall.removeFromWorld = true;
                }
            }
        } 
    }
}


function player_enemy_collisions(entities){
    for (let player of entities.get("player")){
        for (let enemy of entities.get("enemy")) {
            if (enemy.collider !== undefined) {
                if (test_overlap(player.collider.area, enemy.collider.area)) {
                    if (enemy.collider.block_move) {
                        soft_prevent_overlap(player, enemy);
                    }
                    if (enemy.overlap_damage) {
                        console.log("PLAYER HIT");
                        hit(player, enemy);
                    }
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

    for (let sword of entities.get("sword")) {
        for (let character of characters) {
            if (character.tag != sword.owner.tag) {
                if (character.collider !== undefined && test_overlap(sword.collider.area, character.collider.area)) {
                    // Attack goes here
                    if(character.health !== undefined){
                        hit(character, sword.owner, sword.owner.damage);
                    }
                }
            }
        }
    }
}

function prop_collisions(entities) {
    character_prop_collisions(entities);
    prop_room_collisions(entities);
    prop_prop_collisions(entities);
    prop_tile_collisions(entities);
    prop_explosion_collisions(entities);
}

function character_prop_collisions(entities) {

    let characters = [];
    if (entities.get("player") !== undefined) {
        characters = characters.concat(entities.get("player"));
    }
    if (entities.get("enemy") !== undefined) {
        characters = characters.concat(entities.get("enemy"));
    }

    let props = entities.get("prop");

    for (let character of characters) {
        for (let prop of props) {
            if (test_overlap(character.collider.area, prop.collider.area)) {
                if (prop.collider.block_move) { prevent_overlap(character, prop); }

                if (character.tag == "player" && (prop.requires_facing == undefined || prop.requires_facing == false)) {
                    prop.activate(character);
                }

                if (prop instanceof pot && prop.thrown && character !== prop.holder) {
                    hit(character, prop, 1);
                    prop.shatter();
                } 
                if (prop instanceof Boomerang && character !== prop.holder){
                    hit(character, prop, 1);
                }
            }
            if (character.tag == "player" && prop.requires_facing) {
                let point;
                
                if (character.facing == 0) {       // Right
                    point = new Vec2(character.transform.pos.x + 12, character.transform.pos.y);
                }
                else if (character.facing == 1) {  // Left
                    point = new Vec2(character.transform.pos.x - 12, character.transform.pos.y);
                }
                else if (character.facing == 2) {  // Up
                    point = new Vec2(character.transform.pos.x, character.transform.pos.y - 12);
                }
                else if (character.facing == 3) {  // Down
                    point = new Vec2(character.transform.pos.x, character.transform.pos.y + 12);
                }
        
                if (test_point_inside(point, prop.collider.area)) {
                    prop.activate(character);
                }
            }
        }
}
}


function prop_room_collisions(entities) {
    let props = entities.get("prop");
    if (props == undefined) { return; }

    for (let prop of props) {
        if (prop.collider !== undefined) {
            for (let wall of entities.get("wall")) {
                let overlap = prevent_overlap(prop, wall);
                if (overlap) {
                    if (prop instanceof pot) {
                        if(!prop.picked_up){
                            prop.shatter();
                        }
                    }
                    else if (prop instanceof block) {
                        prop.reset();
                    }
                }
            }
        }
    }
}

function prop_prop_collisions(entities) {
    let props = entities.get("prop");
    if (props == undefined) { return; }

    for (let a of props) {
        if (a instanceof block) {
            for (let b of props) {
                if (b instanceof block && a != b) {
                    if (test_overlap(a.collider.area, b.collider.area)) {
                        if (a.moving) {
                            a.reset();
                        }
                        if (b.moving) {
                            b.reset();
                        }
                    }
                }
            }
        }
        if(a instanceof Boomerang){
            for(let b of props){
                if(b instanceof Item){
                    if(test_overlap(a.collider.area, b.collider.area)){
                        a.stick(b);
                    }
                }
            }
        }
    }
}

function prop_tile_collisions(entities) {
    let props = entities.get("prop");
    if (props == undefined) { return; }

    let tiles = entities.get("tile");
    if (tiles == undefined) { return; }

    for (let prop of props) {
        if (prop instanceof block) {
            for (let tile of tiles) {
                if (test_overlap(prop.collider.area, tile.collider.area)) {
                    prop.reset();
                }
            }
        }
        if(prop instanceof Boomerang){
            for (let tile of tiles){
                prevent_overlap(prop, tile)
            }
        }
    }
}

function prop_explosion_collisions(entities){
    let props = entities.get("prop");
    if (props == undefined) {return; }

    let explosions = entities.get("explosion");
    if(explosions == undefined) {return;}

    for(let prop of props){
        if(prop instanceof pot){
            for(let explosion of explosions){
                if (test_overlap(prop.collider.area, explosion.collider.area)) {
                    prop.shatter();
                }
            }
        }
        if(prop instanceof breakable){
            for(let explosion of explosions){
                if (test_overlap(prop.collider.area, explosion.collider.area)) {
                    prop.removeFromWorld = true;
                }
            }
        }
    }
}

// Checks for overlap between two Entities a and b and returns a boolean
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

    // Find point p on AABB closest to sphere center
    let point = closest_point_on_AABB_to_point(b, c.center);
    let distance = Vec2.diff(c.center, point);
    let distance_squared = distance.dot(distance);

    return {test: (distance_squared < c.radius * c.radius), 
        distance_v: distance, 
        sqdist: distance_squared,
        point: point};
}

// Test if Circle c overlaps polygon p comprised of line segments
function test_Circle_Polygon(c, p) {
    if (!test_Circle_AABB(c, p.BB).test) { return {test: false}; }

    let test = {test: false, collisions: []};
    for (let i = 0; i < p.polygon.length - 1; i++) {
        let line_overlap = test_Circle_Line(c, p.polygon[i], p.polygon[i+1]);
        if (line_overlap.test) {
            let line_unit = Vec2.diff(p.polygon[i+1], p.polygon[i])
            line_unit.normalize();
            let normal;
            if (is_point_left_or_above_line(p.polygon[i+1], p.polygon[i], c.center)) {
                normal = new Vec2(line_unit.y, -line_unit.x);
            }
            else {
                normal = new Vec2(-line_unit.y, line_unit.x);
            }

            test.test = true;
            test.collisions.push({sqdist: line_overlap.sqdist, normal: normal, unit: line_unit});
        } 
    }

    if (!test.test) {
        console.log("here");
    }
    return test;
}

// Test if line segment ab intersects circle c
function test_Circle_Line(c, a, b) {
    let sqdist = sqdist_point_segment(c.center, a, b);
    return {test: sqdist <= c.radius * c.radius, sqdist: sqdist};
}

// Tests if a point p is inside an area a
function test_point_inside(p, a) {
    if (a instanceof AABB) {
        return sqdist_point_AABB(p, a) <= 0;
    }
    else if (a instanceof Circle) {
        return sqdist_point_circle(p, a) <= 0;
    }
}

function is_point_left_or_above_line(l1, l2, p) {
    return ((l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x)) > 0;
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
            let normal = prevent_overlap_circles(a, b, test.distance);

            if (normal !== undefined) {
                bounce(a, normal, a.cr);
                if (gameEngine.gravity && a.grounded !== undefined && Math.round(normal.y) == -1) {
                    a.grounded = true;
                }
                bounce(b, Vec2.scale(normal, -1), b.cr);
                if (gameEngine.gravity && b.grounded !== undefined && Math.round(normal.y) == 1) {
                    b.grounded = true;
                }
            }
        }
    }
    else if (a.collider.area instanceof Circle && (b.collider.area instanceof Qtr_Pipe || b.collider.area instanceof Ramp)) {
        test = test_Circle_Polygon(a.collider.area, b.collider.area);
        if (test.test) {
            prevent_overlap_circle_Polygon(a, test.collisions);

            let normal = test.collisions[0].normal;

            if (b.collider.area instanceof Ramp) {
                if (gameEngine.gravity && a.grounded !== undefined && Math.round(normal.y) == -1) {
                    a.grounded = true;
                } 
                bounce(a, normal, a.cr);
            }
            else if (b.collider.area instanceof Qtr_Pipe) {
                if (Math.round(normal.y) == -1) {
                    a.grounded = true;
                }

                if (gameEngine.gravity && a.grounded !== undefined && 
                    Math.acos(a.acceleration_vector.dot(test.collisions[0].unit) < 0.25 * Math.PI)) {
                    if (a.rolling) {
                        a.grounded = true;
                        a.acceleration_vector = test.collisions[0].unit;
                        curve_velocity(a.transform.velocity, test.collisions[0].unit);
                        bounce(a, normal, 0);
                    }
                }
                else {
                    bounce(a, normal, a.cr);
                }
            }
            
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
            let normal = prevent_overlap_circle_AABB(circle, box, test.distance_v, test.sqdist, test.point);

            if (circle.tag == "player" && !circle.rolling && circle.state == state_enum.walking) {
                if (Math.sign(circle.transform.velocity.x) == Math.sign(-normal.x) && 
                    Math.sign(circle.transform.velocity.y) == Math.sign(-normal.y))
                {
                    circle.state = state_enum.pushing;
                }
            } 

            if (normal !== undefined) {
                bounce(circle, normal, circle.cr);
                
                if (gameEngine.gravity && a.grounded !== undefined) {
                    
                    let acceleration_vector = a.acceleration_vector ?? new Vec2(1, 0);
                    let angle = Math.acos(acceleration_vector.dot(normal));
                    if (angle > 0.785398 && angle < 2.35619) {
                        a.grounded = true;
                    }
                }
                else {
                    console.log("here");
                }
            }
        }
    }

    return test.test;
}

// Prevents AABB-AABB overlap between two Entities a and b 
function prevent_overlap_AABBs(a, b, overlap) {
    // Gets the overlap between a and b on the previous time step
    let a_pos = a.collider.area.center;
    let b_pos = b.collider.area.center;
    let a_prev_pos = a.transform !== undefined ? a.transform.prev_pos : a.collider.area.center;
    let b_prev_pos = b.transform !== undefined ? b.transform.prev_pos : b.collider.area.center;

    let prev_overlap = test_AABBs(a.collider.area, b.collider.area, a_prev_pos, b_prev_pos).overlap;

    // If the overlap is horizontal
    if (prev_overlap.y > 0.0001) {
        // If a is on the left push a to the left and b to the right
        if (a_pos.x < b_pos.x) {
            a_pos.x -= overlap.x;
        }
        // If a is on the right push a to the right and b to the left
        else {
            a_pos.x += overlap.x;
        }
    }
    // If the overlap is vertical
    else if (prev_overlap.x > 0.0001) {
        // If a is above, push a up and b down
        if (a_pos.y < b_pos.y) {
            a_pos.y -= overlap.y;
            if (gameEngine.gravity && a.gravity !== undefined) {
                a.transform.velocity.y = 0.0;
                a.grounded = true;
            }
        }
        // If a below, push a down and b up
        else {
            a_pos.y += overlap.y;
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

    let speed_a = a.transform !== undefined ? a.transform.velocity.dot(a.transform.velocity) : 0;
    let speed_b = b.transform !== undefined ? b.transform.velocity.dot(b.transform.velocity) : 0;

    if (speed_a == 0 && speed_b == 0) {
        return;
    }
    let ratio_a = speed_a / (speed_a + speed_b);
    let ratio_b = speed_b / (speed_a + speed_b);

    let normal = distance_vector;
    normal.normalize();
    circle_a.center.add(Vec2.scale(normal, overlap * ratio_a));
    circle_b.center.minus(Vec2.scale(normal, overlap * ratio_b));

    return normal;
}

function prevent_overlap_circle_AABB(c, b, distance_vector, sq_dist, point) {
    let circle = c.collider.area;
    let box = b.collider.area;
    let overlap = circle.radius - Math.sqrt(sq_dist);

    let speed_c = c.transform !== undefined ? c.transform.velocity.dot(c.transform.velocity) : 0;
    let speed_b = b.transform !== undefined ? b.transform.velocity.dot(b.transform.velocity) : 0;

    if (b instanceof block && (c.tag == "enemy" || c.tag == "player")) { 
        speed_b = 0; 
        speed_c = 1;
    }

    if (speed_c == 0 && speed_b == 0) {
        return;
    }

    let ratio_c = speed_c / (speed_c + speed_b);
    let ratio_b = speed_b / (speed_c + speed_b);

    let normal = distance_vector;
    normal.normalize();
    
    circle.center.add(Vec2.scale(normal, overlap * ratio_c));
    box.center.minus(Vec2.scale(normal, overlap * ratio_b));

    return normal;
}

function prevent_overlap_circle_Polygon(c, collisions) {
    for (let i = 0; i < collisions.length; i++) {
        prevent_overlap_circle_segment(c, collisions[i].sqdist, collisions[i].normal);
    }
}
function prevent_overlap_circle_segment(c, sqdist, normal) {
    let overlap = c.collider.area.radius - Math.sqrt(sqdist);
    let overlap_vector = Vec2.scale(normal, overlap);
    c.transform.pos.add(overlap_vector);
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


function sqdist_point_circle(p, c) {
    let distance_vector = Vec2.diff(p, c.center);
    let sqdist = distance_vector.dot(distance_vector);

    return sqdist - (c.radius * c.radius);
}

function sqdist_point_segment(c, a, b) {
    let ab = Vec2.diff(b, a);
    let ac = Vec2.diff(c, a);
    let bc = Vec2.diff(c, b);
    let e = ac.dot(ab);
    // Handle cases wehre c projects outside ab
    if (e <= 0) { return ac.dot(ac); }
    let f = ab.dot(ab);
    if (e >= f) { return bc.dot(bc); }
    // Handle cases where c projects onto ab
    return ac.dot(ac) - e * e / f;
}


// Given point p, return the poin q on AABB b that is closest to p
function closest_point_on_AABB_to_point(b, p) {
    let min = new Vec2(b.center.x - b.half.x, b.center.y - b.half.y);
    let max = new Vec2(b.center.x + b.half.x, b.center.y + b.half.y);

    // For each coordinate axis, if the point cooordinate value
    // outside the box, clamp it to the box
    let q = p.clone();
    q.x = Math.max(q.x, min.x);
    q.x = Math.min(q.x, max.x);

    q.y = Math.max(q.y, min.y);
    q.y = Math.min(q.y, max.y);

    return q;
}

function bounce(entity, normal, cr) {
    cr = cr ?? 0;
    let dn = entity.transform.velocity.dot(normal);
    let transformation = Vec2.scale(normal, (1 + cr) * dn);
    entity.transform.velocity.minus(transformation);
}

function sq_distance(a, b) {
    let distance_v = Vec2.diff(a, b);
    return distance_v.dot(distance_v);
}

function soft_prevent_overlap(a, b) {
    let test = false;
    if (a.collider.area instanceof AABB && b.collider.area instanceof AABB) {
        test = test_AABBs(a.collider.area, b.collider.area);
        
    }
    else if (a.collider.area instanceof Circle && b.collider.area instanceof Circle)
    {
        test = test_Circles(a.collider.area, b.collider.area);
        
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
    }

    if (test.test) {
        push_out(a, b);
    }

    return test.test;
}

function push_out(a, b) {
    let distance_vector = Vec2.diff(a.collider.area.center, b.collider.area.center); 
    let distance = distance_vector.normalize();

    let push_vector = Vec2.scale(distance_vector, 2.5 / distance);
    a.transform.pos.add(push_vector);
}

function curve_velocity(velocity, unit) {
    let magnitude = velocity.compute_magnitude();
    velocity = Vec2.scale(unit, magnitude);
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