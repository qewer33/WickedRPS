let canvas;

let assets = {
    images: {},
};

let welcomeScreen = true;
let grid;
let tiles = [];

let editor;
let game;

const State = {
    Editor: 0,
    InGame: 1,
    GameOver: 2,
};

let state = State.Editor;

function preload() {
    assets.images.rock = loadImage("assets/rock.png");
    assets.images.paper = loadImage("assets/paper.png");
    assets.images.scissors = loadImage("assets/scissors.png");
    assets.images.delete = loadImage("assets/cross-mark.png");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 60);
    canvas.mouseClicked(canvasMouseClicked);
    noiseDetail(2, 1.2);

    grid = generateGrid();

    editor = new Editor();
    game = new Game();
}

function draw() {
    background(50);
    image(grid, 0, 0);
    showDebugInfo();

    switch (state) {
        case State.Editor:
            if (!welcomeScreen) editor.display();
            break;
        case State.InGame:
            game.display();
            break;
        case State.GameOver:
            for (let i in game.tiles) {
                let tile = game.tiles[i];
                tile.display();
                tile.move = false;
            }
            break;
    }
}

function canvasMouseClicked() {
    if (state == State.Editor && !welcomeScreen) editor.mousePressed();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    grid = generateGrid();
}

function hideWelcomeScreen() {
    welcomeScreen = false;
    document.getElementById("welcome-screen").style.display = "none";
}

function generateGrid() {
    let grid = createGraphics(width, height);
    grid.stroke("#424242");
    for (let x = 0; x < width; x += TILE_SIZE) {
        grid.line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += TILE_SIZE) {
        grid.line(0, y, width, y);
    }
    return grid;
}

function showDebugInfo() {
    let tiles = state == State.Editor ? editor.tiles : game.tiles;
    fill("#aaaaaa");
    textSize(15);
    text("FPS: " + Math.round(frameRate()), 10, 25);
    text("Tile Count: " + tiles.length, 10, 45);
    text(
        "Rocks: " +
            tiles.filter((e) => {
                return e.type == TileType.Rock;
            }).length,
        10,
        65
    );
    text(
        "Papers: " +
            tiles.filter((e) => {
                return e.type == TileType.Paper;
            }).length,
        10,
        85
    );
    text(
        "Scissors: " +
            tiles.filter((e) => {
                return e.type == TileType.Scissors;
            }).length,
        10,
        105
    );
}
