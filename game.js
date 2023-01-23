class Game {
    constructor() {
        this.tiles = [];
        this.gameOver = false;
        this.htmlTimeLabel = document.getElementById("time-label");
    }

    display() {
        let firstTileType;

        for (let i in this.tiles) {
            let tile = this.tiles[i];
            tile.display(this.tiles);
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
            this.elapsedTimeText = this.calculateElapsedTimeText();
            this.htmlTimeLabel.innerText = this.elapsedTimeText + " Elapsed";
        }
    }

    start() {
        this.gameOver = false;
        this.tiles = editor.tiles;
        document.getElementById("toolbar").childNodes.forEach((element) => {
            if (element.id == 'start-game-button') { element.disabled = false; element.innerText = "Stop Game"; return; }
            element.disabled = true;
        });
        state = State.InGame;
        this.startTime = new Date();
    }

    toggleState() {
        if(this.gameOver || state == State.Editor) {
            this.start();
        } else {
            this.gameOver = true;
            state = State.GameOver;
            document.getElementById("time-label").innerText = "00:00:00 Elapsed";
            editor.start();
        }
    }

    end() {
        this.gameOver = true;
        state = State.GameOver;
        document.getElementById("time-label").innerText = "00:00:00 Elapsed";
        document.getElementById("game-over-screen").style.display = "flex";
        let winMessage = "";
        if (this.winningTile == TileType.Rock) winMessage = "Rock";
        if (this.winningTile == TileType.Paper) winMessage = "Paper";
        if (this.winningTile == TileType.Scissors) winMessage = "Scissors";
        document.getElementById("win-image-" + winMessage.toLowerCase()).style.display = "block";
        document.getElementById("game-over-label").innerText = winMessage + " is Victorius!";
        document.getElementById("game-over-time-label").innerText = "Game finished in: " + this.elapsedTimeText;
    }

    calculateElapsedTimeText() {
        let elapsedTime = new Date() - this.startTime;
        let seconds = ("0" + Math.floor((elapsedTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + Math.floor(elapsedTime / 1000 / 60)).slice(-2);
        let hours = ("0" + Math.floor(elapsedTime / 1000 / 1000 / 60)).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }
}
