/**
 * Position value object
 * Immutable position in 3D space
 */
export class Position {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        Object.freeze(this);
    }

    /**
     * Create a new position from another position
     */
    static from(position) {
        if (position instanceof Position) {
            return new Position(position.x, position.y, position.z);
        }
        if (position && typeof position.x === 'number') {
            return new Position(position.x, position.y || 0, position.z || 0);
        }
        return new Position();
    }

    /**
     * Add another position to this one
     */
    add(other) {
        const otherPos = Position.from(other);
        return new Position(
            this.x + otherPos.x,
            this.y + otherPos.y,
            this.z + otherPos.z
        );
    }

    /**
     * Subtract another position from this one
     */
    subtract(other) {
        const otherPos = Position.from(other);
        return new Position(
            this.x - otherPos.x,
            this.y - otherPos.y,
            this.z - otherPos.z
        );
    }

    /**
     * Multiply by a scalar
     */
    multiply(scalar) {
        return new Position(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar
        );
    }

    /**
     * Calculate distance to another position
     */
    distanceTo(other) {
        const otherPos = Position.from(other);
        const dx = this.x - otherPos.x;
        const dy = this.y - otherPos.y;
        const dz = this.z - otherPos.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Get length/magnitude
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Normalize to unit vector
     */
    normalize() {
        const len = this.length();
        if (len === 0) return new Position(0, 0, 0);
        return new Position(this.x / len, this.y / len, this.z / len);
    }

    /**
     * Convert to Three.js Vector3
     */
    toVector3() {
        // This will be used by infrastructure layer
        return { x: this.x, y: this.y, z: this.z };
    }

    /**
     * Create from Three.js Vector3
     */
    static fromVector3(vector3) {
        return new Position(vector3.x, vector3.y, vector3.z);
    }

    /**
     * Check equality
     */
    equals(other) {
        const otherPos = Position.from(other);
        return this.x === otherPos.x && this.y === otherPos.y && this.z === otherPos.z;
    }
}

