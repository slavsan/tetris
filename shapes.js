(function( global ){
  "use strict";

  var Shape = {};

  function BaseShape() {
    this.cells = [];
  }
  BaseShape.prototype.constructor = BaseShape;
  BaseShape.prototype.occupyCell = function( cell ) {
    cell.$el.css('background', 'red');
    cell.isCurrentShape = true;
    this.cells.push(cell);
    return this;
  };
  BaseShape.prototype.occupyCells = function() {
    var self = this;
    this.coords.forEach(function( coord ) {
      self.occupyCell(self.grid.getCellAt(coord.x, coord.y));
    });
    return this;
  };

  BaseShape.prototype.freeCells = function() {
    this.cells.forEach(function( cell ) {
      cell.$el.css('background', 'white');
      cell.isCurrentShape = false;
    });
    this.cells = [];
    return this;
  };

  BaseShape.prototype.moveLeft = function() {
    var self = this;
    var isMoveAllowed = this.cells.every(function( cell ) {
      var cellAtNewCoords = self.grid.getCellAt(cell.x - 1, cell.y);
      if (!cellAtNewCoords || cellAtNewCoords.isSolid) {
        console.log("obstacle, can't continue moving left");
        return false;
      }
      return true;
    });
    if (!isMoveAllowed) {
      console.log("stopped");
      return false;
    }
    console.log("move left");
    this.coords = [];
    this.cells.forEach(function( cell ) {
      self.coords.push({x: cell.x - 1, y: cell.y});
    });
    this.freeCells();
    this.occupyCells();
  };

  BaseShape.prototype.moveRight = function() {
    var self = this;
    var isMoveAllowed = this.cells.every(function( cell ) {
      var cellAtNewCoords = self.grid.getCellAt(cell.x + 1, cell.y);
      if (!cellAtNewCoords || cellAtNewCoords.isSolid) {
        console.log("obstacle, can't continue moving right");
        return false;
      }
      return true;
    });
    if (!isMoveAllowed) {
      console.log("stopped");
      return false;
    }
    console.log("move right");
    this.coords = [];
    this.cells.forEach(function( cell ) {
      self.coords.push({x: cell.x + 1, y: cell.y});
    });
    this.freeCells();
    this.occupyCells();
  };
  
  BaseShape.prototype.moveDown = function() {
    var self = this;
    var isMoveAllowed = this.cells.every(function( cell ) {
      var newCell = self.grid.getCellAt(cell.x, cell.y - 1);
      if (!newCell || newCell.isSolid) {
        console.log('landed');
        return false;
      }
      return true;
    });
    if (!isMoveAllowed) {
      console.log("stopped");
      return false;
    }
    console.log("move down");
    this.coords = [];
    this.cells.forEach(function( cell ) {
      self.coords.push({x: cell.x, y: cell.y - 1});
    });
    this.freeCells();
    this.occupyCells();
  };

  function OShape( grid ) {
    this.grid = grid;
    var firstRow = grid.rowsCount - 1;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, firstRow));
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn + 1, firstRow));
    this.coords.push(grid.getCellAt(middleColumn + 1, secondRow));
    this.occupyCells();
    return this;
  }
  OShape.prototype = new BaseShape();
  OShape.prototype.constructor = OShape;

  function TShape( grid ) {
    this.grid = grid;
    var firstRow = grid.rowsCount - 1;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn, firstRow));
    this.coords.push(grid.getCellAt(middleColumn - 1, secondRow));
    this.coords.push(grid.getCellAt(middleColumn + 1, secondRow));
    this.occupyCells();
    return this;
  }
  TShape.prototype = new BaseShape();
  TShape.prototype.constructor = TShape;

  function SShape( grid ) {
    this.grid = grid;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn - 1, secondRow));
    this.coords.push(grid.getCellAt(middleColumn - 1, secondRow + 1));
    this.coords.push(grid.getCellAt(middleColumn, secondRow - 1));
    this.occupyCells();
    return this;
  }
  SShape.prototype  = new BaseShape();
  SShape.prototype.constructor = SShape;

  function ZShape( grid ) {
    this.grid = grid;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn - 1, secondRow));
    this.coords.push(grid.getCellAt(middleColumn - 1, secondRow - 1));
    this.coords.push(grid.getCellAt(middleColumn, secondRow + 1));
    this.occupyCells();
    return this;
  }
  ZShape.prototype  = new BaseShape();
  ZShape.prototype.constructor = ZShape;

  function LShape( grid ) {
    this.grid = grid;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn, secondRow + 1));
    this.coords.push(grid.getCellAt(middleColumn, secondRow - 1));
    this.coords.push(grid.getCellAt(middleColumn + 1, secondRow - 1));
    this.occupyCells();
    return this;
  }
  LShape.prototype = new BaseShape();
  LShape.prototype.constructor = LShape;

  function JShape( grid ) {
    this.grid = grid;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn, secondRow + 1));
    this.coords.push(grid.getCellAt(middleColumn, secondRow - 1));
    this.coords.push(grid.getCellAt(middleColumn -1, secondRow - 1));
    this.occupyCells();
    return this;
  }
  JShape.prototype = new BaseShape();
  JShape.prototype.constructor = JShape;

  function IShape( grid ) {
    this.grid = grid;
    var secondRow = grid.rowsCount - 2;
    var middleColumn = parseInt(grid.colsCount / 2, 10);
    this.coords = [];
    this.coords.push(grid.getCellAt(middleColumn, secondRow));
    this.coords.push(grid.getCellAt(middleColumn, secondRow + 1));
    this.coords.push(grid.getCellAt(middleColumn, secondRow - 1));
    this.coords.push(grid.getCellAt(middleColumn, secondRow - 2));
    this.occupyCells();
    return this;
  }
  IShape.prototype = new BaseShape();
  IShape.prototype.constructor = IShape;


  // Pack all the shape classes in one object (namespace)
  Shape.O = OShape;
  Shape.T = TShape;
  Shape.S = SShape;
  Shape.Z = ZShape;
  Shape.L = LShape;
  Shape.J = JShape;
  Shape.I = IShape;

  // Export the shape namespace to the global scope
  global.Shape = Shape;

}( window ));
