jQuery( document ).on( 'ready fusion-element-render-fusion_alert', function( $, cid ) {
	var $elementCheck = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-alert .close' ) : jQuery( '.fusion-alert .close' );

	$elementCheck.on( 'click', function( e ) {
		e.preventDefault();

		jQuery( this ).parent().slideUp();
	} );
} );
