/**
 * Constructor function for creating a maze
 * @param {object[]} _grid - 2D maze grid with binary entries
 *                         - 0 entry value indicates open cell
 *                         - 1 entry value indicates closed cell
 * @param {number[]} _start - 2D coordinate of the starting point
 * @param {number[]} _finish - 2D coordinate of the destination point
 * @pre  - 'grid' cells must only contain 0's and 1's
 *       - 'start' is an array of length 2
 *       - 'start' coordinate entries do not exceed the dimentions of the grid
 *       - 'start' cannot be located on a closed cell
 *       - 'finish' is an array of length 2
 *       - 'finish' coordinate entries do not exceed the dimensions of the grid
 *       - 'finish' cannot be located on a closed cell
 * @post - a maze object with appropriate grid and starting point is created
 *       - an error is thrown if the preconditions are not met
 */
export default function Maze(grid, start, finish) {
  
  //////////////////// Maze Initialization & Precondition Checkers ////////////////////

  /**
   * Helper method for validating a given grid
   * @param {object[]} grid - 2D maze grid with binary entries
   * @returns 'grid' if all preconditions are met; an error is thrown otherwise
   */
  this.validateGrid = (grid) => {
    if (!Array.isArray(grid)) throw new Error("'grid' must be an array!");
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (!Number.isInteger(grid[i][j])) throw new Error("'grid' entries must be integers!");
        if (grid[i][j] != 1 && grid[i][j] != 0) throw new Error("'grid' entries must only contain 0's and 1's!");
      }
    }
    return grid;
  }

  this._grid = this.validateGrid(grid);
  
  /**
   * Helper method for validating a given starting point
   * @param {number[]} start - 2D coordinate of the starting point
   * @returns 'start' if all preconditions are met; an error is thrown otherwise
   */
  this.validateStart = (start) => {
    if (!Array.isArray(start)) throw new Error("'start' must be an array!");
    if (start.length != 2) throw new Error("'start' must be an array of length 2!");
    if (!(Number.isInteger(start[0]) && Number.isInteger(start[1]))) throw new Error(`'start' entries must be integers! ${start[0]} ${start[1]}`);
    if (start[0] < 0 || start[1] < 0) throw new Error("'start' entries cannot be negative!");
    if (start[0] >= this._grid.length) throw new Error("'start' first entry cannot exceed the number of rows in 'grid'!");
    if (start[1] >= this._grid[start[0]].length) throw new Error("'start' second entry cannot exceed the number of columns in 'grid'!");
    if (this._grid[start[0]][start[1]] === 1) throw new Error("'start' cannot be located on a closed cell!");
    return start;
  }

  this._start = this.validateStart(start);

  /**
   * Helper method for validating a given finishing point
   * @param {number[]} finish - 2D coordinate of the finishing point
   * @returns 'finish' if all preconditions are met; an error is thrown otherwise
   */
  this.validateFinish = (finish) => {
    if (!Array.isArray(finish)) throw new Error("'finish' must be an array!");
    if (finish.length != 2) throw new Error("'finish' must be an array of length 2!");
    if (!(Number.isInteger(finish[0]) && Number.isInteger(finish[1]))) throw new Error("'finish' entries must be integers!");
    if (finish[0] < 0 || finish[1] < 0) throw new Error("'finish' entries cannot be negative!");
    if (finish[0] >= this._grid.length) throw new Error("'finish' first entry cannot exceed the number of rows in 'grid'!");
    if (finish[1] >= this._grid[start[0]].length) throw new Error("'finish' second entry cannot exceed the number of columns in 'grid'!");
    if (this._grid[finish[0]][finish[1]] === 1) throw new Error("'finish' cannot be located on a closed cell!");
    return finish;
  }
  
  this._finish = this.validateFinish(finish);

  //////////////////// Modifier Methods ////////////////////
  
  /**
   * Modifier method for the maze grid
   * @param {object[]} grid - 2D maze grid with binary entries
   *                        - 0 entry value indicates open cell
   *                        - 1 entry value indicates closed cell
   */
  this.setGrid = (grid) => {
    this._grid = this.validateGrid(grid);
  }

  /**
   * Modifier method for the starting point
   * @param {number[]} start - new 2D coordinate of the starting point
   * @pre  - 'start' is an array of length 2
   *       - 'start' coordinate entries do not exceed the dimensions of the grid
   *       - 'start' is not located on a closed cell
   * @post - '_start' is set to the given coordinates
   *       - an error is thrown in case of an invalid parameter
   */
  this.setStart = (start) => {
    this._start = this.validateStart(start);
  }

  /**
   * Modifier method for the finishing point
   * @param {number[]} finish - new 2D coordinate of the finishing point
   * @pre  - 'finish' is an array of length 2
   *       - 'finish' coordinate entries do not exceed the dimensions of the grid
   *       - 'finish' is not located on a closed cell
   * @post - '_finish' is set to the given coordinates
   *       - an error is thrown in case of the an invalid parameter
   */
  this.setFinish = (finish) => {
    this._finish = this.validateFinish(finish);
  }

  //////////////////// Accessor Method ////////////////////

  /**
   * Accessor method for '_grid' property
   * @returns 2D array, representing the grid
   */
  this.getGrid = () => {
    return this._grid;
  }

  /**
   * Accessor method for '_start'
   * @returns 1D array of length 2, representing the coordinates of the starting ponit
   */
  this.getStart = () => {
    return this._start;
  }

  /**
   * Accessor method for '_finish'
   * @returns 
   */
  this.getFinish = () => {
    return this._finish;
  }

  /**
   * Intermediate method for setting up the maze solving algorithm, 'traverse'
   * @returns - a list containing the path from 'start' to 'finish'
   *          - an empty list if the maze is unsolvable
   */
  this.backtracking = () => {
    // store maze solution in path
    const path = [];
    const deepcopyGrid = JSON.parse(JSON.stringify(this._grid));
    this.backgrackingStart(deepcopyGrid, this._start, path);
    return path;
  }

  /**
   * Maze solving algorithm using recursion and backtracking
   * @param {object[]} grid - deepcopy of the original grid property
   * @param {number[]} current - 2D coordinate of the current position
   *                           - equivalent to starting point for the first function call
   * @param {object[]} path - list used for storing the path
   * @pre  - 'grid' complies with all 'this._grid' preconditions
   *       - 'current' complies with all 'this._start' preconditions
   *       - 'path' is an empty list
   * @post - if the maze is solvable, 'path' must contain the correct path from 'start' to 'finish'
   *       - if the maze is unsolvable, 'path' must remain empty
   *       - an error is thrown if the preconditions are not met
   * @returns - true if finishing point is reached, indicating correct path
   *          - false if finishing point is not reached, indicating wrong path
   */
  this.backgrackingStart = (grid, current, path) => {
    let done = false;
    const row = current[0];
    const column = current[1];

    // check if current cell is valid
    if ((row < 0 || row >= grid.length)
    || (column < 0 || column >= grid[0].length)
    || (grid[row][column] !== 0)) // cell should neither be blocked (1) nor visited ("v")
      return false;
    
    grid[row][column] = "v"; // mark current cell as visited
    
    // start traversing
    if (row === this._finish[0] && column === this._finish[1]) {
      path.unshift(current);
      return true; // arrived at finishing point
    } else {
      if (!done) done = this.backgrackingStart(grid, [row - 1, column], path); // move up
      if (!done) done = this.backgrackingStart(grid, [row, column - 1], path); // move left
      if (!done) done = this.backgrackingStart(grid, [row + 1, column], path); // move down
      if (!done) done = this.backgrackingStart(grid, [row, column + 1], path); // move right
    }

    if (done) path.unshift(current);

    return done;
  }

  /**
   * Implements the breadth-first search (BFS) algorithm to solve the maze.
   * @returns list of coordinates indicating the path from start to finish.
   */
  this.bfs = () => {
    const queue = [[[this._start[0], this._start[1]]]];
    let currentPath, currentCoordinate;

    const deepcopyGrid = JSON.parse(JSON.stringify(this._grid));
    deepcopyGrid[this._start[0]][this._start[1]] = "v";

    do {
      currentPath = queue.shift();
      currentCoordinate = this.getCurrentCoordinate(currentPath);

      // move up
      let coordinateUp = [currentCoordinate[0] - 1, currentCoordinate[1]];
      if (this.validateCoordinate(coordinateUp)) {
        if (this.getCell(deepcopyGrid, coordinateUp) === 0) {
          deepcopyGrid[coordinateUp[0]][coordinateUp[1]] = "v";
          queue.push(currentPath.concat([coordinateUp]));
        }
      }

      // move left
      let coordinateLeft = [currentCoordinate[0], currentCoordinate[1] - 1];
      if (this.validateCoordinate(coordinateLeft)) {
        if (this.getCell(deepcopyGrid, coordinateLeft) === 0) {
          deepcopyGrid[coordinateLeft[0]][coordinateLeft[1]] = "v";
          queue.push(currentPath.concat([coordinateLeft]));
        }
      }

      // move down
      let coordinateDown = [currentCoordinate[0] + 1, currentCoordinate[1]];
      if (this.validateCoordinate(coordinateDown)) {
        if (this.getCell(deepcopyGrid, coordinateDown) === 0) {
          deepcopyGrid[coordinateDown[0]][coordinateDown[1]] = "v";
          queue.push(currentPath.concat([coordinateDown]));
        }
      }

      // move right
      let coordinateRight = [currentCoordinate[0], currentCoordinate[1] + 1];
      if (this.validateCoordinate(coordinateRight)) {
        if (this.getCell(deepcopyGrid, coordinateRight) === 0) {
          deepcopyGrid[coordinateRight[0]][coordinateRight[1]] = "v";
          queue.push(currentPath.concat([coordinateRight]));
        }
      }
    } while (currentCoordinate[0] !== this._finish[0] || currentCoordinate[1] !== this._finish[1]);

    return currentPath;
  }

  /**
   * Helper method to determine whether a particular coordinate is within the grid.
   * @param {Number[]} coordinate 
   * @returns a boolean indicating the validity of the coordinate.
   */
  this.validateCoordinate = (coordinate) => {
    if (coordinate[0] < 0 || coordinate[0] >= this._grid.length
      ||coordinate[1] < 0 || coordinate[1] >= this._grid[0].length)
      return false;
    return true;
  };

  /**
   * Helper method to retrieve the value of a cell at a given valid coordinate.
   * @param {Number[][]} grid 
   * @param {Number[]} coordinate 
   * @returns the value of the cell at the indicated coordinate.
   */
  this.getCell = (grid, coordinate) => {
    return grid[coordinate[0]][coordinate[1]];
  };

  /**
   * Helper method to retrieve the last coordinate of a given path.
   * @param {Object[Number[]]} path 
   * @returns the last (i.e., most current) coordinate of the given path.
   */
  this.getCurrentCoordinate = (path) => {
    return path[path.length - 1];
  };
}