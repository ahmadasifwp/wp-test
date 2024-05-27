/* global cssua, avadaToTopVars */
jQuery( document ).ready( function() {
	var lastScrollPosition = 0,
		animationRoot = ( jQuery( 'html' ).hasClass( 'ua-edge' ) || jQuery( 'html' ).hasClass( 'ua-safari-12' ) || jQuery( 'html' ).hasClass( 'ua-safari-11' ) || jQuery( 'html' ).hasClass( 'ua-safari-10' ) ) ? 'body' : 'html';

	jQuery( '.fusion-top-top-link' ).on( 'click', function( e ) {
		e.preventDefault();

		if ( ( cssua.ua.mobile && -1 !== avadaToTopVars.status_totop.indexOf( 'mobile' ) ) || ! cssua.ua.mobile ) {
			jQuery( animationRoot ).animate( {
				scrollTop: 0
			}, 1200, 'easeInOutExpo' );
		}

	} );

	jQuery( window ).on( 'scroll', function() {
		var currentScrollPosition = jQuery( this ).scrollTop();

		if ( 200 < currentScrollPosition && ( currentScrollPosition >= lastScrollPosition || 1 !== parseInt( avadaToTopVars.totop_scroll_down_only ) ) ) {
			jQuery( '.fusion-top-top-link' ).addClass( 'fusion-to-top-active' );
		} else {
			jQuery( '.fusion-top-top-link' ).removeClass( 'fusion-to-top-active' );
		}

		lastScrollPosition = currentScrollPosition;
	} );


	jQuery( window ).on( 'updateToTopPostion', avadaUpdateToTopPostion );
} );

function avadaUpdateToTopPostion() {
	var position = avadaToTopVars.totop_position.split( '_' );

	position = 2 === position.length ? 'to-top-' + position[ 0 ] + ' to-top-' + position[ 1 ] : 'to-top-' + position[ 0 ];

	jQuery( '.to-top-container' ).attr( 'class', 'to-top-container' );
	jQuery( '.to-top-container' ).addClass( position );

}
