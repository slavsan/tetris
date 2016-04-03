(function( global, Grid, Shape ) {
  "use strict";

  var speed = 1000;

  var levelsOfDifficulty = [
    { id: 1, threshold: 10, speed: 1000 },
    { id: 2, threshold: 20, speed: 900 },
    { id: 3, threshold: 30, speed: 800 },
    { id: 4, threshold: 40, speed: 700 },
    { id: 5, threshold: 50, speed: 600 },
    { id: 6, threshold: 60, speed: 500 },
    { id: 7, threshold: 70, speed: 400 },
    { id: 8, threshold: 80, speed: 200 },
    { id: 9, threshold: 90, speed: 100 },
    { id: 10, threshold: false, speed: 100 }
  ];
  
  var score = 0;

  function Mediator() {
    this.events = [];
  }
  Mediator.prototype = {
    triggerEvent: function( eventName, args ) {
      for (var i = 0; i < this.events.length; i += 1) {
        if (this.events[i].eventName === eventName) {
          this.events[i].cb.apply(this, args);
        }
      }
    },
    on: function( eventName, cb ) {
      this.events.push({ eventName: eventName, cb: cb });
    }
  };

  function Tetris( options ) {
    this.difficulty = options.difficulty;
    this.rows = options.rows;
    this.cols = options.cols;
    this.gamePlaceholder = options.gamePlaceholder;
    this.previewPlaceholder = options.previewPlaceholder;
    this.scorePlaceholder = options.scorePlaceholder;
    this.shapes = [Shape.O,Shape.T,Shape.Z,Shape.S,Shape.L,Shape.J,Shape.I];
    this.next = this.getRandomShape();
    this.mediator = new Mediator();
    this.pointsPerCollapsedRow = 10;
    this.render();
    this.subscribe();
  }
  Tetris.prototype = {

    render: function() {
      this.grid = new Grid({
        rows: this.rows,
        cols: this.cols,
        render: {
          placeholder: this.gamePlaceholder
        }
      });
      this.preview = new Grid({
        rows: 5,
        cols: 5,
        render: {
          placeholder: this.previewPlaceholder
        }
      });
      var $scoreView = $(this.scorePlaceholder);
      this.$levelView = $scoreView.find('#level');
      this.$pointsView = $scoreView.find('#score-points');
      this.updateScore(this.getLevel());
      return this;
    },

    handleKeyboardInput: function() {
      var self = this;
      $(document).on('keydown', function( e ) {
        switch (e.keyCode) {
          case 32: // Space
            self.clearInterval();
            if (!self.isPaused) {
              self.interval = setInterval(function() {
                self.shape.moveDown();
              }, 1);
            }
            break;
          case 37: // Left arrow
            if (!self.isPaused) {
              self.shape.moveLeft();
            }
            break;
          case 38: // Up arrow
            if (!self.isPaused) {
              self.shape.rotate();
            }
            break;
          case 39: // Right arrow
            if (!self.isPaused) {
              self.shape.moveRight();
            }
            break;
          case 40: // Down arrow
            if (!self.isPaused) {
              self.shape.moveDown();
            }
            break;
          case 80: // 'P'
            // pause the game eventually
            self.pause();
            break;
        }
      });
    },
    
    getLevel: function() {
      var currentLevel = levelsOfDifficulty[0];
      levelsOfDifficulty.every(function( level ) {
        if (level.threshold === false || score < level.threshold) {
          currentLevel = level;
          return false;
        }
        return true;
      });
      return currentLevel;
    },
    
    updateScore: function( level ) {
      this.$levelView.text(level.id);
      this.$pointsView.text(score);
    },
    
    updateDifficulty: function( level ) {
      speed = level.speed;
    },

    createNewShape: function() {
      var self = this;
      this.shape = this.getNextShape();
      this.interval = setInterval(function() {
        self.shape.moveDown();
      }, this.getSpeed());
    },

    getNextShape: function() {
      var NextShape = this.next;
      this.next = this.getRandomShape();
      this.displayInPreview(this.next);
      return new NextShape(this.grid, this.mediator);
    },

    getRandomShape: function() {
      return this.shapes[Math.floor(Math.random() * this.shapes.length)];
    },

    displayInPreview: function( ShapePreview ) {
      this.preview.cells.forEach(function( cell ) {
        cell.$el.css('background', 'white');
      });
      this.shapePreview = new ShapePreview(this.preview);
    },

    getSpeed: function() {
      return speed;
    },

    pause: function() {
      var self = this;
      if (this.isPaused) {
        this.interval = setInterval(function() {
          self.shape.moveDown();
        }, this.getSpeed());
        this.isPaused = false;
        console.log("game:unpaused");
      } else {
        this.clearInterval();
        this.isPaused = true;
        console.log("game:paused");
      }
    },

    clearInterval: function() {
      clearInterval(this.interval);
    },

    subscribe: function() {
      var self = this;
      this.mediator.on('landed', function() {
        self.clearInterval();
        if (!self.gameOver) {
          self.collapseSolidRows();
          self.createNewShape();
        }
      });
      this.mediator.on('failedRender', function() {
        self.endGame();
      });
      this.mediator.on('rowsCollapsed', function() {
        score += self.pointsPerCollapsedRow;
        var level = self.getLevel();
        self.updateDifficulty(level);
        self.updateScore(level);
      });
    },

    collapseSolidRows: function() {
      var rowsWereCollapsed = false;
      var self = this;
      this.grid.rows.forEach(function( row ) {
        if (self.isSolidRow(row)) {
          rowsWereCollapsed = true;
          self.collapseRow(row);
        }
      });
      if (rowsWereCollapsed) {
        this.moveDownRowsWithSolidCells();
        this.mediator.triggerEvent('rowsCollapsed');
      }
    },

    isSolidRow: function( row ) {
      return row.every(function( cell ){
        return cell.isSolid;
      });
    },

    collapseRow: function( row ) {
      row.forEach(function( cell ) {
        cell.isSolid = false;
        cell.$el.css('background', 'white');
      });
    },

    moveDownRowsWithSolidCells: function() {
      var self = this;
      var currentRowIndex = -1;
      // iterate all rows by starting from the lowest one
      this.grid.rows.forEach(function( row ) {
        currentRowIndex += 1;

        // if the row is empty, we skip it, there's no need to move down an empty row
        if (self.isEmptyRow(row)) {
          return;
        }

        // we want to get the lowest empty row, because several rows may have been collapsed, in this case
        // the next row with solid cells will need to travel all the way down to occupy the lowest empty row
        var lowestEmptyRowIndex = self.getLowestEmptyRowIndex();

        // if the current row doesn't have empty rows beneath it, it doesn't need to go down any further, so
        // we skip it
        if (lowestEmptyRowIndex > currentRowIndex) {
          return;
        }

        self.moveRowDown(row, lowestEmptyRowIndex);
      });
    },

    isEmptyRow: function( row ) {
      return row.every(function( cell ) {
        return !cell.isSolid;
      });
    },

    getLowestEmptyRowIndex: function() {
      var self = this;
      var index = -1;
      this.grid.rows.every(function( row ) {
        index += 1;
        return !self.isEmptyRow(row);
      });
      return index;
    },

    moveRowDown: function( row, lowestEmptyRowIndex ) {
      var self = this;
      row.forEach(function( cell ) {
        var coords = {x: cell.x, y: cell.y};
        var newCell = self.grid.getCellAt(coords.x, lowestEmptyRowIndex);
        if (newCell) {
          var wasSolid = cell.isSolid;
          var previousBackgroundColor = cell.$el.css('background');
          cell.$el.css('background', 'white');
          cell.isCurrentShape = false;
          cell.isSolid = false;
          if (wasSolid) {
            newCell.$el.css('background', previousBackgroundColor);
            newCell.isSolid = true;
          } else {
            newCell.$el.css('background', 'white');
            newCell.isSolid = false;
          }
        }
      });
    },

    endGame: function () {
      this.clearInterval();
      this.gameOver = true;
      this.shape = false;
      $(document).off('keydown');
      console.log("game:over");
    },

    init: function() {
      this.handleKeyboardInput();
      this.createNewShape();
    }
  };

  global.Tetris = Tetris;

}( window, window.Grid, window.Shape ));
