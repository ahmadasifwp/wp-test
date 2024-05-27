// Update cart count dynamic data.
jQuery( document.body ).on( 'wc_fragments_refreshed wc_fragments_loaded', function() {

	jQuery( '.fusion-dynamic-cart-count-wrapper' ).each( function() {
		var $this = jQuery( this ),
			count,
			html;

		// Skip if we don't have singular and plural texts set.
		if ( 'undefined' === typeof $this.data( 'singular' ) || 'undefined' === typeof $this.data( 'plural' ) ) {
			return;
		}

		count = parseInt( $this.find( '> span' ).html() );
		html  = '<span class="fusion-dynamic-cart-count">' + count + '</span>';

		if ( 1 === count ) {
			html += $this.data( 'singular' );
		} else {
			html += $this.data( 'plural' );
		}

		$this.html( html );
	} );
} );
