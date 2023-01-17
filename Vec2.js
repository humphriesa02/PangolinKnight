class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    static sum(a, b) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    minus(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    static diff(a, b) {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    static scale(vector, scalar) {
        return new Vec2(vector.x * scalar, vector.y * scalar);
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }

    compute_distance(other) {
        return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
    }

    get_distance_squared(other) {
        return (other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y);
    }

    get_magnitude_squared() {
        return (this.x * this.x) + (this.y * this.y);
    }

    compute_magnitude() {
        return Math.sqrt(this.get_magnitude_squared());
    }

    normalize() {
        let magnitude_squared = this.get_magnitude_squared();
        if (magnitude_squared == 0) 
        {
            this.x = 0;
            this.y = 0;
        }
        else{
            this.multiply(1 / Math.sqrt(magnitude_squared));
        }
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }
}