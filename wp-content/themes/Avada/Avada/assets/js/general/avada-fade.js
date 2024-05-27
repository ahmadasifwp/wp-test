/* global cssua, avadaFadeVars */
var avadaTriggerPageTitleFading = function() {
	if ( undefined === cssua.ua.mobile ) {

		// Change opacity of page title bar on scrolling
		if ( '1' === avadaFadeVars.page_title_fading || 1 === avadaFadeVars.page_title_fading || true === avadaFadeVars.page_title_fading ) {
			if ( 'left' === avadaFadeVars.header_position || 'right' === avadaFadeVars.header_position ) {
				jQuery( '.fusion-page-title-wrapper' ).fusionScroller( { type: 'opacity', offset: 0 } );
			} else {
				jQuery( '.fusion-page-title-wrapper' ).fusionScroller( { type: 'opacity', offset: 100 } );
			}
		}
	}
};

jQuery( window ).on( 'load', function() {
	avadaTriggerPageTitleFading();
} );
