jQuery( window ).on( 'wc_cart_emptied', function() {
	if ( ! jQuery( '.fusion-woo-cart_table .cart_item' ).length && jQuery( '.fusion-woo-cart-totals-wrapper' ).length ) {
		jQuery( '.fusion-woo-cart-totals-wrapper' ).remove();
	}
} );
