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
    init: function() {
      var shape = new this.shapes[0](this.grid);
    }
  };

  global.Tetris = Tetris;

}( window, window.Grid, window.Shape ));
