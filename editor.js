class Editor {
    constructor() {
        this.selectedType = TileType.Rock;
        this.tile = new Tile(mouseX, mouseY, this.selectedType);
        this.tile.move = false;

        this.tiles = [];
        this.eraser = false;
    }

    display() {
        if (this.eraser) {
            image(assets.images.delete, mouseX - TILE_SIZE / 2, mouseY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
        } else {
            this.tile.display();
            this.tile.type = this.selectedType;
            this.tile.x = mouseX - TILE_SIZE / 2;
            this.tile.y = mouseY - TILE_SIZE / 2;
        }

        for (let i in this.tiles) {
            let tile = this.tiles[i];
            tile.move = false;
            tile.display();
        }
    }

    mousePressed() {
        if (this.eraser) {
            this.tiles.forEach((element, index) => {
                if (element.over(mouseX, mouseY)) {
                    this.tiles.splice(index, 1);
                    console.log("hmm");
                }
            });
        } else if (mouseY > 0) {
            this.tiles.push(new Tile(mouseX - TILE_SIZE / 2, mouseY - TILE_SIZE / 2, this.selectedType));
        }
    }

    changeType(type) {
        this.eraser = false;
        this.selectedType = type;
    }

    randomizeTiles() {
        for (let i = 0; i < random(25, 60); i++)
            this.tiles.push(new Tile(random(width), random(height), Math.floor(random(3))));
    }

    start() {
        state = State.Editor;
        this.tiles = [];
        document.getElementById("game-over-screen").style.display = "none";
        document.getElementById("toolbar").childNodes.forEach((element) => {
            element.disabled = false;
        });
    }
}
