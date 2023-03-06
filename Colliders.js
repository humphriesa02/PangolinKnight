class AABB {
    constructor(center, halfwidth_x, halfwidth_y) {
        this.center = center;
        this.half = {x: halfwidth_x, y: halfwidth_y};
    }
}

class Circle {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }
}

class Qtr_Pipe {
    constructor(pos, angle) {
        let arc_center = pos.clone();
        this.polygon = [];
        if (angle == 0) {
            this.polygon.push(new Vec2(arc_center.x, arc_center.y + 16));
        }
        else if (angle == 1) {
            arc_center.y += 16;
            this.polygon.push(new Vec2(arc_center.x + 16, arc_center.y));
        }
        else if (angle == 2) {
            arc_center.x += 16;
            arc_center.y += 16;
            this.polygon.push(new Vec2(arc_center.x, arc_center.y - 16));
        }
        else if (angle == 3) {
            arc_center.x += 16;
            this.polygon.push(new Vec2(arc_center.x - 16, arc_center.y));
        }

        let arc_angle = 1.5 * Math.PI + angle * 0.5 * Math.PI;
        let radius = 16;
        let arc_segments = 6;
        let angle_increment = (0.5 * Math.PI) / arc_segments;

        for (let i = 0; i < arc_segments - 1; i++) {
            arc_angle += angle_increment;
            let point = new Vec2(arc_center.x + radius * Math.cos(arc_angle), arc_center.y - radius * Math.sin(arc_angle));
            this.polygon.push(point);
        }

        if (angle == 0) {
            this.polygon.push(new Vec2(arc_center.x + 16, arc_center.y));
            this.polygon.push(new Vec2(arc_center.x + 16, arc_center.y + 16));
            this.polygon.push(new Vec2(arc_center.x, arc_center.y + 16));
        }
        else if (angle == 1) {
            this.polygon.push(new Vec2(arc_center.x, arc_center.y - 16));
            this.polygon.push(new Vec2(arc_center.x + 16, arc_center.y - 16));
            this.polygon.push(new Vec2(arc_center.x + 16, arc_center.y));
        }
        else if (angle == 2) {
            this.polygon.push(new Vec2(arc_center.x - 16, arc_center.y));
            this.polygon.push(new Vec2(arc_center.x - 16, arc_center.y - 16));
            this.polygon.push(new Vec2(arc_center.x, arc_center.y - 16));
        }
        else if (angle == 3) {
            this.polygon.push(new Vec2(arc_center.x, arc_center.y + 16));
            this.polygon.push(new Vec2(arc_center.x - 16, arc_center.y + 16));
            this.polygon.push(new Vec2(arc_center.x - 16, arc_center.y));
        }

        this.BB = new AABB(new Vec2(pos.x + 8, pos.y + 8), 8, 8);
    }
}

class Ramp {
    constructor(bottom, top) {
        this.polygon = []
        this.polygon.push(bottom);
        this.polygon.push(top);
        this.polygon.push(new Vec2(top.x, bottom.y))
        this.polygon.push(bottom);

        let half_width = Math.abs(top.x - bottom.x) / 2;
        let half_height = Math.abs(top.y - bottom.y) / 2;
        let pos_x = Math.min(bottom.x, top.x) + half_width;
        let pos_y = Math.max(bottom.y, top.y) - half_height;
        this.BB = new AABB(new Vec2(pos_x, pos_y), half_width, half_height);
    }
}

class Test_Pipe {
    constructor(pos, angle) {
        this.tag = "tile";
        this.collider = new Collider(new Qtr_Pipe(pos, angle), true, false, false);
    }

    update() {}

    draw(ctx) {
    }
}

class Test_Ramp {
    constructor() {
        this.tag = "tile";
        this.collider = new Collider(new Ramp(new Vec2(1040, 608), new Vec2(1072, 592)), true, false, false)
    }

    update() {}

    draw(ctx) {
        
    }
}