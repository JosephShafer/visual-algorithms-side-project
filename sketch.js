let rows = 64;
let cols = 64;
let resolution = 10;
let pause = false;
let grid;
let button;

class Cell{
    constructor(x, y){
        this.alive = Math.floor(Math.random() * 1.5);
        this.x = x * resolution;
        this.y = y * resolution;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.generation = 0;
    }

    drawMyself(){
        if(this.alive)
            fill(255);
        else
        fill((this.r + this.generation*1.031) % 255, (this.g + this.generation*1.002) % 255, (this.b + this.generation*1.003) % 255);
        stroke(0);
        rect(this.x, this.y, resolution - 1, resolution);
    }
    getState(){
        return this.alive;
    }
    setState(state){
        this.alive = state;
    }
    increaseGen(){
        this.generation = this.generation > 255 ? 0 : this.generation + 1;
    }
}
//
let create2DArray = (rows, cols) => {
    let grid = Array(cols);

    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i].push(new Cell(i, j));
        }
    }
    // console.table(grid);
    return grid;
}

function setup() {
    frameRate(60);
    grid = create2DArray(cols, rows);
    createCanvas(640, 640);
}

function touchMoved() {
    bringToLife();
}

function mouseClicked() {
    bringToLife();
}

function bringToLife(){
    let x = Math.floor(mouseX / resolution);
    let y = Math.floor(mouseY / resolution);
    grid[x][y].setState(1);
    grid[x][y].increaseGen();
}


function runRules() {
    grid2 = Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        grid2[i] = Array(grid[i].length).fill(0);
        for (let j = 0; j < grid[i].length; j++) {
            let count = 0;

            for (let xi = -1; xi < 2; xi++) {
                for (let xj = -1; xj < 2; xj++) {

                    count += grid[(i + xi + cols) % cols][(j + xj + rows) % rows].getState();
                }
            }
            count -= grid[i][j].getState();
            // console.log(count);

            if (grid[i][j].getState() == 1) {
                if (count > 3 || count < 2) {
                    grid2[i][j] = 0;
                } else {
                    grid2[i][j] = grid[i][j].getState();
                }
            } else if (grid[i][j].getState() == 0) {
                if (count == 3) {
                    grid2[i][j] = 1;
                } else {
                    grid2[i][j] = grid[i][j].getState();
                }
            }

            //small chance to spawn to keep things moving
            if (Math.random() < .00002) {
                grid2[i][j] = 1;
            }
        }
    }

    return grid2;
}


let m = 0;
function draw() {
    background(0);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = i * resolution;
            let y = j * resolution;
            // if (grid[i][j] == 1)
            //     fill(0)
            // else
            //     fill(255);
            grid[i][j].drawMyself();
            // replace with draw
            // stroke(0);
            // rect(x, y, resolution - 1, resolution);
        }
    }

    if (!pause) {
        let newStates = runRules();
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                if(grid[i][j].getState() == newStates[i][j] && grid[i][j].getState() == 1){
                    grid[i][j].increaseGen();
                }
                grid[i][j].setState(newStates[i][j]);
            }
        }
    }


}