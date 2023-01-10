const TileType = {
    Rock: 0,
    Paper: 1,
    Scissors: 2,
};

const TilePriority = [
    // [bigger, smaller]
    [TileType.Rock, TileType.Scissors],
    [TileType.Paper, TileType.Rock],
    [TileType.Scissors, TileType.Paper],
];

const TILE_SIZE = 32;

class Tile {
    constructor(x, y, type) {
        this.type = type;
        this.move = true;
        this.acceleration = createVector(0, 0);
        this.velocity = p5.Vector.random2D();
        this.position = createVector(x, y);
        this.maxspeed = 3.5;
        this.maxforce = 0.1;
    }

    display(tiles = []) {
        // movement is skidded from: https://p5js.org/examples/hello-p5-flocking.html
        if (this.move) {
            this.flock(tiles);
            this.update();
            this.borders();
        }

        switch (this.type) {
            case TileType.Rock:
                this.img = assets.images.rock;
                break;
            case TileType.Paper:
                this.img = assets.images.paper;
                break;
            case TileType.Scissors:
                this.img = assets.images.scissors;
                break;
        }

        image(this.img, this.position.x, this.position.y, TILE_SIZE, TILE_SIZE);
    }

    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
    }

    // Forces go into acceleration
    applyForce(force) {
        this.acceleration.add(force);
    }

    // We accumulate a new acceleration each time based on three rules
    flock(tiles) {
        let sep = this.separate(tiles); // Separation
        let ali = this.align(tiles); // Alignment
        let coh = this.cohesion(tiles); // Cohesion
        // Arbitrarily weight these forces
        sep.mult(3.3);
        ali.mult(1.5);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        return steer;
    }

    // Wraparound
    borders() {
        if (this.position.x < -TILE_SIZE) this.position.x = width + TILE_SIZE;
        if (this.position.y < -TILE_SIZE) this.position.y = height + TILE_SIZE;
        if (this.position.x > width + TILE_SIZE) this.position.x = -TILE_SIZE;
        if (this.position.y > height + TILE_SIZE) this.position.y = -TILE_SIZE;
    }

    // Separation
    // Method checks for nearby tiles and steers away
    separate(tiles) {
        let desiredseparation = 25.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < tiles.length; i++) {
            let d = p5.Vector.dist(this.position, tiles[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if (d > 0 && d < desiredseparation) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, tiles[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }
        return steer;
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(tiles) {
        let neighbordist = 50;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < tiles.length; i++) {
            let d = p5.Vector.dist(this.position, tiles[i].position);
            if (d > 0 && d < neighbordist) {
                sum.add(tiles[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby tiles, calculate steering vector towards that location
    cohesion(tiles) {
        let neighbordist = 50;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < tiles.length; i++) {
            let d = p5.Vector.dist(this.position, tiles[i].position);
            if (d > 0 && d < neighbordist) {
                sum.add(tiles[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum); // Steer towards the location
        } else {
            return createVector(0, 0);
        }
    }

    collide(otherTile) {
        return (
            this.position.x < otherTile.position.x + TILE_SIZE &&
            this.position.x + TILE_SIZE > otherTile.position.x &&
            this.position.y < otherTile.position.y + TILE_SIZE &&
            TILE_SIZE + this.position.y > otherTile.position.y
        );
    }

    over(x, y) {
        return (
            x > this.position.x &&
            x < this.position.x + TILE_SIZE &&
            y > this.position.y &&
            y < this.position.y + TILE_SIZE
        );
    }
}
