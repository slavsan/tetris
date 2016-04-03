(function( global, Grid, Shape ) {
  "use strict";

  var speed = 1000;

  function Tetris( options ) {
    this.difficulty = options.difficulty;
    this.rows = options.rows;
    this.cols = options.cols;
    this.gamePlaceholder = options.gamePlaceholder;
    this.previewPlaceholder = options.previewPlaceholder;
    this.shapes = [Shape.O,Shape.T,Shape.Z,Shape.S,Shape.L,Shape.J,Shape.I];
    this.next = this.getRandomShape();
    this.render();
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
      return new NextShape(this.grid);
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

    init: function() {
      this.handleKeyboardInput();
      this.createNewShape();
    }
  };

  global.Tetris = Tetris;

}( window, window.Grid, window.Shape ));
