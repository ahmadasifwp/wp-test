/* global fusionCartTable */
jQuery( window ).on( 'updated_wc_div', function() {
	var emptyCartStatus = jQuery( '.fusion-woo-cart_table .cart_item' ).length ? '0' : '1';
	if ( emptyCartStatus !== fusionCartTable.emptyCart ) {
		window.location.reload();
	}
} );

jQuery( 'body' ).on( 'click', '.fusion-woo-cart_table .product-remove a', function() {
	var emptyCartStatus = 2 > jQuery( '.fusion-woo-cart_table .cart_item' ).length ? '1' : '0',
		currentURL      = window.location.href;

	if ( emptyCartStatus !== fusionCartTable.emptyCart ) {
		if ( -1 === currentURL.indexOf( '?' ) ) {
			window.location.href = currentURL + '?empty_cart=1';
		} else {
			window.location.href = currentURL + '&empty_cart=1';
		}
	}
} );
