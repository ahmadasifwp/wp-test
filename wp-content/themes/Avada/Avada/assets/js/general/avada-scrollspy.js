/* global fusion, getStickyHeaderHeight, fusionGetStickyOffset */
function fusionGetScrollOffset() {
		// One page scrolling effect.
	var adminbarHeight     = fusion.getAdminbarHeight(),
		stickyHeaderHeight = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0,
		scrollOffset       = parseInt( adminbarHeight + stickyHeaderHeight + 1, 10 ),
		customSticky;

	// Custom header offset.
	if ( jQuery( '.fusion-tb-header' ).length && 'function' === typeof fusionGetStickyOffset ) {
		customSticky = fusionGetStickyOffset();
		if ( ! customSticky ) {
			return adminbarHeight;
		}
		return customSticky + 1;
	}
	return scrollOffset;
}

jQuery( document ).ready( function() {

	// Initialize ScrollSpy script.
	jQuery( 'body' ).scrollspy( {
		target: '.fusion-menu',
		offset: fusionGetScrollOffset()
	} );

	// Reset ScrollSpy offset to correct height after page is fully loaded, sticky container change.
	jQuery( window ).on( 'load fusion-sticky-change fusion-sticky-scroll-change', function() {
		if ( 'object' === typeof jQuery( 'body' ).data()[ 'bs.scrollspy' ] ) {
			jQuery( 'body' ).data()[ 'bs.scrollspy' ].options.offset = fusionGetScrollOffset();
		}
	} );

	// Reset ScrollSpy offset to correct height after sticky transition has finished.
	jQuery( window ).on( 'fusion-sticky-transition-change', function() {
		setTimeout( function() {
			if ( 'object' === typeof jQuery( 'body' ).data()[ 'bs.scrollspy' ] ) {
				jQuery( 'body' ).data()[ 'bs.scrollspy' ].options.offset = fusionGetScrollOffset();
			}
		}, 300 );
	} );
} );
