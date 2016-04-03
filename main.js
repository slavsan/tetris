(function( Tetris ) {
  "use strict";

  var tetris = new Tetris({
    rows: 25,
    cols: 13,
    gamePlaceholder: '#tetris',
    previewPlaceholder: '#preview',
    scorePlaceholder: '#score'
  });
  tetris.init();

}( window.Tetris ));
