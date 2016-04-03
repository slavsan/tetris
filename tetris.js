(function( global, Grid ) {
  "use strict";

  function Tetris( options ) {
    this.difficulty = options.difficulty;
    this.rows = options.rows;
    this.cols = options.cols;
    this.placeholder = options.placeholder;
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
      // ..
    }
  };

  global.Tetris = Tetris;

}( window, window.Grid ));
