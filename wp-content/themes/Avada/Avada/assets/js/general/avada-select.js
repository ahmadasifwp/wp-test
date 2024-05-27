jQuery( window ).on( 'load fusion-element-render-fusion_tb_woo_cart fusion-element-render-fusion_tb_woo_checkout_tabs fusion-element-render-fusion_tb_woo_checkout_billing fusion-element-render-fusion_tb_woo_checkout_shipping fusion-element-render-fusion_woo_cart_shipping', function() {

	// Set heights of select arrows correctly
	calcSelectArrowDimensions();

	setTimeout( function() {
		calcSelectArrowDimensions();
	}, 100 );
} );

// Wrap gravity forms select and add arrow
function calcSelectArrowDimensions( parent ) {
	var selector   = '.avada-select-parent .select-arrow, .gravity-select-parent .select-arrow, .wpcf7-select-parent .select-arrow',
		$initElems = 'undefined' !== typeof parent ? jQuery( parent ).find( selector ) : jQuery( selector );

	$initElems.filter( ':visible' ).each( function() {
		if ( 0 < jQuery( this ).prev().innerHeight() ) {
			jQuery( this ).css( {
				height: jQuery( this ).prev().innerHeight(),
				width: jQuery( this ).prev().innerHeight(),
				'line-height': jQuery( this ).prev().innerHeight() + 'px'
			} );
		}
	} );
}

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	calcSelectArrowDimensions( parent );
} );
