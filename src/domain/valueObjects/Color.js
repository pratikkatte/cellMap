/**
 * Color value object
 * Immutable color representation
 */
export class Color {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = Math.max(0, Math.min(1, r));
        this.g = Math.max(0, Math.min(1, g));
        this.b = Math.max(0, Math.min(1, b));
        this.a = Math.max(0, Math.min(1, a));
        Object.freeze(this);
    }

    /**
     * Create from hex string (e.g., "#FF0000" or "0xFF0000")
     */
    static fromHex(hex) {
        const hexStr = hex.replace('#', '').replace('0x', '');
        const r = parseInt(hexStr.substring(0, 2), 16) / 255;
        const g = parseInt(hexStr.substring(2, 4), 16) / 255;
        const b = parseInt(hexStr.substring(4, 6), 16) / 255;
        return new Color(r, g, b, 1);
    }

    /**
     * Create from RGB values (0-255)
     */
    static fromRGB(r, g, b, a = 1) {
        return new Color(r / 255, g / 255, b / 255, a);
    }

    /**
     * Convert to hex string
     */
    toHex() {
        const r = Math.round(this.r * 255).toString(16).padStart(2, '0');
        const g = Math.round(this.g * 255).toString(16).padStart(2, '0');
        const b = Math.round(this.b * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    /**
     * Convert to Three.js Color
     */
    toThreeColor() {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            getHex: () => parseInt(this.toHex().replace('#', ''), 16)
        };
    }

    /**
     * Create from Three.js Color
     */
    static fromThreeColor(threeColor) {
        return new Color(threeColor.r, threeColor.g, threeColor.b, 1);
    }

    /**
     * Mix with another color
     */
    mix(other, factor = 0.5) {
        const otherColor = Color.from(other);
        return new Color(
            this.r + (otherColor.r - this.r) * factor,
            this.g + (otherColor.g - this.g) * factor,
            this.b + (otherColor.b - this.b) * factor,
            this.a + (otherColor.a - this.a) * factor
        );
    }

    /**
     * Create from various formats
     */
    static from(value) {
        if (value instanceof Color) return value;
        if (typeof value === 'string') return Color.fromHex(value);
        if (value && typeof value.r === 'number') {
            return new Color(value.r, value.g, value.b, value.a || 1);
        }
        return new Color();
    }
}

