export default class Segment {

    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    /**
     * Distance
     */
    distance(point1, point2) {
        return Math.sqrt(Math.pow(point2.x-point1.x,2) + Math.pow(point2.y-point1.y,2));
    }

    /**
     * Distance with a point
     */
    distanceP(point) {
        var normal = this.normal();
        normal.x = point.x;
        normal.y = point.y;
        var intersection = this.intersection(normal);

        return [intersection[0], this.distance(normal.alpha(intersection[1]), point)];
    }

    /**
     * Normal
     */
    normal() {
        return new Segment(this.x, this.y, this.dy, -this.dx);
    }

    /**
     * Gets the intersection alpha with another 
     */
    intersection(other) {
        var a = this.dx;
        var b = -other.dx;
        var c = this.dy;
        var d = -other.dy;
        var b0 = other.x-this.x;
        var b1 = other.y-this.y;
        var det = a*d - b*c;

        if (det == 0) {
            return null;
        }

        var r1 = (d*b0 - b*b1)/det;
        var r2 = (-c*b0 + a*b1)/det;

        return [r1, r2];
    }

    /**
     * Gets the alpha point
     */
    alpha(a) {
        var point = {};
        point.x = this.x+this.dx*a;
        point.y = this.y+this.dy*a;

        return point;
    }

}