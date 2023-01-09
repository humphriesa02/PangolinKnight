const _GRAVITY_ACCELERATION = 98;
const _AIR_DENSITY = 1.23;
const _DRAG_COEFFICIENT = 0.6;
const _WIND_SPEED = 15;

class Particle {
    constructor() {
        this.f_mass = 1.0;                          // Total mass                                   
        this.v_pos = new Vec2();                    // Position
        this.v_velocity = new Vec2();               // Velocity
        this.f_speed = 0.0;                         // Speed (magnitude of the velocity)
        this.v_forces = new Vec2();                 // Total force acting on the particle
        this.f_radius = 0.1;                        // Particle radius used for collision detection
        this.v_gravity = new Vec2(0,                // Gravity force vector
            this.f_mass * _GRAVITY_ACCELERATION);
    }

    // Computes all the forces acting on the particle
    calc_loads() {
        // Reset forces:
        this.v_forces.x = 0.0;
        this.v_forces.y = 0.0;

        // Aggregate forces:

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

    update_body_euler(dt) {
        // Integrate equation of motion:
        let acceleration = Vec2.scale(this.v_forces, 1 / this.f_mass);

        let delta_velocity = Vec2.scale(acceleration, dt);
        this.v_velocity.add(delta_velocity);

        let displacement = Vec2.scale(this.v_velocity, dt);
        this.v_pos.add(displacement);

        // Misc. calculations:
        this.f_speed = Math.sqrt(this.v_velocity.get_magnitude_squared());

        if      (this.v_pos.y > 730)   { this.v_pos.y = 730; }
        if      (this.v_pos.x < 3)      { this.v_pos.x = 3; }
        else if (this.v_pos.x > 1020)    { this.v_pos.x = 1020; }
    }

    update() {
        this.calc_loads();
        this.update_body_euler(gameEngine.clockTick);
    }

    draw(ctx) {
        ctx.save();
        //ctx.arc(this.v_pos.x, this.v_pos.y, 0.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = "red";
        let x = Math.floor(this.v_pos.x);
        let y = Math.floor(this.v_pos.y);
        ctx.fillRect(x, y, 3, 3);
        ctx.restore();
    }
}