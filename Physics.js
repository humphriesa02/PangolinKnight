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

function testAABBAABB(a, b) {
    if (Math.abs(a.center.x - b.center.x) > (a.half.x + b.half.x)) { return false; }
    if (Math.abs(a.center.y - b.center.y) > (a.half.y + b.half.y)) { return false; }
    return true;
}

function get_AABBAABB_overlap(a, b, ac = a.center, bc = b.center) {
    let ox = a.half.x + b.half.x - Math.abs(ac.x - bc.x);
    let oy = a.half.y + b.half.y - Math.abs(ac.y - bc.y);
    return {x: ox, y: oy};
}

// Prevents overlap between two entities a and b if both should prevent overlap
function prevent_overlap(a, b) {
    // Checks if a and b have colliders, block movement, have moved since the last frame,
    // and if they are overlapping, if any of those conditions are false it exits early
    if (b.collider === undefined || !b.collider.block_move) return;
    if (a.transform.pos == a.transform.prev_pos &&
        b.transform.pos == b.transform.prev_pos) return;
    
    let overlap = get_AABBAABB_overlap(a.collider.body, b.collider.body)
    if (overlap.x <= 0 || overlap.y <= 0) return;

    // Gets the overlap between a and b on the previous time step, along with a ratio of speeds between a and b
    let prev_overlap = get_AABBAABB_overlap(a.collider.body, b.collider.body, a.transform.prev_pos, b.transform.prev_pos);
    let speed_a_sqr = a.transform.velocity.dot(a.transform.velocity);
    let speed_b_sqr = b.transform.velocity.dot(b.transform.velocity);
    let speed_ratio_a = speed_a_sqr / (speed_a_sqr + speed_b_sqr);
    let speed_ratio_b = speed_b_sqr / (speed_a_sqr + speed_b_sqr);

    // If the overlap is horizontal
    if (prev_overlap.y > 0) {
        // If a is on the left push a to the left and b to the right
        if (a.transform.pos.x < b.transform.pos.x) {
            a.transform.pos.x -= overlap.x * speed_ratio_a
            b.transform.pos.x += overlap.x * speed_ratio_b
        }
        // If a is on the right push a to the right and b to the left
        else {
            a.transform.pos.x += overlap.x * speed_ratio_a
            b.transform.pos.x -= overlap.x * speed_ratio_b
        }
    }
    // If the overlap is vertical
    else if (prev_overlap.x > 0) {
        // If a is on the left push a to the left and b to the right
        if (a.transform.pos.y < b.transform.pos.y) {
            a.transform.pos.y -= overlap.y * speed_ratio_a
            b.transform.pos.y += overlap.y * speed_ratio_b
        }
        // If a is on the right push a to the right and b to the left
        else {
            a.transform.pos.y += overlap.y * speed_ratio_a
            b.transform.pos.y -= overlap.y * speed_ratio_b
        }
    }
    // If the overlap is perfectly diagonal
    else {
        let relative_velocity = Vec2.diff(a.transform.velocity, b.transform.velocity);
        // If the relative velocity is greater in the horizontal component then favor
        // pushing the objects out in the vertical direction
        if (Math.abs(relative_velocity.x) > Math.abs(relative_velocity.y)) {
            if (a.transform.pos.y < b.transform.pos.y) {
                a.transform.pos.y -= overlap.y * speed_ratio_a
                b.transform.pos.y += overlap.y * speed_ratio_b
            }
            else {
                a.transform.pos.y += overlap.y * speed_ratio_a
                b.transform.pos.y -= overlap.y * speed_ratio_b
            }
        }
        // If the speed is greater in the vertical then favor pushing in the horizontal
        else {
            if (a.transform.pos.x < b.transform.pos.x) {
                a.transform.pos.x -= overlap.x * speed_ratio_a
                b.transform.pos.x += overlap.x * speed_ratio_b
            }
            else {
                a.transform.pos.x += overlap.x * speed_ratio_a
                b.transform.pos.x -= overlap.x * speed_ratio_b
            }
        }
    }
}

function collisions(entities) {
    let entities_count = entities.length;
    for (let i = 0; i < entities_count; i++) {
        let a = entities[i];
        if (a.collider !== undefined && a.collider.block_move) {
            for (let j = i + 1; j < entities_count; j++) {
                prevent_overlap(entities[i], entities[j]);
            }
        }
    }
}

class Test_Block {
    constructor(x, y) {
        this.transform = new Transform(new Vec2(72 * params.scale, 67.5 * params.scale));
        this.transform.prev_pos = this.transform.pos;
        this.collider = new Collider(new AABB(this.transform.pos, 8 * params.scale, 8 * params.scale), true, true, false);
    }

    update() {}

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.transform.pos.x - screenX(), this.transform.pos.y - screenY(), 16 * params.scale, 16 * params.scale);
        ctx.stroke();
    }

}