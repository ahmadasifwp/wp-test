function checkHoverTouchState() {
	var isTouch = false,
		isTouchTimer;

	function addtouchclass() {
		clearTimeout( isTouchTimer );
		isTouch = true;

		jQuery( 'body' ).addClass( 'fusion-touch' );
		jQuery( 'body' ).removeClass( 'fusion-no-touch' );

		isTouchTimer = setTimeout( function() {
			isTouch = false;
		}, 500 );
	}

	function removetouchclass() {
		if ( ! isTouch ) {
			isTouch = false;
			jQuery( 'body' ).addClass( 'fusion-no-touch' );
			jQuery( 'body' ).removeClass( 'fusion-touch' );
		}
	}

	document.addEventListener( 'touchstart', addtouchclass, { passive: true } );
	document.addEventListener( 'mouseover', removetouchclass );
}

checkHoverTouchState();

jQuery( document ).ready( function() {
	jQuery( 'input, textarea' ).placeholder();
} );
