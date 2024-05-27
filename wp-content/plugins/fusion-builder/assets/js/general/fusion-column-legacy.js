jQuery( window ).on( 'load', function() {

	setTimeout( function() {
		fusionCalcColumnEqualHeights();
	}, 100 );

	jQuery( window ).on( 'fusion-resize-horizontal fusion-live-editor-updated', function() {
		setTimeout( function() {
			fusionCalcColumnEqualHeights();
		}, 500 );
	} );
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-fullwidth.fusion-equal-height-columns' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).find( '.fusion-layout-column .fusion-column-wrapper' ).equalHeights();
		} );
	}
} );

function fusionCalcColumnEqualHeights() {
	var prefix = '.fusion-fullwidth:not(.fusion-equal-height-columns)',
		suffix = '.fusion-fullwidth.fusion-equal-height-columns';

	// Nested columns.
	jQuery( '.fusion-fullwidth.fusion-equal-height-columns .fusion-builder-row-inner' ).each( function() {
		jQuery( this ).find( '.fusion-layout-column > .fusion-column-wrapper' ).not( function( $index, $element ) {
			return ( jQuery( $element ).parent( '.fusion-column-wrapper' ).length || jQuery( $element ).parents( '.fusion-events-shortcode' ).length ) ? 1 : 0;
		} ).equalHeights();
	} );

	// Regular columns.
	jQuery( '.fusion-fullwidth.fusion-equal-height-columns' ).each( function() {
		jQuery( this ).find( '.fusion-layout-column:not(.fusion-builder-row-inner .fusion-layout-column) > .fusion-column-wrapper' ).not( function( $index, $element ) {
			return jQuery( $element ).parentsUntil( '.fusion-content-tb', '.fusion-column-wrapper' ).length ? 1 : 0;
		} ).equalHeights();
	} );

	// Equal heights for dynamic content like blog element that use full content.
	jQuery( prefix + ' .fusion-recent-posts ' + suffix + ', ' + prefix + ' .fusion-posts-container ' + suffix + ', ' + prefix + ' .fusion-portfolio ' + suffix ).each( function() {
		jQuery( this ).find( '.fusion-layout-column .fusion-column-wrapper' ).not( function( $index, $element ) {
			return jQuery( $element ).parent( '.fusion-column-wrapper' ).length ? 1 : 0;
		} ).equalHeights();
	} );
}
