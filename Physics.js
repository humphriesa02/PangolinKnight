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

function overlap_AABB_AABB(a, b) {
    if (Math.abs(a.center.x - b.center.x) > (a.halfwidth.x + b.halfwidth.x)) { return false; }
    if (Math.abs(a.center.y - b.center.y) > (a.halfwidth.y + b.halfwidth.y)) { return false; }
    return true;
}

function simple_AABB_AABB_collision(a, b) {
    if (overlap_AABB_AABB(a.transform.pos, a.collider.collider, b.transform.pos, b.collider.collider )) {
        
    }
}