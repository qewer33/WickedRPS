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
        this.x = x;
        this.y = y;
        this.type = type;

        this.startX = this.x;
        this.startY = this.y;

        this.time = random(500);
        this.firstTime = this.time;
        this.move = true;
        this.firstXNoise = 0;
        this.firstYNoise = 0;

        noiseSeed(random(9999999));
    }

    display() {
        let xNoise = noise(this.time);
        let yNoise = noise(0, this.time);

        if (this.time == this.firstTime) {
            this.firstXNoise = xNoise;
            this.firstYNoise = yNoise;
        }

        if (this.move) {
            if (this.x > width) this.startX -= width;
            if (this.y > height) this.startY -= height;
            if (this.x < 0) this.startX += width;
            if (this.y < 0) this.startY += height;
            this.x = this.startX + xNoise * width - this.firstXNoise * width;
            this.y = this.startY + yNoise * height - this.firstYNoise * height;
            this.time += 0.0025;
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

        image(this.img, this.x, this.y, TILE_SIZE, TILE_SIZE);
    }

    collide(otherTile) {
        return (
            this.x < otherTile.x + TILE_SIZE &&
            this.x + TILE_SIZE > otherTile.x &&
            this.y < otherTile.y + TILE_SIZE &&
            TILE_SIZE + this.y > otherTile.y
        );
    }

    over(x, y) {
        return x > this.x && x < this.x + TILE_SIZE && y > this.y && y < this.y + TILE_SIZE;
    }
}
