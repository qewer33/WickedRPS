class Game {
    constructor() {
        this.tiles = [];
        this.gameOver = false;
    }

    display() {
        let firstTileType;

        for (let i in this.tiles) {
            let tile = this.tiles[i];
            tile.display();
            tile.move = true;

            if (i == 0) {
                firstTileType = tile.type;
                this.winningTile = firstTileType;
                this.gameOver = true;
            }

            if (tile.type !== firstTileType) this.gameOver = false;

            for (let ix in this.tiles) {
                if (i !== ix) {
                    let otherTile = this.tiles[ix];

                    if (tile.collide(otherTile)) {
                        for (let iy in TilePriority) {
                            let p = TilePriority[iy];
                            if (tile.type == p[0] && otherTile.type == p[1]) otherTile.type = p[0];
                        }
                    }
                }
            }
        }

        if (this.gameOver) this.end();
        else {
            let elapsedTime = new Date() - this.startTime;
            let seconds = ("0" + Math.floor((elapsedTime / 1000) % 60)).slice(-2);
            let minutes = ("0" + Math.floor(elapsedTime / 1000 / 60)).slice(-2);
            let hours = ("0" + Math.floor(elapsedTime / 1000 / 1000 / 60)).slice(-2);
            this.elapsedTimeText = `${hours}:${minutes}:${seconds}`;
            document.getElementById("time-label").innerText = this.elapsedTimeText + " Elapsed";
        }
    }

    start() {
        this.gameOver = false;
        this.tiles = editor.tiles;
        document.getElementById("toolbar").childNodes.forEach((element) => {
            element.disabled = true;
        });
        state = State.InGame;
        this.startTime = new Date();
    }

    end() {
        this.gameOver = true;
        state = State.GameOver;
        document.getElementById("time-label").innerText = "00:00:00 Elapsed";
        document.getElementById("game-over-screen").style.display = "flex";
        let winMessage = "";
        if (this.winningTile == TileType.Rock) winMessage = "🪨 Rock";
        if (this.winningTile == TileType.Paper) winMessage = "📜 Paper";
        if (this.winningTile == TileType.Scissors) winMessage = "✂️ Scissors";
        document.getElementById("game-over-label").innerText = winMessage + " is Victorius!";
        document.getElementById("game-over-time-label").innerText = "Game finished in: " + this.elapsedTimeText;
    }
}