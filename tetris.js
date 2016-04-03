(function( global, Grid, Shape ) {
  "use strict";

  function Tetris( options ) {
    this.difficulty = options.difficulty;
    this.rows = options.rows;
    this.cols = options.cols;
    this.placeholder = options.placeholder;
    this.shapes = [Shape.O,Shape.T,Shape.Z,Shape.S,Shape.L,Shape.J,Shape.I];
    this.render();
  }
  Tetris.prototype = {
    render: function() {
      this.grid = new Grid({
        rows: this.rows,
        cols: this.cols,
        render: {
          placeholder: this.placeholder
        }
      });
      return this;
    },
    bind: function() {
      var self = this;
      $(document).on('keydown', function( e ) {
        if (!self.shape) {
          console.warn("No current shape available");
          return;
        }
        switch (e.keyCode) {
          case 32: // Space
            self.shape.moveDown();
            break;
          case 37: // Left arrow
            self.shape.moveLeft();
            break;
          case 38: // Up arrow
            self.shape.rotate();
            break;
          case 39: // Right arrow
            self.shape.moveRight();
            break;
          case 40: // Down arrow
            self.shape.moveDown();
            break;
          case 80: // 'P'
            // pause the game eventually
            self.pause();
            break;
          default:
          // ..
        }
      });
    },
    init: function() {
      this.bind();
      this.shape = new this.shapes[0](this.grid);
    }
  };

  global.Tetris = Tetris;

}( window, window.Grid, window.Shape ));
