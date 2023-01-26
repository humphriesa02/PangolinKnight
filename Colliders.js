const _GRAVITY_ACCELERATION = 980;
const _AIR_DENSITY = .00123;
const _DRAG_COEFFICIENT = 0.06;
const _WIND_SPEED = 0;
const _GROUND_PLANE = 730;
const _RESTITUTION = 0.2;

class Particle {
    constructor(kinematic = false) {
        this.kinematic = kinematic;
        this.color = "red";
        this.f_mass = 1.0;                          // Total mass                                   
        this.v_pos = new Vec2();                    // Position
        this.v_prev_pos = new Vec2();               // Position on the previous time step
        this.v_velocity = new Vec2();               // Velocity
        this.f_speed = 0.0;                         // Speed (magnitude of the velocity)
        this.v_forces = new Vec2();                 // Total force acting on the particle
        this.v_impact_forces = new Vec2();          // Total forces from an impact acting on the particle
        this.f_radius = 10;                         // Particle radius used for collision detection
        this.v_gravity = new Vec2(0,                // Gravity force vector
            this.f_mass * _GRAVITY_ACCELERATION);
        this.b_collision = false;                   // Whether the particle has collided with something
    }

    check_for_collisions(dt) {
        this.b_collision = false;

        // Reset aggregate impact force
        this.v_impact_forces.x = 0;
        this.v_impact_forces.y = 0;
    
        let entitiesCount = gameEngine.entities.length;

        // Check for collisions against all entities
        for (let i = 0; i < entitiesCount; i++) {
            let entity = gameEngine.entities[i];
            if (this != entity) {
                let radii = this.f_radius + entity.f_radius;
                let distance = Vec2.diff(this.v_pos, entity.v_pos);
                let distance_squared = distance.dot(distance);

                if (distance_squared <= radii * radii) {
                    distance.normalize();
                    let normal = distance.clone();
                    let relative_velocity = Vec2.diff(this.v_velocity, entity.v_velocity);
                    let vrn = relative_velocity.dot(normal);

                    if (vrn < 0.0) {
                        let impulse = -vrn * (_RESTITUTION + 1) / (1 / this.f_mass + 1 / entity.f_mass);
                        let impact_force = normal.clone();
                        impact_force.multiply(impulse / dt);
                        this.v_impact_forces.add(impact_force);

                        let seperation = Math.sqrt(distance_squared) - radii;
                        let ns = Vec2.scale(normal, seperation);
                        this.v_pos.minus(ns);
                        this.b_collision = true;
                    }
                }
            }
        }
        // Check for collisions with ground plane
        if (this.v_pos.y >= (_GROUND_PLANE - this.f_radius)) {
            let normal = new Vec2(0, -1);
            let relative_velocity = this.v_velocity.clone();
            let rvn = relative_velocity.dot(normal);    // The component of the relative velocity in the direction of the collision unit normal vector
            // Check to see if the particle is moving toward the ground
            if (rvn < 0.0) {
                let impulse = -rvn * (_RESTITUTION + 1) * this.f_mass;
                let impact_force = normal.clone();
                impact_force.multiply(impulse / dt)
                this.v_impact_forces.add(impact_force);

                this.v_pos.y = _GROUND_PLANE - this.f_radius;
                this.v_pos.x = ((_GROUND_PLANE - this.f_radius + this.v_prev_pos.y) 
                                / (this.v_pos.y - this.v_prev_pos.y) * 
                                (this.v_pos.x - this.v_prev_pos.x)) + 
                                this.v_prev_pos.x;

                this.b_collision = true;
            }
        }
        // Check for collisions with horizontal bounds
        if (this.v_pos.x >= 1024 - this.f_radius) {
            let normal = new Vec2(-1, 0);
            let relative_velocity = this.v_velocity.clone();
            let rvn = relative_velocity.dot(normal);    // The component of the relative velocity in the direction of the collision unit normal vector
            // Check to see if the particle is moving toward the ground
            if (rvn < 0.0) {
                let impulse = -rvn * (_RESTITUTION + 1) * this.f_mass;
                let impact_force = normal.clone();
                impact_force.multiply(impulse / dt)
                this.v_impact_forces.add(impact_force);

                this.v_pos.x = 1024 - this.f_radius;
                this.v_pos.y = ((1024 - this.f_radius + this.v_prev_pos.x) 
                                / (this.v_pos.x - this.v_prev_pos.x) * 
                                (this.v_pos.y - this.v_prev_pos.y)) + 
                                this.v_prev_pos.y;

                this.b_collision = true;
            }
        }
        else if (this.v_pos.x < this.f_radius) {
            let normal = new Vec2(1, 0);
            let relative_velocity = this.v_velocity.clone();
            let rvn = relative_velocity.dot(normal);    // The component of the relative velocity in the direction of the collision unit normal vector
            // Check to see if the particle is moving toward the ground
            if (rvn < 0.0) {
                let impulse = -rvn * (_RESTITUTION + 1) * this.f_mass;
                let impact_force = normal.clone();
                impact_force.multiply(impulse / dt)
                this.v_impact_forces.add(impact_force);

                this.v_pos.x = this.f_radius;
                this.v_pos.y = ((this.f_radius - this.v_prev_pos.x) 
                                / (this.v_pos.x - this.v_prev_pos.x) * 
                                (this.v_pos.y - this.v_prev_pos.y)) + 
                                this.v_prev_pos.y;

                this.b_collision = true;
            }
        }
    }

    // Computes all the forces acting on the particle
    calc_loads() {
        // Reset forces:
        this.v_forces.x = 0.0;
        this.v_forces.y = 0.0;

        // Aggregate forces:
        if (this.b_collision) {
            // Add impact forces only (if any)
            this.v_forces.add(this.v_impact_forces);
        }
        else {
            // Gravity
            this.v_forces.add(this.v_gravity);

            // Still air drag
            let v_drag = new Vec2(-this.v_velocity.x, -this.v_velocity.y);
            v_drag.normalize();
            let f_drag = 0.5 * _AIR_DENSITY * this.f_speed * this.f_speed * 
                (Math.PI * this.f_radius * this.f_radius) * _DRAG_COEFFICIENT;
            
            v_drag.multiply(f_drag);

            this.v_forces.add(v_drag);

            // Wind
            let v_wind = new Vec2();
            v_wind.x = 0.5 * _AIR_DENSITY * _WIND_SPEED * _WIND_SPEED *
                (Math.PI * this.f_radius * this.f_radius) * _DRAG_COEFFICIENT;
            this.v_forces.add(v_wind);
        }
    }

    update_body_euler(dt) {
        // Integrate equation of motion:
        let acceleration = Vec2.scale(this.v_forces, 1 / this.f_mass);

        let delta_velocity = Vec2.scale(acceleration, dt);
        this.v_velocity.add(delta_velocity);

        let displacement = Vec2.scale(this.v_velocity, dt);
        this.v_pos.add(displacement);

        // Misc. calculations:
        this.f_speed = Math.sqrt(this.v_velocity.get_magnitude_squared());
    }

    update() {
        if (this.kinematic) {
            this.check_for_collisions(gameEngine.clockTick);
            this.calc_loads();
            this.update_body_euler(gameEngine.clockTick);
        }
    }

    draw(ctx) {
        let x = this.v_pos.x;
        let y = this.v_pos.y;
        let radius = this.f_radius;
        drawCircle(ctx, x, y, radius, this.color, this.color, 3);
    }
}

class AABB {
    constructor(center, halfwidth_x, halfwidth_y) {
        this.center = center;
        this.half = {x: halfwidth_x, y: halfwidth_y};
    }
}