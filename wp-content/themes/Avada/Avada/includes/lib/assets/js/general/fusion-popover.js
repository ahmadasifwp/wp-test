/* global cssua */
jQuery( window ).on( 'load', function() {
	if ( cssua.ua.mobile || cssua.ua.tablet_pc ) {
		jQuery( '.fusion-popover, .fusion-tooltip' ).each( function() {
			jQuery( this ).attr( 'data-trigger', 'click' );
			jQuery( this ).data( 'trigger', 'click' );
		} );
	}

	// Initialize Bootstrap Popovers
	jQuery( '[data-toggle~="popover"]' ).popover( {
		container: 'body',
		content: function() {
			return jQuery.parseHTML( '<div>' + ( 'undefined' !== typeof jQuery( this ).attr( 'data-html-content' ) ? jQuery( this ).attr( 'data-html-content' ) : '' ) + '</div>' );
		},
		html: true
	} );
} );

// Front-end, initiate on fusion text render.
jQuery( window ).on( 'fusion-element-render-fusion_text fusion-element-render-fusion_popover', function( event, cid ) {
	jQuery( 'div[data-cid="' + cid + '"]' ).find( '[data-toggle~="popover"]' ).popover( {
		container: 'body',
		content: function() {
			return jQuery.parseHTML( '<div>' + ( 'undefined' !== typeof jQuery( this ).attr( 'data-html-content' ) ? jQuery( this ).attr( 'data-html-content' ) : '' ) + '</div>' );
		},
		html: true
	} );
} );
